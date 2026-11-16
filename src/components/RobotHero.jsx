import { useEffect, useRef } from "react";
import RobotFace from "./RobotFace";
import { createRobotModel3D } from "./RobotModel3D";
import "./RobotHero.css";

/**
 * NOVA has two interactive renderers, not a still-image placeholder:
 * - WebGL: genuine articulated, lit 3D geometry.
 * - No WebGL / context lost: a jointed, independently moving 2.5D puppet
 *   assembled from transparent renders of our own 3D model, with live eyes.
 * Both paths use the same eye animation and click / keyboard expression cycle.
 */
export default function RobotHero({ accent = "#B9A5F4" }) {
  const faceCanvas = useRef(null);
  const sceneCanvas = useRef(null);
  const rootRef = useRef(null);
  const faceRef = useRef(null);
  const modelRef = useRef(null);
  const moodRef = useRef(0);
  const reactionRef = useRef(null);

  useEffect(() => {
    const canvas = faceCanvas.current;
    const scene = sceneCanvas.current;
    const root = rootRef.current;
    if (!canvas || !scene || !root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const face = new RobotFace(canvas, { color: accent, reduced });
    faceRef.current = face;
    face.start();

    let model = null;
    let fallbackReason = "";
    const setMode = (mode, reason = "") => {
      root.dataset.renderMode = mode;
      root.dataset.fallbackReason = reason;
    };
    const init3D = () => {
      try {
        model = createRobotModel3D(scene, canvas, {
          accent,
          reduced,
          onFailure: error => {
            console.warn("NOVA 3D paused; switching to animated fallback:", error);
            model?.pause();
            model = null;
            modelRef.current = null;
            setMode("fallback", "renderer-error");
          },
        });
        modelRef.current = model;
        setMode(model ? "webgl-3d" : "fallback", model ? "" : "webgl-unavailable");
      } catch (error) {
        console.warn("NOVA 3D unavailable; using animated fallback:", error);
        model = null;
        modelRef.current = null;
        fallbackReason = "renderer-error";
        setMode("fallback", fallbackReason);
      }
    };
    init3D();

    // If a GPU driver silently stops producing frames without emitting a
    // context-loss event, switch to the *animated* fallback instead of leaving
    // an apparently frozen canvas on screen. Do not penalize hidden tabs,
    // off-screen scenes or explicitly reduced-motion preferences.
    let lastFrameCount = -1;
    let stoppedChecks = 0;
    const watchdog = reduced ? null : window.setInterval(() => {
      const snapshot = model?.getState?.();
      if (!snapshot || !snapshot.visible || document.hidden) {
        stoppedChecks = 0;
        lastFrameCount = -1;
        return;
      }
      if (snapshot.frameCount === lastFrameCount) stoppedChecks += 1;
      else stoppedChecks = 0;
      lastFrameCount = snapshot.frameCount;
      if (stoppedChecks >= 2) {
        console.warn("NOVA WebGL stopped updating; enabling animated fallback");
        model?.pause();
        model = null;
        modelRef.current = null;
        setMode("fallback", "stalled-renderer");
        stoppedChecks = 0;
      }
    }, 1200);

    // Some devices allow WebGL initially but later lose their graphics context.
    // Switching immediately prevents a permanently frozen first frame.
    const contextLost = event => {
      event.preventDefault();
      model?.pause();
      model = null;
      modelRef.current = null;
      setMode("fallback", "context-lost");
    };
    const contextRestored = () => init3D();
    scene.addEventListener("webglcontextlost", contextLost);
    scene.addEventListener("webglcontextrestored", contextRestored);

    let pending = 0;
    let pointer = { x: 0, y: 0 };
    const update = () => {
      pending = 0;
      const r = root.getBoundingClientRect();
      if (!r.width || !r.height) return;
      // Measure the gaze relative to NOVA's EYES, not to the middle of the
      // entire 455px stage (which is far below its head). Keep a broad reach
      // across the full viewport, including the bottom corners.
      const eyeX = r.left + r.width * 0.5;
      const eyeY = r.top + r.height * 0.345;
      const reachX = Math.max(260, window.innerWidth * 0.40);
      const reachY = Math.max(225, window.innerHeight * 0.40);
      const dx = Math.max(-1, Math.min(1, (pointer.x - eyeX) / reachX));
      const dy = Math.max(-1, Math.min(1, (pointer.y - eyeY) / reachY));
      face.lookAt(dx, dy);
      model?.setPointer(dx, dy);
      // Live CSS joints for devices without WebGL. These values also follow
      // a touch/stylus pointer and work even when the 3D renderer is paused.
      root.style.setProperty("--nova-look-x", `${(dx * 7).toFixed(2)}px`);
      root.style.setProperty("--nova-look-y", `${(dy * 9).toFixed(2)}px`);
      root.style.setProperty("--nova-yaw", `${(dx * 34).toFixed(2)}deg`);
      root.style.setProperty("--nova-pitch", `${(-dy * 28).toFixed(2)}deg`);
      root.style.setProperty("--nova-roll", `${(dx * 1.5).toFixed(2)}deg`);
      root.style.setProperty("--nova-body-roll", `${(-dx * 1.2).toFixed(2)}deg`);
    };
    const move = event => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!pending) pending = requestAnimationFrame(update);
    };
    const leave = () => {
      face.lookAt(null);
      model?.setPointer(0, 0);
      root.style.setProperty("--nova-look-x", "0px");
      root.style.setProperty("--nova-look-y", "0px");
      root.style.setProperty("--nova-yaw", "0deg");
      root.style.setProperty("--nova-pitch", "0deg");
      root.style.setProperty("--nova-roll", "0deg");
      root.style.setProperty("--nova-body-roll", "0deg");
    };

    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          face.start();
          model?.setVisible(true);
        } else {
          face.stop();
          model?.setVisible(false);
        }
      }, { threshold: 0 });
      observer.observe(root);
    }
    // Keep user-directed interaction available even when the system requests
    // reduced motion; only autonomous animation is reduced in that mode.
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      scene.removeEventListener("webglcontextlost", contextLost);
      scene.removeEventListener("webglcontextrestored", contextRestored);
      cancelAnimationFrame(pending);
      clearInterval(watchdog);
      clearTimeout(reactionRef.current);
      observer?.disconnect();
      face.stop();
      face._ro?.disconnect();
      model?.destroy();
      if (faceRef.current === face) faceRef.current = null;
      modelRef.current = null;
    };
  }, [accent]);

  const moods = ["happy", "thinking", "listening", "sad", "speaking", "idle"];
  const changeMood = () => {
    const face = faceRef.current;
    if (!face) return;
    const next = moods[moodRef.current % moods.length];
    moodRef.current += 1;
    face.setState(next);
    modelRef.current?.setExpression(next);
    const root = rootRef.current;
    if (root) {
      root.dataset.expression = next;
      // Restart a short, visible head-bob/body-hop on every activation.
      root.classList.remove("nova-reacting");
      void root.offsetWidth;
      root.classList.add("nova-reacting");
      clearTimeout(reactionRef.current);
      reactionRef.current = window.setTimeout(() => root.classList.remove("nova-reacting"), 850);
    }
    if (face.reduced) {
      for (let i = 0; i < 40; i++) face.update(1 / 60);
      face.draw();
      modelRef.current?.render();
    }
  };
  const reset = () => {
    moodRef.current = 0;
    faceRef.current?.setState("idle");
    modelRef.current?.setExpression("idle");
    if (rootRef.current) rootRef.current.dataset.expression = "idle";
  };
  return (
    <div
      className="hero-bot robot-hero nova-bot"
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label="Interactive NOVA 3D robot: tracks your pointer with its eyes and head, floats, blinks, and changes expression when activated"
      data-expression="idle"
      data-render-mode="initializing"
      onClick={changeMood}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault(); changeMood();
        }
      }}
      onPointerEnter={() => { if (moodRef.current === 0) faceRef.current?.setState("listening"); }}
      onPointerLeave={reset}
      onFocus={() => faceRef.current?.setState("listening")}
      onBlur={reset}
    >
      <div className="nova-environment" aria-hidden="true">
        <span className="nova-ambient-glow" />
        <canvas className="nova-webgl" ref={sceneCanvas} />
        <div className="nova-fallback-stage">
          <span className="nova-fallback-shadow" />
          <img className="nova-fallback-base" src="/assets/nova-base.webp" alt="" draggable="false" />
          <div className="nova-fallback-float">
            <img className="nova-fallback-torso" src="/assets/nova-torso.webp" alt="" draggable="false" />
            <img className="nova-fallback-arm nova-fallback-arm-left" src="/assets/nova-arm-left.webp" alt="" draggable="false" />
            <img className="nova-fallback-arm nova-fallback-arm-right" src="/assets/nova-arm-right.webp" alt="" draggable="false" />
            <div className="nova-fallback-head">
              <div className="nova-fallback-head-inner">
                <img className="nova-fallback-head-art" src="/assets/nova-head.webp" alt="" draggable="false" />
                <canvas className="nova-face-texture" ref={faceCanvas} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

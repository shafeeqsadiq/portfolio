import { useEffect, useRef } from "react";
import RobotFace from "./RobotFace";
import "./RobotHero.css";

/** The large, cursor-reactive CSS-3D robot from the uploaded Bhavesh portfolio.
 *  All DOM listeners and animation loops are cleaned up on unmount.
 */
export default function RobotHero({ accent = "#F0B56F" }) {
  const canvasRef = useRef(null);
  const rigRef = useRef(null);
  const faceRef = useRef(null);
  const moodRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    const rig = rigRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer:fine)").matches;
    const face = new RobotFace(canvas, { color: accent, reduced });
    faceRef.current = face;
    face.start();
    let frame = 0;
    let pointer = {x:0,y:0};
    const update = () => {
      frame=0;
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      const dx = Math.max(-1,Math.min(1,(pointer.x-r.left-r.width/2)/(window.innerWidth/2)));
      const dy = Math.max(-1,Math.min(1,(pointer.y-r.top-r.height/2)/(window.innerHeight/2)));
      face.lookAt(dx,dy);
      if (rig) {
        rig.style.setProperty("--ry", `${(dx*26-6).toFixed(1)}deg`);
        rig.style.setProperty("--rx", `${(-dy*12-4).toFixed(1)}deg`);
      }
    };
    const move = e => {
      pointer={x:e.clientX,y:e.clientY};
      if (!frame) frame=requestAnimationFrame(update);
    };
    const leave = () => {
      face.lookAt(null);
      rig?.style.removeProperty("--ry");
      rig?.style.removeProperty("--rx");
    };
    let observer;
    if (!reduced && "IntersectionObserver" in window) {
      observer=new IntersectionObserver(([entry]) => entry.isIntersecting ? face.start() : face.stop());
      observer.observe(canvas);
    }
    if (!reduced && fine) {
      window.addEventListener("pointermove", move, {passive:true});
      document.addEventListener("pointerleave", leave);
    }
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
      observer?.disconnect();
      face.stop();
      face._ro?.disconnect();
      if (faceRef.current === face) faceRef.current = null;
    };
  }, [accent]);

  const moods = ["happy", "thinking", "listening", "sad", "speaking", "idle"];
  const changeMood = () => {
    const face = faceRef.current;
    if (!face) return;
    const next = moods[moodRef.current % moods.length];
    moodRef.current += 1;
    face.setState(next);
  };

  return (
    <div className="hero-bot robot-hero" style={{ "--hot": accent }}
      role="button" tabIndex={0}
      aria-label="Interactive robot: follows the pointer, blinks, and changes expression when activated"
      onClick={changeMood}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); changeMood(); } }}
      onPointerEnter={() => { if (moodRef.current === 0) faceRef.current?.setState("listening"); }}
      onPointerLeave={() => { moodRef.current = 0; faceRef.current?.setState("idle"); }}
      onFocus={() => faceRef.current?.setState("listening")}
      onBlur={() => { moodRef.current = 0; faceRef.current?.setState("idle"); }}
    >
      <div className="bot3d" >
      <div className="b3-rig" ref={rigRef}>
      <div className="b3-antenna"><i className="b3-bulb"></i></div>
      <div className="b3-box b3-head">
      <i className="b3-f b3-front">
      <canvas aria-label="Animated robot eyes" className="b3-screen" ref={canvasRef}></canvas>
      </i>
      <i className="b3-f b3-back"></i>
      <i className="b3-f b3-left"></i>
      <i className="b3-f b3-right"></i>
      <i className="b3-f b3-top"></i>
      <i className="b3-f b3-bottom"></i>
      </div>
      <span className="b3-ear b3-ear-l"></span>
      <span className="b3-ear b3-ear-r"></span>
      <span className="b3-neck"></span>
      <div className="b3-box b3-body">
      <i className="b3-f b3-front"><b className="b3-chip"></b></i>
      <i className="b3-f b3-back"></i>
      <i className="b3-f b3-left"></i>
      <i className="b3-f b3-right"></i>
      <i className="b3-f b3-top"></i>
      <i className="b3-f b3-bottom"></i>
      </div>
      <span className="b3-limb b3-arm-l"></span>
      <span className="b3-limb b3-arm-r"></span>
      <span className="b3-limb b3-leg-l"></span>
      <span className="b3-limb b3-leg-r"></span>
      </div>
      <span className="b3-shadow"></span>
      </div>
    </div>
  );
}

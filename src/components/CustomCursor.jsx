import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduced.matches) return undefined;
    const dot = document.createElement("span");
    const ring = document.createElement("span");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    dot.setAttribute("aria-hidden", "true"); ring.setAttribute("aria-hidden", "true");
    document.body.append(dot, ring);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, frame;
    const updateTarget = (rawTarget) => {
      const target = rawTarget instanceof Element ? rawTarget : null;
      const overRobot = !!target?.closest(".robot-companion");
      document.body.classList.toggle("cursor-over-robot", overRobot);
      ring.classList.toggle("cursor-ring--active", !overRobot && !!target?.closest("a,button,[role=button],input,textarea,select"));
    };
    const move = (event) => { x = event.clientX; y = event.clientY; dot.style.transform = `translate3d(${x}px,${y}px,0)`; updateTarget(event.target); };
    const hover = (event) => updateTarget(event.target);
    const animate = () => { rx += (x - rx) * .16; ry += (y - ry) * .16; ring.style.transform = `translate3d(${rx}px,${ry}px,0)`; frame = requestAnimationFrame(animate); };
    addEventListener("mousemove", move); addEventListener("mouseover", hover); frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); removeEventListener("mousemove", move); removeEventListener("mouseover", hover); document.body.classList.remove("cursor-over-robot"); dot.remove(); ring.remove(); };
  }, []);
  return null;
}

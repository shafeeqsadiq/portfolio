import { useEffect, useRef } from "react";

/** A quiet reading-progress indicator: no React renders during scrolling. */
export default function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    const bar = barRef.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      const total = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const amount = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      if (bar) bar.style.transform = `scaleX(${amount})`;
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div className="reading-progress" aria-hidden="true"><span ref={barRef}/></div>;
}

import { useEffect } from "react";

/** Pointer-positioned, CSS-only illumination on project cards.
 *  React never re-renders while the pointer moves. Disabled on touch/reduced motion.
 */
export default function ProjectGlow() {
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!query.matches) return;
    const move = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const card = target.closest("#projects .v5-software-card, #hardware-projects .v5-robotics-card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, []);
  return null;
}

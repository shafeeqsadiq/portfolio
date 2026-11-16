import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const sections = [["intro", "Home"], ["research", "Research"], ["hardware-projects", "Robotics"], ["projects", "Software"], ["journey", "Journey"], ["skills", "Skills"], ["contact", "Contact"]];

export default function NavBar() {
  const [active, setActive] = useState("intro");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") return undefined;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const marker = Math.min(window.innerHeight * .4, 280);
        let current = sections[0][0];
        sections.forEach(([id]) => {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= marker) current = id;
        });
        setActive(current);
      });
    };
    window.addEventListener("scroll", update, { passive:true });
    window.addEventListener("resize", update);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll",update); window.removeEventListener("resize",update); };
  }, [location.pathname]);

  const handleClick = (event,id) => {
    if (location.pathname !== "/") return;
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    setActive(id);
    window.history.replaceState(null, "", `/#${id}`);
  };

  return <nav className="floating-nav v5-nav" aria-label="Main navigation"><div className="floating-nav-links">{sections.map(([id,label]) => <a href={`/#${id}`} key={id} onClick={(e)=>handleClick(e,id)} aria-current={active===id&&location.pathname==="/" ? "location":undefined} className={active===id&&location.pathname==="/"?"is-active":""}>{label}</a>)}</div></nav>;
}

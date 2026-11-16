import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Intro from "./components/Intro";
import Research from "./components/Research";
import Projects from "./components/Projects";
import HardwareProjects from "./components/HardwareProjects";
import Contact from "./components/Contact";
import CareerTimeline from "./components/CareerTimeline";
import TechnicalSkills from "./components/TechnicalSkills";
import ProjectLog from "./components/ProjectLog";
import NavBar from "./components/NavBar";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import ProjectGlow from "./components/ProjectGlow";
import PixelNameMark from "./components/PixelNameMark";
import "./App.css";
import "./styles/Global.css";
import "./styles/V5.css";
import "./styles/V6.css";
import "./styles/V6v2.css";
import "./styles/V7.css";
import "./styles/V8.css";
import "./styles/V9.css";

export default function App() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.slice(1);
      const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" }), 70);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0,0);
    return undefined;
  }, [location.pathname]);

  return <div className="App v5-app v6-app">
    <ScrollProgress /><ProjectGlow /><CustomCursor /><PixelNameMark /><NavBar />
    <main id="content"><Routes>
      <Route path="/" element={<><Intro /><Research /><HardwareProjects /><Projects /><CareerTimeline /><TechnicalSkills /><Contact /></>} />
      <Route path="/builds/:projectId" element={<ProjectLog />} />
    </Routes></main>
  </div>;
}

import React from "react";
import { Link } from "react-router-dom";
import ProjectMedia from "./ProjectMedia";
import { roboticsProjects } from "../data/portfolio";

export default function HardwareProjects() {
  return (
    <section id="hardware-projects" className="v5-section v5-robotics" aria-labelledby="robotics-title">
      <div className="v5-label-row"><span className="v5-section-kicker">02 / ROBOTICS WORK</span><span className="v5-label-rule" /></div>
      <header className="v5-section-header"><div><h2 id="robotics-title">Robotics work</h2><p>Autonomy, mapping, perception and multi-agent coordination.</p></div><span className="v5-section-count">TWO SELECTED PROJECTS</span></header>
      <div className="v5-robotics-grid">
        {roboticsProjects.map((project,index) => <article className="v5-robotics-card" key={project.slug}>
          <div className="v5-robotics-media"><ProjectMedia project={project} variant="card" /></div>
          <div className="v5-robotics-card-content">
            <div className="v5-robotics-meta"><span>{String(index + 1).padStart(2,"0")} — {project.category}</span><span>VIDEO DEMO</span></div>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
            <div className="v5-robotics-tags">{project.techStack}</div>
            <div className="v5-robotics-links"><Link to={`/builds/${project.slug}`}>Explore project <span aria-hidden="true">↗</span></Link><a href={project.link} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div>
          </div>
        </article>)}
      </div>

    </section>
  );
}

import React from "react";
import { softwareProjects } from "../data/portfolio";

export default function Projects() {
  return (
    <section id="projects" className="v5-section v5-software" aria-labelledby="software-title">
      <div className="v5-label-row"><span className="v5-section-kicker">03 / SOFTWARE</span><span className="v5-label-rule" /></div>
      <header className="v5-section-header">
        <div><h2 id="software-title">Selected software</h2><p>Data engineering, applied AI, and software.</p></div>
        <a href="https://github.com/shafeeqsadiq" target="_blank" rel="noopener noreferrer" className="v5-header-link">More on GitHub <span aria-hidden="true">↗</span></a>
      </header>
      <div className="v5-software-grid">
        {softwareProjects.map((project, index) => <article className="v5-software-card" key={project.title}>
          <div className="v5-software-card-top"><span>{String(index + 1).padStart(2,"0")} / {String(softwareProjects.length).padStart(2,"0")}</span><span className="v5-category">{project.category}</span></div>
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
          <div className="v5-software-card-footer"><span>{project.techStack}</span><div className="v5-software-card-links">{project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} live dashboard`}>Live dashboard <span aria-hidden="true">↗</span></a>}<a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`}>GitHub <span aria-hidden="true">↗</span></a></div></div>
        </article>)}
      </div>
    </section>
  );
}

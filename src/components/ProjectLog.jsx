import React from "react";
import { Link, useParams } from "react-router-dom";
import { roboticsProjects } from "../data/portfolio";
import ProjectMedia from "./ProjectMedia";

export default function ProjectLog() {
  const { projectId } = useParams();
  const project = roboticsProjects.find((item) => item.slug === projectId);
  if (!project) return <article className="v5-detail-page"><Link to="/#hardware-projects">← Back to robotics</Link><h1>Project not found</h1></article>;
  return <article className="v5-detail-page">
    <Link to="/#hardware-projects" className="v5-detail-back">← Back to robotics</Link>
    <span className="v5-section-kicker">ROBOTICS / PROJECT NOTES</span>
    <h1>{project.title}</h1><p className="v5-detail-summary">{project.desc}</p>
    <div className="v5-detail-media"><ProjectMedia project={project} variant="detail" /></div>
    <p className="v5-detail-note">Recorded project demonstration · Use the controls to play, pause or scrub through the footage.</p>
    <h2>Project highlights</h2><ul>{project.details.map(detail=><li key={detail}>{detail}</li>)}</ul>
    <p className="v5-detail-tags">{project.techStack}</p>
    <a className="v5-email-link" target="_blank" rel="noopener noreferrer" href={project.link}>View source on GitHub ↗</a>
  </article>;
}

import React from "react";
import RobotHero from "./RobotHero";

const categories = [
  { name: "Languages", skills: ["Python", "C++", "MATLAB", "JavaScript", "TypeScript", "SQL"] },
  { name: "Robotics & AI", skills: ["ROS 2", "MoveIt 2", "Gazebo", "OpenCV", "PyTorch", "SLAM", "Computer Vision", "Robot Learning"] },
  { name: "Applications & Web", skills: ["React", "React Native", "Expo", "Node.js", "Express", "Flask", "WebSockets", "Leaflet", "Chart.js"] },
];

export default function TechnicalSkills() {
  return (
    <section id="skills" className="v5-section v6-skills v6v2-skills" aria-labelledby="skills-heading">
      <div className="v5-label-row"><span className="v5-section-kicker">05 / TOOLKIT</span><span className="v5-label-rule" /></div>
      <div className="v6v2-skills-grid">
        <div className="v6v2-skills-left">
          <header className="v6v2-skills-heading">
            <h2 id="skills-heading">Technical skills<span className="v6-period">.</span></h2>
            <p>The tools and technologies I use to build across software, robotics and intelligent systems.</p>
          </header>
          <div className="v6-skills-list">
            {categories.map((cat, i) => (
              <div className="v6-skill-row" key={cat.name}>
                <div className="v6-skill-label"><span>{String(i+1).padStart(2, "0")}</span><h3>{cat.name}</h3></div>
                <div className="v6-skill-tags">{cat.skills.map(skill => <span className="v6-skill-pill" key={skill}>{skill}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
        <aside className="v6v2-robot-pane" aria-label="Interactive robotics companion">
          <span className="v6v2-robot-eyebrow">INTERACTIVE / LAB COMPANION</span>
          <div className="v6v2-robot-stage"><RobotHero accent="#B9A5F4" /></div>
          <span className="v6v2-robot-hint">MOVE YOUR CURSOR <span aria-hidden="true">·</span> CLICK TO CHANGE EXPRESSION</span>
        </aside>
      </div>
    </section>
  );
}

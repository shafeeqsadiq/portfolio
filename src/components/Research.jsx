import React from "react";

const interests = ["Embodied AI", "Robot Learning", "Computer Vision", "Autonomous Robots", "Motion Planning", "Manipulation"];

export default function Research() {
  return (
    <section id="research" className="v5-research" aria-labelledby="research-heading">
      <div className="v5-label-row"><span className="v5-section-kicker">01 / RESEARCH</span><span className="v5-label-rule" /></div>
      <div className="v5-research-content">
        <h2 id="research-heading">Research Interests</h2>
        <p className="v5-research-list">{interests.map((item, idx) => <React.Fragment key={item}><span>{item}</span>{idx < interests.length-1 && <span className="v5-research-dot" aria-hidden="true">·</span>}</React.Fragment>)}</p>
      </div>
    </section>
  );
}

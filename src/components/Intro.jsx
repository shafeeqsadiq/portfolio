import React from "react";
import { TypeAnimation } from "react-type-animation";

const socials = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/shafeeq-sadiq/" },
  { label: "GitHub", url: "https://github.com/shafeeqsadiq" },
  { label: "Medium", url: "https://medium.com/@shafeeqsadiq" },
];

export default function Intro() {
  return (
    <section id="intro" className="v5-intro" aria-labelledby="v5-intro-heading">
      <div className="v5-intro-grid">
        <div className="v5-intro-copy">
          <p className="v5-overline">HELLO, I'M</p>
          <h1 id="v5-intro-heading" className="v5-hero-name">
            <span className="v5-hero-typed"><TypeAnimation sequence={["Shafeeq Sadiq"]} speed={62} repeat={0} cursor={false} /></span><span className="v5-name-cursor" aria-hidden="true">|</span>
          </h1>
          <div className="v5-intro-description">
            <p>I’m an <strong>AI Engineer at Resilience, Inc.</strong>, with a master’s degree in Computer Science from <strong>Saint Louis University</strong>. Alongside my interests in robot learning, embodied AI, and computer vision, I also build meaningful software applications that address practical problems.</p>
            <p>My goal is to bridge AI and robotics through meaningful, research-driven projects, creating intelligent systems that connect software to the physical world. Outside my day-to-day work, I enjoy contributing to open source, participating in hackathons, attending tech events, and exchanging ideas with the wider engineering community.</p>
          </div>
          <div className="v5-intro-actions">
            <a className="v5-contact-link" href="mailto:shafeeqsadiq2000@gmail.com">Get in touch <span aria-hidden="true">↗</span></a>
            <span className="v5-actions-divider" aria-hidden="true" />
            <div className="v5-socials" aria-label="Social profiles">
              {socials.map(({ label, url }) => <a key={label} href={url} target="_blank" rel="noreferrer noopener">{label}<span aria-hidden="true">↗</span></a>)}
            </div>
          </div>
        </div>
        <figure className="v5-portrait">
          <div className="v5-portrait-frame"><img src="/profile.jpg" alt="Portrait of Shafeeq Sadiq" loading="eager" decoding="async" /></div>
        </figure>
      </div>
    </section>
  );
}

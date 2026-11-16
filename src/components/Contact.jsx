import React from "react";

export default function Contact() {
  return (
    <footer id="contact" className="v5-contact">
      <div className="v5-label-row"><span className="v5-section-kicker">06 / CONTACT</span><span className="v5-label-rule" /></div>
      <div className="v5-contact-content"><div><h2>Let's build something meaningful.</h2><p>I'm always glad to connect about research, engineering collaborations, open source and thoughtful ideas.</p></div><a href="mailto:shafeeqsadiq2000@gmail.com" className="v5-email-link">Say hello <span aria-hidden="true">↗</span></a></div>
      <div className="v5-footer-bottom"><span>© {new Date().getFullYear()} Shafeeq Sadiq</span><div><a href="https://www.linkedin.com/in/shafeeq-sadiq/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://github.com/shafeeqsadiq" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://medium.com/@shafeeqsadiq" target="_blank" rel="noopener noreferrer">Medium</a></div></div>
    </footer>
  );
}

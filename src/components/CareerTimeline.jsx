import React, { useState } from "react";

// All positions use exactly the same calendar scale, shared by year ticks,
// education spans, logos and the orange progress line. A month is plotted
// at its midpoint because only the month (not the exact day) is supplied.
const FIRST_YEAR = 2018;
const LAST_YEAR = 2026;
const TOTAL_YEARS = LAST_YEAR + 1 - FIRST_YEAR;
const YEAR_TICKS = Array.from({ length: TOTAL_YEARS }, (_, index) => FIRST_YEAR + index);
const atMonth = (year, month = 1) => ((year - FIRST_YEAR + (month - 0.5) / 12) / TOTAL_YEARS) * 100;
const atYear = (year) => ((year - FIRST_YEAR) / TOTAL_YEARS) * 100;

const stops = [
  {
    id: "anna",
    title: "Anna University",
    detail: "B.E • Computer Science & Engineering",
    year: "2022",
    period: "Aug 2018 – May 2022",
    month: { year: 2022, month: 5 },
    studyStart: { year: 2018, month: 8 },
    logo: "/assets/identity/anna-badge.png",
    milestone: "Graduated May 2022",
    type: "education",
  },
  {
    id: "slu",
    title: "Saint Louis University",
    detail: "M.S • Computer Science",
    year: "2025",
    period: "Aug 2023 – May 2025",
    month: { year: 2025, month: 5 },
    studyStart: { year: 2023, month: 8 },
    logo: "/assets/identity/slu-badge.png",
    milestone: "Graduated May 2025",
    type: "education",
  },
  {
    id: "resilience",
    title: "Resilience, Inc.",
    detail: "AI Research Engineer",
    year: "PRESENT",
    period: "Aug 2025 – Present",
    month: { year: 2025, month: 8 },
    logo: "/assets/identity/resilience-badge.png",
    milestone: "Started August 2025",
    type: "experience",
  },
];

export default function CareerTimeline() {
  const [active, setActive] = useState(2);
  const selection = stops[active];
  const selectedPosition = atMonth(selection.month.year, selection.month.month);

  return (
    <section id="journey" className="v5-section v9-journey" aria-labelledby="journey-label">
      <div className="v5-label-row">
        <span className="v5-section-kicker" id="journey-label">04 / EDUCATION &amp; EXPERIENCE</span>
        <span className="v5-label-rule" />
      </div>

      <div className="v9-map" aria-label="Interactive education and experience timeline, from 2018 through 2026">
        <header className="v9-map-header">
          <span>ENGINEERING JOURNEY / CONNECTED CHAPTERS</span>
          <span>2018 <em aria-hidden="true">→</em> PRESENT</span>
        </header>

        <div className="v9-scroll" role="region" aria-label="Timeline from 2018 to present. Scroll horizontally on narrow screens." tabIndex={0}>
          <div className="v9-content">
            <div className="v9-years-row">
              <span className="v9-row-label">YEAR</span>
              <div className="v9-calendar">
                {YEAR_TICKS.map((year) => <span key={year}
                  className={`v9-year ${year === FIRST_YEAR ? "v9-year-first" : ""}`}
                  style={{ left: `${atYear(year)}%` }}>{year}</span>)}
                <span className="v9-year v9-year-present" style={{ left: "100%" }}>PRESENT</span>
              </div>
            </div>

            <div className="v9-education-row">
              <span className="v9-row-label">EDUCATION</span>
              <div className="v9-education-area">
                {stops.slice(0, 2).map((stop, index) => {
                  const start = atMonth(stop.studyStart.year, stop.studyStart.month);
                  const end = atMonth(stop.month.year, stop.month.month);
                  return <div className="v9-study-span" key={stop.id}
                    style={{ left: `${start}%`, width: `${end - start}%` }}>
                    <button type="button" className={`v9-study-card ${active === index ? "is-current" : ""}`}
                      onClick={() => setActive(index)} aria-pressed={active === index}
                      aria-label={`${stop.title}, ${stop.detail}, ${stop.period}`}>
                      <span className="v9-study-icon"><img src={stop.logo} alt="" /></span>
                      <span className="v9-study-copy"><strong>{stop.title}</strong><small>{stop.detail}</small></span>
                    </button>
                    <span className="v9-study-duration" aria-hidden="true" />
                  </div>;
                })}
              </div>
            </div>

            <div className="v9-experience-row">
              <span className="v9-row-label">EXPERIENCE <span>&amp; EDUCATION</span></span>
              <div className="v9-track" style={{ "--v9-progress": `${selectedPosition}%` }}>
                <span className="v9-track-base" aria-hidden="true" />
                <span className="v9-track-progress" aria-hidden="true" />
                {stops.map((stop, index) => <div key={stop.id}
                  className={`v9-event v9-event-${stop.id}`}
                  style={{ left: `${atMonth(stop.month.year, stop.month.month)}%` }}>
                  <button className={`v9-event-button ${active === index ? "is-current" : ""}`} type="button"
                    onClick={() => setActive(index)} aria-pressed={active === index}
                    title={`${stop.title} — ${stop.milestone}`}
                    aria-label={`${stop.title}. ${stop.milestone}. Select timeline milestone.`}>
                    <img src={stop.logo} alt="" />
                  </button>
                  <span className="v9-event-caption" aria-hidden="true">
                    <strong>{stop.title}</strong>
                    <small>{stop.year}</small>
                  </span>
                </div>)}
              </div>
            </div>
          </div>
        </div>

        <p className="v9-scroll-note">SCROLL HORIZONTALLY TO SEE THE COMPLETE TIMELINE →</p>
        <footer className="v9-footer">
          <span className="v9-legend"><i className="v9-legend-bar" /> Education duration</span>
          <span className="v9-selected" aria-live="polite">SELECTED / {selection.title.toUpperCase()} · {selection.period.toUpperCase()}</span>
        </footer>
      </div>
    </section>
  );
}

import React, { useEffect, useRef, useState } from "react";
import "../styles/ProjectMedia.css";

/**
 * Offline-friendly project media: a real, bundled screenshot always sits behind
 * each bundled video. If a video cannot load or decode, the same screenshot
 * remains visible instead of a broken-media icon or an empty black panel.
 *
 * Videos are deliberately silent. The case-study player exposes play/pause and
 * seeking without the unnecessary sound toggle in the browser's native UI.
 */
export default function ProjectMedia({ project, variant = "featured", active = true }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visiblePage, setVisiblePage] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const isDetail = variant === "detail";
  const hasVideo = Boolean(project.video) && !failed;
  const poster = project.poster || project.image;

  useEffect(() => {
    setFailed(false);
    setReady(false);
    setPosterFailed(false);
    setPlaying(false);
    setDuration(0);
    setCurrentTime(0);
  }, [project.video, poster]);

  useEffect(() => {
    if (!project.video || isDetail) return undefined;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener?.("change", update);
    return () => mediaQuery.removeEventListener?.("change", update);
  }, [project.video, isDetail]);

  useEffect(() => {
    if (!project.video || isDetail || !containerRef.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [project.video, isDetail]);

  useEffect(() => {
    if (!project.video || isDetail) return undefined;
    const update = () => setVisiblePage(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, [project.video, isDetail]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isDetail || failed) return undefined;
    if (active && inView && visiblePage && !reducedMotion) {
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
    return undefined;
  }, [active, inView, visiblePage, reducedMotion, isDetail, failed]);

  const togglePlayback = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video || failed) return;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  const seek = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    const next = Number(event.target.value);
    video.currentTime = next;
    setCurrentTime(next);
  };

  const formatTime = (value) => {
    const seconds = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className={`project-media project-media--${variant} ${hasVideo ? "project-media--video" : "project-media--image"}`}
    >
      {!posterFailed ? (
        <img
          className="project-media__asset project-media__still"
          src={poster}
          alt={`${project.title} project demonstration preview`}
          loading={isDetail ? "eager" : "lazy"}
          decoding="async"
          onError={() => setPosterFailed(true)}
        />
      ) : (
        <span className="project-media__unavailable" role="img" aria-label={`${project.title} preview unavailable`}>
          {project.title} · Preview unavailable
        </span>
      )}

      {hasVideo && (
        <video
          ref={videoRef}
          className={`project-media__asset project-media__video${ready ? " is-ready" : ""}`}
          src={project.video}
          poster={poster}
          preload="metadata"
          playsInline
          muted
          loop={!isDetail}
          controls={false}
          onLoadedData={() => setReady(true)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => { setFailed(true); setReady(false); setPlaying(false); }}
          aria-label={`${project.title} project demonstration video`}
        />
      )}

      {hasVideo && (
        <>
          {!isDetail && (
            <span className="project-media__label" aria-hidden="true">
              <span className="project-media__live-dot" /> Project footage
            </span>
          )}
          <div className={`project-media__controls${isDetail ? " project-media__controls--detail" : ""}`}>
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={playing ? `Pause ${project.title} video` : `Play ${project.title} video`}
              title={playing ? "Pause video" : "Play video"}
            >
              {playing ? "Ⅱ" : "▶"}
            </button>
            {isDetail && (
              <>
                <input
                  className="project-media__seek"
                  type="range"
                  min="0"
                  max={duration || 0.1}
                  step="0.1"
                  value={Math.min(currentTime, duration || 0.1)}
                  onChange={seek}
                  onClick={(event) => event.stopPropagation()}
                  aria-label={`Seek through ${project.title} demonstration`}
                />
                <span className="project-media__time" aria-hidden="true">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </>
            )}
          </div>
        </>
      )}
      {failed && <span className="project-media__fallback-label">Video unavailable · Showing project screenshot</span>}
    </div>
  );
}

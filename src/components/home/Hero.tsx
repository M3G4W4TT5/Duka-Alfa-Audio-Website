import { useEffect, useState } from "react";
import type { BrowserPhoto } from "../../data/types";
import "./hero.css";

interface Props {
  slides: (BrowserPhoto & { id: string; durationMs?: number })[];
  title: string;
  message: string;
  intervalMs: number;
}
export default function Hero({ slides, title, message, intervalMs }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(preference.matches);
    const visibility = () => setVisible(!document.hidden);
    motion();
    visibility();
    preference.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      preference.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (
      slides.length < 2 ||
      paused ||
      hovered ||
      focused ||
      reduced ||
      !visible
    )
      return;
    const timer = window.setTimeout(
      () => setActive((active + 1) % slides.length),
      slides[active].durationMs ?? intervalMs,
    );
    return () => window.clearTimeout(timer);
  }, [active, slides, intervalMs, paused, hovered, focused, reduced, visible]);
  if (!slides.length) return null;
  const move = (direction: number) =>
    setActive((active + direction + slides.length) % slides.length);
  return (
    <section
      className="hero"
      aria-label="Featured event photographs"
      aria-roledescription="carousel"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setFocused(false);
      }}
    >
      <div className="hero-photos">
        {slides.map(
          (slide, index) =>
            (index === active ||
              index === (active + 1) % slides.length ||
              index === (active - 1 + slides.length) % slides.length) && (
              <img
                key={slide.id}
                className={`hero-photo ${active === index ? "is-active" : ""}`}
                src={slide.src}
                srcSet={slide.srcSet}
                sizes={`(max-aspect-ratio: ${slide.width}/${slide.height}) max(${Math.ceil((620 * slide.width) / slide.height)}px, ${Math.ceil((100 * slide.width) / slide.height)}svh), 100vw`}
                width={slide.width}
                height={slide.height}
                alt={active === index ? slide.alt : ""}
                aria-hidden={active !== index}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                style={{ objectPosition: slide.position ?? "center" }}
              />
            ),
        )}
      </div>
      <div className="hero-shade" />
      <div className="hero-copy">
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
      {slides.length > 1 && (
        <div
          className="hero-controls"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button aria-label="Previous hero image" onClick={() => move(-1)}>
            <img className="icon" src="/icons/chevron-left.svg" alt="" />
          </button>
          <span aria-hidden="true">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
          <button aria-label="Next hero image" onClick={() => move(1)}>
            <img className="icon" src="/icons/chevron-right.svg" alt="" />
          </button>
          <button
            aria-label={
              paused || reduced ? "Play slideshow" : "Pause slideshow"
            }
            aria-pressed={paused || reduced}
            disabled={reduced}
            onClick={() => setPaused(!paused)}
          >
            <img
              className="icon"
              src={`/icons/${paused || reduced ? "play" : "pause"}.svg`}
              alt=""
            />
          </button>
        </div>
      )}
      <a className="hero-scroll" href="#about">
        Discover Duka
      </a>
    </section>
  );
}

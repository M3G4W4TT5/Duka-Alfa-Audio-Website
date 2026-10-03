import { useEffect, useRef, useState } from "react";
import type { BrowserPhoto } from "../../data/types";
import "./stories.css";

interface CarouselStory {
  slug: string;
  title: string;
  tags: string[];
  photo: BrowserPhoto;
}
interface Props {
  stories: CarouselStory[];
}
export default function StoriesCarousel({ stories }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      element.scrollTo({
        left: activeRef.current * element.clientWidth,
        behavior: "instant",
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  if (!stories.length) return null;
  const go = (index: number) => {
    const element = track.current;
    if (!element) return;
    const target = (index + stories.length) % stories.length;
    element.scrollTo({
      left: target * element.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return (
    <div
      className="stories-shell"
      role="region"
      aria-label="Selected project stories"
      aria-roledescription="carousel"
    >
      <div
        ref={track}
        className={`stories-track ${dragging ? "is-dragging" : ""}`}
        onScroll={() => {
          const element = track.current;
          if (element)
            setActive(
              Math.max(
                0,
                Math.min(
                  stories.length - 1,
                  Math.round(element.scrollLeft / element.clientWidth),
                ),
              ),
            );
        }}
        onPointerDown={(event) => {
          drag.current = null;
          if (
            event.pointerType === "touch" ||
            event.button !== 0 ||
            (event.target as HTMLElement).closest("a, button")
          )
            return;
          drag.current = {
            x: event.clientX,
            left: event.currentTarget.scrollLeft,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onPointerMove={(event) => {
          if (drag.current)
            event.currentTarget.scrollLeft =
              drag.current.left - (event.clientX - drag.current.x);
        }}
        onPointerUp={(event) => {
          if (!drag.current) return;
          const element = event.currentTarget;
          const distance = event.clientX - drag.current.x;
          const start = Math.round(drag.current.left / element.clientWidth);
          const next =
            Math.abs(distance) > Math.min(element.clientWidth * 0.15, 100)
              ? start + (distance < 0 ? 1 : -1)
              : start;
          drag.current = null;
          setDragging(false);
          if (element.hasPointerCapture(event.pointerId))
            element.releasePointerCapture(event.pointerId);
          requestAnimationFrame(() =>
            go(Math.max(0, Math.min(stories.length - 1, next))),
          );
        }}
        onPointerCancel={() => {
          drag.current = null;
          setDragging(false);
        }}
      >
        {stories.map((story, index) => (
          <article
            className="story-slide"
            key={story.slug}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${stories.length}: ${story.title}`}
          >
            <img
              className="story-photo"
              src={story.photo.src}
              srcSet={story.photo.srcSet}
              sizes={`(max-width: 600px) ${Math.ceil((620 * story.photo.width) / story.photo.height)}px, 100vw`}
              width={story.photo.width}
              height={story.photo.height}
              alt={story.photo.alt}
              style={{ objectPosition: story.photo.position ?? "center" }}
              loading="lazy"
              draggable={false}
            />
            <div className="story-shade" />
            <div className="story-copy">
              <h3>{story.title}</h3>
              {story.tags.length > 0 && (
                <ul className="story-tags">
                  {story.tags.slice(0, 4).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
              <a
                className="menu__link"
                href={`/stories/${story.slug}/`}
                tabIndex={active === index ? 0 : -1}
              >
                Learn More<span className="sr-only"> about {story.title}</span>
              </a>
            </div>
          </article>
        ))}
      </div>
      {stories.length > 1 && (
        <>
          <div className="story-dots" aria-label="Choose a story">
            {stories.map((story, index) => (
              <button
                key={story.slug}
                aria-label={`Show ${story.title}, story ${index + 1} of ${stories.length}`}
                aria-current={active === index ? "true" : undefined}
                onClick={() => go(index)}
              >
                <span className={active === index ? "is-active" : ""} />
              </button>
            ))}
          </div>
        </>
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {stories[active]?.title}
      </span>
    </div>
  );
}

import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Service } from "../../data/types";
import { navigation } from "../../data/navigation";
import "./header.css";

interface Props {
  services: Pick<Service, "slug" | "title" | "parent">[];
  home?: boolean;
}

export default function Header({ services, home = false }: Props) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(!home);
  const root = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const current = Math.max(0, window.scrollY);
      const heroEnd =
        document.querySelector<HTMLElement>(".hero")?.offsetHeight ?? 0;
      setScrolled(!home || current > 60);
      if (home && current < heroEnd) {
        setHidden(false);
        previous = current;
      } else if (Math.abs(current - previous) > 2) {
        setHidden(current > previous);
        previous = current;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  useEffect(() => {
    if (!open) return;
    const background = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main, footer, .contact-fab, .skip",
      ),
    );
    background.forEach((element) => {
      element.inert = true;
    });
    document.body.classList.add("menu-open");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = Array.from(
        root.current?.querySelectorAll<HTMLElement>("a, button, summary") ?? [],
      ).filter((element) => element.getClientRects().length > 0);
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      background.forEach((element) => {
        element.inert = false;
      });
      document.body.classList.remove("menu-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      ref={root}
      role={open ? "dialog" : undefined}
      aria-modal={open ? true : undefined}
      aria-label={open ? "Website navigation" : undefined}
      className={`site-header ${hidden && !open ? "is-hidden" : ""} ${scrolled || open ? "is-solid" : ""}`}
    >
      <div className="header-bar">
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen(!open)}
        >
          <img src="/identity/mark.svg" alt="" width="58" height="58" />
        </button>
        <a className="wordmark" href="/" aria-label="Duka Alfa Audio home">
          <img
            src="/identity/wordmark.svg"
            alt="DUKA ALFA AUDIO"
            width="256"
            height="23"
          />
        </a>
        <a className="button header-contact" href="/contact/">
          Get in Touch
        </a>
      </div>
      <div
        id="site-navigation"
        className={`navigation-overlay ${open ? "is-open" : ""}`}
        inert={!open}
        aria-hidden={!open}
      >
        <nav className="overlay-content" aria-label="Main navigation">
          <div className="menu-links">
            {navigation.slice(0, 2).map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <details className="menu-services">
              <summary>Services<Plus className="menu-expand" size={20} aria-hidden="true" /><Minus className="menu-collapse" size={20} aria-hidden="true" /></summary>
              <div className="service-submenu">
                {services.map((service) => (
                  <a
                    key={service.slug}
                    className={service.parent ? "submenu-child" : ""}
                    href={`/services/${service.slug}/`}
                  >
                    {service.title}
                  </a>
                ))}
              </div>
            </details>
            {navigation.slice(2).map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <div className="menu-note">
            <p className="eyebrow">Professional sound & lighting</p>
            <p>
              From live stages
              <br />
              to the spaces we share.
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}

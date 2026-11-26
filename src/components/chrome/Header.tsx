import { Mail, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Service } from "../../data/types";
import { navigation } from "../../data/navigation";
import NavigationChladni from "#navigation-chladni";
import { navigationStills, useNavigationPresentation } from "./useNavigationPresentation";
import "./header.css";

interface Props {
  services: Pick<Service, "slug" | "title" | "parent">[];
  home?: boolean;
  contactIconOnly?: boolean;
}

const blankImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default function Header({ services, home = false, contactIconOnly = false }: Props) {
  const { open, showArtwork, still, close, toggleMenu, reportArtwork,
    stillImage, decodeStill, selectCheckedInLook, replaceArtwork, finishReveal } = useNavigationPresentation();
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
        event.preventDefault();
        close();
        toggle.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = Array.from(
        root.current?.querySelectorAll<HTMLElement>(
          "a[href], button, summary, input, select, textarea, [tabindex]",
        ) ?? [],
      ).filter((element) =>
        element.tabIndex >= 0 &&
        !element.matches(":disabled") &&
        !element.closest("[inert]") &&
        element.getClientRects().length > 0 &&
        getComputedStyle(element).visibility === "visible",
      );
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
  }, [close, open]);

  return (
    <header
      ref={root}
      role={open ? "dialog" : undefined}
      aria-modal={open ? true : undefined}
      aria-label={open ? "Website navigation" : undefined}
      className={`site-header ${hidden && !open ? "is-hidden" : ""} ${scrolled || open ? "is-solid" : ""} ${open ? "has-open-navigation" : ""}`}
    >
      <div className="header-bar">
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => {
            toggle.current?.focus();
            toggleMenu();
          }}
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
        <a
          className={contactIconOnly ? "header-mail" : "button header-contact"}
          href="/contact/"
          aria-label={contactIconOnly ? "Contact Duka Alfa Audio" : undefined}
        >
          {contactIconOnly ? <Mail size={22} strokeWidth={1.5} aria-hidden="true" /> : "Get in Touch"}
        </a>
      </div>
      <div
        id="site-navigation"
        className={`navigation-overlay ${open ? "is-open" : ""}`}
        inert={!open}
        aria-hidden={!open}
        onTransitionEnd={(event) => {
          if (open && event.target === event.currentTarget && event.propertyName === "opacity") finishReveal();
        }}
      >
        <NavigationChladni open={open} showArtwork={showArtwork} dialog={root} reportArtwork={reportArtwork}
          selectCheckedInLook={selectCheckedInLook} replaceArtwork={replaceArtwork} />
        {(navigationStills.desktop || navigationStills.mobile) && (
          <picture hidden>
            <source media="(prefers-reduced-motion: reduce)" srcSet={blankImage} />
            <source media={`(width < ${navigationStills.breakpoint}px)`} srcSet={navigationStills.mobile ?? blankImage} />
            <img ref={stillImage} onLoad={decodeStill} src={navigationStills.desktop ?? blankImage} alt="" />
          </picture>
        )}
        {still && (
          <div className={`navigation-artwork navigation-starting-frame ${showArtwork ? "is-fading" : ""}`} aria-hidden="true">
            <img src={still} alt="" />
          </div>
        )}
        <nav className="navigation-scroll" aria-label="Main navigation">
          <div className="overlay-content">
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
          </div>
        </nav>
      </div>
    </header>
  );
}

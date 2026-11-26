interface Passage {
  element: HTMLElement;
  text: string;
}

// Measure normal browser wrapping before masking each line. This preserves
// kerning, text balancing and the actual metrics of the locally hosted font.
function splitPassages(passages: Passage[]) {
  const fragments = passages.map(({ element, text }) => {
    const node = element.firstChild!;
    const range = document.createRange();
    const lineStarts: number[] = [];
    let lastTop = -Infinity;
    function recordLine(offset: number, top: number) {
      if (Math.abs(top - lastTop) > 1) lineStarts.push(offset);
      lastTop = top;
    }
    for (const match of text.matchAll(/\S+/g)) {
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      const rects = range.getClientRects();
      if (rects.length === 1) {
        recordLine(match.index, rects[0].top);
        continue;
      }
      // A hyphenated word can occupy two lines. Keep the browser's exact break.
      let offset = match.index;
      for (const character of match[0]) {
        range.setStart(node, offset);
        range.setEnd(node, offset + character.length);
        recordLine(offset, range.getBoundingClientRect().top);
        offset += character.length;
      }
    }

    const original = document.createElement("span");
    original.className = "sr-only";
    original.textContent = text;
    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    const title = element.dataset.reveal === "title";
    lineStarts.forEach((start, index) => {
      const ink = document.createElement("span");
      ink.className = title ? "history-line history-title-line" : "history-line history-body-line";
      ink.style.setProperty("--order", String(index));
      ink.textContent = text.slice(start, lineStarts[index + 1]);
      if (title) {
        const mask = document.createElement("span");
        mask.className = "history-line-mask";
        mask.append(ink);
        visual.append(mask);
      } else {
        visual.append(ink);
      }
    });
    return [original, visual];
  });
  passages.forEach(({ element }, index) => element.replaceChildren(...fragments[index]));
}

export function mountHistory(viewport: HTMLElement) {
  const wide = matchMedia("(min-width: 64rem) and (orientation: landscape)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const chapters = Array.from(viewport.querySelectorAll<HTMLElement>(".history-chapter"));
  const photos = Array.from(viewport.querySelectorAll<HTMLElement>(".history-photo"));
  const passages = Array.from(viewport.querySelectorAll<HTMLElement>(".history-title, .history-body"),
    (element) => ({ element, text: element.textContent!.trim() }));
  const textGroups = viewport.querySelectorAll<HTMLElement>(".history-year, .history-copy, .history-note");
  const textObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.setAttribute("data-shown", "");
      entry.target.querySelectorAll("[data-reveal]").forEach((text) => text.setAttribute("data-shown", ""));
      textObserver.unobserve(entry.target);
    }
  });

  let horizontal = false;
  let initialized = false;
  let fontsReady = false;
  let photoObserver: IntersectionObserver | undefined;
  let inputs: AbortController | undefined;
  let panFrame = 0;
  let wheelFrame = 0;
  let destination = 0;
  let lastTime = 0;

  function updatePhotos() {
    panFrame = 0;
    if (reduced.matches) return;
    const size = horizontal ? viewport.clientWidth : window.innerHeight;
    for (const photo of photos) {
      const rect = photo.getBoundingClientRect();
      const start = horizontal ? rect.left : rect.top;
      const length = horizontal ? rect.width : rect.height;
      if (start > size || start + length < 0) continue;
      const progress = (size - start) / (size + length);
      photo.style.setProperty("--pan", `${(progress * 20 - 10).toFixed(3)}%`);
    }
  }

  function queuePhotos() {
    if (!panFrame && !reduced.matches) panFrame = requestAnimationFrame(updatePhotos);
  }

  function stopWheel() {
    cancelAnimationFrame(wheelFrame);
    wheelFrame = 0;
  }

  function easeWheel(time: number) {
    if (!readingHorizontally()) {
      stopWheel();
      return;
    }
    const delta = destination - viewport.scrollLeft;
    if (Math.abs(delta) <= 1) {
      viewport.scrollLeft = destination;
      wheelFrame = 0;
      return;
    }
    const elapsed = time - lastTime;
    lastTime = time;
    viewport.scrollLeft += Math.sign(delta) * Math.max(1, Math.abs(delta) * (1 - Math.exp(-7.5 * elapsed / 1000)));
    wheelFrame = requestAnimationFrame(easeWheel);
  }

  function moveBy(distance: number) {
    const max = viewport.scrollWidth - viewport.clientWidth;
    const current = viewport.scrollLeft;
    const next = wheelFrame ? destination : current;
    if (distance < 0 ? Math.max(current, next) <= 1 : Math.min(current, next) >= max - 1) return false;
    destination = Math.max(0, Math.min(max, next + distance));
    if (reduced.matches) viewport.scrollLeft = destination;
    else if (!wheelFrame) {
      lastTime = performance.now();
      wheelFrame = requestAnimationFrame(easeWheel);
    }
    return true;
  }

  function readingHorizontally() {
    return horizontal && window.scrollY < 1 && !viewport.closest("[inert]");
  }

  function onWheel(event: WheelEvent) {
    if (!readingHorizontally() || event.ctrlKey || event.defaultPrevented) return;
    if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      stopWheel(); // Native sideways trackpad gestures stay under the reader’s finger.
      return;
    }
    const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 :
      event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? viewport.clientWidth : 1;
    if (event.deltaY && moveBy(event.deltaY * unit)) event.preventDefault();
  }

  function onKey(event: KeyboardEvent) {
    if (!readingHorizontally() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!(event.target instanceof HTMLElement) ||
        !event.target.matches("html, body, #main, [data-history]")) return;
    const page = viewport.clientWidth * .85;
    const step: Record<string, number> = {
      ArrowLeft: -80, ArrowRight: 80, ArrowUp: -80, ArrowDown: 80,
      PageUp: -page, PageDown: page, " ": event.shiftKey ? -page : page,
      Home: -viewport.scrollWidth, End: viewport.scrollWidth,
    };
    if (step[event.key] && moveBy(step[event.key])) event.preventDefault();
  }

  // Horizontal swipes are native. A vertical swipe can also advance the strip.
  let touch: { x: number; y: number; previousY: number } | undefined;
  function onTouchStart(event: TouchEvent) {
    stopWheel();
    const finger = event.touches[0];
    touch = event.touches.length === 1 ? { x: finger.clientX, y: finger.clientY, previousY: finger.clientY } : undefined;
  }
  function onTouchMove(event: TouchEvent) {
    if (!touch || event.touches.length !== 1 || !readingHorizontally()) return;
    const finger = event.touches[0];
    const delta = touch.previousY - finger.clientY;
    touch.previousY = finger.clientY;
    if (Math.abs(finger.clientX - touch.x) >= Math.abs(finger.clientY - touch.y)) return;
    const next = Math.max(0, Math.min(viewport.scrollWidth - viewport.clientWidth, viewport.scrollLeft + delta));
    if (event.cancelable && Math.abs(next - viewport.scrollLeft) > .5) {
      event.preventDefault();
      viewport.scrollLeft = next;
    }
  }

  function observePhotos() {
    const edge = horizontal ? viewport.clientWidth - 100 : innerHeight * .72;
    photoObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const photo = entry.target;
        observer.unobserve(photo);
        const show = () => photo.setAttribute("data-shown", "");
        const img = photo.querySelector("img")!;
        // A fast scroll can bring a lazy image into view before it has decoded.
        if (img.complete) show();
        else {
          img.loading = "eager";
          void img.decode().then(show, show);
        }
      }
    }, {
      root: horizontal ? viewport : null,
      rootMargin: horizontal ? "0px -100px 0px 0px" : `0px 0px -${Math.round(innerHeight - edge)}px 0px`,
    });
    for (const photo of photos) {
      if (photo.hasAttribute("data-shown")) continue;
      const rect = photo.getBoundingClientRect();
      const startsInView = horizontal ? rect.left < edge && rect.right > 0 : rect.top < edge && rect.bottom > 0;
      if (!initialized && startsInView) photo.setAttribute("data-opening", "");
      photoObserver.observe(photo);
    }
  }

  function layout() {
    stopWheel();
    const previous = horizontal;
    const rect = viewport.getBoundingClientRect();
    const inHistory = rect.bottom > 0 && rect.top < innerHeight;
    const atStart = previous ? viewport.scrollLeft < 1 : window.scrollY < 1;
    const chapter = chapters.find((section) => {
      const box = section.getBoundingClientRect();
      return previous ? box.right > viewport.clientWidth * .35 : box.bottom > innerHeight * .35;
    });

    // Restore natural line wrapping before checking available space on rotation.
    for (const { element, text } of passages) element.textContent = text;
    horizontal = wide.matches;
    viewport.toggleAttribute("data-horizontal", horizontal);
    // Very short windows and enlarged text must still expose every line.
    if (horizontal && Array.from(viewport.querySelectorAll<HTMLElement>(".history-lead, .history-note"))
      .some((column) => column.scrollHeight > column.clientHeight + 1)) {
      horizontal = false;
      viewport.removeAttribute("data-horizontal");
    }
    if (horizontal && !inputs) {
      viewport.tabIndex = 0;
      inputs = new AbortController();
      const { signal } = inputs;
      window.addEventListener("wheel", onWheel, { passive: false, signal });
      window.addEventListener("keydown", onKey, { signal });
      viewport.addEventListener("pointerdown", stopWheel, { passive: true, signal });
      viewport.addEventListener("touchstart", onTouchStart, { passive: true, signal });
      viewport.addEventListener("touchmove", onTouchMove, { passive: false, signal });
    } else if (!horizontal && inputs) {
      viewport.removeAttribute("tabindex");
      inputs.abort();
      inputs = undefined;
    }

    photoObserver?.disconnect();
    textObserver.disconnect();
    const motion = !reduced.matches && fontsReady;
    viewport.toggleAttribute("data-preparing", !reduced.matches && !fontsReady);
    viewport.toggleAttribute("data-motion", motion);
    if (motion) {
      splitPassages(passages);
      for (const group of textGroups) {
        if (!group.hasAttribute("data-shown")) textObserver.observe(group);
      }
      observePhotos();
    }
    if (initialized && previous !== horizontal && inHistory && !atStart && chapter) {
      if (horizontal) {
        window.scrollTo({ top: 0, behavior: "instant" });
        viewport.scrollLeft += chapter.getBoundingClientRect().left - parseFloat(getComputedStyle(viewport.firstElementChild!).paddingLeft);
      } else {
        viewport.scrollLeft = 0;
        chapter.scrollIntoView({ block: "start", behavior: "instant" });
      }
    }
    initialized = fontsReady || reduced.matches;
    queuePhotos();
  }

  let layoutFrame = 0;
  function queueLayout() {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(layout);
  }

  layout();
  const begin = () => { fontsReady = true; queueLayout(); };
  const fontDeadline = window.setTimeout(begin, 450);
  void document.fonts.ready.then(() => {
    clearTimeout(fontDeadline);
    begin();
  });
  let width = viewport.clientWidth;
  let height = innerHeight;
  function checkSize() {
    const nextWidth = viewport.clientWidth;
    if (width !== nextWidth || (wide.matches && height !== innerHeight)) queueLayout();
    width = nextWidth;
    height = innerHeight;
  }
  // The reading width can change when a scrollbar appears without a window resize.
  new ResizeObserver(checkSize).observe(viewport);
  window.addEventListener("resize", checkSize);
  wide.addEventListener("change", queueLayout);
  reduced.addEventListener("change", queueLayout);
  window.addEventListener("scroll", queuePhotos, { passive: true });
  viewport.addEventListener("scroll", queuePhotos, { passive: true });
}

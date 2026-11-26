import { useCallback, useEffect, useRef, useState } from "react";
import type { ChladniPresentationStatus } from "@duka/chladni/player";
import preset from "../../data/navigation.chladni.json";
import presetSource from "../../data/navigation.chladni.json?raw";
import stillManifest from "../../data/navigation-stills.json";

export type ReportArtwork = (status: ChladniPresentationStatus, present?: () => boolean) => void;

const firstFrameWait = 250;
declare const __CHLADNI_STILL_RELEASE__: string | null;
const stillUrls = import.meta.glob<string>("../../assets/navigation-*.webp", {
  eager: true, query: "?url", import: "default",
});
const captured: {
  presetSha256: string;
  simulatorIntegrity: string;
  desktopSha256?: string;
  mobileSha256?: string;
} = stillManifest;
const matchingRelease = __CHLADNI_STILL_RELEASE__ === captured.simulatorIntegrity;
export const navigationStills = {
  desktop: matchingRelease && captured.desktopSha256 ? stillUrls["../../assets/navigation-desktop.webp"] : undefined,
  mobile: matchingRelease && captured.mobileSha256 ? stillUrls["../../assets/navigation-mobile.webp"] : undefined,
  breakpoint: preset.framing.breakpoint,
};

function mayShowArtwork() {
  return !document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useNavigationPresentation() {
  const [menu, setMenu] = useState<{ open: boolean; showArtwork: boolean; still?: string }>({
    open: false, showArtwork: false,
  });
  const open = useRef(false);
  const frame = useRef<{ status: ChladniPresentationStatus; present?: () => boolean }>({ status: "preparing" });
  const pending = useRef<{ timer: number; deadline: number }>(null);
  const stillImage = useRef<HTMLImageElement>(null);
  const decodedStill = useRef<string>(undefined);
  const verifiedPreset = useRef<string>(undefined);
  const checkedInLook = useRef(false);
  const stillOpening = useRef<{ source: string; revealed: boolean; timer: number }>(null);

  const readyStill = useCallback(() => {
    const image = stillImage.current;
    if (!checkedInLook.current || verifiedPreset.current !== presetSource || !image?.complete ||
      image.currentSrc !== decodedStill.current) return;
    const expected = window.innerWidth < navigationStills.breakpoint ? navigationStills.mobile : navigationStills.desktop;
    if (expected && image.currentSrc === new URL(expected, window.location.href).href) return image.currentSrc;
  }, []);

  const cancelPending = useCallback(() => {
    if (!pending.current) return;
    window.clearTimeout(pending.current.timer);
    pending.current = null;
  }, []);

  const cancelHandover = useCallback(() => {
    if (!stillOpening.current) return;
    window.clearTimeout(stillOpening.current.timer);
    stillOpening.current = null;
  }, []);

  const drawArtwork = useCallback((present?: () => boolean) => {
    if (!present || !mayShowArtwork()) return false;
    try {
      return present();
    } catch {
      return false;
    }
  }, []);

  const handOverStill = useCallback(() => {
    const opening = stillOpening.current;
    if (!open.current || !opening?.revealed || opening.source !== readyStill() ||
      frame.current.status !== "ready" || !drawArtwork(frame.current.present)) return;
    cancelHandover();
    setMenu(current => ({ ...current, showArtwork: true }));
  }, [cancelHandover, drawArtwork, readyStill]);

  const finishReveal = useCallback(() => {
    if (!stillOpening.current) return;
    stillOpening.current.revealed = true;
    handOverStill();
  }, [handOverStill]);

  const reveal = useCallback((present?: () => boolean) => {
    cancelPending();
    cancelHandover();
    const eligible = mayShowArtwork();
    // Draw at the current size before committing the overlay's visible state.
    const showArtwork = drawArtwork(present);
    const still = eligible && !present && frame.current.status !== "unavailable" ? readyStill() : undefined;
    if (still) {
      const overlay = stillImage.current?.closest(".navigation-overlay");
      const duration = overlay ? parseFloat(getComputedStyle(overlay).transitionDuration) * 1000 : 0;
      const timer = window.setTimeout(finishReveal, duration + 34);
      stillOpening.current = { source: still, revealed: false, timer };
    }
    open.current = true;
    setMenu({ open: true, showArtwork, still });
  }, [cancelHandover, cancelPending, drawArtwork, finishReveal, readyStill]);

  const decodeStill = useCallback(() => {
    const image = stillImage.current;
    if (!image?.currentSrc || !image.complete || !image.naturalWidth || image.currentSrc === decodedStill.current) return;
    const source = image.currentSrc;
    void image.decode().then(() => {
      if (image.currentSrc !== source) return;
      decodedStill.current = source;
    }).catch(() => {
      // A broken or changed image will never be selected for the opening.
    });
  }, []);

  const selectCheckedInLook = useCallback((selected: boolean) => {
    checkedInLook.current = selected;
  }, []);

  const reportArtwork = useCallback<ReportArtwork>((status, present) => {
    frame.current = { status, present };
    if (status === "unavailable") {
      setMenu(current => current.open && current.showArtwork ? { ...current, showArtwork: false } : current);
    }
    if (pending.current && status !== "preparing") {
      const withinDeadline = performance.now() < pending.current.deadline;
      reveal(status === "ready" && withinDeadline ? present : undefined);
    } else if (status === "ready") {
      handOverStill();
    }
  }, [handOverStill, reveal]);

  const close = useCallback(() => {
    cancelPending();
    cancelHandover();
    open.current = false;
    setMenu(current => current.open ? { ...current, open: false } : current);
  }, [cancelHandover, cancelPending]);

  const replaceArtwork = useCallback(() => {
    cancelHandover();
    frame.current = { status: "preparing" };
    setMenu(current => current.open ? { open: true, showArtwork: true } : current);
  }, [cancelHandover]);

  function toggleMenu() {
    if (open.current || pending.current) {
      close();
      return;
    }
    const { status, present } = frame.current;
    if (!mayShowArtwork() || status !== "preparing") {
      reveal(status === "ready" ? present : undefined);
      return;
    }
    pending.current = {
      deadline: performance.now() + firstFrameWait,
      timer: window.setTimeout(() => reveal(), firstFrameWait),
    };
  }

  useEffect(() => {
    if (matchingRelease && window.crypto?.subtle) {
      const bytes = new TextEncoder().encode(presetSource.replaceAll("\r\n", "\n"));
      void window.crypto.subtle.digest("SHA-256", bytes).then((digest) => {
        const hex = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
        if (hex === captured.presetSha256) verifiedPreset.current = presetSource;
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    decodeStill();
    const cancelOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && pending.current) {
        event.preventDefault();
        cancelPending();
      }
    };
    document.addEventListener("keydown", cancelOnEscape);
    return () => {
      document.removeEventListener("keydown", cancelOnEscape);
      cancelPending();
      cancelHandover();
    };
  }, [cancelHandover, cancelPending, decodeStill]);

  return { ...menu, toggleMenu, close, reportArtwork, stillImage, decodeStill, selectCheckedInLook, replaceArtwork,
    finishReveal };
}

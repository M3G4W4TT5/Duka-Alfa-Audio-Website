import { Component, lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import type { ChladniPlayerHandle, ChladniPresentationStatus } from "@duka/chladni/player";
import navigationPreset from "../../data/navigation.chladni.json";
import type { ReportArtwork } from "./useNavigationPresentation";

export interface NavigationChladniProps {
  open: boolean;
  showArtwork: boolean;
  dialog: RefObject<HTMLElement | null>;
  reportArtwork: ReportArtwork;
  selectCheckedInLook: (selected: boolean) => void;
  replaceArtwork: () => void;
}

export const NavigationPlayer = lazy(async () => {
  const { ChladniPlayer } = await import("@duka/chladni/player");
  return { default: ChladniPlayer };
});

class ChladniErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onFailure?: () => void }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function DeferredChladni({ children, fallback = null, onFailure }: {
  children: ReactNode;
  fallback?: ReactNode;
  onFailure?: () => void;
}) {
  return (
    <ChladniErrorBoundary fallback={fallback} onFailure={onFailure}>
      <Suspense fallback={null}>{children}</Suspense>
    </ChladniErrorBoundary>
  );
}

export function useNavigationArtwork({ open, showArtwork, dialog, reportArtwork }: NavigationChladniProps) {
  const [available, setAvailable] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [started, setStarted] = useState(false);
  const pointer = useRef<ChladniPlayerHandle>(null);
  const active = open && showArtwork && available;

  const onStatusChange = useCallback((status: ChladniPresentationStatus) => {
    reportArtwork(status, () => pointer.current?.present() ?? false);
  }, [reportArtwork]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(motion.matches);
      setAvailable(document.visibilityState === "visible" && !motion.matches);
    };
    update();
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (available) setStarted(true);
  }, [available]);

  useEffect(() => {
    if (!active || !dialog.current) return;
    const element = dialog.current;
    const move = (event: PointerEvent) => {
      if (
        event.pointerType === "touch" ||
        (event.target instanceof Element && event.target.closest("[data-plate-controls]"))
      ) {
        pointer.current?.leavePointer();
        return;
      }
      pointer.current?.movePointer(event);
    };
    const leave = () => pointer.current?.leavePointer();
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      leave();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, [active, dialog]);

  return { active, available, started, reducedMotion, pointer, onStatusChange };
}

export default function NavigationChladni(props: NavigationChladniProps) {
  const { active, available, started, pointer, onStatusChange } = useNavigationArtwork(props);
  const { selectCheckedInLook } = props;
  useLayoutEffect(() => {
    selectCheckedInLook(true);
    return () => selectCheckedInLook(false);
  }, [selectCheckedInLook]);
  return (
    <div className="navigation-artwork" aria-hidden="true" data-show-artwork={props.showArtwork}>
      {started && (
        <DeferredChladni onFailure={() => onStatusChange("unavailable")}>
          <NavigationPlayer configuration={navigationPreset} active={active} prepare={available}
            onStatusChange={onStatusChange} ref={pointer} />
        </DeferredChladni>
      )}
    </div>
  );
}

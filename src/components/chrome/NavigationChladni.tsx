import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import type { ChladniPlayerHandle } from "@duka/chladni/player";
import navigationPreset from "../../data/navigation.chladni.json";

export interface NavigationChladniProps {
  open: boolean;
  dialog: RefObject<HTMLElement | null>;
}

export const NavigationPlayer = lazy(async () => {
  const { ChladniPlayer } = await import("@duka/chladni/player");
  return { default: ChladniPlayer };
});

class ChladniErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function DeferredChladni({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ChladniErrorBoundary fallback={fallback}>
      <Suspense fallback={null}>{children}</Suspense>
    </ChladniErrorBoundary>
  );
}

export function useNavigationArtwork({ open, dialog }: NavigationChladniProps) {
  const [available, setAvailable] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [started, setStarted] = useState(false);
  const pointer = useRef<ChladniPlayerHandle>(null);
  const active = open && available;

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
    if (!active || !dialog.current) return;
    setStarted(true);
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

  return { active, started, reducedMotion, pointer };
}

export default function NavigationChladni(props: NavigationChladniProps) {
  const { active, started, pointer } = useNavigationArtwork(props);
  return (
    <div className="navigation-artwork" aria-hidden="true">
      {started && (
        <DeferredChladni>
          <NavigationPlayer configuration={navigationPreset} active={active} ref={pointer} />
        </DeferredChladni>
      )}
    </div>
  );
}

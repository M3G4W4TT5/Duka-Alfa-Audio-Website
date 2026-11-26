import { lazy, useEffect, useState } from "react";
import NavigationChladni, { DeferredChladni } from "./NavigationChladni";
import type { NavigationChladniProps } from "./NavigationChladni";

const NavigationChladniTest = lazy(() => import("./NavigationChladniTest"));

export default function NavigationChladniPreview(props: NavigationChladniProps) {
  const [mode, setMode] = useState<"visitor" | "test">();

  useEffect(() => {
    if (props.open && !mode) {
      const query = new URLSearchParams(window.location.search);
      setMode(query.get("chladni") === "test" ? "test" : "visitor");
    }
  }, [props.open, mode]);

  if (mode === "test") {
    return (
      <DeferredChladni fallback={<NavigationChladni {...props} />}>
        <NavigationChladniTest {...props} />
      </DeferredChladni>
    );
  }
  return mode === "visitor" ? <NavigationChladni {...props} /> : null;
}

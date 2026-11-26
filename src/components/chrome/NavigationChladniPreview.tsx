import { lazy, useEffect, useState } from "react";
import NavigationChladni, { DeferredChladni } from "./NavigationChladni";
import type { NavigationChladniProps } from "./NavigationChladni";

const NavigationChladniTest = lazy(() => import("./NavigationChladniTest"));

export default function NavigationChladniPreview(props: NavigationChladniProps) {
  const [mode, setMode] = useState<"visitor" | "test">();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setMode(query.get("chladni") === "test" ? "test" : "visitor");
  }, []);

  if (mode === "test") {
    return (
      <DeferredChladni onFailure={() => props.reportArtwork("unavailable")}>
        <NavigationChladniTest {...props} />
      </DeferredChladni>
    );
  }
  return mode === "visitor" ? <NavigationChladni {...props} /> : null;
}

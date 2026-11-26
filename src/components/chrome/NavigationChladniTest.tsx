import { lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { parseConfiguration, type Configuration } from "@duka/chladni/player";
import type { ChladniEditorHandle } from "@duka/chladni/editor";
import navigationPreset from "../../data/navigation.chladni.json";
import {
  DeferredChladni,
  NavigationPlayer,
  useNavigationArtwork,
  type NavigationChladniProps,
} from "./NavigationChladni";
import "./navigation-chladni-test.css";

const NavigationEditor = lazy(async () => {
  const { ChladniEditor } = await import("@duka/chladni/editor");
  return { default: ChladniEditor };
});

const storageKey = "duka-navigation-chladni-v1";

interface SavedLook {
  locked?: Configuration;
  draft?: Configuration;
}

function readSavedLook(): { saved: SavedLook; message: string } {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return { saved: {}, message: "" };
    const { locked, draft } = JSON.parse(raw);
    return {
      saved: {
        locked: locked ? parseConfiguration(locked) : undefined,
        draft: draft ? parseConfiguration(draft) : undefined,
      },
      message: "",
    };
  } catch {
    return { saved: {}, message: "The saved look could not be read. Using the website look." };
  }
}

export default function NavigationChladniTest(props: NavigationChladniProps) {
  const { active, available, started, reducedMotion, pointer, onStatusChange } = useNavigationArtwork(props);
  const [session, setSession] = useState(readSavedLook);
  const [editing, setEditing] = useState(false);
  const [initialPreset, setInitialPreset] = useState<unknown>();
  const [outlet, setOutlet] = useState<HTMLDivElement | null>(null);
  const editor = useRef<ChladniEditorHandle | null>(null);
  const primaryAction = useRef<HTMLButtonElement>(null);
  const presetActions = useRef<HTMLDetailsElement>(null);
  const { saved, message } = session;
  const { locked } = saved;
  const attachEditor = useCallback((handle: ChladniEditorHandle | null) => {
    editor.current = handle;
    pointer.current = handle;
  }, [pointer]);

  const { selectCheckedInLook, replaceArtwork } = props;
  useLayoutEffect(() => {
    selectCheckedInLook(!locked && !editing);
    return () => selectCheckedInLook(false);
  }, [selectCheckedInLook, locked, editing]);

  const saveLook = useCallback((next: SavedLook, status: string) => {
    try {
      if (next.locked || next.draft) {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } else {
        window.localStorage.removeItem(storageKey);
      }
    } catch {
      status += " Browser storage is unavailable. This change is available until you leave the page.";
    }
    setSession({ saved: next, message: status });
  }, []);

  useEffect(() => {
    if (!editing) return;
    const saveDraft = () => {
      try {
        const draft = editor.current?.capturePreset();
        if (draft) saveLook({ locked, draft }, "Draft saved.");
      } catch {
        // Keep the previous saved look while another preset or asset is loading.
      }
    };
    if (!props.open) {
      saveDraft();
      return;
    }
    window.addEventListener("pagehide", saveDraft);
    return () => window.removeEventListener("pagehide", saveDraft);
  }, [editing, props.open, locked, saveLook]);

  function edit() {
    const preset = saved.draft ?? saved.locked ?? navigationPreset;
    const width = props.dialog.current?.clientWidth ?? window.innerWidth;
    const profile = width < preset.framing.breakpoint ? "mobile" : "desktop";
    const view = preset.framing[profile].enabled ? profile : "window";
    replaceArtwork();
    setInitialPreset({ ...preset, editor: { ...preset.editor, view, editCrop: false } });
    setEditing(true);
    setSession({ saved, message: "" });
  }

  function lock() {
    if (!editor.current) {
      setSession({ saved, message: "The editor is loading." });
      return;
    }
    try {
      const locked = editor.current.capturePreset();
      replaceArtwork();
      saveLook({ locked }, "Previewing the locked look.");
      setEditing(false);
    } catch (error) {
      setSession({ saved, message: error instanceof Error ? error.message : "The look could not be locked." });
    }
  }

  function exportLocked() {
    const contents = JSON.stringify(locked, null, 2) + "\n";
    const url = URL.createObjectURL(new Blob([contents], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "navigation.chladni.json";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (presetActions.current) {
      presetActions.current.open = false;
      presetActions.current.querySelector("summary")?.focus();
    }
  }

  return (
    <>
      <div className="navigation-artwork" aria-hidden="true" data-show-artwork={props.showArtwork}>
        {started && (
          <DeferredChladni key={editing ? "editor" : "player"} onFailure={() => onStatusChange("unavailable")}
            fallback={editing && outlet ? createPortal(
            <p className="navigation-editor-error" role="status">
              The editor could not load. Reopen the page to try again.
            </p>, outlet,
          ) : null}>
            {editing ? (
              <NavigationEditor
                layout="container"
                initialPreset={initialPreset}
                active={active}
                prepare={available}
                onStatusChange={onStatusChange}
                controlsOutlet={outlet}
                ref={attachEditor}
              />
            ) : (
              <NavigationPlayer configuration={locked ?? navigationPreset} active={active} prepare={available}
                onStatusChange={onStatusChange} ref={pointer} />
            )}
          </DeferredChladni>
        )}
      </div>
      <div className="navigation-test-layer" data-plate-controls>
        <div className="navigation-look-tools">
          <div className="navigation-look-actions">
            <button ref={primaryAction} type="button" onClick={editing ? lock : edit} disabled={reducedMotion}>
              {editing ? "Lock & preview" : "Edit look"}
            </button>
            {(editing || locked || saved.draft) && (
              <details ref={presetActions} className="navigation-preset-actions">
                <summary>Preset</summary>
                <div>
                  {locked && <button type="button" onClick={exportLocked}>Export locked preset</button>}
                  <button type="button" onClick={() => {
                    primaryAction.current?.focus();
                    if (editing || locked) replaceArtwork();
                    setEditing(false);
                    saveLook({}, "Previewing the website look.");
                  }}>
                    Restore website look
                  </button>
                </div>
              </details>
            )}
          </div>
          <p role="status">{reducedMotion ? "Artwork paused for reduced motion." : message}</p>
        </div>
        <div className="navigation-editor-controls" ref={setOutlet} />
      </div>
    </>
  );
}

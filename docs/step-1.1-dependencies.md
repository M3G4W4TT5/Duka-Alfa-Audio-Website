# Step 1.1 — dependency maintenance

Updated 30 September 2026. Baseline: `1cea62ffb61062ba6b705272d08306573cc5a08d`; local and remote `main` matched and the working tree was clean. The authenticated dashboard confirmed the Duka Alfa Audio account and Git-integrated `duka-alfa-audio` project. The connector exposed another account and was not used to operate this project.

## Focused changes

| Path | Change | Reason |
| --- | --- | --- |
| Root Wrangler → Miniflare → Undici | Wrangler `4.143.0` → `4.144.0`, minimum `^4.144.0`; Miniflare `5.20260926.0-alpha` → `5.20260926.1-alpha`; Undici `7.29.0` → `7.29.1` | Compatible upstream release supplies the patched emulator dependency. |
| Studio → Sanity → CLI → Workbench CLI → federation Vite → DTS plugin → Undici | Add scoped DTS-plugin override to `7.29.1` | Current Workbench CLI `2.8.0` pins federation Vite `1.22.1`, which pins DTS plugin `2.9.0` and vulnerable Undici. Updating Sanity to current `6.17.0` retains this path. Override only the patch-level HTTP dependency, preserving the aligned federation packages. |
| Studio → Sanity → CLI → TypeID `1.2.0` → UUID | Add `typeid-js@1.2.0` scoped UUID override: `10.0.0` → `11.1.1` | Latest TypeID still requests `^10.0.0`. UUID `11.1.1` is the smallest patched release and retains CommonJS and ESM exports and the `v7(undefined, buffer)` / `stringify` APIs TypeID uses. |

Existing archive/parser overrides remain. Exactly five package resolutions change; npm also sorts the existing Studio workspace link. No unrelated dependency upgrades, audit suppression or forced fixes. The reusable starter was not modified.

Primary sources: [Wrangler release](https://github.com/cloudflare/workers-sdk/releases/tag/wrangler%404.144.0), [Undici TLS advisory](https://github.com/nodejs/undici/security/advisories/GHSA-w293-vg96-wgc3), [UUID advisory](https://github.com/uuidjs/uuid/security/advisories/GHSA-w5hq-g745-h8pq), [UUID changelog](https://github.com/uuidjs/uuid/blob/main/CHANGELOG.md), [npm scoped overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides). Current release versions and dependency constraints were checked against the npm registry.

## Exposure and remaining findings

Fresh baseline audit: **11 moderate, 1 high, 0 critical** (12 affected packages, including propagated parent findings). After clean installation: **0 findings at every severity**. No moderate finding remains to defer.

These vulnerable copies are tooling dependencies, but tooling processes can receive remote responses: the DTS plugin downloads remote type archives with an Undici Agent and Miniflare handles emulator networking. Repository source has no Undici or UUID imports. The Astro output is static; the root contact Function uses native runtime `fetch` to fixed provider endpoints. No BalancedPool/custom-TLS use was found in the affected callers, and the configured classic Studio has no Workbench federation setup. This limits observed exposure, but does not justify leaving vulnerable packages installed.

Sanity CLI generates telemetry trace identifiers using TypeID. Its UUID calls use `v7` and `stringify`, not the advisory's vulnerable `v3`/`v5`/`v6` buffer-writing APIs. The scoped update removes the vulnerable package without changing this legitimate workflow. Reassess both overrides when their parent constraints change; remove them when supported upstream dependencies supply patched versions.

## Verification

Node `24.20.0`, npm `11.19.0`:

```sh
npm install --package-lock-only --ignore-scripts --cache /tmp/duka-step11-cache
npm update undici uuid --package-lock-only --ignore-scripts --cache /tmp/duka-step11-cache
npm ci --cache /tmp/duka-step11-cache
npm run check
npm run build
SANITY_STUDIO_PROJECT_ID=placeholder SANITY_STUDIO_DATASET=production \
  XDG_CONFIG_HOME=/tmp/duka-step11-config XDG_CACHE_HOME=/tmp/duka-step11-xdg-cache \
  SANITY_CLI_TELEMETRY_DISABLED=1 npm run studio:build
npm audit --json --cache /tmp/duka-step11-cache
npm ls undici uuid wrangler miniflare
XDG_CONFIG_HOME=/tmp/duka-step11-config XDG_CACHE_HOME=/tmp/duka-step11-xdg-cache \
  WRANGLER_SEND_METRICS=false npm run dev:pages -- --ip 127.0.0.1 --port 8791
git diff --check
```

All passed. Check reported zero Astro errors/warnings/hints and passed Function/Studio TypeScript checks. Build retained static output. Studio built with process-local placeholders; no real project was contacted or hosted settings changed. npm warned about install-script approval policy for esbuild/workerd; the actual builds and emulator ran successfully without changing that policy.

Focused Node assertions on the installed tree passed:

- Both affected Undici copies preserve a rejecting custom BalancedPool connector; ordinary pool HTTP requests succeed; unsolicited WebSocket subprotocols emit an error instead of crashing or opening.
- Before update, UUID `v3`/`v5`/`v6` accepted an undersized buffer. After update, all reject it with `RangeError`; a negative-offset `v5` case also rejects.
- Actual overridden CommonJS TypeID generated 10,000 unique, strictly increasing trace IDs with UUID roundtrips; ESM import/roundtrip also passed.
- Wrangler `4.144.0` compiled the root Functions and served static GET HTTP 200 with noindex and disabled controls. A valid fictional multipart POST returned HTTP 503 `local_mode_disabled`, as required on localhost.

Complete staged diff and tracked file list are reviewed before pushing. The final commit is identified by `git log -1` and its matching automatic Pages deployment, avoiding a self-referential SHA in this file. Hosted verification must confirm successful deployment for that exact commit, HTTP 200, `noindex, nofollow`, disabled Name/Email/Message/Send controls and a valid fictional same-origin multipart POST returning HTTP 503 `not_configured`. The completed deployment ID and results are recorded in the final reviewer handoff.

Candidate for a later starter update: this Wrangler minimum and the two scoped overrides, with the same compatibility checks. No design, content, CMS, mail, Turnstile, domains, DNS or deployment architecture changes belong to this maintenance step.

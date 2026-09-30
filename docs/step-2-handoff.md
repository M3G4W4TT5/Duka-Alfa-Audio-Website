# Step 2 design handoff — 30 September 2026

The user explicitly approved implementation and expanded scope to supporting pages. The accepted brief is in `docs/step-2-design.md`. This is an English design review, not a business-domain launch.

## Implemented direction

Black background, white text, calm sans-serif headings, spacious copy, outlined buttons and selected supplied images. Homepage order: rotating hero, supplied about introduction, four service routes, selected stories, equipment, partner grid, disabled contact form and minimal footer. Bespoke Home Audio is grouped within Installations and retains its own route.

The original mark opens a fading black navigation overlay with a Services disclosure. Header hides on downward scroll and returns on upward scroll. A fixed envelope links to Contact. Hero advances every three seconds, with typed per-slide timing overrides, pause and manual controls. First-pass review requested all Hero photos: all 14 usable photos are included; the user deferred Peja because of its added logo. Only current/neighbouring images load together. Reduced motion stops automatic rotation and removes transitions. Stories support mouse dragging, native touch scrolling, clickable active dots and previous/next controls. Equipment uses native disclosures ordered Sound, Rigging, Stage, Lights, LED Screens; Sound features TT+ Audio.

Supporting pages: five services, about introduction, stories overview/four case fixtures using one case component, equipment, partners overview/eight partner routes, Contact, Privacy and Legal review drafts, and 404. All internal links have destinations. Cases omit unconfirmed contribution/capacity claims; partner descriptions remain limited to supplied facts. Founder history and full case narratives are future editorial work.

## Implementation boundaries

Astro static output, TypeScript and React islands for Header, Hero and StoriesCarousel. Shared layout, buttons, cards, photo handling, section patterns and CSS tokens. Component styles are dedicated files. Typed temporary content is separated in `src/data`; `src/lib/content.ts` rejects a prematurely configured live Sanity project. Responsive WebP variants have dimensions and appropriate sizes. Asset notes are in `docs/step-2-assets.md`.

Node 24, dependency fixes, package files/lockfile, Studio and Functions retained. No Sanity, mail, Turnstile, hooks, domain or DNS configuration changed. Both contact switches remain disabled, form controls are disabled and no mail was sent. All 26 generated pages retain `noindex, nofollow`.

## Local verification

- `npm run check`: zero errors, warnings or hints; Functions and Studio TypeScript checks passed.
- `npm run build`: 26 static pages; responsive image generation passed.
- Dedicated source files formatted; `git diff --check`, staged diff checks and selected-file inventory review passed before delivery.
- Built HTML audit: one H1/noindex per page; internal routes and fragment targets valid; disabled contact controls.
- Browser review at 320, 390, 768 and 1440 pixels; no horizontal page overflow. Narrow header button CSS corrected. Service cards reflow from four to two to one column; menu scrolls at narrow sizes.
- Menu open/close, Services disclosure, Escape/focus restoration, Shift-Tab wrapping, background inertness, visible focus, directional header, equipment panels, story dots and mouse drag checked.
- All 14 hero slides rendered and wrapped correctly with three images mounted at a time. White text contrast is 20.03:1 on the background and at least 4.74:1 over the brightest possible shaded image; muted text is 9.72:1 on cards.
- User's subsequent header correction verified: stays visible inside the hero, fully retracts after it (header bottom reaches viewport top), returns on an 18px upward scroll and hides on the next downward scroll. Mouse focus no longer holds it visible; keyboard focus remains visible.
- Reduced-motion emulation: hero pause control disabled, zero transition duration, static rotation; mobile story navigation still works.
- Temporary long story title, tripled service summary and absent story tags/gallery reviewed at 320px; fixtures restored before final build. Existing optional-image/description omissions also render.
- Native touch swipe needs a physical-device check: the review browser cannot synthesize touch input. The carousel uses native horizontal scrolling and CSS snapping for touch. No claim of full device or screen-reader certification.

Desktop/mobile viewport and full-page screenshots are retained outside Git in the project's `Website Review/2026-09-30` folder and shown in the review task. Git/Pages delivery evidence is recorded in that task after push; the delivered revision is the commit containing this handoff (`git log -1`).

Initial design commit `08767ddfeb913502ef01afa56deb564a6650fc8c` deployed successfully as `fd2a834c-d2a3-4baa-94e5-85938569e0c2`: build log confirmed 26 pages and published assets. The final header correction is a subsequent commit, with its matching deployment verified in the delivery task.

## Remaining decisions

Hero videos and editorial timing; final image selection/crops and credits; founder/family story; case contributions, capacities and article copy; equipment inventory/model details; partner descriptions and supporting photos; Albanian localisation; final legal entity, public contacts, processing/retention and jurisdiction-specific review. Privacy/Legal are explicitly labelled drafts and do not certify Kosovo/EU compliance.

Legal review reference points: [Kosovo Law 06/L-082](https://gzk.rks-gov.net/ActDetail.aspx?ActID=18616&langid=2), [Information and Privacy Agency](https://aip.rks-gov.net/en/about-us/), and [GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679). Apply them to the final business/configuration before launch.

Review URL: https://duka-alfa-audio.pages.dev. No final Sanity modelling or connection in this stage.

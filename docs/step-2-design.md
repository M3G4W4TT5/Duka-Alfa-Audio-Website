# Accepted design — 30 September 2026

The user approved the brief and expanded implementation plan before code changes. This stage now includes supporting pages, superseding the original homepage-only boundary.

## Explicit requirements

Black background, white text, large real photographs and transparent white-outline buttons. Desktop review precedes mobile refinement; one responsive site serves both.

Homepage: full-screen hero → supplied about introduction → four service cards → selected stories → equipment → partners → disabled contact form → minimal footer. Use the supplied hero/about wording unchanged as review copy. All five services remain; Bespoke Home Audio is grouped within Installations.

Header: original white mark left toggles a fading black navigation overlay; original wordmark centre; Get in Touch right. Hide on downward scroll, show on upward scroll at any depth. Fixed circular envelope/contact link bottom right. Services expands within navigation; no services overview route is needed.

Hero: images first, automatic advance every three seconds, stationary central message. Typed default timing and optional slide overrides prepare for later editorial controls. Future video timing is unresolved. Include pause and previous/next controls; pause for interaction and reduced motion.

Stories: manually draggable/swipeable full-width image carousel; title, up to four supplied factual tags and Learn More. Bottom-centred clickable dots, one per story, active filled white; previous/next controls and keyboard access. More Stories links to the overview.

Equipment: TT+ Audio highlighted, expandable category rows with selected products/category panels. Partner logos form a spaced grid linking to individual pages. Contact remains disabled throughout this stage.

## Implementation recommendations accepted with the brief

Restrained sans-serif typography, spacious layout, individual image focal points, short fades, keyboard focus, reduced-motion alternatives. Dedicated CSS, shared tokens, typed fixtures, Astro static presentation and narrowly hydrated React interactions. No arbitrary page builder.

Supporting pages: five service routes, about introduction, stories overview and reusable case template, equipment overview, partner pages, contact, privacy/legal review drafts. Final case contributions, capacities, inventory/availability, partner relationship details, founder narrative and jurisdiction-specific legal details are not invented.

## Stage boundaries

Keep Astro static output, TypeScript, selective React, Node 24 and the existing lockfile/fixes. No Sanity configuration, mail, Turnstile, hooks, domains, DNS or Music Store. Keep both contact switches off and noindex. Approval authorises scoped commits, pushes and the pages.dev review deployment.

The user selected the Selection photo folder for use and recalled the supplied partner/product assets. Copy only the assets actually used; retain private packages and reference screenshots outside Git. Supplied lettering remains original geometry, including any wordmark-only derivative.

The user subsequently confirmed calm, medium-weight headings with spacious text, and equipment order: Sound (TT+ Audio) → Rigging → Stage → Lights → LED Screens. Selected product panels may coexist with category descriptions where model details are incomplete.

First-pass review revision: include all 14 usable photographs from the selected Hero folder. The user explicitly deferred the fifteenth (Peja Outdoor Festival) because of its added logo. Three-second default timing remains.

Header revision: remain visible through the hero; scrolling downward beyond its end retracts the entire header. A small upward scroll reveals it; the next downward scroll hides it. Mouse focus must not keep the header visible. Visible keyboard focus keeps its control accessible.

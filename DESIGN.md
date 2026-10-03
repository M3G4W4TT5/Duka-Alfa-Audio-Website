# Website design

This file defines the current design for Duka Alfa Audio. Update the relevant sections as revisions are agreed; keep one current specification instead of accumulating dated approval notes. Repository workflow belongs in [AGENTS.md](AGENTS.md), and environment status belongs in [README.md](README.md).

## Visual direction

Use a black background, white text, spacious layouts and large supplied photographs. Keep accents restrained. Buttons have transparent backgrounds and white outlines; hover reverses their foreground and background colours. Preserve supplied logo geometry, aspect ratios and lettering, including the Memory(One) footer credit.

Use shared tokens in `src/styles/tokens.css` for colours, spacing, typography and motion. Use existing responsive sizes and spacing unless a revision changes them. Photo crops respect individual focal points; reserve image dimensions to avoid layout shifts.

## Typography

Use locally hosted FK Grotesk Neue from `public/fonts/` throughout the interface. Keep text as HTML.

| Text role | Font | CSS weight |
| --- | --- | --- |
| H1 | FK Grotesk Neue Black | 900 |
| H2 | FK Grotesk Neue Bold | 700 |
| H3 | FK Grotesk Neue Medium | 500 |
| Body text and paragraphs | FK Grotesk Neue Regular | 400 |
| Button text, including links styled as buttons | FK Grotesk Neue Light | 300 |
| `p.prose.muted` | FK Grotesk Neue Light | 300 |
| `p.eyebrow.muted` | FK Grotesk Neue Thin | 100 |
| Footer legal links, including Privacy Notice and Legal Information | FK Grotesk Neue Thin | 100 |

Ordinary links inherit the font and weight of their surrounding text. Do not apply Thin to links globally. The two paragraph selectors above are exceptions to the default paragraph weight.

## Icons

Use only [Lucide React](https://lucide.dev/guide/react) (`lucide-react`) for interface icons. Add icons sparingly when they clarify an action:

| Purpose | Component |
| --- | --- |
| Selected links | `ArrowUpRight` |
| Mail and contact | `Mail` |
| Phone numbers where an icon is useful | `Phone` |
| Previous/next and equipment disclosures | `ChevronLeft`, `ChevronRight` |
| Services disclosure | `Plus`, `Minus` |
| Homepage scroll cue | `ChevronDown` |

Use consistent outline strokes and inherit text colour through `currentColor`, including hover states. The standard size is 20 CSS pixels; adjust only where the control needs it. Do not add an icon to every link or contact detail. Supplied brand logos, wordmarks and the favicon remain identity assets. Carousel dots remain state indicators.

Use named imports. Render icons statically in Astro presentation components; use the same library inside interactive React components. Hide decorative icons from assistive technology. Give icon-only buttons and links an accessible name on the control.

## Shared components

### Header and navigation

Place the original white mark on the left, the wordmark in the centre and Get in Touch on the right. The mark toggles a fading black navigation overlay. Use About Us for the company navigation link. Services expands inside navigation; group Bespoke Home Audio within Installations.

Keep the header visible through the homepage hero. Beyond the hero, downward scrolling hides the entire header and upward scrolling reveals it. On supporting pages, use the same directional scroll behaviour. Mouse focus does not hold the header open; visible keyboard focus keeps its control accessible. Keep a fixed circular mail/contact link at the bottom right.

### Footer

Use a minimal footer with the supplied brand identity, navigation, social links, Memory(One) design credit and legal links. Centre all footer contents on mobile.

## Page patterns

### Homepage

Order sections as hero → company introduction → four service cards → selected stories → equipment → partners → contact → footer. Use About us for the company introduction heading and READ MORE for its button. Omit the service and selected-stories subtitles. Retain all five service routes; Bespoke Home Audio is included within Installations in the homepage and navigation.

### Hero

Use a full-screen image carousel with a stationary central heading and message. Advance every three seconds by default, with optional per-slide timing. Omit previous/next controls, playback controls and the image counter. Preserve keyboard-focus and document-visibility pauses and honour reduced motion. Use a centred SCROLL cue with an animated Lucide down icon; it disappears after the first downward scroll and stays hidden until a new page load. Use only selected hero photographs; video behaviour requires a separate agreed specification.

### Stories

Use a full-width carousel supporting drag, swipe and keyboard navigation. Each slide has an image, title, up to four factual tags and Learn More. Place clickable pagination dots at the bottom centre, with the active dot filled white, without previous/next arrow buttons. More Stories links to the overview.

The stories overview omits the Selected Work eyebrow and places its image cards closer to the introductory text.

Use a shared case-article template for context, confirmed contribution, gallery, relevant facts and enquiry. Omit unsupported or absent content rather than filling it with invented details.

### Equipment and partners

Highlight TT+ Audio. Order expandable equipment groups as Sound → Rigging → Stage → Lights → LED Screens. Use equipment cards inside dropdowns. Sound cards retain product thumbnails; Stage and Lights use text cards without large event photos. Category summaries show quantity/type placeholders pending client inventory. Omit the configuration/availability note.

Display supplied partner logos in a spaced grid linking to individual partner pages.

### Supporting pages

Contact sections omit the Get in Touch eyebrow. On desktop align the introductory heading with the top of the Name/Email input borders; on mobile retain stacked reflow. The Contact page starts directly with this contact section and omits the separate page introduction and divider.

The company page omits its introductory eyebrow and uses smaller gaps around its body sections.

Use shared layouts for service details, company introduction, stories overview and cases, equipment, partners, contact and legal information. Keep enquiry actions clear. Forms expose their actual availability and validation state; operational enablement is managed outside this design specification.

## Responsive behaviour and accessibility

Use one responsive layout across narrow, intermediate and wide screens. Check reflow at 320 CSS pixels and enlarged text. Keep readable line lengths and sufficient contrast. Optional sections disappear with their headings and spacing when content is absent.

Support keyboard navigation, visible focus, labelled controls, logical heading order and touch interaction. Navigation restores focus and prevents interaction with obscured content while open.

Use ordinary scrolling and short fades. Honour reduced motion. Do not add autoplay sound, compulsory intros, heavy parallax, pinned zoom sequences or motion-dependent access to content.

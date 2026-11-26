# Website design

This file defines the current design for Duka Alfa Audio. Update the relevant sections as revisions are agreed; keep one current specification instead of accumulating dated approval notes. Repository workflow belongs in [AGENTS.md](AGENTS.md), and environment status belongs in [README.md](README.md).

## Visual direction

Use a black background, white text, spacious layouts and large supplied photographs. Keep accents restrained. Content action links use white text with line-height 2 and a 2px underline that expands from the centre over 0.4 seconds on hover or keyboard focus. They have no box outline. Only navbar Get in Touch and contact-form Send Message retain transparent backgrounds and white outlines; hover reverses their foreground and background colours. Preserve supplied logo geometry, aspect ratios and lettering, including the Memory(One) footer credit.

Use shared tokens in `src/styles/tokens.css` for colours, spacing, typography and motion. Use existing responsive sizes and spacing unless a revision changes them. Photo crops respect individual focal points; reserve image dimensions to avoid layout shifts.

## Typography

Use locally hosted fonts from `public/fonts/`. FK Grotesk Neue is the site’s default typeface. Keep text as HTML.

| Text role | Font | CSS weight |
| --- | --- | --- |
| H1 | FK Grotesk Neue Black | 900 |
| H2 | FK Grotesk Neue Bold | 700 |
| About Us timeline years | FK Grotesk Bold | 700 |
| H3 | FK Grotesk Neue Medium | 500 |
| About Us story titles | FK Grotesk Neue Medium, condensed uppercase with open tracking | 500 |
| Body text and paragraphs | FK Grotesk Neue Regular | 400 |
| About Us story paragraphs | FK Grotesk Neue Light | 300 |
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

Use consistent outline strokes and inherit text colour through `currentColor`, including hover states. The standard size is 20 CSS pixels; adjust only where the control needs it. Do not add an icon to every link or contact detail. Brand logos, wordmarks and the favicon remain identity assets. The explicitly requested footer WhatsApp, Facebook and Instagram marks use Simple Icons brand SVGs; Lucide remains the source for interface icons. Carousel dots remain state indicators.

Use named imports. Render icons statically in Astro presentation components; use the same library inside interactive React components. Hide decorative icons from assistive technology. Give icon-only buttons and links an accessible name on the control.

## Shared components

### Header and navigation

Place the original white mark on the left, the wordmark in the centre and Get in Touch on the right. The mark toggles a fading black navigation overlay. Use About Us for the company navigation link. Services expands inside navigation; group Bespoke Home Audio within Installations.

Show the Chladni sand pattern behind the whole open menu, with the desktop pattern composed to the right of the links and a dedicated portrait crop for narrow screens. Prepare the first frame while the menu is closed and pause the simulation after preparation. Reveal the menu with the live pattern or a matching still. When the live pattern is ready, draw the same crop behind the still before fading it out. Use solid black for reduced motion and when neither artwork presentation is available. Keep the links and header legible as menu content scrolls. Mouse and pen movement can light the live pattern.

Keep the header visible through the homepage hero. Beyond the hero, downward scrolling hides the entire header and upward scrolling reveals it. On supporting pages, use the same directional scroll behaviour. Mouse focus does not hold the header open; visible keyboard focus keeps its control accessible. Keep a fixed circular mail/contact link at the bottom right.

### Footer

Use a compact footer with three circular social links (WhatsApp, Facebook and Instagram) beneath the supplied logo. Each is 50px with a 30px brand mark, an upward colour fill and a matching tooltip on hover or keyboard focus. Use WhatsApp green, Facebook blue and the supplied Instagram gradient. Split navigation into About Us/Stories/Equipment and Partners/Contact columns; place the second column where the former social text links appeared. Retain the Memory(One) design credit and legal links. Centre all footer contents on mobile.

### Clickable cards

Service and story overview cards are whole-card links. Omit repeated Learn More and Read Story labels. Retain the subtle image zoom on hover. Show a white 2.5px edge with a diagonal gradient reveal from 0% to 100% over 0.6 seconds on hover or visible keyboard focus; offset the edge 5px outside the card. Respect reduced motion and retain the existing keyboard focus outline. Use the shared card components on the homepage and overview pages.

## Page patterns

### Homepage

Order sections as hero → company introduction → four service cards → selected stories → equipment → partners → contact → footer. Use About us for the company introduction heading and READ MORE for its button. Omit the service and selected-stories subtitles. Retain all five service routes; Bespoke Home Audio remains grouped within Installations in navigation; omit the separate homepage sentence linking to it.

### Hero

Use a full-screen image carousel with a stationary central heading and message. Advance every three seconds by default, with optional per-slide timing. Omit previous/next controls, playback controls and the image counter. Preserve keyboard-focus and document-visibility pauses and honour reduced motion. Use a centred SCROLL cue with an animated Lucide down icon; it fades out after the first downward scroll and stays hidden until a new page load. Use only selected hero photographs; video behaviour requires a separate agreed specification.

### Stories

Use a full-width carousel supporting drag, swipe and keyboard navigation. Each slide has an image, title, up to four factual tags and Learn More. Place clickable pagination dots at the bottom centre, with the active dot filled white, without previous/next arrow buttons. More Stories links to the overview.

The stories overview omits the Selected Work eyebrow and places its image cards closer to the introductory text.

Story detail pages omit the Project Stories eyebrow. Use a shared case-article template for context, confirmed contribution, gallery, relevant facts and enquiry. Omit unsupported or absent content rather than filling it with invented details.

### Equipment and partners

Highlight TT+ Audio. Order expandable equipment groups as Sound → Rigging → Stage → Lights → LED Screens. Use equipment cards inside dropdowns. Sound cards retain product thumbnails; Stage and Lights use text cards without large event photos. Category summaries show quantity/type placeholders pending client inventory. Omit the configuration/availability note.

On the Equipment page, omit the introductory eyebrow and the separate TT+ logo/heading/paragraph block. Place the equipment list closer to the page introduction. The homepage retains its TT+ introduction.

Display supplied partner logos in a spaced grid linking to individual partner pages. The partners overview omits its Brands & Equipment eyebrow and places the logo grid closer to the introduction.

Individual partner pages place the supplied logo to the right of the partner title, omit the Our Partners eyebrow and redundant partner & Duka heading, and bring the description/enquiry section closer to the title. Equipment appears only on the homepage and Equipment page.

### Supporting pages

The Services overview at `/services/` lists all five services using the existing service cards in a responsive grid matching the Stories overview. Service detail pages omit the Our Services eyebrow.

Contact sections omit the Get in Touch eyebrow. The homepage has no divider between partners and contact. On desktop align the introductory heading with the top of the Name/Email input borders; on mobile retain stacked reflow. The Contact page starts directly with this contact section and omits the separate page introduction and divider.

The About Us page opens directly on the 2008–2026 company history. Lay it out as a continuous horizontal sequence on landscape screens from 64rem wide. Use a vertical reading order on narrow and portrait screens. On desktop, set each year above its story and alternate text columns with inset and full-bleed photographs. Reduce the year size on shorter landscape screens. On mobile, introduce the story before the year. Set the years and titles in white and the lightweight body copy in soft grey on black. Use existing event photography for the review.

The About header uses a bare envelope icon in the upper right linking to Contact. The timeline ends at the final photograph. Omit the footer, floating contact shortcut and inline contact links on this page.

Stagger the year digits and headline lines upwards through masks. Fade in the body copy line by line. Reveal inset photographs from the lower edge or corner and let the image travel slightly inside its frame on the reading axis. Keep the timeline in a single expanded view. Reduced motion shows the complete text and images immediately.

Use shared layouts for service details, company introduction, stories overview and cases, equipment, partners, contact and legal information. Keep enquiry actions clear. Forms expose their actual availability and validation state; operational enablement is managed outside this design specification.

## Responsive behaviour and accessibility

Use one responsive layout across narrow, intermediate and wide screens. Check reflow at 320 CSS pixels and enlarged text. Keep readable line lengths and sufficient contrast. Optional sections disappear with their headings and spacing when content is absent.

Support keyboard navigation, visible focus, labelled controls, logical heading order and touch interaction. Navigation restores focus and prevents interaction with obscured content while open.

Use ordinary scrolling and short fades. Honour reduced motion. Do not add autoplay sound, compulsory intros, heavy parallax, pinned zoom sequences or motion-dependent access to content.

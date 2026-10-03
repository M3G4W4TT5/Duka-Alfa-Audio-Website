# Duka Alfa Audio Website

Independent public website repository generated from [astro-sanity-cloudflare-starter](https://github.com/M3G4W4TT5/astro-sanity-cloudflare-starter), revision `ea2952e9b2ca214f1dbef64986bb6fbd5573f377`.

This is the Step 2 design review: a responsive Duka homepage and supporting routes using typed temporary English content and selected supplied assets. The user approved this design direction and the pages.dev review deployment. Final editorial content and business-domain launch remain later work.

## Local development

Use Node 24. Run `npm ci`, `npm run check`, `npm run build`, then `npm run dev` for local review. The separate `studio/` workspace and root `functions/` are retained. Both npm packages are private.

Keep `PUBLIC_SANITY_PROJECT_ID` unset, `PUBLIC_CONTACT_FORM_READY=0` and `CONTACT_FORM_ENABLED=0`. Retain noindex. No Sanity, Turnstile or mail credentials are required for this stage.

## Stage boundaries

Steps 1 and 1.1 established GitHub, a Git-integrated Cloudflare Pages review deployment and dependency fixes. Step 2 adds the accepted design in [the design specification](DESIGN.md). Bespoke Home Audio sits within Installations; all five services have routes. See [the Step 2 handoff](docs/step-2-handoff.md) for implementation, verification and remaining content decisions. Derive final Sanity fields after the broader design settles. Mail, webhooks, custom domains, DNS and the future Music Store are later scope.

Private handoff packages, unselected source assets, screenshots, evidence and operational addresses stay outside this public repository. Only individually selected assets authorised for this review are included; see [asset notes](docs/step-2-assets.md). Starter guidance in `docs/` is reference material, not a record of completed client setup.

## Code organisation

`src/pages` composes shared layouts and components. `src/data` contains typed fixtures, `src/lib/content.ts` is their loading boundary, and `src/lib/images.ts` produces responsive image data. CSS tokens live in `src/styles/tokens.css`; component CSS is kept alongside its component. React is limited to the navigation, timed hero and story carousel. Equipment panels use native disclosure controls.

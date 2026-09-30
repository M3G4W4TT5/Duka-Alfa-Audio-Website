# Duka Alfa Audio Website

Independent public website repository generated from [astro-sanity-cloudflare-starter](https://github.com/M3G4W4TT5/astro-sanity-cloudflare-starter), revision `ea2952e9b2ca214f1dbef64986bb6fbd5573f377`.

This is a development preview using the neutral demonstration layout and account-free content. The Duka label identifies the review environment; design, copy and assets are not approved launch content.

## Local development

Use Node 24. Run `npm ci`, `npm run check`, `npm run build`, then `npm run dev` for local review. The separate `studio/` workspace and root `functions/` are retained. Both npm packages are private.

Keep `PUBLIC_SANITY_PROJECT_ID` unset, `PUBLIC_CONTACT_FORM_READY=0` and `CONTACT_FORM_ENABLED=0`. Retain noindex. No Sanity, Turnstile or mail credentials are required for this stage.

## Stage boundaries

Step 1 establishes GitHub and a Git-integrated Cloudflare Pages review deployment. Later design work should preserve shared components and the starter architecture. Derive final Sanity fields after design; configure the existing project only after verifying access and published content. Mail, webhooks, custom domains, DNS and the future Music Store are later scope.

Private handoff packages, source assets, evidence and operational addresses stay outside this public repository. Only individually reviewed public assets may be added later. See [step 1 handoff](docs/step-1-handoff.md) for implementation and verification details. Starter guidance in `docs/` is reference material, not a record of completed client setup.

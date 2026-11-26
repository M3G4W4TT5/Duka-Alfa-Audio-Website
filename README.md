# Duka Alfa Audio Website

Independent public website repository generated from [astro-sanity-cloudflare-starter](https://github.com/M3G4W4TT5/astro-sanity-cloudflare-starter), revision `ea2952e9b2ca214f1dbef64986bb6fbd5573f377`.

This is the Step 2 design review: a responsive Duka homepage and supporting routes using typed temporary English content and selected supplied assets. The user approved this design direction and the pages.dev review deployment. Final editorial content and business-domain launch remain later work.

## Local development

Use Node 24. Run `npm ci`, `npm run check`, `npm run build`, then `npm run dev` for local review. The separate `studio/` workspace and root `functions/` are retained. Both npm packages are private.

Keep `PUBLIC_SANITY_PROJECT_ID` unset, `PUBLIC_CONTACT_FORM_READY=0` and `CONTACT_FORM_ENABLED=0`. Retain noindex. No Sanity, Turnstile or mail credentials are required for this stage.

### Navigation artwork

The navigation player uses `src/data/navigation.chladni.json` and the pinned `@duka/chladni` release in `vendor/`. Run `npm run dev -- --host 127.0.0.1 --port 4340` and open `/?chladni=test`. Open the menu, choose **Edit look**, then open **Controls**. Select Desktop or Mobile under **View** and enable **Edit crop** to adjust the framing in the overview. Keep **Use this crop on the website** enabled for each profile you want the player to use.

Choose **Lock & preview** to play the captured look in the menu. Drafts are saved in the current browser when closing the menu or leaving the page. Under **Preset**, choose **Export locked preset** to download `navigation.chladni.json`. Replace the checked-in preset with that export to share the look in the next build. **Restore website look** clears the draft and the lock in this browser.

`npm run build:chladni-preview` creates a local test-capable build for `npm run preview`. Cloudflare Pages uses its usual `npm run build` command and includes the editor only when its built-in `CF_PAGES_BRANCH` is `staging`. Both test-capable builds require `?chladni=test`. A standard local build and other Pages branches contain only the player.

`npm run dev:chladni` uses the adjacent simulator workspace and watches its source exports. Install dependencies in both checkouts before using this mode. Set the process environment variable `CHLADNI_SOURCE_PATH` to use another copy of that workspace. The normal dev command and all builds resolve the pinned tarball. To update that release, copy a new versioned simulator tarball to `vendor/` and install it with `npm install ./vendor/duka-chladni-VERSION.tgz`. Commit the new tarball and lockfile together and remove the superseded tarball.

## Stage boundaries

Steps 1 and 1.1 established GitHub, a Git-integrated Cloudflare Pages review deployment and dependency fixes. Step 2 adds the accepted design in [the design specification](DESIGN.md). Bespoke Home Audio sits within Installations; all five services have routes. See [the Step 2 handoff](docs/step-2-handoff.md) for implementation, verification and remaining content decisions. Derive final Sanity fields after the broader design settles. Mail, webhooks, custom domains, DNS and the future Music Store are later scope.

Private handoff packages, unselected source assets, screenshots, evidence and operational addresses stay outside this public repository. Only individually selected assets authorised for this review are included; see [asset notes](docs/step-2-assets.md). Starter guidance in `docs/` is reference material, not a record of completed client setup.

## Code organisation

`src/pages` composes shared layouts and components. `src/data` contains typed fixtures, `src/lib/content.ts` is their loading boundary, and `src/lib/images.ts` produces responsive image data. CSS tokens live in `src/styles/tokens.css`; component CSS is kept alongside its component. React is limited to the navigation, timed hero and story carousel. Equipment panels use native disclosure controls.

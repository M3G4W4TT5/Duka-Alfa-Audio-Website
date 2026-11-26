# Duka Alfa Audio Website

Independent public website repository generated from [astro-sanity-cloudflare-starter](https://github.com/M3G4W4TT5/astro-sanity-cloudflare-starter), revision `ea2952e9b2ca214f1dbef64986bb6fbd5573f377`.

This is the Step 2 design review: a responsive Duka homepage and supporting routes using typed temporary English content and selected supplied assets. The user approved this design direction and the pages.dev review deployment. Final editorial content and business-domain launch remain later work.

## Local development

Use Node 24. Run `npm ci`, `npm run check`, `npm run build`, then `npm run dev` for local review. The separate `studio/` workspace and root `functions/` are retained. Both npm packages are private.

Keep `PUBLIC_SANITY_PROJECT_ID` unset, `PUBLIC_CONTACT_FORM_READY=0` and `CONTACT_FORM_ENABLED=0`. Retain noindex. No Sanity, Turnstile or mail credentials are required for this stage.

### Navigation artwork

The navigation player uses `src/data/navigation.chladni.json` and the pinned `@duka/chladni` release in `vendor/`. Run `npm run dev -- --host 127.0.0.1 --port 4340` and open `/?chladni=test`. Open the menu and choose **Edit look**. Once the artwork appears, open **Controls**. Select Desktop or Mobile under **View** and enable **Edit crop** to adjust the framing in the overview. Keep **Use this crop on the website** enabled for each profile you want the player to use.

The player prepares the first frame while the menu is closed. The menu gives the live frame up to 250 ms, then uses the matching desktop or mobile still if decoded. Once the menu is open and the live frame has been drawn at the same crop, the still fades out over it. Reduced motion and unavailable artwork fall back to black. Browser-only locks wait for their own frame.

After replacing the checked-in preset or updating the simulator, run `npm run capture:chladni-stills` against the pinned local dev server. Pass a different local URL after `--` if needed. Chrome captures the settled player at each reference size that uses its device crop. Window framing, disabled crops and reference sizes that select a different crop use the live-player path. Commit the generated WebP files and `src/data/navigation-stills.json`. The release check verifies their hashes. The adjacent-source dev mode uses live playback while developing renderer changes.

Choose **Lock & preview** to play the captured look in the menu. Drafts are saved in the current browser when closing the menu or leaving the page. Reload the test URL to reopen the same lock on that origin. Visitors opening the ordinary URL get the checked-in look. Under **Preset**, choose **Export locked preset** to download `navigation.chladni.json`. Replace `src/data/navigation.chladni.json` with that export and commit it to share the look in the next build. **Restore website look** clears the draft and the lock in this browser.

`npm run build:chladni-preview` creates a local test-capable build for `npm run preview`. Cloudflare Pages uses its usual `npm run build` command and includes the editor only when its built-in `CF_PAGES_BRANCH` is `staging`. Both test-capable builds require `?chladni=test`. A standard local build and other Pages branches contain only the player.

`npm run dev:chladni -- --host 127.0.0.1 --port 4340` uses the adjacent simulator workspace and watches its source exports. Install dependencies in both checkouts before using this mode. Set `CHLADNI_SOURCE_PATH` to use another copy of the simulator workspace. The normal dev command and all builds resolve the pinned tarball. A site checkout needs only `npm ci` to install it from the repository.

To ship simulator changes, run `npm version patch --no-git-tag-version` and `npm pack --ignore-scripts` in the simulator workspace, choosing a different version increment when appropriate. Copy the resulting tarball to the site's `vendor/` directory and run `npm install ./vendor/duka-chladni-VERSION.tgz` from the site checkout with the actual filename. Remove the superseded tarball. Test the intended look with the pinned release, then commit the tarball replacement, both npm manifests and the matching preset in one site commit. To roll back that pair locally, run `git revert <release-commit>` and `npm ci`.

Run `npm run check:chladni` after installing or changing the release. It checks the tarball against the npm lockfile and inspects the emitted player and editor assets for local, main, regular preview and staging builds. Run it again after a rollback.

## Stage boundaries

Steps 1 and 1.1 established GitHub, a Git-integrated Cloudflare Pages review deployment and dependency fixes. Step 2 adds the accepted design in [the design specification](DESIGN.md). Bespoke Home Audio sits within Installations; all five services have routes. See [the Step 2 handoff](docs/step-2-handoff.md) for implementation, verification and remaining content decisions. Derive final Sanity fields after the broader design settles. Mail, webhooks, custom domains, DNS and the future Music Store are later scope.

Private handoff packages, unselected source assets, screenshots, evidence and operational addresses stay outside this public repository. Only individually selected assets authorised for this review are included; see [asset notes](docs/step-2-assets.md). Starter guidance in `docs/` is reference material, not a record of completed client setup.

## Code organisation

`src/pages` composes shared layouts and components. `src/data` contains typed fixtures, `src/lib/content.ts` is their loading boundary, and `src/lib/images.ts` produces responsive image data. CSS tokens live in `src/styles/tokens.css`; component CSS is kept alongside its component. React is limited to the navigation, timed hero and story carousel. Equipment panels use native disclosure controls.

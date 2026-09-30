# Duka Alfa Audio Website instructions

The human user's current stage request controls scope. Step 2's design brief was explicitly approved on 30 September 2026. Implement the responsive homepage and supporting service, about, stories/case-template, equipment, partner, contact and review legal pages. Keep noindex and disabled contact delivery. Do not launch the business domain.

Keep Astro static output, TypeScript, Node 24, the lockfile, separate `studio/` workspace and repository-root `functions/`. Use React islands only for a useful interaction. Both packages remain private.

Leave `PUBLIC_SANITY_PROJECT_ID` unset for account-free demo content. Keep `PUBLIC_CONTACT_FORM_READY=0` and `CONTACT_FORM_ENABLED=0`. Do not configure Sanity, mail, Turnstile, webhooks, deploy hooks, custom domains or DNS during this stage.

Follow the accepted direction in docs/step-2-design.md. Use dedicated CSS files, shared custom-property tokens, typed fixtures and reusable components. Derive final Sanity schema from settled components later; case articles belong in Sanity. Alfa Audio only; Music Store is future scope. Keep all five services; Bespoke Home Audio sits within Installations. Do not invent business claims.

Only individually selected website assets authorised by the user may enter this public repository: the original supplied identity, selected photographs from Web Package/Selection, selected partner logos/product images, and the user-supplied Memory(One) footer logo. Preserve original logo geometry and sibling source folders. Never copy entire private packages, unselected media, reference screenshots, provenance/approval records, operational addresses or credentials. Public-safe asset credits and implementation documentation are allowed. Read local private handoff guidance without copying it here.

Commit narrowly; inspect `git diff` and `git ls-files` before pushing. Run `npm run check` and `npm run build` for code changes. Verify hosted commit, build log and rendered URL separately from local checks. Keep tokens, passwords, hook URLs and contact message bodies out of files, logs and chat. Stop at the authorised stage boundary.

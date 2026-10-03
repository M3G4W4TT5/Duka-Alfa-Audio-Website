# Repository guidance

## References

- [DESIGN.md](DESIGN.md) is the source of truth for design requirements. Update design decisions there, not in this file.
- [README.md](README.md) describes local setup and the current environment configuration.
- [docs/operations-handoff.md](docs/operations-handoff.md) contains deployment and operations guidance.

## Architecture

- Use Node 24, TypeScript and Astro static output. Retain the root `functions/` directory and separate `studio/` npm workspace; both packages remain private.
- Compose pages in `src/pages` from shared layouts and reusable components. Keep typed content in `src/data` and load it through `src/lib/content.ts`.
- Use React islands for interactions that need client state. Render presentation components statically where possible.
- Keep styles in dedicated CSS files. Keep dependency changes and `package-lock.json` consistent.

## Scope and data

- Preserve unrelated working-tree changes and sibling source folders. Make targeted changes requested by the user.
- Do not invent business claims or publish unsupported content.
- Include only individually selected assets authorised for website use. Keep private handoff packages, unselected media, reference captures, approval records and operational addresses outside this public repository.
- Never put credentials, tokens, hook URLs or contact message bodies in source files, logs or chat.
- Change provider configuration, environment switches, domains and production services only when the task authorises those changes. Consult the current setup documentation first.

## Validation

- Run `npm run check` and `npm run build` after code or dependency changes.
- For interface changes, verify representative desktop and mobile layouts, relevant interactions and accessibility in a browser.
- Inspect `git diff --check`, the complete diff and tracked files before committing or pushing. Keep commits focused on the requested revision.
- Report local checks, CI results and hosted verification separately. A local build does not establish that a deployment is live.

## Delivery

- Commit each completed revision locally. Push to main only on the user's explicit command.
- After an authorised push, check CI and verify the deployed commit and affected rendered pages when hosting access is available.

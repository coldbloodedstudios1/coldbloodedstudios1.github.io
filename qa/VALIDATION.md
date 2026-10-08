# Homepage validation

Validated on 8 October 2026 using Node 24.19, Astro 7.3.8 and Chromium through Playwright.

- Astro checks: 7 files, zero errors, warnings or hints.
- Production build: static homepage generated successfully.
- Viewports: 320, 390, 768 and 1440 CSS pixels; no horizontal overflow.
- Automated axe WCAG A/AA checks: zero violations at each tested width, including contrast. CTA crimson was darkened to #ce1638 during validation.
- Keyboard: first Tab exposes Skip to content; Enter opens/closes project notes.
- Without JavaScript: navigation and native disclosures work.
- Game hierarchy: two original-game cards; TARKRAFT appears only in its separate experimental section.
- Asset/console checks: images decode, no failing local requests or page errors.
- Visual review: inspected full-page desktop and mobile screenshots; mascot species, full silhouettes and red eyes retained; cards and sections stack without clipping.
- Original README untouched; source project files and original artwork untouched.
- npm dependency audit at install: zero reported vulnerabilities.

See results.json for the machine-readable report. Screenshots are generated locally in qa/screenshots and ignored by Git. These checks do not replace a manual screen-reader audit, real-device testing or hosted performance measurements before publication.

Reproduce after starting `npm run preview` in another terminal:

```sh
npx playwright install chromium
node qa/homepage.mjs
```

Set CBS_PREVIEW_URL if the server uses a different address, or CBS_BROWSER_PATH to an existing compatible Chromium executable. For the initial workspace, the system Node 20 installation was too old; checks/builds use the bundled Node 24 runtime. Other machines should use Node 24 LTS.

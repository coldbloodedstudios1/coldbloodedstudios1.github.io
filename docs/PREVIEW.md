# Preview the homepage

This branch is a review build, not a published site. The original root README remains untouched.

Use Node.js 24 LTS (minimum supported here: 22.12). From this repository:

```sh
npm ci
npm run dev
```

Open http://localhost:4321. To view the production output instead:

```sh
npm run check
npm run build
npm run preview
```

Open the local URL printed by Astro. Press Ctrl+C to stop the server. On another machine, clone the repository and switch to `design/cinematic-homepage` first. The GitHub build workflow can provide a downloadable `homepage-review-build` artifact; serve its extracted files with a local static server (do not double-click HTML because root-relative assets require serving).

Review Games/Studio/Experiments/Connect navigation, Project notes disclosures, keyboard focus and mobile stacking. The title studies are original abstract artwork, not screenshots. No store/release links are fabricated. GitHub is the only external destination currently confirmed.

For repeatable browser checks, follow `qa/VALIDATION.md`. Design decisions and exact component behavior are in `docs/HOMEPAGE-SPEC.md`; artwork provenance is in `docs/ASSETS.md`.

The branch adds no deployment. Do not publish or merge before user approval. Astro's official setup and Pages guidance inform the configuration:
- https://docs.astro.build/en/install-and-setup/
- https://docs.astro.build/en/guides/deploy/github/

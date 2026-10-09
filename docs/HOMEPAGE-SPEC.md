# Cold Blooded Studios homepage — Cinematic Hybrid (A)

Status: implementation specification and working review build, 8 October 2026. Publication requires user approval. This specification locks the user-selected Cinematic Hybrid direction; it is not a reconstruction of the inaccessible assistant design message in the earlier conversation.

## Purpose and confirmed content

The homepage should make the studio recognizable, introduce its two original games, introduce Kirk/Jerry/Bryan, and distinguish experimental fan work from studio-owned originals. Primary journey: arrival → original games → project notes. Secondary journey: studio identity → GitHub. The confirmed facts are the studio name; Kirk as a black snake with red eyes; Jerry as a black frog with red eyes; Bryan as a black gator with red eyes; Gilt & Guilt and Pocket Vein as original games; TARKRAFT as an experimental fan project. No genres, platforms, development stage, release date, gameplay claims, store pages, personal roles, or contact address are inferred.

Editorial proposals such as “Original games. Cold blood.” are draft marketing copy for review. Game title artwork is explicitly marked as concept artwork. It is not represented as a screenshot. Game summaries remain neutral until approved material arrives. The existing local mascot suite is used as studio identity artwork, with its AI-generated provenance recorded in ASSETS.md.

## Visual direction

Cinematic: near-black canvas, large assertive typography, sculpted black characters, restrained crimson halo, quiet technical framing and generous negative space. Hybrid: clear navigation, readable editorial content, conventional cards and obvious links. Keep cinematic art decorative where redundant. Never put essential text in an image. The hero features Kirk; the studio section gives equal dedicated portraits to all three mascots. Do not recolor bodies green, replace species, or switch eye colors. The geometric diamond is a provisional UI mark, not an approved studio logo.

| Token | Value / implementation |
| --- | --- |
| Canvas | `#0b0c10` |
| Surface | `#14161d`; studio band `#101116` |
| Main text | `#f5f3ef` |
| Supporting text | `#b2b4be`; brightened from the OBS secondary token for readability |
| Brand crimson | `#ed2445`; large headline and decorative accent |
| CTA crimson | `#ce1638`; darker solid background for AA contrast with white text |
| Small accent/link text | `#ff879b` |
| Divider | `#343640`; decorative only, never the sole signifier of an interactive control |
| Gilt accent | `#ded0a6` for text, warm gold title study |
| Pocket accent | `#ff879b` for text, crimson title study |
| Font | Local Arial/Helvetica/system sans; no remote font calls |
| Headline | 48–102px fluid, 1.06 line height, -0.045em tracking, 800 weight |
| Section heading | 34–61px fluid; one H1 followed by H2 sections and H3 items |
| Body | 16px default, 1.6 line height; supporting card copy about 14.4px |
| Eyebrow | 11.2px, uppercase, 0.17em tracking, 700 weight |
| Container | Maximum 1240px; 20px side gutters mobile, 32px from 600px |
| Spacing | 8px base rhythm; 24–36px card gaps; 72px section padding mobile, 100px desktop |
| Shape | Mostly square edges, 1px dividers; reserve round shapes for decorative orbital frames |

## Page anatomy and exact behavior

1. **Header:** brand home anchor; Games, Studio, Experiments, Connect. Static header keeps reading space free on small devices. Navigation wraps naturally into a second row; all links are available without JavaScript. Minimum 44px link height. Skip link becomes visible on focus and targets main content.
2. **Hero:** eyebrow “Independent game studio”; H1 “Original games. Cold blood.”; neutral introduction; primary “Explore our games” to `#games`; secondary “Meet the studio” to `#studio`. Mobile: text then 360px art area. At 600px art height becomes 460px. At 960px a 1.08:1 split holds text and 540px art. Kirk stays completely visible using contain sizing; never crop eyes. Decorative orbits and coordinates are hidden from assistive technology. The hero image loads eagerly with high fetch priority. Bottom rail introduces “Three creatures. One studio.” and the next section anchor.
3. **Original games (`#games`):** H2 “Worlds of our own.”; Gilt & Guilt first, Pocket Vein second. Single column under 600px; two columns thereafter. Title study art is 8:5 with explicit label; native H3 title underneath. Use native details/summary for Project notes, including concept-art clarification and unannounced release info. Closed state is default. Browser handles keyboard and expanded-state semantics. Do not invent wishlist/play buttons while destination URLs are absent.
4. **Studio (`#studio`):** contrasting charcoal band, H2 “Meet the cold bloods.” Three named portraits with meaningful alt text. Mobile single column; three columns from 600px. Individual name/species caption, no unverified team job titles. Portraits retain contain sizing and square space. All are lazy loaded. Shared identity statement closes the band.
5. **Experiments (`#experiments`):** separate section after the original games and studio. H2 “Outside the originals.” TARKRAFT card with conspicuous “Experimental fan project” badge and text explicitly separating it from Gilt & Guilt and Pocket Vein. Include unofficial/no endorsement wording. No third-party logos, screenshots, downloads, storefront CTAs, or implication that it is studio-owned original IP. Native disclosure provides neutral project notes. Desktop two-column intro/card; mobile stack.
6. **Connect (`#connect`):** H2 “Follow the next chapter.” One real link to `https://github.com/coldbloodedstudios1`, opening in the same tab. No nonfunctional mailing list, invented email address, or fabricated social account. Add approved channels when available.
7. **Footer:** studio name, proposed tagline, Back to top anchor. Keep minimal until legal/contact information is approved.

## Interaction and responsive requirements

Base layout must fit 320px width with no horizontal overflow. Breakpoints: 600px for card/portrait columns; 960px for split hero, section headers and experimental section. Desktop content remains bounded at 1240px. Cards scale their art only 1.025 on hover over 350ms; no carousel, background video, scroll hijacking, parallax, or autoplay sound. Reduced-motion preference disables smooth scrolling and transitions. Native disclosures are functional with scripting disabled. All CTAs are anchors with actual destinations. Decorations never intercept clicks. Focus ring is 3px `#ffafbf` with 6px offset. Do not suppress outlines. Forced-colors mode keeps control/card boundaries visible.

## Accessibility acceptance

Target WCAG 2.2 AA: logical landmarks, unique page title, English language, one H1, correctly nested headings, meaningful link names, sufficient text contrast (4.5:1 ordinary text / 3:1 large text), visible keyboard focus, keyboard-operable disclosures and links, ≥44px primary touch targets, and readable 200% zoom/reflow. Art conveying no facts is alt-empty; crew images describe the species and eye color. Avoid red-only status differentiation: labels and copy state original vs experimental explicitly. Validate automated checks plus manual keyboard, zoom and screen-reader smoke review before publication. Automated checks alone are not full conformance certification.

## Implementation contract

Astro static output at root path, suitable for the account-level `.github.io` repository. Canonical production site setting exists in `astro.config.mjs`; root `/` is intentional (no repository-name base path). No server/API/framework islands required. Shared layout owns metadata and styles. Header/GameCard are reusable Astro components; `src/data/studio.ts` centralizes confirmed title and mascot data. Original SVG title studies live in `public/art`; optimized transparent WebP mascot images in `public/mascots`. Explicit dimensions prevent layout jumps. No external image, font, analytics or tracking requests. Detail content is accessible HTML. Assets and text are versioned. Lock dependencies with package-lock and use Node 24 for local/CI parity.

Performance targets for the subsequent release review: zero shipped application JS for this milestone; hero mascot under 150KB; each crew asset under 150KB; total art under 450KB; no layout shifts caused by unknown image size; LCP goal under 2.5s and CLS under 0.1 on an agreed mobile test profile. Measure these on approved hosting; local build success is not a field performance measurement. Do not preload all portraits. Prefer approved screenshots in future only after rights/provenance and responsive crop review.

## Repository preservation and publication gate

Inspected remote: one branch `main`, starting commit `dd008c45d92072f86b2f5a37fd8858be49e9da4a`, containing README.md only. Existing README is untouched. GitHub identifies coldbloodedstudios1 as a user-owned account (rather than an organization); the requested namespace is used unchanged. Work is isolated on `design/cinematic-homepage`. Build workflow checks and uploads a review artifact only. It has read-only repository permission, no Pages deployment step, no Pages write permission and no merge automation. Robots metadata is noindex/nofollow for the review build. Do not merge, configure Pages, remove the review indexing restriction, or publish without user approval.

## Next milestone after review

Post-push verification: GitHub has a pre-existing automatic Pages build for the original main commit, completed before this work. Its settings were not changed. Main still points to the original commit; the review branch runs only the added build workflow. Approval is required before changing that existing publication setup to publish Astro output.

Approve visual layout/copy; supply game summaries, rights-cleared screenshots and store/project links; confirm mascot selection and final logo; confirm fan-project wording, contact and social destinations. Add focused game detail routes when content exists. Recheck keyboard/contrast/mobile/performance, replace draft metadata with approved social/canonical metadata, then request approval for the concrete production result. Only after approval add an explicit Pages deployment workflow and merge. No deployment exists in the present milestone.

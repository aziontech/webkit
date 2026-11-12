# S4b — builder journal and DONE (verbatim)

`JOURNAL.md` and `DONE.md` from job S4b, copied without edits.

---

# JOURNAL — S4b (site: professional-services, about-us, careers, compliance)

## 14:48 — setup
- Scaffolded `npm create vite@latest -- --template vue-ts`, installed the 3 tarballs + vue-router. ~2 min. Fine.
- **medium** — `@aziontech/webkit@5.12.0` declares `"@aziontech/theme": "^4.0.0"` as a dependency, but the theme tarball we are given is 5.2.2. npm therefore installs a *second*, nested `@aziontech/theme@4.3.1` under `node_modules/@aziontech/webkit/node_modules/`. The app's `src/webkit.css` imports the 5.2.2 tokens while any webkit-internal import of theme resolves to 4.3.1. `npx @aziontech/webkit doctor` reports only the top-level version and says OK — it does not flag the duplicate. Left as is (cannot change the package); watched for token mismatches.
- `npx @aziontech/webkit init --yes` worked well: wrote `src/webkit.css` (theme + `@aziontech/webkit/styles` for Tailwind v4), `postcss.config.mjs`, eslint/stylelint, husky, `.claude/` skills, and patched `src/main.ts`. `doctor` → 0 fail. Good experience. **low**: init adds 8 devDependencies pinned to `"latest"` and `doctor` then warns about its own choice.
- **low** — init says "Theme defaults to LIGHT; set `<html data-theme="dark">`". Clear, but for a dark-only marketing site there is no "site" preset that does it; done by hand in `index.html`.
- **low** — README step 2 says `import '@aziontech/theme/globals.css'`, `webkit-usage` skill says `import '@aziontech/theme'`, init writes a `webkit.css` with `@import '@aziontech/theme'` + `@import '@aziontech/webkit/styles'`. Three different instructions for the same step; I followed what `init` wrote.

## 14:50 — finding the sections
- Worked well: `llms/llms.txt` "Components: Marketing sections" is an excellent index. Almost every band of the 4 pages has a named section (`site-nav`, `hero-band`, `capability-grid`, `media-split-stack`, `client-quotes`, `faq-section`, `closing-call-to-action`, `photo-marquee`, `recognition-marquee`, `investor-marks`, `process-scroll`, `listing-table`, `compliance-badges`, `resource-grid`, `site-footer`). The `examples/<name>/site-*.vue` files show the real azion.com placement inside `SectionContainer`/`SectionGap`. ~10 min.
- **high** — Every `site-*` example points images at `/marketing-components/logos/...` and `/marketing-components/badges/...` and `/media/careers/*.jpg` — paths that exist on azion.com, not in the package. The package actually exports the logos as `@aziontech/webkit/assets/<file>.svg` (360 entries in `exports`), but no doc says "import the logo from `@aziontech/webkit/assets/...`". Found it by reading `package.json` exports. Copy-paste of an example gives broken images.
- **high** — Office/team photos (PhotoMarquee on careers + about) are not shipped at all (only `gpa-photo.jpg`, `netshoes-photo.jpg`). Decision: crop the photos out of the reference screenshots into `app/public/media/` as local mock assets so the band can be shown faithfully.
- **medium** — Rule `webkit-header-search` / lint `webkit/header-search-trigger` says "never a bare magnifier IconButton, always SearchTrigger", but `SiteNav` itself renders `IconButton icon="pi pi-search"` (site-nav.vue:342) and does not open a Command palette. The flagship component breaks its own rule; I used SiteNav as is (no slot to change it).

## 14:54 — professional-services (built)
- Used: `SiteNav`, `HeroBand kind="centered" plain` with `carouselMarks` (all 11 client marks exist in the brand registry 👍), `CapabilityGrid` (3 Topics), `MediaSplitStack kind="alternating"`, `ClientQuotes`, `FaqSection`, `ClosingCallToAction kind="split"`, `SiteFooter`, `SectionContainer`/`SectionGap hatch`. First render was ~90% of the reference with zero custom CSS. Very good. ~25 min.
- **high** — `npm run build` (Vite template's `vue-tsc -b`) fails: `TS2307 Cannot find module '@aziontech/webkit/site-nav' / 'site-footer' / 'webkit-provider'`, while `vue-tsc --noEmit -p tsconfig.app.json` resolves the same imports fine. The package's `exports` point straight at `.vue` sources with no `types` condition, and build mode does not pick them up consistently. README "Requirements" only mentions `htmlAttributes`. Workaround: build script = `vue-tsc --noEmit -p tsconfig.app.json && vite build`. ~10 min.
- **medium** — `import '@aziontech/icons'` (the exact line `init` writes into main.ts) fails type-check under TypeScript 6 (`TS2882`, noUncheckedSideEffectImports): icons ships no declaration. Added `src/env.d.ts` with `declare module '@aziontech/icons'`.
- **medium** — The `init` ESLint config lints `dist/` (57 errors from built chunks) and the init `.stylelintrc.json` + husky pre-commit lint `dist/` too (521 stylelint errors from the theme's own compiled hex colours) — the first commit failed in the pre-commit hook. Added eslint `ignores` and a `.stylelintignore`. The strict preset also applies `webkit/authoring-standards` "no prose comments" to *app* code (a data comment saying "FAQ answers are mock" is an error) and demands `defineSlots` on a 3-line layout. Contributor rules applied to consumers; complied (removed comments, added defineSlots).
- **medium** — FAQ answers are not in the reference (collapsed); `FaqSection` requires `answer`. Wrote short mock answers.
- **low** — `ClientQuotes`: reference selector row has 6 clients (Contabilizei, Axur, Zoop, HeroSpark, GPA, GFG); only 4 quotes are known (Contabilizei from the page + 3 from `examples/client-quotes/site-default.json`), so 4 cards. Zoop has no brand-registry mark → `logo` = `@aziontech/webkit/assets/zoop-extended-color.svg` (works with Vite).
- **low** — Illustrations for the three media bands: picked `build-applications`, `stay-in-control`, `white-gloves-when-it-matters` from `src/assets/illustrations/registry.ts`; the reference's diagrams (Azion node wired to frameworks / grid / headset) are not in the registry. No preview gallery of illustration names in llms/ — had to read registry.ts.
- **low** — `SiteFooter` links are `{label, href}` only: no way to show the "↗" external icon after "Our Community".
- **low** — iPhone: reference nav hides "Login" at 393 px; `SiteNav` keeps it until <384 px (README says so). Not configurable.

## 14:55 — about-us (built)
- Used: `HeroBand kind="title-band" size="large"` (two actions, `trailing` chevron), `PhotoMarquee` (title + wide description beside it = the "Builders, not spectators" band), `RecognitionMarquee`, `InvestorMarks`, `ClosingCallToAction kind="primary"` (pixel texture + closing hatch). ~12 min, near pixel-level match. Logos imported from `@aziontech/webkit/assets/*.svg` (g2, gigaom, frost-and-sullivan, monashees, qualcomm) all exist.
- **medium** — Photos: none shipped (see 14:50). Cropped the 4 visible photos of the reference strip into `app/public/media/about-*.jpg`; the two edge ones are partial crops, so the marquee loops slightly odd slivers.
- **low** — Hero: reference breaks the title over 2 lines in a ~760 px column; `title-band` sets it on one line (`titleLength` only offers `short`/`long` and short is already the default). Hero is ~45 px shorter than the reference. No prop for it; left.
- **low** — The eyebrow in the reference has no blue caret after "ABOUT"/"ANALYSIS"; WebKit's `Overline` always draws it. Cosmetic.
- **low** — `RecognitionMarquee` items need `date?`; the reference has the date folded into `reportName` ("G2 Spring 2026 Reports") so I omitted `date`. Fine.

## 14:56 — careers (built)
- Used: `HeroBand kind="centered"` (dot field, matches), `PhotoMarquee`, `MediaSplitBand size="large"`, `ProcessScroll title-kind="centered"`, `ListingTable` (anchor `latest-roles` so the hero "See roles" → `#latest-roles` works), `ClosingCallToAction kind="primary"`. ~20 min.
- **medium** — `ListingTable` / section prop types: passing a plain object literal array fails `vue-tsc` (`grow: number` not assignable to `1|2|3`; `as const` fails because the prop is a mutable array). The fix is `import ListingTable, { type ListingTableColumn } from '@aziontech/webkit/listing-table'` — this named-type import from a `.vue` subpath works but is documented nowhere (llms/components/listing-table.md shows the type name only).
- **medium** — "Latest roles" is in the screenshot but not in pages.json (client-rendered). Rows transcribed from the screenshot as mock data.
- **low** — `ProcessScroll` lays all 5 cards in one row at 1440 px; the reference pins the band and scrolls the cards sideways (4 visible, ~1000 px sticky runway), so our page is ~1170 px shorter. No prop for the sticky/scroll mode (`StickyCarousel` is a different component with different cards). Accepted.
- **low** — Values illustration: reference = globe with the Azion mark; closest registry entry is `content-and-media-delivery-globe` (globe + media icons). `global-network` is a flat map. No globe-with-Azion-mark illustration.
- Photos: cropped from the reference into `public/media/careers-*.jpg` (same workaround as about-us).

## 14:59 — compliance (built) + wrap-up
- Used: `HeroBand kind="centered"` (no eyebrow, two actions), `ComplianceBadges` (7 certifications, badges from `@aziontech/webkit/assets/*-symbol-color.svg`, no "see more" cell), `ResourceGrid` for the "Data privacy" band (overline, headline, long lead, 3 link cards with ↗). ~8 min, close to pixel-identical.
- **low** — `ComplianceBadges` and `ResourceGrid` use the "balanced" grid: the 7th badge (CPRA) and the 3rd link (Privacy Policy) stretch across the empty cells of the last row. The reference keeps one cell wide and leaves the rest empty. Desktop only (the iPhone 2-column grid matches). Rule `webkit-sections` says this is on purpose ("No row ends on an empty cell"), so it's a design difference, not a bug. No prop to turn it off.
- **low** — Only one `soc-symbol-color.svg` exists for both SOC 2 and SOC 3 (the reference uses the same artwork too). Fine.
- Final checks: `npm run build` passes, `npx @aziontech/webkit check` → 0 errors (1 warning: "latest" pins added by init), `eslint` + `stylelint` clean, built `dist/` served by `vite preview` returns index.html for `/`, every page route and an unknown deep path; page shot from dist renders. Every page shot once at the end; the dev server is stopped.
- **low (process)** — The `shoot.sh` capture worked first time each time (~11 s per page). Good tooling.

### What worked well (overall)
- The marketing-section catalogue covers these company pages almost completely; every band mapped to one section and the page files are just data + `SectionContainer`/`SectionGap`. No custom CSS and no hex colours anywhere in `src/`.
- `examples/<section>/site-*.vue` show real azion.com placement. Fastest way to learn each section.
- Brand-mark registry (`carouselMarks`, `mark`) had every client in the hero strip.
- Dark theme via `data-theme="dark"` worked everywhere with no per-component work.


---

# DONE — S4b

## Pages
- `site-professional-services`: **built**. Missing or different: the quote selector has 4 clients, not 6 (no quote copy for GPA/GFG); FAQ answers are mock (collapsed in the reference); media-band illustrations are the closest registry ones, not the reference diagrams; no ↗ icon on footer "Our Community".
- `site-about-us`: **built**. Photos cropped from the reference screenshot (WebKit ships none); the hero title sits on one line where the reference breaks it over two.
- `site-careers`: **built**. "Latest roles" rows transcribed from the screenshot (not in pages.json); ProcessScroll shows all 5 cards in one row instead of the reference's pinned sideways scroll (so the page is ~1000 px shorter); the values globe illustration has media icons instead of the Azion mark; photos cropped from the reference.
- `site-compliance`: **built**. The last badge cell (CPRA) and the last link cell (Privacy Policy) stretch across the empty grid cells (WebKit "balanced" grid).

## WebKit pieces used most
`SiteNav`, `SiteFooter`, `SectionContainer max-width="site"`, `SectionGap hatch`, `HeroBand` (centered / title-band), `ClosingCallToAction` (split / primary), `PhotoMarquee`, `CapabilityGrid`, `MediaSplitStack`, `MediaSplitBand`, `ClientQuotes`, `FaqSection`, `RecognitionMarquee`, `InvestorMarks`, `ProcessScroll`, `ListingTable`, `ComplianceBadges`, `ResourceGrid`, `WebkitProvider`, and the logo/badge assets under `@aziontech/webkit/assets/*`. Setup came from `npx @aziontech/webkit init`, plus `check` and `doctor`.

## Top 5 WebKit problems, by impact
1. **`npm run build` breaks out of the box.** The Vite template's `vue-tsc -b` cannot resolve `@aziontech/webkit/site-nav`, `site-footer` and `webkit-provider`: `exports` point at raw `.vue` with no types. `import '@aziontech/icons'`, the line `init` writes, also fails under TS 6 because icons ships no declaration. Workaround: `vue-tsc --noEmit -p tsconfig.app.json` plus an `env.d.ts` shim.
2. **Example image paths are broken, and photos aren't shipped.** Every `site-*` example uses `/marketing-components/...` and `/media/careers/...` URLs that aren't in the package. The real logos are exported as `@aziontech/webkit/assets/<file>.svg`, but no doc says so. Office photos don't exist at all.
3. **The `init` lint wiring blocks the first commit.** The husky pre-commit runs eslint and stylelint over `dist/` (521 errors from the theme's own compiled CSS). Contributor-only rules (no prose comments, `defineSlots`) also fire on app code.
4. **Version mismatch between packages.** `@aziontech/webkit@5.12.0` depends on `@aziontech/theme ^4`, so the given theme 5.2.2 gets installed alongside a nested 4.3.1. `doctor` doesn't notice.
5. **Section types and the header rule contradict the docs.** Section prop types (e.g. `ListingTableColumn`) are only reachable via an undocumented named-type import from a `.vue` subpath. `SiteNav` renders the bare magnifier `IconButton` that rule `webkit-header-search` forbids, and offers no prop or slot to fix it.

## Build
`npm run build` **passes** (`vue-tsc --noEmit -p tsconfig.app.json && vite build`). `dist/` works as a static SPA: tested with `vite preview`, where `/`, every page route and an unknown deep path all serve index.html and render. `npx @aziontech/webkit check` reports 0 errors. Git checkpoints are in `app/` (setup+PS, about, careers, compliance).

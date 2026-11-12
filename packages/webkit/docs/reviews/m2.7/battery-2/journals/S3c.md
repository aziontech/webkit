# S3c — builder journal and DONE (verbatim)

`JOURNAL.md` and `DONE.md` from job S3c, copied without edits.

---

# Journal — job S3c (WebKit site rebuild)

Pages: site-product-edge-pulse, site-product-our-network, site-blog, site-resource-hub.

## 14:48 — start
Read BRIEF.md. Plan: empty Vite+Vue3+TS app in `app/`, install the 3 tarballs, follow WebKit's own setup docs.

## 14:53 — setup (≈20 min)
- **Worked well:** `npx @aziontech/webkit init --yes` wired webkit.css, Tailwind v4 postcss, icons import, lint, AGENTS/CLAUDE.md in one go. README "For AI agents: start here" and `llms/llms.txt` are an excellent index. Marketing sections exist for nearly every band in the brief (SiteNav, SiteFooter, CapabilityGrid, ClientQuotes, MediaSplitStack, UseCaseLinks, FaqSection, ClosingCallToAction, NetworkSection, ArticleIndexBlog, ArticleIndexResourceHub…).
- **Worked well:** `examples/site-nav/site-default.json` and `examples/site-footer/site-default.json` ship the real azion.com nav/footer data; shell rendered nearly pixel-identical to the reference on first try.
- **high — TypeScript build broken out of the box.** The Vite vue-ts template's `vue-tsc -b` (project-references build mode) fails with TS2307 "Cannot find module '@aziontech/webkit/site-nav'" for every WebKit import, because exports point at raw `.vue` source files outside the composite project's `include`. `vue-tsc --noEmit -p tsconfig.app.json` resolves them fine. README "Requirements › TypeScript" says vue-tsc works under strict but doesn't mention build mode. Fix: changed build script to `vue-tsc --noEmit -p tsconfig.app.json && vite build`. ~5 min.
- **medium — `import '@aziontech/icons'` (added by `init`) fails typecheck** (TS2882, no declarations for side-effect import; package has only CSS exports). `init` should add a `declare module` shim. Added `src/env.d.ts`.
- **low — Section props are typed with mutable arrays** (`SiteNavMenu[]`), so passing site JSON as a TS module with `as const` fails, and plain JSON imports fail on `kind: string` vs `SiteFooterKind`. The `webkit-sections` rule says "bind the site JSON entry's props straight on", which doesn't typecheck for any enum prop. Used TS modules with `'site' as const` on the enum field only. Types like `SiteNavMenu` are only exported from inside the .vue file (no documented type import path).
- **low — `init` note** "design system defaults to LIGHT; set data-theme=dark" is clear. Set `data-theme="dark"` on `<html>` in index.html + main.ts.
- **low — `Link`** renders an external-link icon for internal routes on the home index (no doc on how to suppress it). Left as is (home index isn't a reference page).
- **medium — `init`'s husky pre-commit hook (`npx eslint .` + `npx stylelint "**/*"`) lints `dist/`**, so the first commit after any `npm run build` fails on hundreds of errors from WebKit's *own* compiled CSS/JS (hex colours, literal ms timings). The generated eslint config has no `ignores` and no `.stylelintignore` is written. Also flags the Vite template's `// https://vite.dev/config/` comment (webkit/authoring-standards bans implementation comments — strict for an app). Fix: `{ ignores: ['dist/**'] }` + `.stylelintignore`. ~5 min.

## 14:56 — site-product-edge-pulse (≈35 min)
Built from: `Hero` (kind=screen, texture=dots) + `Hero.Title`, `SectionContainer`/`SectionGap hatch`, `CapabilityGrid`, `ClientQuotes`, `MediaSplitStack` (alternating), `UseCaseLinks`, `FaqSection`, `ClosingCallToAction` (split), SiteNav/SiteFooter. Every band of the reference had a matching section; first render was ~95% faithful.
- **Worked well:** `examples/client-quotes/site-default.json` already contains the Dafiti quote verbatim; `ClosingCallToAction kind=split` with `titleMuted` reproduces "See everything. / Act faster." exactly; `CapabilityGrid` without title = the bare 3×2 framed grid.
- **high — vue-tsc reports TS2339 "Property 'value' does not exist"** on *any object-typed* template expression inside `<Hero.Title>` (and its `#actions` slot): `:title="copy.title"` fails, a destructured string const works. Not seen on other compound components so far. Workaround: destructured primitive consts in `<script setup>`. ~15 min to isolate. Probably the `Object.assign(Hero, { Title })` compound typing in `hero/index.ts` interacting with vue-tsc 3.3 / TS 6 — no docs mention it.
- **medium — illustration registry ≠ asset folder.** `src/assets/illustrations/` ships `usage-chart.svg`, `real-time-metrics-status-codes.svg`, `placeholder.svg`… but they are not in `registry.ts`, so `illustration: 'usage-chart'` renders the "PLACE DESIGN ASSET" placeholder (docs: illustration.md). No CLI/doc lists the *valid* names (`webkit view illustration` would be the place). Used `low-latency` and `stay-in-control` instead. ~5 min.
- **medium — no Edge Pulse product imagery.** Reference media are console screenshots (Default Tag code panel, HTTP Requests table, Real-Time Events filter). `ProductWidget` has `real-time-events-filter`/`-log` that would match, but `MediaSplitStack` bands accept only `image` URL or `illustration` name — no widget/scene slot. Used generic registered illustrations (gap recorded).
- **medium — `ClientQuotes` autoplays with no prop to stop it.** Reference freezes on the first (Dafiti/GFG) quote; screenshot after 2.5 s lands on the second quote. `QuoteTabs` has `autoplay` but the section doesn't pass it through (sections must not get extra props per `webkit-sections`). Left as is.
- **low — `Hero.Title` default maxWidth (4xl)** puts the H1 on one line; reference wraps to 2. `max-width="2xl"` fixes it.
- **low — `MediaSplitStack` title row** sits directly on the first band; reference has a hatched `SectionGap` between the centred title and the bands. Not configurable; accepted.
- **low — `SiteNav` keeps `Login` at 393 px** (README: hides below 384 px); reference hides it on iPhone. No prop. Accepted.
- **low — FAQ answers are not in pages.json** (questions only, all collapsed): wrote short mock answers.
- Logos: `@aziontech/webkit/assets/zoop-extended-color.svg` export works as a Vite URL import — nice, but undocumented in the client-quotes docs (example uses a `/marketing-components/logos/...` path that doesn't exist in a consumer app).

## 14:58 — site-product-our-network (≈15 min)
Built from: `Hero` (screen, dots, `carousel` + `carouselMarks` + `carouselLabel` = the "TRUSTED BY SECURITY TEAMS" brand strip), `NetworkSection` (outcomes), `MediaSplitStack` (alternating), `ClientQuotes`, `PlatformDirectory`, `ClosingCallToAction kind=primary`.
- **Worked well (excellent):** all 11 hero brand marks are in the mark registry; `examples/media-split-stack/site-alternating.json` *is* this page's band (same illustrations: fastest-path-to-live-website, runtime, distributed-apis). `NetworkSection` reproduces the dotted world map + lead + chips + 4 outcome cells pixel-close. `ClosingCallToAction primary` = the orange pixelate close exactly. Fastest page so far.
- **low — `NetworkSection` outcomes require a `logo`**; reference cells show only the figure + text (its imgs are decorative and render nothing). Supplied Dafiti/MadeiraMadeira/Renner/Fourbank logos from `@aziontech/webkit/assets/*` (the ones the webkit example uses). Small visual addition vs reference.
- **low — `highlights` must be literal substrings**; fine but the doc says "phrases" — used just the figure ("7x") to match the reference's white-figure/grey-text split.
- **low — Hero description copy contains literal `**bold**` markers** in pages.json and in the reference render; kept verbatim (Hero.Title description doesn't parse markdown, consistent with reference).
- **low — PlatformDirectory items need an `href`** or they're dropped ("Items without … an href are skipped"); pages.json gives none, so used `#`. Silent dropping would be easy to miss.

## 14:59 — site-blog (≈20 min)
Built from: `Hero` (band, size=medium) + `Hero.Title`, `ArticleHighlight`, `ArticleIndexBlog`, `ClosingCallToActionNewsletter` (with a mock `@submit` → loading → submitted, per the `webkit-sections` rule "the section never posts").
- **Worked well:** `ArticleIndexBlog` reproduces the category pill bar + search + ruled rows + avatar byline + "Show more" exactly; `ClosingCallToActionNewsletter` is the reference band verbatim (incl. pixelate closing frame). Hero size=medium gives the reference's exact hero height.
- **medium — no blog imagery / no documented image source.** Examples point at `/media/blog/*.png`, which ships nowhere. Used the 12 illustration SVGs exported at `@aziontech/webkit/assets/*.svg` (ddos-protection, usage-chart, ai-gateway, …) as stand-in thumbnails; the reference uses grey/orange 3D raster art. The `assets/*` export list isn't documented in llms/ (found it by reading package.json exports).
- **medium — `ArticleHighlight` wall wraps 5 items as 3 + 2** (CardGrid "balanced" rule); the reference shows one 5-column strip. No `columns` prop; the rule `webkit-sections` forbids tweaking. Accepted.
- **low — `ArticleHighlight` auto-advances too?** Reference capture is on item 2 (Performance), ours on item 1 — likely timing; not configurable either way.
- **low — avatars** fall back to initials (no author photos available; `authors[].name` only).
- **low — row descriptions:** reference rows show no excerpt; set `description: ''` (type requires the field) — rendered fine.

## 15:00 — site-resource-hub (≈10 min)
Built from: `Hero` (screen, dots), `ArticleIndexResourceHub` (title + 3 facet dropdowns + ruled rows + Load more), `ClosingCallToActionNewsletter`. No `SectionGap` between hero and list, as in the reference.
- **Worked well:** `examples/article-index-resource-hub/site-resource-hub.json` already had the exact facets ("All content types / All categories / All industries") and the Security e-book row verbatim. Done in one pass.
- **low — row excerpt clamped to 2 lines on mobile** (ellipsis); reference shows the full excerpt at 393 px. No prop.
- **low — row thumbnails** reuse WebKit's illustration SVG exports (same gap as blog: no raster article art available).
- **low — newsletter placeholder differs per page** ("Your e-mail" on blog, "Your email" here) — kept verbatim per pages.json via the `form` prop.

## 15:03 — wrap-up
- `npx @aziontech/webkit check`: 0 errors. It first warned "no WebkitProvider in src/"; added `<WebkitProvider locale="en">` at the App root. One warning remains: `init` itself pins 8 devDependencies as `"latest"`, and then `doctor` warns about those pins. That's a **low**-severity inconsistency inside WebKit's own tooling.
- `npm run build` passes (vue-tsc --noEmit -p + vite build). Served `dist/` from a static server with an index.html fallback on a free port: `/`, every page route and an unknown path all return 200. Our Network renders from dist at the same height as in dev (6963 px).
- Process note (not WebKit): port 5124 was already taken by another job's server. My first dist check hit it and showed their page; I moved to a free port.
- Final shots of all 4 pages are in shots/ and shots/tiles/; the dev server is stopped.


---

# DONE — job S3c

## Pages
- `site-product-edge-pulse`: **built.** Missing or approximate: the three media rows use generic WebKit illustrations (low-latency, stay-in-control, live-debugging) instead of the Edge Pulse console screenshots. The client-quote carousel autoplays, so the shot can land on a different quote than the reference. FAQ answers are mock text (pages.json lists only the questions).
- `site-product-our-network`: **built.** Every band matches. The 4 outcome cells show client logos, which the reference cells don't render; `NetworkSection` requires a logo.
- `site-blog`: **built.** Thumbnails are WebKit illustration SVGs, not the reference's 3D raster art, and avatars show initials. The featured strip wraps 3 + 2 instead of a single row of 5.
- `site-resource-hub`: **built.** Thumbnails are illustration SVGs. On iPhone, row excerpts are clamped to 2 lines (the reference shows them in full).

Shared chrome on every page: `SiteNav` (mega-menus, mobile sheet, search trigger) and `SiteFooter`, dark theme via `data-theme="dark"`. `/` lists all four pages.

## WebKit pieces used most
`SiteNav`, `SiteFooter`, `Hero` + `Hero.Title` (screen and band, dots texture, brand-mark carousel), `SectionContainer` + `SectionGap hatch`, `MediaSplitStack`, `ClientQuotes`, `ClosingCallToAction` (split, primary), `ClosingCallToActionNewsletter`, `CapabilityGrid`, `UseCaseLinks`, `FaqSection`, `NetworkSection`, `PlatformDirectory`, `ArticleHighlight`, `ArticleIndexBlog`, `ArticleIndexResourceHub`, `Button`, `WebkitProvider`, the `@aziontech/webkit/assets/*` logo and illustration exports, and the `examples/*/site-*.json` data.

## Top 5 problems with WebKit (by impact)
1. **The TypeScript build fails out of the box** (high). The Vite vue-ts template's `vue-tsc -b` can't resolve any `@aziontech/webkit/*` import (TS2307), because the exports point at raw `.vue` sources. Separately, `init` adds `import '@aziontech/icons'` with no type shim (TS2882). Fix: `vue-tsc --noEmit -p tsconfig.app.json` plus a `declare module` file.
2. **vue-tsc reports a false "Property 'value' does not exist"** (high) on any object-typed expression inside `<Hero.Title>` and its `#actions` slot. It took 15 minutes to isolate. Workaround: destructure into primitive consts.
3. **`init`'s pre-commit hook lints `dist/`** (medium). The generated eslint config has no `ignores` and no `.stylelintignore` is written, so the first commit after a build fails on hundreds of errors in WebKit's own compiled output. The strict comment ban also flags the Vite template's own comment.
4. **Media gaps in the marketing sections** (medium):
   - The illustration registry ≠ the shipped asset folder: `usage-chart` and `real-time-metrics-status-codes` render the "PLACE DESIGN ASSET" placeholder, and no list of valid names is documented.
   - `MediaSplitStack` can't host a `ProductWidget`.
   - Examples reference image paths (`/media/blog/*`, `/marketing-components/logos/*`) that don't exist in a consumer app. The working `@aziontech/webkit/assets/*` exports aren't documented.
5. **Sections can't be tuned to match the real site** (medium/low), and the `webkit-sections` rule forbids extra props or wrappers:
   - `ClientQuotes` and `ArticleHighlight` autoplay with no `autoplay` passthrough.
   - The `ArticleHighlight` wall can't be a single row of 5.
   - `SiteNav` keeps `Login` at 393 px.
   - Resource Hub row excerpts are clamped on mobile.
   - Typing: enum props and mutable-array props make "bind the site JSON straight on" fail typecheck.

What worked very well: `llms/llms.txt`, a section for every band in the brief, and `examples/*/site-*.json` holding near-verbatim azion.com data. With those, every page was ~95% faithful on its first render.

## Build
`npm run build` **passes** (`vue-tsc --noEmit -p tsconfig.app.json && vite build`). `npx @aziontech/webkit check` reports 0 errors and 1 warning (the "latest" pins that `init` itself writes). `dist/` was verified as a static SPA: deep links and unknown paths fall back to `index.html`.

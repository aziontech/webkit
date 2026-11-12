# S3b — builder journal and DONE (verbatim)

`JOURNAL.md` and `DONE.md` from job S3b, copied without edits.

---

# JOURNAL — job S3b (WebKit 5.12.0 / theme 5.2.2 / icons 4.4.0)

## 14:49 Setup
- Hand-made empty Vite + Vue 3 + TS app; installed the 3 tarballs as file: deps, then `npx @aziontech/webkit init -y`.
- **medium** — `init -y` silently added 8 devDependencies pinned as `"latest"` (eslint, stylelint, husky, …) and a `prepare: husky` script; `doctor` then warns about those same `latest` pins. The tool warns about its own output.
- **medium** — `@aziontech/webkit@5.12.0` declares `"@aziontech/theme": "^4.0.0"` while the package set ships theme **5.2.2**. npm nests a second copy (theme 4.3.1, pulled from the registry) under `webkit/node_modules`. The app CSS imports 5.2.2; any theme import inside webkit gets 4.3.1. Two theme majors in one bundle; nothing in README/MIGRATION-v6 mentions which theme major goes with webkit 5.12.
- **low** — First `init` run on a dir without `src/main.ts` only prints a note; after I created the entry it merged `./webkit.css` + `@aziontech/icons` into main.ts correctly. Worked well.
- **low** — init notes "design system defaults to LIGHT; set <html data-theme=\"dark\">". Clear. I set both `data-theme="dark"` and `class="dark"` on <html> in index.html.
- **low** — `doctor` warns "no WebkitProvider in src/". README quick-start never mentions WebkitProvider; only doctor does.
- **medium** — init installs a husky pre-commit hook that runs `npx eslint .` + stylelint on every commit; the brief requires checkpoint commits, so lint errors would block checkpoints. Noted; I'll keep the hook and fix lint, falling back to `--no-verify` only if needed (will log if so).

## 14:54 Learning WebKit for marketing pages (~25 min)
- **Worked well** — `llms/llms.txt` has a "Components: Marketing sections" list that maps almost 1:1 onto the product-page template in the brief: `HeroBand`, `CapabilityGrid`, `MediaSplitStack`/`MediaSplitBand`, `CodeSplit`, `UseCaseLinks`, `ClientQuotes`, `PlatformDirectory`, `FaqSection`, `ClosingCallToAction`, `SiteNav`, `SiteFooter`, `Ticker`. Each `llms/components/<name>.md` has a props table + example. Fast to learn.
- **medium** — The `shells/website` block (`npx @aziontech/webkit view shells/website`) hand-builds the header from `GlobalHeader` + `NavigationMenu` + `SearchTrigger` + `Command` and the footer from `Footer`, while `SiteNav`/`SiteFooter` sections do the same job in one tag. README says "start from a block, do not build the screen from scratch", rule `webkit-sections.md` says "never rebuild a band from primitives when a section exists". Two sources of truth for the same chrome. I used the sections (`SiteNav`, `SiteFooter`), not `add shells/website`.
- **low** — `npx @aziontech/webkit search product page` returns console blocks (analytics-dashboard, first-use…) and never surfaces `hero-band`/`capability-grid` etc. Searching by band names works; searching by page type doesn't.
- **medium** — Registry names (client/framework marks for `HeroBand.carouselMarks`/`Ticker.marks`/`ClientQuotes.mark`, `Illustration` names, `Diagram` names) are not listed in one place in the docs. `illustration.md` lists illustration names in an example; mark names I had to read from `src/svg/brands/registry.ts`. Missing from the brand registry but needed here: zoop, datadog, splunk, bigquery, aws-s3, kinesis (zoop exists only as an asset file `@aziontech/webkit/assets/zoop-extended-color.svg`).

## 14:54 Page 1 — site-product-secure-internet-access (~30 min)
Used: `SiteNav`, `HeroBand kind=centered` (eyebrow + carousel marks), `SectionContainer max-width=site` + `SectionGap hatch`, `CapabilityGrid` (bare), `MediaSplitStack kind=alternating`, `ClientQuotes`, `UseCaseLinks`, `PlatformDirectory`, `FaqSection`, `ClosingCallToAction kind=split`, `SiteFooter`. First screenshot already matched the reference layout section by section — impressive.
- **high** — No illustration for Secure Internet Access in the `Illustration` registry (and no `Diagram` named for it either). The reference has two custom diagrams (users → one policy → web/SaaS/AI; teams → AI policy). Used the closest registry art: `intent-to-policy` and `stay-in-control`; the pictures don't say what the copy says.
- **medium** — `ClientQuotes` (QuoteTabs) auto-advances, and has no prop to pin the selected tab or stop rotation; the reference is frozen on GPA. My screenshot lands on whichever tab is current at capture time.
- **medium** — The brief gives one quote per page, but `ClientQuotes` wants 3–6 items (and the reference shows six client tabs). I filled the other tabs with quotes that appear elsewhere in this job's copy (GPA, Contabilizei, GFG/Dafiti) or the WebKit carousel example (Axur), and a short mock line for Zoop and HeroSpark (no copy available). Flagged as mock.
- **medium** — `FaqSection` items require an `answer`; the reference ships questions only (all closed). Answers were assembled from sentences already on the page.
- **low** — `SiteNav` shows the Login button at phone width; the reference shows only "Start for free" + search there. No prop to hide the secondary action below `xl`.
- **low** — `SiteFooter` link items are `{label, href}` only: no way to mark "Our Community" as external (the reference has the ↗ icon).
- **low** — `HeroBand titleLength="long"` put the two-line H1 on one line at 1440 (the doc says "long widens its column so it breaks into two lines instead of three"). Default `short` gives the reference's two lines.
- **medium** — Lint (`webkit/authoring-standards`, strict preset that `init` installs and the husky hook enforces) rejects *any* comment in app code, including a one-line note explaining mock data. That rule is written for WebKit contributors; in a consumer app it blocks commits. Removed the comments.
- **high** — `vue-tsc` with TypeScript 6 (what `npm i -D typescript` installs today) cannot resolve any `@aziontech/webkit/<name>` import (TS2307 on every component). Pinned `typescript@~5.9`; then `vue-tsc --noEmit -p .` passes but `vue-tsc -b` (Vite template's default build script) still fails with TS2307 on every import. Changed the build script to `vue-tsc --noEmit -p . && vite build`. README only says "TypeScript (optional)… vue-tsc --noEmit checks it"; no supported TS version, no mention that `-b` mode breaks. ~15 min.
- **low** — `init` adds `import '@aziontech/icons'` to main.ts but that package has no types, so vue-tsc fails with TS2882; needed a one-line `declare module '@aziontech/icons'` shim.
- **medium** — Neither the `eslint.config.mjs` nor the `.stylelintrc.json` written by `init` ignores `dist/`, so after the first `npm run build` the husky pre-commit hook fails (49 ESLint errors on bundled WebKit JS, 521 stylelint errors on the bundled CSS — hex colours inside WebKit itself). Added `ignores` + `.stylelintignore`. Every consumer that builds before committing hits this.

## 14:57 Page 2 — site-product-ai-gateway (~25 min)
Used: `HeroBand kind=centered` with two actions + `carouselMarks` (all 30 stack marks resolved from the brand registry: `gcp` = Google Cloud, `workers-cloudflare` = Cloudflare Workers), `CapabilityGrid`, `MediaSplit` + `Diagram name="ai-gateway"`, `SectionModule` + `SectionTitle` + `Carousel` (carousel-root/item/previous/next) + `Overline`, `CodeSplit`, `ClientQuotes`, `PlatformDirectory`, `FaqSection` (real answers from the brief), `ClosingCallToAction`.
- **Worked well** — `CodeSplit` reproduces the reference code card (filename tab, line numbers, copy button, syntax colours, pixel texture) almost pixel for pixel from one `codeTabs` entry.
- **medium** — No section for the reference's "Use cases" band (title + prev/next arrows on the right, a sliding row of cards with an orange overline, heading and sentence). `UseCases` is a static 3-column frame with a title cell; `StickyCarousel` numbers its cards and has no overline; `UseCaseLinks` needs links. Composed `SectionModule` > `Carousel` > `CarouselItem` > `Overline` + h3 + p by hand. `Carousel` renders its controls *above the track* inside the body; they can't go into the `SectionModule` header `actions` slot (they need Carousel's context), so the arrows sit at the start, not at the end of the title row.
- **medium** — `SectionModule title=` renders a tall opener (~240 px) for a one-word title; the reference's header row is ~90 px. Used the `header` slot with `SectionTitle size=small padding=small`. `SectionTitle :framed="false"` drops all padding (title flush against the rule) — there is no "framed but compact" combination besides `padding=small`.
- **low** — The `carousel.md` example imports `@aziontech/webkit/carousel` and puts `class="w-[85vw] max-w-120 sm:w-120"` on `CarouselItem`; the lint shipped by the same package rejects the first (`prefer-tree-shakeable-root`) and the docs' own style-override rule forbids the `w-[85vw]`/`sm:` classes. Examples don't pass the package's own lint.
- **medium** — `Diagram name="ai-gateway"` is a tall vertical flow (App → Firewall → Functions → primary/fallback models), ~2× the height of the reference's horizontal hub (chatbots/agents → gateway → models/MCP/APIs). The asset `@aziontech/webkit/assets/ai-gateway.svg` is a different "radar" scene and is not in the `Illustration` registry. Kept the Diagram: right subject, wrong shape; the band is ~250 px taller than the reference.
- **low** — `MediaSplitBand` (the one-claim band) only takes `scene | image | illustration`, not a `Diagram`; had to drop to `MediaSplit` + `media` slot and pick `texture`/`textureFade`/`align` myself.

## 14:59 Page 3 — site-product-data-stream (~20 min)
Used: `HeroBand` (no client strip, `DOCS` secondary with chevron), `CapabilityGrid`, `SectionTitle` (eyebrow "Complete, not complex", size large), 3 × `MediaSplit` (alternating `kind`, `framed`, `texture=pixelate`) with `ProductWidget` `data-stream-source / -sampling / -connector`, `Ticker` in a `SectionModule`, `UseCaseLinks`, `ClientQuotes`, `PlatformDirectory`, `FaqSection`, `ClosingCallToAction`.
- **Worked well** — `ProductWidget` has exact Data Stream console mocks (source, sampling, connector). Discovered only through the `product-widget.md` prop union; `search "data stream"`-style discovery would not have found it.
- **medium** — The data-stream widgets are "fragments": `kind="window"`, `chrome`, `width`, `fade` are silently ignored ("a widget that does not declare one keeps its own value"), so they fill the whole media cell at full scale instead of the small framed console window the reference shows. They also carry fake collaborator cursors ("Bianca", "Diego") that are not in the reference and can't be turned off. Docs don't say which of the 70 widgets are framed vs fragments.
- **medium** — No section for "a run of media splits whose media is a console widget": `MediaSplitStack` takes only `image`/`illustration` and wants an `action` per band; `MediaSplitBand` takes `scene`/`image`/`illustration`. Composed `MediaSplit` × 3 by hand and alternated `kind` myself (no sticky stacking).
- **medium** — Integration logos: brand registry lacks Datadog, Google BigQuery, AWS S3, Splunk, Kinesis Firehose (some exist as asset SVGs, e.g. `datadog-symbol-color.svg`, but `Ticker` only takes registry names). Unregistered names render as typographic wordmarks, as documented — so the row mixes logos and words. `LogoWall` would take URLs but is a framed square grid, not a strip.
- **low** — `Ticker` has no "static/frozen" mode except reduced motion; the reference row is a frozen marquee.
- **low** — FAQ answers again absent from the brief; assembled from page sentences.

## 15:00 Page 4 — site-product-real-time-events (~10 min)
Same recipe as Data Stream (by now the template is fully mapped): `HeroBand`, `CapabilityGrid`, `ClientQuotes` (GFG/Dafiti quote first), `SectionTitle`, 4 × `MediaSplit` + `ProductWidget` (`real-time-events-log`, `real-time-events-filter`, `real-time-metrics-dashboard`, `real-time-events-volume`), `UseCaseLinks`, `FaqSection`, `ClosingCallToAction`. No platform directory on this page (matches the reference).
- **medium** — The reference's 3rd band shows Grafana + GraphQL logo tiles; no widget or illustration for "Grafana/GraphQL integration". Used `real-time-metrics-dashboard` (a dashboard mock) as the closest.
- **low** — The copy embeds "Docs: https://…" URLs inside paragraphs. `MediaSplit.description` is a plain string (no markdown, unlike `FaqSection`), so the URLs render as unlinked text — verbatim, but not clickable. Could have used the default slot with a `Link`, but that changes the copy.
- **low** — `ClientQuotes` has no quote-only variant (the reference's RTE quote band has no logo above the quote on the left); fine as is.

## 15:03 Wrap-up
- `npx @aziontech/webkit check`: 0 errors / 0 warnings after adding `WebkitProvider locale="en"` at the root and pinning the 8 `latest` devDependencies that `init` itself wrote.
- `npm run build` passes; `vite preview` serves `/`, every page route and an unknown path (SPA fallback) with 200. Runtime network requests are only the fonts `@aziontech/theme` references (fonts.azion.com, cdn.jsdelivr.net).
- Re-shot all four pages at the end (desktop + iPhone), no console errors. Desktop heights vs reference: SIA 6733/6879, AI Gateway 7308/6955, Data Stream 8110/8271, RTE 7432/7687.


---

# DONE — job S3b

## Pages
- `site-product-secure-internet-access`: **built** — the two media bands use the closest registry illustrations (`intent-to-policy`, `stay-in-control`), not the reference's policy diagrams (WebKit has none for SIA); FAQ answers built from page sentences (brief has questions only); quote tabs other than GPA hold mock or borrowed quotes.
- `site-product-ai-gateway`: **built** — the control-point band uses `Diagram name="ai-gateway"` (a vertical flow, ~250 px taller than the reference's hub picture); the "Use cases" carousel is hand-composed (`Carousel` + `Overline`), and its arrows sit above the cards, not on the right of the title row.
- `site-product-data-stream`: **built** — console mocks are `ProductWidget` fragments drawn full-cell (not the small framed windows of the reference); 5 of the 11 integration logos render as wordmarks (not in the brand registry); FAQ answers built from page sentences.
- `site-product-real-time-events`: **built** — the Grafana/GraphQL band uses `real-time-metrics-dashboard` (no Grafana/GraphQL art); "Docs: URL" text in the copy is not clickable; FAQ answers built from page sentences.
- `/` lists links to all four pages. Every page renders in dark theme (`<html data-theme="dark" class="dark">`).

## WebKit pieces used most
`SiteNav`, `SiteFooter`, `HeroBand` (kind `centered`, with `carouselMarks`), `SectionContainer` + `SectionGap hatch`, `CapabilityGrid`, `ClientQuotes`, `UseCaseLinks`, `PlatformDirectory`, `FaqSection`, `ClosingCallToAction` (split), `MediaSplit` + `ProductWidget` / `Diagram`, `MediaSplitStack`, `CodeSplit`, `SectionTitle`, `SectionModule`, `Carousel`, `Ticker`, `Overline`, `WebkitProvider`.

## Top 5 problems with WebKit (by impact)
1. **TypeScript toolchain breaks out of the box (high).** `vue-tsc` with TypeScript 6 can't resolve any `@aziontech/webkit/<name>` import. With TS 5.9, `vue-tsc --noEmit` works but `vue-tsc -b` (the default Vite build script) still fails on every import. I had to pin TS and rewrite the build script, and the docs name no supported TS version.
2. **Product art is missing for these products (high).** The `Illustration` and `Diagram` registries have nothing for Secure Internet Access, and nothing for Grafana/GraphQL. The `ai-gateway` diagram has a different shape from the site's. The Data Stream / RTE `ProductWidget`s are "fragments" that ignore `kind`/`chrome`/`width`/`fade` without warning, and they draw fake collaborator cursors.
3. **The generated lint and hook block normal commits (medium).** The ESLint and stylelint configs that `init` writes don't ignore `dist/`, so the husky pre-commit hook fails after the first build (on hex colours inside WebKit's own bundled code). The strict preset also bans every comment in app code. On top of that, `init` pins 8 deps as `latest`, which `doctor` then warns about, and webkit 5.12 declares theme `^4` while theme 5.2.2 ships alongside it, so two theme copies get installed.
4. **Common product-page bands have no section (medium).** There is no component for a carousel of overline cards with arrows in the title row, none for a run of media splits whose media is a widget or diagram (`MediaSplitStack`/`MediaSplitBand` take only image/illustration/scene), and no compact framed section header. I hand-composed all three.
5. **Discovery and registries are hard to navigate (medium).** `search "product page"` returns console blocks. Brand-mark names live only in `src/svg/brands/registry.ts`, and the registry lacks common integration marks (Datadog, Splunk, BigQuery, S3, Kinesis, Zoop). There are also no controls for site details: `ClientQuotes` auto-rotates with no way to stop it, `SiteNav` can't hide Login on phones, and footer links can't be marked external. Some doc examples fail the package's own lint (e.g. the `carousel` compound import).

## Build
`npm run build` passes (`vue-tsc --noEmit -p . && vite build` → `app/dist/`). `npx @aziontech/webkit check`: 0 errors, 0 warnings. `dist/` works as a static SPA when the server rewrites unknown paths to `index.html` (checked with `vite preview`: `/`, all four routes and an unknown path return 200). Git checkpoints are in `app/` (setup + one commit per page + final).

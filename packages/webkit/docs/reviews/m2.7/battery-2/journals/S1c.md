# S1c — builder journal and DONE (verbatim)

`JOURNAL.md` and `DONE.md` from job S1c, copied without edits.

---

# Journal — S1c (site solution pages with WebKit 5.12.0)

## 14:51 Setup
- Scaffolded Vite vue-ts, installed 3 tarballs + vue-router. `npx @aziontech/webkit init --yes` worked first time: wrote .claude rules/skills, eslint/stylelint, postcss, `src/webkit.css`, patched `src/main.ts`. Worked well. (low)
- `init` added devDeps as `"latest"` (eslint, stylelint, husky, …) — non-reproducible installs, and a `prepare: husky` script. **low**
- `init` note says theme defaults to LIGHT; dark needs `<html data-theme="dark">`. Clear. Will set it statically in index.html.
- `catalog.json` has no `components` array at top level (keys: imports, patterns, tokens…) — I expected a component list; the per-component data is in `catalog/components/*.json` and `llms/components/*.md`. Cost ~3 min. **low**
- `llms/llms.txt` is the best entry point: "Components: Marketing sections" lists almost every band these solution pages need. Worked well.

## 14:59 Finding the pieces
- `npx @aziontech/webkit search solution page` → **0 blocks**. No solution-page block/pattern exists, even though `llms.txt` describes several sections as "the … band of a solution page" (UseCaseLinks, TemplateGallery, ResourceGrid). I assembled the page from sections myself. **medium** (~10 min reading section pages to work out the order).
- Mapping reference → WebKit worked very well (all from `llms/components/*.md`): HeroWithOpening (hero + 3-col capability grid + hatched gap — exact match for template steps 1–2), MediaSplitStack (solutions rows, `Docs ›`), TemplateGallery, ClientQuotes, ComplianceBadges, PlatformDirectory, RecognitionMarquee, FaqSection, ClosingCallToAction `kind="primary"`, SiteNav, SiteFooter, SectionContainer/SectionGap. Big win.
- `examples/site-nav/site-default.json` has the real Azion mega-menu tree; reused it (adjusted Products to the 21 in the brief). Worked well.
- Docs of ComplianceBadges / RecognitionMarquee / ClientQuotes / MediaSplitStack use asset URLs like `/marketing-components/badges/soc.svg` that **do not exist** in a consumer app (they 404). Only by digging into `src/assets/site-assets.json` did I find the mapping to `@aziontech/webkit/assets/soc-symbol-color.svg`, which can be imported as a URL through Vite. Nothing in README/llms says how to serve them. **high** (~10 min).
- I did NOT read `node_modules/@aziontech/webkit/docs/reviews/…` (JOURNAL-B.md, FINDINGS.md from another evaluation run are shipped inside the package!). Shipping internal review notes in the npm tarball is a packaging bug. **low**
- Illustration registry names (MediaSplitStack `illustration`) are only discoverable by reading `src/assets/illustrations/registry.ts`; no list in llms. Picked closest names (`enable-owasp-protection-with-customizable-rules`, `implement-api-gateway-security`, `detect-and-classify`, `protect-financial-applications`). **medium**
- Brand mark names for ClientQuotes `mark` / TemplateGallery `tickerMarks` likewise only in `src/svg/brands/registry.ts`. **medium**

## 14:59 Build / tooling
- **TypeScript cannot resolve any WebKit import.** `vue-tsc -b` (Vite template: TS 6.0 + vue-tsc 3.3, `moduleResolution: bundler`) → `TS2307 Cannot find module '@aziontech/webkit/site-nav'` for every component: the exports map points at raw `.vue` files and ships no `.d.ts`. Downgrading TS to 5.9 did not help. README claims "vue-tsc --noEmit checks it under strict" — not true in a fresh Vite app. Workaround: ambient `src/webkit-modules.d.ts` (`declare module '@aziontech/webkit/*'` → DefineComponent; `'@aziontech/webkit/assets/*'` → string). Loses all prop typing. **high** (~15 min).
- TS 6 also errors on the side-effect `import '@aziontech/icons'` (TS2882) — went away on TS 5.9. **low**
- `init` installs a husky pre-commit running `npx eslint .` but the generated `eslint.config.mjs` has **no ignores**, so it lints `dist/` (50 errors on WebKit's own bundled hex colours) and blocks the commit. Also lints the Vite template's `// https://vite.dev/config/` comment as an error. Added `{ ignores: ['dist/**','node_modules/**'] }`; scoped the hook's stylelint glob to `src/` (the `**/*` glob ran >3 min). **high** (~10 min).
- `cp`/`rm` interactive aliases on this box ate a few minutes — not WebKit.

## 14:59 Financial services page — built
- Shot it: page height 7936 vs ref 8207; every band lines up with the reference (hero, 3-col grid, 4 media rows with orange pixel texture, quote, compliance grid, directory, marquee, FAQ, orange CTA, footer).
- Overline cursor after eyebrows renders **blue**: `overline.vue` paints it `bg-(--accent)` and the theme's `--accent` is `#0072F5`. Brief says orange, but the reference iPhone shot (retail, "Compatible with your stack") shows the same blue cursor, so this matches production. **Not a gap** (corrected at retail step).
- ClientQuotes with one quote shows a single logo cell + an empty wall. Reference shows 6 client tabs (GFG, Axur, Zoop, HeroSpark, Contabilizei, GPA). pages.json only has the Dafiti quote; I added Axur, Zoop, HeroSpark and Contabilizei using the Azion quotes shipped in WebKit's own ClientQuotes example. No GPA quote anywhere, so 5 tabs instead of 6. Decision recorded. **low**
- pages.json lists only FAQ questions; FaqSection needs `answer`. Wrote short mock answers. (content gap, not WebKit)
- SiteFooter: "Our Community ↗" — link items have no external flag, so no ↗ icon. **low**
- SiteNav on iPhone shows Login + Start for free; reference shows only Start for free. No prop for this. **low**
- Icons in PlatformDirectory: picked `ai ai-*` names from `@aziontech/icons/dist/azionicons.css` (no searchable icon catalog in the llms docs). **low**

## 15:00 Technology page — built
- Same template; illustrations `saas-platforms`, `distributed-apis`, `ai-applications`, `intent-to-policy` (no AI-gateway illustration in the registry even though `src/assets/illustrations/ai-gateway.svg` exists — it is not registered). **low**
- ClientQuotes → QuoteTabs **autoplays and ClientQuotes exposes no `autoplay` prop** (QuoteTabs has `autoplay`, the section doesn't forward it). With the extra 4 client quotes the screenshot froze on the Axur quote, i.e. the page showed copy that isn't in the brief. Reverted to the single Dafiti quote (wall = 1 cell, reference shows 6). **medium** (~10 min)
- Height 8050 vs ref 8096. Layout matches band for band.

## 15:01 Retail page — built
- Hero: HeroWithOpening with 6 items lays out 3×2 exactly like the reference.
- TemplateGallery: 8 cards, scrolling wall with fade, ticker of 30 marks — all 30 frameworks/clouds exist in the brand registry. Visually near-identical to the reference. Big win.
- Only diff found: primary "Deploy now" needed `trailing: true` for the chevron (my miss, not WebKit).
- Template card icons: `ai ai-astro/azion/react/eleventy/gatsby/hugo/jekyll/next` from `@aziontech/icons`. The example uses `ai-cor ai-next` (colour font) — unclear when to use `ai` vs `ai-cor`; no doc on it. **low**
- pages.json tree was truncated after the FAQ ("full tree in structure/site-solution-retail.txt", which isn't in the job folder); the reference tiles show the same closing CTA as the other pages, so I used it.
- Height 9607 vs ref 9805.

## 15:03 Final checks
- `npx @aziontech/webkit check` initially: **2 errors** — it flags my ambient `declare module '@aziontech/webkit/*'` shim as "not exported". So the TS workaround the package forces on me is itself rejected by the package's CI gate. Moved the shim to tsconfig `paths` (`@aziontech/webkit/assets/*` → string d.ts, `@aziontech/webkit/*` → DefineComponent d.ts); check passes, build passes, but still no prop types. **high**
- `check` doctor warned: no `WebkitProvider` → added `<WebkitProvider locale="en">` at the root. The doctor also warns about the 8 devDeps that **`init` itself** wrote as `"latest"`; pinned them to the versions it suggested. `init` and `doctor` disagree with each other. **medium**
- Final: `webkit check` 0 errors / 0 warnings; `npm run build` passes; `vite preview` serves `/`, `/site-solution-retail` and an unknown path from index.html (SPA fallback).
- UseCaseLinks (home index) draws an external ↗ arrow even on in-app links. **low**
- Final shots: financial 7936/8207, technology 8013/8096, retail 9607/9805 (desktop px, ours/ref).

## What worked well
- Sections cover the whole solution-page template; the page is about 60 lines of template + data. HeroWithOpening, MediaSplitStack, TemplateGallery, ComplianceBadges, PlatformDirectory, RecognitionMarquee, FaqSection, ClosingCallToAction `primary` came out pixel-close with zero styling from me.
- `llms/llms.txt` + per-component md (props table + example) was enough to use every section first time.
- Dark theme via `data-theme="dark"` on <html> just worked.


---

# DONE — S1c

## Pages
- `site-solution-financial-services`: **built**. Missing: client-quote wall shows 1 logo tab, not 6 (only the Dafiti quote is in the brief, and ClientQuotes autoplays); FAQ answers are mock text (the brief gives questions only); the footer's "Our Community ↗" has no external icon; illustrations are the closest ones in the WebKit registry, not the exact production art.
- `site-solution-technology`: **built**. The same gaps as financial services. The SaaS and AI-agent illustrations differ from production.
- `site-solution-retail`: **built**. Same quote, FAQ and footer gaps. The template gallery, ticker and 3×2 capability grid match the reference.
- `/`: an index of links to the three pages (HeroBand + UseCaseLinks).

## WebKit pieces used most
SiteNav, SiteFooter, HeroWithOpening, SectionContainer (`max-width="site"`), SectionGap (`hatch`), MediaSplitStack, ClientQuotes, ComplianceBadges, PlatformDirectory, RecognitionMarquee, FaqSection, ClosingCallToAction (`kind="primary"`), TemplateGallery (retail), WebkitProvider, HeroBand + UseCaseLinks (index). Assets: `@aziontech/webkit/assets/*.svg` (badges, analyst logos), brand-mark and illustration registry names, and `@aziontech/icons` `ai`/`pi` glyphs.

## Top 5 problems with WebKit, by impact
1. **No TypeScript types reach a consumer.** The exports map points at raw `.vue` files, so `vue-tsc -b` in a fresh Vite vue-ts app fails with TS2307 on every import (tried TS 6.0 and 5.9). The README says it type-checks. I needed a shim, and the first shim (an ambient `declare module`) was then rejected by `webkit check`. I ended up with tsconfig `paths` stubs, which means no prop typing at all.
2. **`init` scaffolding breaks the first commit.** The husky pre-commit runs `eslint .` with no `dist/` ignore, so WebKit's own bundled hex colours fail the lint. The Vite template comment counts as a lint error, the `**/*` stylelint glob runs for minutes, and devDeps are written as `"latest"`, which `doctor` then warns about.
3. **Asset paths in the docs 404.** The ComplianceBadges, RecognitionMarquee, ClientQuotes and MediaSplitStack docs use `/marketing-components/...` URLs that a consumer app doesn't serve. The real mapping (`@aziontech/webkit/assets/...`) is only in `src/assets/site-assets.json`.
4. **Registries aren't documented.** Illustration names, brand-mark names and icon names can only be found by reading `src/**/registry.ts` and the icon CSS. Some assets are shipped but not registered (for example the `ai-gateway` illustration).
5. **No solution-page block, and the sections leave out props.** `search solution page` returns 0 blocks, so I assembled the page by hand. ClientQuotes doesn't pass on QuoteTabs' `autoplay`, so the quote shown at capture time isn't deterministic. SiteNav can't hide Login on mobile, and SiteFooter links can't be marked external.

Also: the npm tarball ships `docs/reviews/m2.7/run-1/` (internal review notes from another evaluation run). I did not read them.

## Build
`npm run build` (vue-tsc -b && vite build) **passes**. `npx @aziontech/webkit check` reports 0 errors and 0 warnings. `dist/` works as a static SPA (checked with `vite preview`: `/`, `/site-solution-retail` and an unknown path all serve the app). Dev server stopped. Git: 5 commits (setup, one per page, final).

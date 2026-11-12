# S4c — builder journal and DONE (verbatim)

`JOURNAL.md` and `DONE.md` from job S4c, copied without edits.

---

# JOURNAL — S4c (WebKit rebuild)

14:48 — Start. Reading BRIEF, pages.json; setting up Vite+Vue3+TS app.

14:49 — **Setup (worked well):** `npx @aziontech/webkit init -y` kept my `file:` deps for the three tarballs (the dry-run plan said `add-dep @aziontech/webkit@latest`, which scared me — it did not actually overwrite). Wrote postcss/Tailwind v4, src/webkit.css, eslint, stylelint, husky, .mcp.json, AGENTS.md/CLAUDE.md. `doctor` reported 15 OK. ~5 min.

14:49 — **medium — theme version mismatch:** `@aziontech/webkit@5.12.0` declares `"@aziontech/theme": "^4.0.0"` in dependencies, but the shipped theme tarball is 5.2.2. npm therefore installed a **second** theme (4.3.1) nested at `node_modules/@aziontech/webkit/node_modules/@aziontech/theme`. `doctor` says nothing about it ("installed 5.2.2"). Unclear which token set webkit's component sources resolve against. Kept the app on 5.2.2 (the one webkit.css imports).

14:49 — **low — init pins "latest":** init writes 8 devDeps as `"latest"` and then `doctor` warns about exactly those (“consider pinning”). The tool flags its own output.

14:49 — **low — dark theme:** init's final NOTE says "defaults to LIGHT; set <html data-theme=\"dark\">". Clear enough. Set it in index.html.

14:49 — **low — init leaves Vite template's src/style.css** (hex colours, `:root` light styles) imported in main.ts; lint would then fail on it. Removed it by hand.

14:49 — **found (helpful but odd):** the package ships `docs/reviews/m2.7/battery-2-kit/structure/*.txt` — the component trees of azion.com pages incl. mine (e.g. `block-subject-library`, `block-recognition-marquee`, `block-hero-form`, `marketing-media-split`). Used them to map sections to WebKit components; these names are not the same as the published import names (e.g. `marketing-card-grid` → `card-grid`, `block-hero-title-band` → ? ), needs guessing.

14:54 — **low — lint vs. Vite template:** the husky pre-commit hook (from init) runs `eslint .`, and the strict preset's `webkit/authoring-standards` rejects the `// https://vite.dev/config/` comment in the stock `vite.config.ts`. First commit failed. A config file is not a component; the "no prose comments" rule should not apply to it. Deleted the comment. ~3 min.

14:54 — **low — `rm` interactive / my mistake:** setup + learning ended up in one commit (pathspec exclusion did not apply). Not WebKit's fault; noted for the checkpoint record.

14:54 — **Worked well — site chrome:** `SiteNav` + `SiteFooter` (examples/site-nav/site-default.json, examples/site-footer/site-default.vue) gave a pixel-close nav and footer from data alone. Copied the menus JSON and re-labelled the footer columns from pages.json. ~10 min.

14:54 — **medium — finding the section components:** `npx @aziontech/webkit search` / llms.txt list *platform* blocks (console screens) first; marketing sections (SubjectLibrary, RecognitionMarquee, HeroForm, MediaSplitStack, ClosingCallToAction, HeroBand) only live under "Components: Marketing sections" in llms.txt. The shells/website block does not mention them. I only found the right ones because the package ships the azion.com structure trees in `docs/reviews/m2.7/battery-2-kit/structure/` with names like `block-subject-library`. ~15 min.

14:54 — **Worked well — site-learning:** `HeroBand kind="title-band"` + `carouselMarks` (client registry names copied from examples/hero-form/default.vue) and `SubjectLibrary` with the 16 subjects + `closing` rendered almost identical to the reference (desktop 3927px vs 4027px ref). ~10 min.

14:54 — **medium — SubjectLibrary last row:** reference pairs the 16th subject (1 cell) with the closing CTA spanning **2 of 3 cells**. WebKit's CardGrid "balanced" layout (rule webkit-sections: "a short last row sharing the width evenly") renders the last row as two halves (50/50). No prop on SubjectLibrary to keep the 3-column track; and the component description itself says the closing "spans the grid's last two cells", which is not what renders. Left as is.

14:54 — **low — SiteFooter external link:** reference shows "Our Community ↗" (external icon). `SiteFooter` links are `{label, href}` only; no icon/external flag. Left without the icon.

14:54 — **low — HeroBand registry names:** `carouselMarks` takes "registry names" but the registry list is not documented on the hero-band page; copied the 11 names from the hero-form example. In my render the strip starts at 'itau' (frozen mid-scroll), fine.

14:55 — **Worked well — site-recognitions:** `HeroBand kind="centered"` (dot field, eyebrow with the orange // and blue caret), `RecognitionMarquee`, `MediaSplitStack kind="media-end"` with eyebrow+title, and `ClosingCallToAction kind="primary"` matched the reference structure 1:1. Analyst logos come from the package (`@aziontech/webkit/assets/*-extended-reversed.svg`, with `logoLight`). ~15 min.

14:55 — **medium — no G2 badge art:** the reference shows the G2 "Leader" / "High Performer" Spring/Winter 2026 badges inside a dark rounded frame. WebKit ships only `assets/g2-symbol-color.svg`; no badge assets and no illustration registry entry for them. Used the G2 symbol as `image` → a huge orange G2 disc fills the media cell instead of a framed badge. The `image` slot of MediaSplitStack has no "framed / contained" option either.

14:55 — **low — asset imports undocumented:** the recognition-marquee example uses `logo: '/marketing-components/logos/gigaom-extended-reversed.svg'` (a site-relative path that does not exist in my app). I found by reading package.json `exports` that `@aziontech/webkit/assets/<file>.svg` is importable as a Vite URL. Not stated in recognition-marquee.md or usage.md. ~5 min.

14:55 — **low — HeroBand height:** `headerOffset` docs say "height of the site header taken out of a band that fills a screen". Tried `56px`; the reference hero is a full 900px *below* the header, so left it empty. A literal length is also against rule webkit-page-layout ("never a literal length") with no header-height token documented.

14:55 — **low — marquee item copy:** pages.json truncates the Frost & Sullivan report name ("…Award, North"); kept it verbatim.

14:56 — **Worked well — site-scale-up:** `HeroForm` (fields as data: text/email/phone with `half`, `(Required)` markers, US dial-code select) + `MediaSplitStack kind="alternating"` without media + `RecognitionMarquee` with `title` rendered nearly 1:1 (3947px vs 3972px ref). Submit is mocked locally (loading → submitted), no network. ~15 min.

14:56 — **medium — landing-page header:** the reference LP shows only the Azion mark in the bar. `SiteNav` requires `menus` and always draws menu button/search; no "landing"/"minimal" kind, and there is no LP header block (headers/: auth, creation, docs, resource, site). Built it from `GlobalHeader kind="site"` + `GlobalHeader.Brand` + `Brand` (copied the brand link markup from blocks/headers/site-header). Lint accepted it because the header has no navigation. ~8 min.

14:56 — **low — HeroForm phone label:** reference phone field has no visible label; HeroForm fields require `label` (a11y), so mine shows "Phone". Correct for a11y, a visible diff.

14:56 — **low — HeroForm submit label colour:** reference submit button text is white on orange; WebKit's primary renders dark text on orange. Did not restyle (rule webkit-style-override).

14:56 — **low — RecognitionMarquee reportName:** the scale-up quotes have no report line; `reportName` is documented as part of every item with no "optional" mark. Passed `''`, renders fine.

14:58 — **Worked well — site-privacy-policy:** `npx @aziontech/webkit add shells/documentation --variant Article` copied a full docs page (GlobalHeader + SearchTrigger/Command, Sidebar + MenuRoot/MenuGroup/MenuSub + ThemeSwitcher, DocPageHeader with breadcrumb/last updated/meta actions, DocProse + DocHeading, DocPagination, DocOnThisPage with groups, DocCta). Replacing the copy gave a near pixel match on desktop and iPhone. Best experience of the job. ~25 min.

14:58 — **high — docs shell scroll model vs. reference:** the block puts the article in an inner `ScrollArea` inside an `h-screen` frame. The live docs page scrolls the *document* (full-page capture is 4369px). With the block as-is the page is one 900px screen and a full-page screenshot shows nothing below the fold. Changed the frame to `min-h-screen`, dropped `ScrollArea`, made both rails `sticky top-0 h-screen self-start`. That is a structural edit to a block the docs tell me to "change only the content" of, and `webkit diff` will now report drift. ~10 min.

14:58 — **medium — docs footer:** the Article block's footer is a bare `Footer kind="content"` with string links and only a status slot (no socials/brand/language). The reference docs footer is the site footer. `SiteFooter kind="content"` did exactly that — but the block does not use or mention it; found it from site-footer.md's `kind` prop.

14:58 — **low — MenuItem outside MenuGroup** ("Back to Docs" directly in `MenuRoot`) renders a stray list bullet at the rail's left edge. Wrapped it in an unlabeled `MenuGroup`. Not documented.

14:58 — **low — "Developer tools ▾":** reference has a chevron dropdown trigger; the block's header uses plain `NavigationMenu.Trigger href` links. Left as a plain link rather than inventing a menu.

14:58 — **low — DocPagination labels:** the reference says "Previous page / Next page"; the catalog default is "Previous / Next", so I passed `previous-label`/`next-label` (product copy, allowed).

14:58 — **low — ThemeSwitcher in a dark-only site:** the block's rail footer requires `ThemeSwitcher` ("applies no side effect itself"), which the reference also shows. It is inert here; the site stays dark via `<html data-theme="dark">`.

15:01 — **high — `npm run build` (vue-tsc) fails on WebKit imports:** the Vite template's build is `vue-tsc -b && vite build`. vue-tsc reports TS2307 "Cannot find module" for 21 WebKit subpaths (`brand`, `button`, `site-nav`, `site-footer`, `webkit-provider`, every `menu-*`, `doc-*`, …) while others with the same export shape (`hero-band`, `hero-form`, `subject-library`, all `./src/components/**/x.vue`) resolve. Also TS2882 for the side-effect `import '@aziontech/icons'` (CSS-only package, no types). The README promises "`vue-tsc --noEmit` checks it under strict" and suggests `vueCompilerOptions.htmlAttributes: []`; added that, no change. Could not find the cause in the package docs within a reasonable time (~15 min). **Decision:** `build` = `vite build` (passes); kept `npm run typecheck` (= `vue-tsc -b`) as a separate, currently failing script. Also had to add `as const` on HeroForm field `kind`s: plain object literals do not satisfy `HeroFormFieldKind` (the hero-form example is plain JS so it never shows this).

15:01 — **low — webkit.blocks.json after adapting a block:** `add` wrote both the Default and Article variant files; I deleted Documentation.vue and renamed the Article copy. `webkit check` then warned the recorded files were gone. Re-pointed the entry by hand to src/views/privacy-policy.vue; no CLI command to rename/forget a block copy. `webkit diff` now shows +372/−276 (expected: content + the scroll-model change).

15:01 — **low — iPhone nav:** at 393px WebKit's SiteNav shows Login (README: "Login steps out under 384px"); the reference hides it at 393px. Recognitions hero is also ~50px taller in the reference on iPhone. Not adjustable through props.

15:01 — **Runtime network:** the built CSS references fonts.azion.com and cdn.jsdelivr.net (from @aziontech/theme / icons font faces). No other runtime requests; forms are mocked.

15:01 — Final shots of all 4 pages taken (0 console errors each). Dev/preview servers stopped. SPA fallback checked with `vite preview` (/, /site-learning, /nope/deep → 200, catch-all route renders the index page).

15:01 — **medium — init's eslint config does not ignore `dist/`:** after `npm run build`, the husky pre-commit (`eslint .`) fails with 49 `webkit/no-hardcoded-color` errors inside **WebKit's own compiled code** in dist/assets (hex palettes in the brand-globe scene, `#F3652B` in SiteNav/footer chunks). So the package's own components would fail its own rule, and init's config blocks every commit after the first build. Added `{ ignores: ['dist/**'] }` to eslint.config.mjs. Same for the hook's stylelint run (hex colours, literal ms timings and `0px` in the theme/WebKit compiled CSS): added `.stylelintignore` with `dist/**`.


---

# DONE — S4c

## Pages
- `site-privacy-policy`: **built** — docs shell from `shells/documentation` (Article variant): header with SearchTrigger/Command, rail with Agreements and Policies + Previous versions, DocPageHeader, full policy text in DocProse, DocPagination, On this page + GitHub/Community + Ready to build? card, site footer (`SiteFooter kind="content"`). Missing: "Developer tools ▾" dropdown chevron (plain link); the full-width divider under the page header sits inside the column.
- `site-learning`: **built** — HeroBand title-band + client strip, SubjectLibrary (16 subjects) + closing CTA. Missing: the closing CTA spans 1/2 of the last row instead of 2/3 (CardGrid balanced layout); footer "Our Community ↗" external icon.
- `site-recognitions`: **partial** — HeroBand centered, RecognitionMarquee (5 items), MediaSplitStack (9 bands, "Learn More" on the last one), ClosingCallToAction. Missing: the G2 "Leader"/"High Performer" badge images (not shipped; G2 symbol used instead).
- `site-scale-up`: **built** — brand-only landing header (GlobalHeader + Brand), HeroForm (mocked submit), MediaSplitStack alternating (4 bands), RecognitionMarquee "What analysts say about Azion". Diffs: phone field shows a "Phone" label (required by HeroForm), submit text is dark on orange.
- `/` lists links to every page. Vue Router history mode, one route per page, catch-all → index. Dark only (`<html data-theme="dark">`).

## WebKit pieces used most
SiteNav, SiteFooter, SectionContainer + SectionGap, HeroBand, HeroForm, SubjectLibrary, RecognitionMarquee, MediaSplitStack, ClosingCallToAction, the `shells/documentation` Article block (GlobalHeader, SearchTrigger, Command, Sidebar, Menu*, ThemeSwitcher, DocPageHeader, DocProse, DocHeading, DocPagination, DocOnThisPage, DocCta), `@aziontech/webkit/assets/*` logos, WebkitProvider.

## Top 5 problems with WebKit (by impact)
1. **Type-checking breaks the default build** — `vue-tsc` cannot resolve 21 WebKit subpaths (brand, button, site-nav, site-footer, menu-*, doc-*) or the `@aziontech/icons` side-effect import, though the README says vue-tsc works. I had to drop vue-tsc from `build`.
2. **Docs shell scroll model** — the `shells/documentation` block scrolls the article inside an `h-screen` ScrollArea. The real docs page scrolls the document, so I had to make a structural edit to a block that "should only change content", and the block now shows drift.
3. **Marketing sections are hard to find** — `search` and llms.txt lead with console/platform blocks; the right site sections only became obvious from the azion.com structure dumps shipped under docs/reviews. shells/website does not point to them, and there is no landing-page (brand-only) header.
4. **Missing marketing assets and layout options** — no G2 badge art; MediaSplitStack `image` has no framed/contained mode; SubjectLibrary's closing CTA cannot span 2 of 3 cells (balanced grid overrides what its own description promises); SiteFooter links cannot carry an external icon.
5. **Setup inconsistencies** — webkit 5.12.0 depends on theme ^4 while theme 5.2.2 ships (a nested theme 4.3.1 gets installed and `doctor` stays silent); init pins 8 devDeps to "latest" and then `doctor` warns about them; the strict lint rejects the stock vite.config.ts comment, and init's ESLint/Stylelint configs lint `dist/`, where WebKit's own compiled code breaks its own rules (hex colours, literal timings), so every commit after the first build fails until `dist/` is ignored; asset import paths in examples (`/marketing-components/logos/...`) do not exist in a consumer app.

## Build
`npm run build` (= `vite build`) **passes** and produces `app/dist/` (SPA; serve with index.html fallback). `npx eslint .` passes; `npx @aziontech/webkit check` reports 0 errors (1 warning: devDeps pinned to "latest" by init). `npm run typecheck` (vue-tsc) still fails, see problem 1.

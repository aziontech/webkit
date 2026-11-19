# Docs site architecture review — 2026-11-19

Research and specification only. No product code changed. Checked on `feat/webkit-ai-ready`
at `7f6e27ca7`, against the live build on `http://localhost:4413` (same commit), at 1920, 1280
and 390 px wide.

The owner raised four issues about the WebKit docs site (`apps/docs`). This document finds the
root cause of each, says what the right fix is, and says what check stops it from coming back.

A few words used below:

- **Route shell**: the small Vue file behind one URL (`src/pages/*.vue`). Its only job should be
  to load the page's data and hand it to WebKit components.
- **DocMarkdown**: the WebKit component (`@aziontech/webkit/doc-markdown`) that turns a Markdown
  file into WebKit components. It understands Markdown plus tags such as `<Steps>`, `<Tabs>`,
  `<Note>`, `<CodeGroup>`, `<CardGroup>` (the same tag set Mintlify uses).
- **`doc-*` components**: the WebKit components made for documentation pages
  (`packages/webkit/src/components/docs/`): `DocLayout`, `DocPageHeader`, `DocProse`,
  `DocSteps`, `DocCallout`, `DocCodeGroup`, `DocCardGroup`, `DocTableOfContents`…
- **Guard**: an automatic check (a test, a lint, a CI job) that fails when the mistake comes back.

## Summary

| #   | Item                    | Root cause                                                                                                                                                                                                                                                                           | Fix                                                                                                                                                                                                                                                                            | Guard                                                                                                                                                                                                                          | Effort |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 1   | Non-WebKit components   | The site was built before `DocMarkdown` and the `doc-*` set existed. It has its own Markdown pipeline (markdown-it → HTML string → `innerHTML`), its own Shiki code styling in a CSS file, and 24 local `.vue` files. Nothing forbids local components.                              | Render every page through WebKit only: `DocLayout` as the shell, `DocMarkdown` for all Markdown, and seven new `doc-*` components for what is missing (Do/Don't, API table, live example, block preview, token table, color explorer, icon gallery). Delete `src/components/`. | New rule `docs-site` + a test in `pnpm test:docs` (already in CI) that fails on a local component folder, an import that is not `@aziontech/webkit/*`, `innerHTML`, custom CSS, or a Markdown tag `DocMarkdown` does not know. | L      |
| 2   | Foundations as Markdown | Foundation pages are a Vue registry (`lib/foundations.ts`) that glues hand-written Vue views (token tables, explorer, icon grid, demos) above a Markdown rule. Only the prose is Markdown.                                                                                           | Yes, every page can be Markdown. Each foundation becomes one `.md` file with frontmatter; live parts become tags bound to published data (`<TokenTable group="bg" />`, `<IconGallery />`, `<Example name="…" />`). Nothing blocks it.                                          | Same test: every route's body is a `DocMarkdown` source; `lib/foundations.ts` is gone; the nav is built from frontmatter.                                                                                                      | L      |
| 3   | Home container          | Each route picks its own padding and width. The home uses `Hero` + `Container max-width="7xl"` with a frame; the other pages use `px-(--spacing-md) lg:px-(--spacing-xl)` with no cap at all, plus a hand-written `max-w-4xl` on Markdown. No route uses the theme's layout classes. | One container for every route, owned by `DocLayout`: `layout-boundary` + `layout-column-content` (876 px), section gap `--layout-section-gap`. Pages render only their body.                                                                                                   | A visual geometry test in `apps/visual` that opens every docs route at 390 / 768 / 1280 / 1920 and fails when the content column's left edge or width differs from the home page's.                                            | M      |
| 6   | "View as Markdown" icon | `@aziontech/icons` has no Markdown icon, so the action was given the generic `az az-file`, copied by hand into four pages.                                                                                                                                                           | Add `az-markdown` (the Markdown mark) through `/icons-add`. Give `DocPageHeader` one `markdownHref` prop that renders the standard action with `az az-markdown` and the localized label. Remove the four copies.                                                               | `doc-page-header.test.ts` asserts the action uses `az az-markdown`; the docs-site test fails on `viewMarkdown` next to any other icon.                                                                                         | S      |

My recommended order: **6 → 3 → 1 + 2 together.** Item 6 is small and independent. Item 3 is
done by adopting `DocLayout`, which item 1 needs anyway. Items 1 and 2 are one migration: moving
the pages to `DocMarkdown` is what removes the local components.

---

## 1. Non-WebKit components on the docs site

### Evidence

**The Markdown pipeline is not WebKit.** `apps/docs/plugins/content.ts` renders every Markdown
file at build time with `markdown-it` and Shiki (`markdown()`, lines 104–132), cuts the result
into HTML strings (`markdownParts()`, lines 237–309), and the page injects those strings with
`innerHTML`:

- `apps/docs/src/components/raw-html.vue:6`: `h(props.tag, { class: 'docs-html', innerHTML: props.html })`
- `apps/docs/src/components/markdown-parts.vue`: wraps each HTML string in `DocProse` + `RawHtml`.

`DocMarkdown` is never used by the site (`grep -rn DocMarkdown apps/docs` finds nothing). So a
Markdown page can only be headings, paragraphs, lists, tables and code: there is no way to show
`<Steps>`, `<Tabs>`, `<Note>`, `<CodeGroup>` or `<CardGroup>`, and no inline `<Tooltip>`
(`DOC_MARKDOWN_INLINE_TAGS` in `parse-doc-markdown.ts`), so a term cannot carry its explanation on
hover the way it can on the Azion docs. The Getting started page
(`packages/webkit/README.md`) has 10 numbered install steps that render as a plain list, where
`DocSteps` exists for exactly that.

**Code blocks are not WebKit's `CodeBlock`.** The site highlights with its own Shiki instance
(`content.ts:24–42`) and styles the result with hand-written CSS in
`apps/docs/src/styles/main.css:21–79` (`.docs-code .shiki`, `.docs-html pre.shiki`, colors via
`--shiki-light` / `--shiki-dark`). WebKit's `CodeBlock` has its own highlighter
(`packages/webkit/src/components/code/code-block/lib/highlight-code.ts`). The two look and behave
differently (copy button, line numbers, header, wrapping). This CSS file also breaks
`.claude/rules/styling.md` ("no CSS declared for one component").

**24 local components.** Every file under `apps/docs/src/components/`:

| Local file                                                                                         | What it does                                                             | Replace with                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs-shell.vue`                                                                                   | Header, sidebar, drawer, footer, search, built by hand                   | `DocLayout` (exists: header, nav rail, drawer, outline, search palette, footer slot)                                                                                                                                              |
| `side-nav.vue`                                                                                     | Sidebar tree                                                             | `DocLayout` `navigation` prop (exists)                                                                                                                                                                                            |
| `search-command.vue`                                                                               | ⌘K palette                                                               | `DocLayout` search palette + `search` slot (exists)                                                                                                                                                                               |
| `table-of-contents.vue`                                                                            | "On this page"                                                           | `DocLayout` outline / `DocTableOfContents` (exists)                                                                                                                                                                               |
| `markdown-parts.vue`, `raw-html.vue`                                                               | Markdown HTML via `innerHTML`                                            | `DocMarkdown` (exists)                                                                                                                                                                                                            |
| `code-view.vue`                                                                                    | Highlighted source + copy                                                | `CodeBlock` / `DocCodeGroup` (exist)                                                                                                                                                                                              |
| `tokens/inline-code.vue`                                                                           | Turns `` `x` `` into `<code>`                                            | Markdown backticks inside `DocMarkdown` (exists)                                                                                                                                                                                  |
| `tokens/architecture-intro.vue`                                                                    | Three cards, "Primitives → Theme → Semantic"                             | Plain Markdown: `<Steps>` or `<CardGroup>` (exist)                                                                                                                                                                                |
| `card-index.vue`                                                                                   | Filterable card list (Foundations, Blocks indexes)                       | A route shell composing `DocPageHeader` + `Input` + `DocCardGroup` (exist); no component of its own                                                                                                                               |
| `component-grid.vue`                                                                               | Components index with live first example                                 | Route shell composing `DocCardGroup` + **`doc-example`** (new, compact mode)                                                                                                                                                      |
| `do-dont.vue`                                                                                      | Do / Don't pair (owner decision B28)                                     | **`doc-do-dont`** (new), tag `<DoDont>`; `DocMarkdown` also builds it from adjacent `## Do` / `## Don't` headings                                                                                                                 |
| `api-table.vue`                                                                                    | Props / events / slots tables                                            | **`doc-api-table`** (new), tag `<ApiTable component="button" />`                                                                                                                                                                  |
| `example-card.vue`, `live-preview.vue`                                                             | Live example + its source                                                | **`doc-example`** (new), tag `<Example name="button/variants" />` (like shadcn's `ComponentPreview`)                                                                                                                              |
| `block-frame.vue`                                                                                  | Block in an iframe with 375 / 768 / 1280 / full widths and a drag handle | **`doc-block-preview`** (new), tag `<BlockPreview id="auth/auth-sign-in" />`                                                                                                                                                      |
| `tokens-view.vue`, `tokens/token-table.vue`, `tokens/token-sample.vue`, `tokens/motion-sample.vue` | Token tables with samples (the README's "token table pattern")           | **`doc-token-table`** (new), tag `<TokenTable group="bg" />`                                                                                                                                                                      |
| `tokens/color-playground.vue`, `tokens/palette-strips.vue`                                         | Color explorer and primitive palette strips                              | **`doc-color-explorer`** (new), tags `<ColorExplorer />` and `<ColorExplorer view="palette" />`                                                                                                                                   |
| `icons-view.vue`                                                                                   | Searchable icon grid                                                     | **`doc-icon-gallery`** (new), tag `<IconGallery />`                                                                                                                                                                               |
| `foundation-demo.vue`                                                                              | Language, direction and devices demos                                    | Ordinary examples in `packages/webkit/examples/` shown with `<Example name="…" />`. Today it imports a block by a relative path that leaves the package (`../../../../packages/webkit/blocks/auth/auth-sign-in/auth-sign-in.vue`) |

Also outside `components/`: `styles/main.css` (custom CSS, see above) and the Shiki and
markdown-it code in `plugins/content.ts`.

### Root cause

The docs site was built first, as an app with its own parts, before WebKit had `DocMarkdown`
and most of the `doc-*` components. When those arrived (so the same content could render in apps, the Azion docs and the site),
nobody moved the site onto them, and nothing required it:
`apps/docs/eslint.config.js` only reuses the root config, and no test looks at what the site
imports. So the site kept two ways of doing everything: its own and WebKit's. The site that is
meant to show WebKit is the one place WebKit's docs components are not used.

### Correct fix

My recommendation: **the docs site renders only WebKit.** The app keeps route shells and data
loading; everything a reader sees comes from `@aziontech/webkit/*`.

1. **Shell.** Replace `docs-shell.vue`, `side-nav.vue`, `search-command.vue` and
   `table-of-contents.vue` with `DocLayout` in `app.vue`. The nav tree, section links and search
   items come from `lib/nav.ts` data passed as props.
2. **Markdown.** Delete the markdown-it / Shiki pipeline and `raw-html.vue`. The `?markdown`
   import returns the raw source (plus frontmatter) and the page renders `<DocMarkdown :source>`.
   Code is drawn by `CodeBlock` / `DocCodeGroup`, so `styles/main.css` shrinks to its `@import`,
   `@reference` and `@source` lines.
3. **Parity in `DocMarkdown`.** Before the switch, `DocMarkdown` must do what `content.ts` does
   today, each with a test in `doc-markdown.test.ts`:
   - adjacent `## Do` / `## Don't` and `## When to use` / `## When not to use` headings, and
     `- **Do:**` / `- **Don't:**` list items, become a `doc-do-dont` pair (owner decision B28,
     same shapes as `apps/docs/README.md` § "Do and Don't");
   - HTML comments never print; task-list markers render as plain bullets;
   - relative links are rewritten (`.specs/<name>.md` → `/components/<name>`, other repo files →
     GitHub), which today is `sourceHref()` in `content.ts`. Recommendation: the app passes a
     link-resolver function, so `DocMarkdown` stays free of repo paths.
4. **Seven new `doc-*` components**, each through `/component-new` (spec, review, test,
   examples). Names follow `naming.md` § 24 (`doc-<the MDX tag>`):

   | Component            | Tag                                 | Data it needs (passed in, never fetched)                     |
   | -------------------- | ----------------------------------- | ------------------------------------------------------------ |
   | `doc-do-dont`        | `<DoDont>` (+ heading pairs)        | none                                                         |
   | `doc-api-table`      | `<ApiTable component="…" />`        | the catalog entry (props, events, slots, sub-components)     |
   | `doc-example`        | `<Example name="dir/file" />`       | the example component and its source                         |
   | `doc-block-preview`  | `<BlockPreview id="…" state="…" />` | the frame URL and the source                                 |
   | `doc-token-table`    | `<TokenTable group="…" />`          | the token group (name, light, dark, usage, responsive steps) |
   | `doc-color-explorer` | `<ColorExplorer />`                 | the semantic and primitive color groups                      |
   | `doc-icon-gallery`   | `<IconGallery />`                   | the icon list (`catalog/assets/icons.json`)                  |

   How data reaches a tag: `DocMarkdown` gets one new prop, `data` (an object the route shell
   fills), and a data-bound tag reads its slice by its attributes (`group="bg"` →
   `data.tokens.bg`). Tags stay plain strings, so the same Markdown also works on the Azion docs
   site and in `llms` output. This is an API change to `doc-markdown` and goes through its spec.

5. **Route shells only compose WebKit.** `card-index.vue` and `component-grid.vue` disappear;
   the index pages compose `DocPageHeader`, `Input`, `DocCardGroup` and `doc-example` directly.

### Guard so it never recurs

**Rule** — new `.claude/rules/docs-site.md` (scope `webkit`), registered in
`.claude/hooks/lib/standards.mjs` and paired with the test below:

> The docs site renders only WebKit. `apps/docs/src` holds `app.vue`, `main.ts`, `router.ts`,
> route shells in `pages/` and data code in `lib/` and `composables/`; it has no `components/`
> folder. A route shell imports components only from `@aziontech/webkit/*`. Markdown renders only
> through `DocMarkdown`; no `innerHTML`, no `v-html`, no Markdown or highlighting library in the
> app, no CSS beyond the stylesheet imports. A piece the site needs that WebKit lacks becomes a
> `doc-*` component through `/component-new`, never a local file.

**Machine check** — `apps/docs/test/docs-site.test.ts`, run by `pnpm test:docs` (already the
`docs-markdown` gate and the `toolkit` CI job, `governance.yml` line 362), so no new CI wiring.
It fails when:

1. `apps/docs/src/components/` exists, or any `.vue` sits outside `src/pages/` and `src/app.vue`;
2. a `.vue` imports a component from anywhere but `@aziontech/webkit/*` (relative `.vue`
   imports included; `vue`, `vue-router`, `@unhead/vue`, `../lib/*`, `virtual:docs-*` allowed);
3. any file under `apps/docs/src` contains `innerHTML`, `v-html` or a `<style>` block;
4. `apps/docs/package.json` depends on `markdown-it`, `shiki` or another Markdown/highlight lib;
5. `src/styles/main.css` has anything but `@import`, `@reference` and `@source` lines;
6. a Markdown source the site renders uses a tag `DocMarkdown` does not know
   (`DOC_MARKDOWN_BLOCK_TAGS` from `parse-doc-markdown.ts`); unknown tags fail the build instead
   of showing as text.

`doc-markdown.test.ts` gains one test per parity item in step 3.

### Migration steps

1. Write the specs for the seven `doc-*` components and the `DocMarkdown` changes (`data` prop,
   Do/Don't pairs, comments, task lists, link resolver); review and build each.
2. Swap the shell for `DocLayout` (also fixes item 3).
3. Move one page type at a time to `DocMarkdown`: foundations (item 2), then block guidelines,
   then the spec sections on component pages. Run `pnpm test:docs:smoke` and the visual suite
   after each.
4. Delete `src/components/`, `raw-html`, the Shiki/markdown-it code and the custom CSS. Turn the
   guard test on (it can land first with an allowlist that only shrinks).

### Risks

- **Server rendering.** `DocMarkdown` parses in the browser and on the server; with `vite-ssg`
  the page must render the same on both, and its tags load lazily. The smoke test already fails
  on hydration errors; run it per migrated page type.
- **Visual baselines** for every docs page change. Regenerate with `/baselines-regenerate`.
- **Bundle size.** Pages now ship the Markdown source and parser instead of pre-rendered HTML.
  Measure with the existing size gate; if it hurts, pre-parse at build time into the node tree
  `readDocMarkdown` already produces.
- **`block-page.vue` reads guideline sections by heading name.** Keep those headings, or move
  that logic into the Markdown itself.

---

## 2. Foundations in Markdown or Vue

### Evidence

`apps/docs/src/lib/foundations.ts` is a hand-kept list of 16 foundation pages. Each entry mixes
three things: a `tokens` key (which Vue view draws the token tables), an optional `markdown` file
(a rule or a skill), and an optional `demo` or `view`. `foundation-page.vue` stacks them:
`FoundationDemo` → `TokensView` → `IconsView` → the Markdown. So on the Color page the prose
from `rules/webkit-tokens.md` always comes after every table, and the page author cannot put a
table next to the paragraph that explains it. Typography, Spacing, Radius, Shadows and Z-index
have no Markdown at all; their whole page is Vue.

The Azion docs site is Astro with MDX: each page is one file, and live parts are components
written inside the text. Starlight, Docusaurus, Mintlify, Fumadocs, VitePress and the shadcn docs
all work the same way: the page is a Markdown file, interactive parts are tags inside it (shadcn's
`<ComponentPreview name="…" />` is the same idea as `<Example name="…" />` here).

### Root cause

The foundations started as token dumps generated from the theme, so they were built as Vue views.
Markdown was added later only for prose, and the site's Markdown pipeline (item 1) cannot place a
component inside the text, so the views had to sit around the Markdown instead of in it.

### Is anything blocking Markdown? No.

| Today's Vue part                     | As a tag inside Markdown                                                | Why it works                                                                                                                                          |
| ------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Token tables built from theme data   | `<TokenTable group="bg" />`, `<TokenTable group="spacing" usage="…" />` | The data is computed at build time as now (`buildTokens()`), handed to `DocMarkdown` through `data`.                                                  |
| Color explorer, palette strips       | `<ColorExplorer />`, `<ColorExplorer view="palette" />`                 | An interactive component works inside `DocMarkdown` like any other tag (`<Tabs>` already is).                                                         |
| Icon grid                            | `<IconGallery />`                                                       | Same: data from `catalog/assets/icons.json`.                                                                                                          |
| Language / direction / devices demos | `<Example name="config-provider/languages" />` etc.                     | They become normal examples in `packages/webkit/examples/`, already server-rendered and visually tested. Each example wraps its own `ConfigProvider`. |
| Three-layer intro                    | `<Steps>` with three steps, or `<CardGroup>`                            | Existing tags.                                                                                                                                        |
| Static build with `vite-ssg`         | No change                                                               | `DocMarkdown` is a normal component; it renders on the server like the rest of the page.                                                              |

### Correct fix — target architecture

My recommendation: **every page on the site is one Markdown file, rendered by `DocMarkdown`.**
Route shells only load data. This is what makes the WebKit docs look like (and be portable to)
the Azion docs.

- **Where the files live.** Pure-prose foundations keep their source in the rule they document
  (`rules/webkit-page-layout.md`, `rules/webkit-direction.md`, `rules/webkit-strings.md`,
  `rules/webkit-accessibility.md`, `rules/webkit-site-pages.md`), so the rule and the page cannot
  drift. Token and gallery pages (Color, Typography, Spacing, Radius, Shadows, Motion, Z-index,
  Icons) get their own file in `packages/webkit/docs/foundations/<slug>.md`: short prose with the
  tags placed where they belong.
- **Frontmatter replaces `lib/foundations.ts`.** Each file states `title`, `summary`, `order`
  and `group`; the nav, the Foundations index and search are built from it.
- **Same for components and blocks over time.** A component page is already data (catalog +
  spec + examples); its shell can produce a Markdown source (`<ApiTable>`, `<Example>` per
  example, spec sections) and render it with `DocMarkdown`, which is also what "Copy for AI"
  and `llms/` need.
- **Home.** Once `DocMarkdown` maps a `<Hero>` tag to `DocHero`, the home is `index.md` with
  `<Hero>` and `<CardGroup>`. Until then it is a route shell composed of WebKit only.

### Guard so it never recurs

- The item 1 rule gains one line: "Every page body is a `DocMarkdown` source; a page never
  places a component around the Markdown."
- `docs-site.test.ts` also fails when `lib/foundations.ts` (or any hand-kept page list) comes
  back, when a foundation slug has no Markdown file, or when a route shell renders anything but
  `DocPageHeader` + `DocMarkdown` (index pages excepted, listed by name).

### Migration steps

1. Build `doc-token-table`, `doc-color-explorer`, `doc-icon-gallery`, `doc-example` (item 1).
2. Move the three demos into `packages/webkit/examples/` (they then also get visual tests).
3. Write the eight new foundation files; add frontmatter to the five rules used as pages.
4. Replace `foundation-page.vue`'s stack with `<DocMarkdown :source :data>`; delete
   `lib/foundations.ts`, `tokens-view.vue`, `icons-view.vue`, `foundation-demo.vue`.
5. Check: `pnpm build:docs`, `pnpm test:docs:smoke`, the visual suite, and
   `check:docs-markdown` (it already covers `rules/` and `skills/`; add
   `packages/webkit/docs/foundations/`).

### Risks

- **Rules are also read by agents.** Tags such as `<Steps>` in a rule are fine (agents read
  Mintlify-style tags well), but data tags (`<TokenTable>`) mean nothing outside the site; keep
  them out of `rules/` and in the foundation files only. The `llms` build expands or drops them.
- **Token tables are long.** A Markdown page with many tables may need the outline to list each
  table; `DocLayout`'s outline is built from headings, so give each table a heading.

---

## 3. Home container

### Evidence

Measured on `http://localhost:4413` (left edge and width of the page heading and of the widest
content, in px; the sidebar ends at 300 from 1024 px up).

| Route                 | 1920: heading left / content width         | 1280: heading left / width | 390: heading left / width | Page root classes                                                                                                                  |
| --------------------- | ------------------------------------------ | -------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `/` (home)            | 348 / framed `Container` 1620 (300 → 1920) | 348 / 876 (hero title cap) | **24** / 342              | `flex w-full flex-col`, then `Hero max-width="7xl"` and `Container max-width="7xl" class="lg:@max-7xl/main:border-s-0!"`           |
| `/foundations/color/` | 348 / **1524** (tables to 1872, no cap)    | 348 / 884                  | 16 / 358                  | `flex w-full flex-col gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-lg) lg:px-(--spacing-xl)`; Markdown in `max-w-4xl` (1024) |
| `/components/button/` | 348 / 1220 (+ outline rail)                | 348 / 580                  | 16 / 358                  | same as above, plus an `article flex-1` and a table-of-contents aside                                                              |

What this shows:

- **Different edges and caps.** At 1920 the home content stops at 1620 px inside a frame with
  border lines; the Color page runs to 1872 px with no cap, so lines of a table are 1524 px long;
  the Markdown on the same page is capped at 1024 px by a hand-written `max-w-4xl`
  (`foundation-page.vue:24`). Three widths on one site.
- **Different phone inset.** The home heading sits 24 px from the edge (Hero's own inset), the
  other pages 16 px.
- **Different spacing tokens.** Pages use `gap-(--spacing-xl)` and `px-(--spacing-md)`, not the
  layout tokens `--layout-section-gap` / `--layout-boundary-inline`.
- **No route uses the theme's container classes.** `grep -rn "layout-column\|layout-boundary"
apps/docs/src` finds nothing. `rules/webkit-page-layout.md` says "Never hand-roll a page cap"
  and lists `.layout-column-content` for documentation. The `DocLayout` example
  (`packages/webkit/examples/doc-layout/default.vue:65–66`) does it right:
  `<div class="layout-boundary"><div class="layout-column-content …">`.
- The home needs an `!important` override (`lg:@max-7xl/main:border-s-0!`) to hide a doubled
  line against the sidebar, a sign the frame does not belong in this shell.

Screenshots (1920, 1280, 390) are listed at the end.

### Root cause

The site's shell (`docs-shell.vue`) gives pages a bare `<main>` and no column, so each page
invents its own: the home was designed as a marketing band (`Hero` + framed `Container`, a
`site` surface piece), the other pages copied one padding string. The layout rule existed but no
check looked at the docs app.

### Correct fix

My recommendation: **one column, owned by the layout, not by the pages.**

- `DocLayout` wraps its default slot in the docs column:
  `layout-boundary` (the page inset, `--layout-boundary-*`) + `layout-column-content`
  (cap `--layout-measure-content` = `--container-3xl` = 876 px) +
  `flex flex-col gap-(--layout-section-gap)`. Pages render only their body and never set a
  width, padding or cap. This is a small spec change to `doc-layout` (today the example adds the
  column by hand).
- Every page starts with `DocPageHeader` (the home with `DocHero`, same left edge).
- The home drops the framed `Container` / `Module` bands and uses `DocCardGroup` inside the same
  column. Wide parts (examples, token tables, card grids) fit the 876 px column with container
  queries, as `rules/webkit-page-layout.md` asks; the outline rail sits beside the column as
  `DocLayout` already does from `xl`.
- Remove `max-w-4xl`, `px-(--spacing-*)`, `py-(--spacing-*)` and `gap-(--spacing-xl)` from every
  route root.

### Guard so it never recurs

1. **Visual geometry check** — `apps/visual/tests/docs-column.spec.ts` (styled suite, `visual`
   CI job, beside `band-edges.spec.ts`). For every docs route in the build's route list (sample
   of every page type in CI, all routes in a sweep script `apps/visual/scripts/docs-column.mjs`)
   at 390, 768, 1280 and 1920 px, it measures the `DocPageHeader` / `DocHero` box and the
   content column and fails when, against the home page at the same width:
   - the left edge differs by more than 1 px, or
   - the column width differs by more than 1 px, or
   - any direct child of the column is wider than the column.
2. **Static check** in `docs-site.test.ts`: a route shell's template may not contain `max-w-`,
   `px-`, `py-`, `mx-auto` or `layout-column` (the layout owns them).
3. `doc-layout.test.ts` asserts the main slot is wrapped in `layout-boundary` +
   `layout-column-content`.

### Migration steps

1. Spec + build the `DocLayout` column change; adopt `DocLayout` in the site (item 1, step 2).
2. Strip the page-root classes from every route shell; rebuild the home in the column.
3. Add the geometry test; regenerate baselines.

### Risks

- **Narrower pages.** Token tables and the components grid lose width at 1920. That is the
  point (line length), but expect the tables to wrap sooner; the token table already reflows
  below 36rem.
- **The home looks less like a marketing page.** If the owner wants a full-bleed hero later,
  that is a `DocHero` variant decision, not a page-level exception.

---

## 6. "View as Markdown" uses a generic file icon

### Evidence

- `packages/icons/src/icons.json` has `file`, `file-pdf`, `file-word`, `file-excel`, `json`,
  `code`, `html`… but **no `markdown`**; `packages/icons/src/svg-raw/az/` and `az-color/` have no
  Markdown SVG either.
- The action is written by hand in four places, all with `az az-file`:
  - `apps/docs/src/pages/foundation-page.vue:32`
  - `apps/docs/src/pages/component-page.vue:86`
  - `apps/docs/src/pages/block-page.vue:149`
  - `apps/docs/src/pages/assets-page.vue:102` (a `Button`, not a header action)
- `DocPageHeader` (`doc-page-header.vue:42`, `metaActions`) takes any icon, so nothing ties the
  action to one look.

### Root cause

There was no Markdown icon to choose, so the nearest one was used, and because the action is
built in each page instead of in one place, the stopgap was copied four times.

### Correct fix

My recommendation:

1. **Add the icon** with `/icons-add`: `az-markdown`, the Markdown mark (the "M↓" logo by Dustin
   Curtis, released CC0, so free to use). Monochrome (`src/svg-raw/az/az-markdown.svg`, font
   glyph, inherits text color); `icons.json` entry: `set: mono`, `group: external`,
   `category: language` (like `html`), `shows: "The Markdown mark: an M and a down arrow in a
rounded box"`, `means: "Markdown"`. Rebuild and confirm it appears in the catalog, the gallery
   and the docs Icons page.
2. **One place for the action.** Add a `markdownHref` prop to `DocPageHeader` (spec change):
   when set, the header shows the standard "View as Markdown" action with `az az-markdown`,
   `target="_blank"`, and the label from the `common` locale catalog (`common.viewMarkdown`, in
   English, Portuguese and Spanish). The three pages pass `:markdown-href` and drop their copies.
3. **Assets page.** After item 2 each asset section is its own Markdown page with its own header,
   so the extra `Button` goes away.

### Guard so it never recurs

- `doc-page-header.test.ts`: with `markdownHref`, the action renders `az az-markdown` and the
  localized label; without it, no action.
- `docs-site.test.ts`: fails when `apps/docs/src` builds a `viewMarkdown` action by hand.
- The naming check (`icon-name` rule) already fails when a used icon name is missing from the
  icons package, so `az-markdown` cannot be referenced before it exists.

### Migration steps

1. `/icons-add markdown` (icons package; `fix(icons)` commit).
2. Spec + build `DocPageHeader.markdownHref`; add `common.viewMarkdown` to the three locales.
3. Replace the four copies; run `pnpm test:docs:smoke`.

### Risks

- A brand-like glyph in the `external` group: it is a format logo, the same case as `html`.
  Keep its `means` as "Markdown" so search finds it.

---

## Side finding

`http://localhost:4413/components/` (with a trailing slash) renders the "Page not found" page,
while `/components`, `/blocks` and `/foundations/color/` work. Not one of the four items; worth
a follow-up check of the router's trailing-slash handling for the index routes.

## Evidence files

Screenshots taken for this review (not committed):
`/tmp/claude-0/-root--t3-worktrees-webkit-t3-32b15713-6abaa662a8758bcc/3d8b302c-2e26-44c3-811e-418008ae0871/scratchpad/shots/`
— `_-1920.png`, `_-1280.png`, `_-390.png` (home), `_foundations_color_-1920.png`,
`_foundations_color_-1280.png`, `_foundations_color_-390.png`,
`_components_button_-1920.png`, `_components_button_-1280.png`, `_components_button_-390.png`,
`_foundations_devices_-1280.png`, `_foundations_devices_-390.png`.

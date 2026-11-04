# Page sections — `@aziontech/webkit/sections`

A **page section** is a complete marketing block (a hero, a FAQ band, a pricing grid, the site footer) that the marketing site places on a page from JSON. Every section is a webkit component under `packages/webkit/src/components/sections/<name>/`, and all of them are reachable through one import. This document is the convention; the rules it leans on are [`imports.md`](../rules/imports.md) § Page sections, [`compound-api.md`](../rules/compound-api.md) § Registry compounds and [`component-structure.md`](../rules/component-structure.md).

## The contract with the site

A page is a list of sections:

```json
{
  "sections": [
    { "_id": "hero-band", "props": { "kind": "title-band", "title": "Deliver content fast, worldwide", "…": "…" } },
    { "_id": "use-cases", "props": { "eyebrow": "SQL Database", "items": [ "…" ] } }
  ]
}
```

Three strings are the **same string**, on purpose:

| Surface | Value |
|---|---|
| `_id` in the site JSON | `use-cases` |
| component name, folder, spec (`.specs/use-cases.md`), testid `sections-use-cases` | `use-cases` |
| public path `@aziontech/webkit/sections/use-cases`, registry key `registry['use-cases']`, member `Sections.UseCases` | `use-cases` → `UseCases` |

The site renders the whole list through the registry compound, or one block by hand:

```vue
<script setup>
import Sections from '@aziontech/webkit/sections'
</script>

<template>
  <Sections :sections="page.sections" />
  <Sections.UseCases v-bind="section.props" />
</template>
```

Tree-shaking path, when a consumer wants one block only: `import UseCases from '@aziontech/webkit/sections/use-cases'`.

## What a section component is

- **Props only.** The props are exactly the keys of `SITE_SECTION.props` in the section's Storybook story — nothing more, nothing less — so `v-bind="section.props"` is the whole API. No slots, no events. Interaction the block needs (tabs, filters, load-more, a newsletter form, copy-to-clipboard) is local state inside the component.
- **Monolithic.** A section composes existing webkit components (`SectionModule`, `FrameBox`, `CardGrid`, `Topic`, `Hero`, …) inside its own root; it has no sub-components of its own. The page owns the column (`SectionContainer` / `SectionGap`), so a section's root is the band at `SectionModule` level.
- **Bulk data is typed.** Every nested shape is a named, exported type beside the component (`UseCasesItem`, `UseCasesAction`), one JSDoc line per field. Arrays default to `() => []`; an optional affordance object (`primaryAction`, `search`) defaults to `undefined` and is rendered under `v-if`; a configuration object the block cannot render without (`form`, `competitor`, `menus`) is `Required: true`.
- **`kind` changes layout, never the content shape.** Two variants share one component (+ `kind`) only when they take the same props (at most two optional keys of difference). A different data model or different behaviour is a different section, even when the site JSON reused the `_id`.
- **Vocabulary.** `title` / `eyebrow` / `description` for copy; `primaryAction` / `secondaryAction` (`{ label, href, trailing? }`) for the one or two calls to action — never `action`, `actions[]`, `cta`, `link`, `moreLink`; `anchor` for the in-page `id` a `#hash` link targets (set on the inner `SectionModule` with `scroll-mt`); `ariaLabel` / `xAriaLabel` for every accessible name the markup needs. Banned at the root: `status`, `heading`, `header`, `variant`, `is*`/`has*` (see [`prop-vocabulary.md`](../rules/prop-vocabulary.md)).

## The registry compound

```
packages/webkit/src/components/sections/
  sections/           # the compound is itself the component `sections` (spec .specs/sections.md, testid sections-sections)
    sections.vue      # <Sections :sections>: v-for entry → <component :is="registry[entry._id]" v-bind="entry.props" />
    registry.ts       # export type SectionRegistry = { 'use-cases': typeof UseCases, … }; export const registry: SectionRegistry; export type SectionId
    index.ts          # Object.assign(Sections, { UseCases, …, registry }) as CompoundSections (explicit type, like every compound index)
    sections.test.ts
  use-cases/
    use-cases.vue
    use-cases.test.ts
```

Exports in `packages/webkit/package.json`:

```jsonc
"./sections": "./src/components/sections/sections/index.ts",          // compound — leads the docs
"./sections-root": "./src/components/sections/sections/sections.vue", // tree-shakeable root
"./sections/use-cases": "./src/components/sections/use-cases/use-cases.vue"
```

`registry` and the compound carry explicit types (`SectionRegistry`, `CompoundSections`) because `vue-tsc` emits declarations: an inferred `{ 'use-cases': UseCases }` would leak the block's private `Props` interface and fail with TS4023/TS4082.

`Sections` provides nothing and the blocks inject nothing: it is a dispatcher. Unknown `_id`s are skipped. Adding a block touches five lines: the export, the `SectionRegistry` key and the `registry` entry in `registry.ts`, the `index.ts` member (in `CompoundSections` and in the `Object.assign`), and the block's line in `## Sub-components` of `.specs/sections.md`.

## Storybook

- **Data module as the single source.** The site JSON of a section lives in `apps/storybook/src/stories/templates/marketing/_sections/<id>.js` (`export const SITE_SECTION = { _id, props }`). The template story (`Templates/Marketing/…`), the component story (`Components/Sections/<Pascal>`) and the MDX page all import it; nothing duplicates the copy.
- **Template story** renders the component: `args: SITE_SECTION.props`, a `Template` whose `setup()` returns `{ args }` and whose template is `inColumn('<UseCases v-bind="args" />')`. Its "Show code" is built with `sectionMarkup(tag, props)` from `_shared/section-source.js` + `toSfc(...)`, so the snippet is a runnable SFC with concrete props and the big arrays as `<script setup>` consts (never `v-bind="args"` in the snippet — see [`storybook-source.md`](../rules/storybook-source.md)).
- **`*Json` docs stories** (`siteJsonStory(SITE_SECTION)`, `tags: ['!dev']`) stay, so the MDX keeps printing the JSON block.
- **Component story** is the one `/component-create` generates; point its `args` at the same `_sections/<id>.js`.

## Authoring a section through the pipeline

1. Read the section's template story: `SITE_SECTION.props` → the Props table; nested shapes → exported types; the `TEMPLATE` const → the component template; the story's `setup()` → local state.
2. Write `.specs/<name>.md` from `.specs/_template.md`: `category: sections`, `structure: monolithic`, `status: draft`, no `checksum`, no `figma:`; drop `## Sub-components`; Events and Slots tables are `_none_`; `## Usage` imports `@aziontech/webkit/sections/<name>`; the Constraints block verbatim. Then run `spec-validator`.
   - The spec parser reads the first `interface …Props {` block line by line: never inline an object type in `Props`, never name a helper type `*Props`.
   - `Motion & Animations: _none_` is only valid when the file carries no `transition-*` / `animate-*` at all; otherwise list each class, and each must exist in the catalog's animations.
3. `/component-create <name>`: the export key is `./sections/<name>`; the template is transcribed from the story with relative imports; there is no `figma:` block, so the Code Connect step is a documented skip. Then register the block in `registry.ts` and `index.ts`.
4. Expand the test to the floor in [`testing.md`](../rules/testing.md): fallback testid and consumer override, the heading names the landmark (`aria-labelledby`), one cell per item in order, action link `href`, nothing rendered when an optional part is absent, `kind` → `data-kind`, `expectNoA11yViolations` per kind; stateful blocks add their behaviour (tab switching, filtering, load-more, form validation).
5. Rewrite the template story onto the component, add the `.size-limit.json` budget for the block (the compound gets none), regenerate `catalog.json`.

## Site JSON contract changes

Converting a template may change its JSON: a `kind` / `size` key where variants merged, `primaryAction` / `secondaryAction` replacing older action keys, a renamed field that collided with the vocabulary (`status` → `statusLabel`), or a new `_id` where one id covered two incompatible shapes. Every such change is listed in the PR body under **Site JSON changes** so the consuming site follows in the same release.

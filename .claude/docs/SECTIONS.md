# Page sections — `@aziontech/webkit/sections/<name>`

A **page section** is a complete marketing block (a hero, a FAQ band, a pricing grid, the site footer) that the marketing site places on a page from JSON. Every section is a webkit component under `packages/webkit/src/components/sections/<name>/`, published on its own at `@aziontech/webkit/sections/<name>`. This document is the convention; the rules it leans on are [`imports.md`](../rules/imports.md) § Page sections and [`component-structure.md`](../rules/component-structure.md).

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

Two names are the **same string**, on purpose:

| Surface | Value |
|---|---|
| `_id` in the site JSON | `use-cases` |
| component name, folder, spec (`.specs/use-cases.md`), testid `sections-use-cases` | `use-cases` |
| public path `@aziontech/webkit/sections/use-cases`, import binding | `use-cases` → `UseCases` |

The site imports the blocks it uses and binds each entry's `props` onto its block. Mapping `_id` to component is the site's own concern; the package ships no registry and no dispatcher.

```vue
<script setup>
import UseCases from '@aziontech/webkit/sections/use-cases'
</script>

<template>
  <UseCases v-bind="section.props" />
</template>
```

## What a section component is

- **Props only.** The props are exactly the keys of `SITE_SECTION.props` in the section's Storybook story — nothing more, nothing less — so `v-bind="section.props"` is the whole API. No slots, and no events except a form's `submit` (below). Interaction the block needs (tabs, filters, load-more, copy-to-clipboard) is local state inside the component.
- **Forms are the one exception: they emit `submit`, the site sends.** A section that collects data (a lead form, a newsletter sign-up) never posts, fetches or fakes a send. It renders the fields, validates them locally on submit only (the `webkit-form` pattern: a required field's label carries its Required tag from the first render, an empty required field takes the amber `required` state and a malformed value the red `invalid` state only after a failed submit, never both at once, and editing a field clears its message), and on a valid submit emits `submit: [event: SubmitEvent, values: Record<string, string>]` (event first — see [`event-payloads.md`](../rules/event-payloads.md)); the site posts to its endpoint. The outcome comes back as consumer-owned state props the block renders (see [`component-states.md`](../rules/component-states.md)): `loading` while the site sends (submit suppressed), `submitted` to show the success message, `error` to show the failure message; the messages themselves are props from the JSON. Transport details (`endpoint`, `hiddenFields`, `pageName`) are not component props: they sit in a `submission` key next to `props` in the section entry (`{ _id, props, submission }`), so `v-bind="section.props"` stays the whole API.
- **One landmark per band.** The root is a `<section>` named by the band's title (`aria-label`) only when no composed component already renders a named landmark for it; when `media-split`, `quote-tabs` or `big-numbers` owns the named region, the root is a plain `div`, so axe never sees two landmarks with one name.
- **Monolithic.** A section composes existing webkit components (`SectionModule`, `FrameBox`, `CardGrid`, `Topic`, `Hero`, …) inside its own root; it has no sub-components of its own. The page owns the column (`SectionContainer` / `SectionGap`), so a section's root is the band at `SectionModule` level.
- **Bulk data is typed.** Every nested shape is a named, exported type beside the component (`UseCasesItem`, `UseCasesAction`), one JSDoc line per field. Arrays default to `() => []`; an optional affordance object (`primaryAction`, `search`) defaults to `undefined` and is rendered under `v-if`; a configuration object the block cannot render without (`form`, `competitor`, `menus`) is `Required: true`.
- **`kind` changes layout, never the content shape.** Two variants share one component (+ `kind`) only when they take the same props (at most two optional keys of difference). A different data model or different behaviour is a different section, even when the site JSON reused the `_id`.
- **Vocabulary.** `title` / `eyebrow` / `description` for copy; `primaryAction` / `secondaryAction` (`{ label, href, trailing?, target? }`) for the band's one or two calls to action — never `action`, `actions[]`, `cta`, `link`, `moreLink` at the root; inside a repeated item (a feature, a step, a cell) the single affordance is `action` and a clipboard affordance is `copy: { label, text }`; `anchor` for the in-page `id` a `#hash` link targets (set on the band's root `<section>` with `scroll-mt-(--spacing-xxl)`); `ariaLabel` / `xAriaLabel` for every accessible name the markup needs. Banned at the root: `status`, `heading`, `header`, `variant`, `is*`/`has*` (see [`prop-vocabulary.md`](../rules/prop-vocabulary.md)).

## Layout and exports

```
packages/webkit/src/components/sections/
  use-cases/
    use-cases.vue
    use-cases.test.ts
```

One export per block in `packages/webkit/package.json`, and one `.size-limit.json` budget:

```jsonc
"./sections/use-cases": "./src/components/sections/use-cases/use-cases.vue"
```

## Storybook

- **Data module as the single source.** The site JSON of a section lives in `apps/storybook/src/stories/templates/marketing/_sections/<id>.js` (`export const SITE_SECTION = { _id, props }`). The template story (`Templates/Marketing/…`), the component story (`Components/Sections/<Pascal>`) and the MDX page all import it; nothing duplicates the copy.
- **Template story** renders the component: `args: SITE_SECTION.props`, a `Template` whose `setup()` returns `{ args }` and whose template is `inColumn('<UseCases v-bind="args" />')`. Its "Show code" is built with `sectionMarkup(tag, props)` from `_shared/section-source.js` + `toSfc(...)`, so the snippet is a runnable SFC with concrete props and the big arrays as `<script setup>` consts (never `v-bind="args"` in the snippet — see [`storybook-source.md`](../rules/storybook-source.md)). When the data carries the site's image URLs (`/marketing-components/…`), the story's `args` go through `withStoryAssets` from `_shared/site-assets.js`, which swaps them for the package assets on the canvas only; the snippet and the `*Json` block keep the site URLs.
- **`*Json` docs stories** (`siteJsonStory(SITE_SECTION)`, `tags: ['!dev']`) stay, so the MDX keeps printing the JSON block.
- **Component story** is the one `/component-create` generates; point its `args` at the same `_sections/<id>.js`.

## Authoring a section through the pipeline

1. Read the section's template story: `SITE_SECTION.props` → the Props table; nested shapes → exported types; the `TEMPLATE` const → the component template; the story's `setup()` → local state.
2. Write `.specs/<name>.md` from `.specs/_template.md`: `category: sections`, `structure: monolithic`, `status: draft`, no `checksum`, no `figma:`; drop `## Sub-components`; Events and Slots tables are `_none_`; `## Usage` imports `@aziontech/webkit/sections/<name>`; the Constraints block verbatim. Then run `spec-validator`.
   - The spec parser reads the first `interface …Props {` block line by line: never inline an object type in `Props`, never name a helper type `*Props`.
   - `Motion & Animations: _none_` is only valid when the file carries no `transition-*` / `animate-*` at all; otherwise list each class, and each must exist in the catalog's animations.
3. `/component-create <name>`: the export key is `./sections/<name>`; the template is transcribed from the story with relative imports; there is no `figma:` block, so the Code Connect step is a documented skip.
4. Expand the test to the floor in [`testing.md`](../rules/testing.md): fallback testid and consumer override, the band's landmark is named by its title, one cell per item in order, action link `href`, nothing rendered when an optional part is absent, `kind` → `data-kind`, `expectNoA11yViolations` per kind; stateful blocks add their behaviour (tab switching, filtering, load-more, form validation).
5. Rewrite the template story onto the component, add the `.size-limit.json` budget for the block, regenerate `catalog.json`. A block that composes `Illustration` (or another component whose registry is split into async chunks) is budgeted with `entryOnly: true`, like the existing `illustration`-based entries.

## Site JSON contract changes

Converting a template may change its JSON: a `kind` / `size` key where variants merged, `primaryAction` / `secondaryAction` replacing older action keys, a renamed field that collided with the vocabulary (`status` → `statusLabel`), or a new `_id` where one id covered two incompatible shapes. Every such change is listed in the PR body under **Site JSON changes** so the consuming site follows in the same release.

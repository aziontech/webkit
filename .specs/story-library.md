---
name: story-library
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 4cb797aa066809e8e6a07782014c5a2e7b290415fed7be34f0af20faf1003702
---
# StoryLibrary — Component Spec

## Purpose

Every success story of a company as one filterable library. A left-aligned title sits over a toolbar — a search field and one searchable select per facet (industry, solution, product) on one row — then a grid of story cards and a load-more button. Each card is one link named by its company: the client mark in a single ink, the story's category as an overline, its description and a read cue whose arrow nudges on hover. The grid runs one column on phones, two from `sm` and three from `lg`. Search and facets combine; when nothing matches, an empty state offers to clear every filter. It is a page section — the site places it from a `{ _id: 'story-library', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `input-text`, `select`, `button` and `empty-state`; the search, the facet selections and each select's own option search are local state.

## When to use

- To list every success story with search and facet filters.

## When NOT to use

- For a closing row of three related stories → use `article-cards`.
- For a filterable list of articles → use `article-index-blog` or `article-index-resource-hub`.

## Related

- `article-index-resource-hub` — the sibling listing of articles with facet dropdowns.
- `empty-state` — the no-match state.

## Best practices

- Derive each facet's `options` from the values the items carry, so every option matches at least one story.
- Give every item a `facets` entry per facet `key`; an item without one never matches a selection on that facet.

## Usage

```vue
<script setup>
import StoryLibrary from '@aziontech/webkit/story-library'
</script>

<template>
  <StoryLibrary
    anchor="cases"
    title="Companies building with Azion"
    aria-label="Success stories"
    link-label="Read story"
    more-label="Load more"
    :items="[
      {
        key: 'case-gpa',
        href: '/success-cases/gpa',
        client: { name: 'GPA', logo: '/logos/gpa-extended-reversed.svg' },
        category: 'Retail',
        description: 'GPA solved a targeted DNS attack and reduced costs by 30%.',
        facets: { industry: ['Retail'] }
      }
    ]"
    :facets="[
      { key: 'industry', label: 'Industry', allLabel: 'All industries', options: [{ value: 'Retail', label: 'Retail' }] }
    ]"
    :search="{ placeholder: 'Search by company or story', label: 'Search success stories' }"
    :empty="{ title: 'No stories match these filters.', action: 'View all success stories' }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline of the band, rendered left-aligned as its `h2`; the band renders no header when empty. |
| `items` | `StoryLibraryItem[]` | `[]` | false | The stories, in order; each is `{ key, href, client, category, description, facets? }`. |
| `facets` | `StoryLibraryFacet[]` | `[]` | false | The facet selects, in order; each is `{ key, label, allLabel, options }`. |
| `search` | `StoryLibrarySearch` | `undefined` | false | The search field's `placeholder` and accessible `label`; the field is omitted when absent. |
| `empty` | `StoryLibraryEmpty` | `undefined` | false | The no-match state's `title` and the `action` label of its clear-filters button. |
| `linkLabel` | `string` | `''` | false | Read cue at the foot of each card, also the lead of its accessible name. |
| `moreLabel` | `string` | `''` | false | Label of the load-more button under the grid; the button is omitted when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of stories. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` (a card lifts to the raised surface, the read cue brightens and its arrow nudges), `focus-visible` (inset ring)
- Filtered: the search matches the client name and the description; each facet keeps the stories whose `facets[key]` holds the selected value; all filters combine
- Empty: when no story matches, the grid and the load-more button give way to `empty-state`, whose action clears the search and every facet; it renders only when `empty` is set
- `data-last-row-sm` / `data-last-row-lg` mark the cards on the grid's last row so it drops its bottom rule

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover fill of a card and of its read cue | `transition-colors duration-fast-02 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |
| hover nudge of the read arrow | `transition-[translate] duration-moderate-02 ease-expressive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| card fill | hover `var(--bg-surface-raised)` |
| rules | `var(--border-default)` |
| overline, description, read cue | `text-overline-sm` / `text-body-sm`, `var(--text-muted)`, hover `var(--text-default)` |
| no-match text | `text-label-sm`, `var(--text-muted)` |
| focus ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: every card shows an inset `focus-visible` ring; the field, selects and buttons own theirs.
- Keyboard map: `Tab` moves through the search field, each select, the cards and the load-more button; the selects own their keyboard map.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the toolbar is a `search` landmark; the field is named by `search.label` and each select trigger by its facet `label`; the list is named by `ariaLabel`; each card link is named `linkLabel: client name`, its mark decorative (`alt=""`) and its read cue `aria-hidden`; an option search with no match announces itself as a `status`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every card is a full-cell link.

## Stories (Storybook)

- Default
- NoResults — the empty state, rendered with no stories.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

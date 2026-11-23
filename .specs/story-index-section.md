---
name: story-index-section
category: section
structure: monolithic
status: implemented
spec_version: 7
template: 2
created: 2026-11-05
last_updated: 2026-11-16
checksum: aaa3d70533a74c035eb199fd7980b267f43ea6b9afda238a3de1cd46efbb0dbc
---

# StoryIndexSection — Component Spec

## Purpose

Every success story of a company as one filterable library. A left-aligned title sits over a toolbar — a search field and one select per facet (industry, solution, product) on one row, each starting with an option that clears it — then a grid of story cards and a load-more button that reveals the next page. Below `lg` the toolbar folds to the search field (with its shorter placeholder) and a filter button that reveals the selects, with each applied facet listed under it as a removable chip. A select with more than seven options gains an option search. Each card is one link named by its company: the client mark in a single ink, the story's category as an overline, its description and a read cue whose arrow nudges on hover. The grid runs one column on phones, two from `sm` and three from `lg`. Search and facets combine; when nothing matches, an empty state offers to clear every filter. It is a page section — the site places it from a `{ _id: 'story-index-section', props }` entry and binds `props` straight onto it — and it composes `module`, `module-header`, `registration-frame`, `input`, `select`, `chip`, `button` and `empty-state`; the search, the facet selections, each select's own option search and the page count are local state, and facets can be seeded from the URL query.

## When to use

- Use StoryIndexSection for a card grid of customer stories with search and facets.

## When NOT to use

- For a closing row of three related stories → use `article-cards-section`.
- For the full filterable list of articles or resources → use `article-index-section`.
- For a filterable list of non-article rows (jobs) → use `listing-index-section`.

## Related

- `article-index-section` — the filterable list of articles or resources.
- `empty-state` — the no-match state.

## Best practices

- Derive each facet's `options` from the values the items carry, so every option matches at least one story.
- Give every item a `facets` entry per facet `id`; an item without one never matches a selection on that facet.
- Pass `client.logo` as any image URL or imported asset (`import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'`); the card fits a mark of any intrinsic size, so do not pre-scale or crop it.

## Usage

```vue
<script setup>
  import StoryIndexSection from '@aziontech/webkit/story-index-section'
</script>

<template>
  <StoryIndexSection
    anchor="cases"
    title="Companies building with Azion"
    aria-label="Success stories"
    link-label="Read story"
    more-label="Load more"
    :items="[
      {
        id: 'case-gpa',
        href: '/success-cases/gpa',
        client: { name: 'GPA', logo: '/logos/gpa-extended-reversed.svg' },
        category: 'Retail',
        description: 'GPA solved a targeted DNS attack and reduced costs by 30%.',
        facets: { industry: ['Retail'] }
      }
    ]"
    :facets="[
      {
        id: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: [{ value: 'Retail', label: 'Retail' }]
      }
    ]"
    search-placeholder="Search by company or story"
    search-aria-label="Search success stories"
    empty-title="No stories match these filters."
    empty-action-label="View all success stories"
  />
</template>
```

## Props

| Prop                     | Type                       | Default | Required | JSDoc                                                                                                                                                  |
| ------------------------ | -------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `anchor`                 | `string`                   | `''`    | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                         |
| `title`                  | `string`                   | `''`    | false    | Headline of the band, rendered left-aligned as its `h2`; the band renders no header when empty.                                                        |
| `items`                  | `StoryIndexSectionItem[]`  | `[]`    | false    | The stories, in order; each is `{ id, href, client, category, description, facets?, target? }`; a story whose `target` is `_blank` opens in a new tab. |
| `facets`                 | `StoryIndexSectionFacet[]` | `[]`    | false    | The facet selects, in order; each is `{ id, label, allLabel, options }`.                                                                               |
| `searchPlaceholder`      | `string`                   | `''`    | false    | Placeholder of the search field; the field is omitted when this and `searchAriaLabel` are both empty.                                                  |
| `searchShortPlaceholder` | `string`                   | `''`    | false    | Shorter placeholder of the search field below `lg`; empty uses `searchPlaceholder`.                                                                    |
| `searchAriaLabel`        | `string`                   | `''`    | false    | Accessible name of the search field.                                                                                                                   |
| `emptyTitle`             | `string`                   | `''`    | false    | Message of the no-match state; the state renders only with it.                                                                                         |
| `emptyActionLabel`       | `string`                   | `''`    | false    | Label of the no-match state's button that clears every filter; no button renders without it.                                                           |
| `linkLabel`              | `string`                   | `''`    | false    | Read cue at the foot of each card, also the lead of its accessible name.                                                                               |
| `moreLabel`              | `string`                   | `''`    | false    | Label of the load-more button under the grid; without it every match is listed and no button renders.                                                  |
| `pageSize`               | `number`                   | `12`    | false    | Stories listed per page when `moreLabel` is set; the load-more button reveals the next page.                                                           |
| `filterLabel`            | `string`                   | `''`    | false    | Label of the filter button below `lg`; empty uses the locale catalog (`Filters`).                                                                      |
| `seedFromQuery`          | `boolean`                  | `false` | false    | Seeds each facet on mount from the URL query parameter named by its `id` when the value is one of its options.                                         |
| `ariaLabel`              | `string`                   | `''`    | false    | Accessible name of the list of stories.                                                                                                                |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` (a card lifts to the raised surface, the read cue brightens and its arrow nudges), `focus-visible` (inset ring)
- Filtered: the search matches the client name and the description; each facet keeps the stories whose `facets[id]` holds the selected value; all filters combine
- Paged: with `moreLabel` set, the first `pageSize` matches render and the load-more button, shown while more remain, adds the next `pageSize` and moves keyboard focus to the link of the first revealed item, so focus never drops to the page when the button leaves and a screen reader reads the new item; changing the search or a facet returns to the first page
- Clearing one facet: every select starts with an option labelled by its `allLabel` that clears that facet
- Folded toolbar (below `lg`): a filter button (`aria-expanded`, `aria-controls`) beside the search field shows or hides the selects, stacked (the panel carries `data-state="open|closed"`); its label carries the number of applied facets; every facet set to a value renders a removable `chip` (`<facet label>: <option label>`) whose remove clears it; the field shows `searchShortPlaceholder` when set. From `lg` the selects sit on the toolbar row and the button and chips are hidden (CSS only for the layout; the placeholder switches after mount, so server and client markup match)
- Option search: a select with more than seven options renders a search field above its options and a `status` line when nothing matches
- Seeded: with `seedFromQuery`, on mount (client only) a facet takes the value of `?<id>=` in the URL when it is one of its options
- New tab: a story whose `target` is `_blank` links with `rel="noopener"`
- Empty: when no story matches, the grid and the load-more button give way to `empty-state`, whose action clears the search and every facet; it renders only when `emptyTitle` is set
- `data-last-row-sm` / `data-last-row-lg` mark the cards on the grid's last row so it drops its bottom rule
- Client mark: drawn at the mark row's height, at most `9rem` wide, keeping its aspect ratio; when the card is narrower than that (two columns at 200% zoom) the mark shrinks to the card's width (`min-w-0`) and stays start-aligned, so a mark of any size or aspect ratio never pushes the card past its column

## Motion & Animations

| Trigger                                  | Animation / Transition                                                 | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ---------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| hover fill of a card and of its read cue | `transition-colors duration-fast-02 ease-productive-entrance`          | inline (matches catalog)                          | `motion-reduce:transition-none` |
| hover nudge of the read arrow            | `transition-[translate] duration-moderate-02 ease-expressive-entrance` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                          | Token (DESIGN.md)                                                                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| card fill                       | hover `var(--bg-surface-raised)`                                                                                                                    |
| rules                           | `var(--border-default)`                                                                                                                             |
| overline, description, read cue | `text-overline-sm` / `text-body-sm`; overline and read cue `var(--text-muted)` (cue hover `var(--text-default)`), description `var(--text-default)` |
| no-match text                   | `text-label-sm`, `var(--text-muted)`                                                                                                                |
| focus ring                      | `var(--ring-color)`                                                                                                                                 |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: every card shows an inset `focus-visible` ring; the field, selects and buttons own theirs.
- Keyboard map: `Tab` moves through the filter button (below `lg`), the search field, each select, the applied-filter chips, the cards and the load-more button; the selects own their keyboard map.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the toolbar is a `search` landmark; the field is named by `searchAriaLabel` and each select trigger by its facet `label`; the list is named by `ariaLabel`; the filter button reports `aria-expanded` and controls the selects; each applied chip's remove button is named by the chip; each card link is named `linkLabel: client name`, followed by `(opens in a new tab)` when its `target` is `_blank`, its mark decorative (`alt=""`) and its read cue `aria-hidden`; an option search with no match announces itself as a `status`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every card is a full-cell link.

## Internationalization

| Key                                | English source         | Override prop |
| ---------------------------------- | ---------------------- | ------------- |
| `storyIndexSection.search`         | `Search`               | —             |
| `storyIndexSection.searchFacet`    | `Search {facet}`       | —             |
| `storyIndexSection.noMatch`        | `No results found.`    | —             |
| `storyIndexSection.filters`        | `Filters`              | `filterLabel` |
| `storyIndexSection.filtersApplied` | `{label} ({count})`    | —             |
| `common.newTab`                    | `(opens in a new tab)` | —             |

- Every other string arrives through props.
- Formatting: none.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the external-link arrow does not mirror; its hover nudge moves toward the end edge (`rtl:` flips the `translate-x`).
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Responsive

- Container queries: none; the grid runs one column on phones, two from `sm`, three from `lg`.
- Narrow (< `lg`): the toolbar folds to the filter button and the search field; the selects stack inside the disclosure; applied facets wrap as chips.
- Touch: every card is a full-cell link; the button, field and selects are large.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; a client mark shrinks to the card's width.

## Performance

- Bundle budget: the `./story-index-section` entry in `.size-limit.json`, initial chunk only.
- Runtime budget: filtering a few hundred stories on each keystroke stays under one frame; only `pageSize` cards render at once.
- Heavy parts: the applied-filter `Chip`s load in their own chunk the first time a filter is applied.

## Examples

- Default
- NoResults — the empty state, rendered with no stories.
- Paged — a `pageSize` of two, so the load-more button reveals the next page (pagination is the library's main interaction beyond filtering).

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

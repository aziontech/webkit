---
name: subject-grid-section
category: section
structure: monolithic
template: 2
status: implemented
spec_version: 5
created: 2026-11-05
last_updated: 2026-11-16
checksum: e05d9f2b0ce0ad069ab8e65712ad2fbe2a2a70c5554bd9d6ffd2bbf0e1d26b47
---

# SubjectGridSection — Component Spec

## Purpose

A library of learning subjects in a divider grid: each subject is one framed card with its name, what it covers and a list of its article links, and an optional closing call to action spans every cell left in the grid's last row so the grid ends without an empty cell. It is a page section — the site places it from a `{ _id: 'subject-grid-section', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `module`, `registration-frame`, `card-grid`, `call-to-action` and `button` rather than owning any anatomy of its own.

## When to use

- On the Learning Center index, to list every subject with the articles that teach it.
- Whenever a page needs a grid of topic cards that each carry a short list of links, closed by one call to action.

## When NOT to use

- For a grid of features with artwork → use `feature-tiles-section`.
- For a filterable list of rows → use `listing-index-section`.
- Inside another band's cell → compose `registration-frame` and `call-to-action` directly.

## Related

- `call-to-action` — the `lead` band drawn in the closing cell.
- `card-grid` — the divider grid the subject cards sit in.

## Best practices

- Give every subject a unique `slug`; it is the card's `id`, so a `#slug` link lands on it.
- Keep the subject count at a multiple of three plus one when `closing` is set, so the closing cell takes two thirds of the last row on desktop; any other count still ends flush, with the closing cell across one cell or a full row.
- Keep each subject's articles to a handful; the card grows with its list.

## Usage

```vue
<script setup>
  import SubjectGridSection from '@aziontech/ui/subject-grid-section'
</script>

<template>
  <SubjectGridSection
    anchor="subjects"
    :subjects="[
      {
        slug: 'cdn',
        title: 'CDN',
        description: 'Reduce latency by caching content close to users.',
        articles: [{ label: 'What is a CDN?', href: '/learning/cdn/what-is-a-cdn/' }]
      }
    ]"
    :closing="{
      eyebrow: 'Next step',
      title: 'Put what you learned to work.',
      titleMuted: 'On Azion.',
      description: 'Deploy your first application in minutes.',
      primaryAction: { label: 'Start for free', href: '/signup' },
      secondaryAction: { label: 'Talk to sales', href: '/contact', trailing: true }
    }"
  />
</template>
```

## Props

| Prop        | Type                          | Default     | Required | JSDoc                                                                                                                                                                                                           |
| ----------- | ----------------------------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`    | `string`                      | `''`        | false    | In-page `id` of the band, the target of a `#hash` link.                                                                                                                                                         |
| `subjects`  | `SubjectGridSectionSubject[]` | `[]`        | false    | The subject cards, in order; each is `{ slug, title, description, articles }` where every article is `{ label, href }`. Subjects without a title or a linked article are skipped.                               |
| `closing`   | `SubjectGridSectionClosing`   | `undefined` | false    | Call to action across the cells left in the grid's last row; `{ eyebrow, title, titleMuted, description, primaryAction, secondaryAction }` where each action is `{ label, href, trailing?, target? }`. Omitted when absent. |
| `ariaLabel` | `string`                      | `''`        | false    | Accessible name of the band; empty leaves the section unnamed. Set it so the band is a named region landmark.                                                                                                   |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Three columns from the large breakpoint, one below the small one, on `card-grid`'s `fixed` layout (equal tracks whatever the count), so the closing cell spans the cells the subjects leave in the last row (`3 - count % 3` from the large breakpoint, `2 - count % 2` from the small one), never leaving a divider-coloured empty cell; with a count of three times n plus one it takes two thirds of the last row on desktop, as on azion.com's learning page
- Empty: when no subject carries a title and a linked article the band renders nothing — not the grid, not the closing cell

## Motion & Animations

| Trigger                  | Animation / Transition                    | Token (see `contributing/docs/TOKENS.md` § Animations) | Reduced-motion fallback         |
| ------------------------ | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| hover on an article link | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                             | Token (TOKENS.md)          |
| ---------------------------------- | -------------------------- |
| typography (subject title)         | `.text-heading-sm`         |
| typography (description, articles) | `.text-body-sm`            |
| subject title                      | `var(--text-default)`      |
| description and article links      | `var(--text-muted)`        |
| article link hover                 | `var(--text-default)`      |
| card fill                          | `var(--bg-canvas)`         |
| closing cell fill                  | `var(--bg-surface-raised)` |
| card inset                         | `var(--spacing-xl)`        |
| card rhythm                        | `var(--spacing-lg)`        |
| focus ring                         | `var(--ring-color)`        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: each article link draws `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)`; the closing buttons own theirs.
- Keyboard map: `Tab` moves through the article links in reading order, then the closing actions; `Enter` follows one. Nothing else in the band is interactive.
- ARIA: the band is a `<section>` carrying `anchor` as its `id` and named by `ariaLabel` when set, so it becomes a region landmark; each subject is an `h3` over a `role="list"` of links; the closing cell is `call-to-action`'s own section, named by its title.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): titles `var(--text-default)`, descriptions and links `var(--text-muted)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the article link colour transition carries `motion-reduce:transition-none`.
- Touch target ≥40×40 px — the closing actions are large `button`s; article links are inline text links inside a list.

## Internationalization

- No built-in strings: subject titles, descriptions, article labels, the closing copy and `ariaLabel` arrive through props.

## Right-to-left

- Layout: the composed `card-grid` and `call-to-action` use logical utilities, so the grid fills from the inline start.
- Icons: the closing buttons' chevrons mirror (owned by `button`).
- Keyboard: unchanged.

## Responsive

- One subject per row on phones (`mobileColumns: 1`), three columns from the grid's breakpoint up; the closing cell spans two cells from the small breakpoint.
- No horizontal scroll at 320 px.

## Performance

- Bundle budget: 7.5 KB for `./subject-grid-section` gzip in `.size-limit.json`.
- Renders static cards and links; no state, timers or observers.

- Default

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

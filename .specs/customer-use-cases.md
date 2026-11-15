---
name: customer-use-cases
category: section
structure: monolithic
template: 2
status: implemented
spec_version: 5
created: 2026-11-04
last_updated: 2026-11-15
checksum: aafaefd95f71949c32c70fc2706578b2d4da69b1da9428a3e6409a69301807e7
---

# CustomerUseCases — Component Spec

## Purpose

The "what teams use it for" band of a product page: a three-column frame whose first cell carries the band's overline, headline, lead and one call to action, followed by one cell per use case. It is a page section — the site places it from a `{ _id: 'customer-use-cases', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `card-grid`, `registration-frame`, `eyebrow`, `feature-item` and `button` rather than owning any anatomy of its own.

## When to use

- Use CustomerUseCases when the band's title sits in the first grid cell with one action.
- On a product or solution page, right after the opening band, to name the concrete jobs the product is bought for.
- Whenever a page needs three to six short, icon-led use cases with one link out to the documentation.

## When NOT to use

- For a grid of features with artwork → use `feature-tiles`.
- For use cases that each link to their own page, or any grid of claims with no single action → use `capability-grid`.
- Inside another band's cell → compose `feature-item` directly.

## Related

- `feature-item` — the icon, title and description cell each use case is rendered with.
- `card-grid` — the frame grid this band lays its cells in.

## Best practices

- Keep `items` to four or so; the first cell spans two rows at `lg`, so four cases fill the grid exactly.
- Write `title` as the heading the page's outline needs; it is the band's `h2`.
- Give `primaryAction` an `href` to the documentation and set `trailing` so the chevron reads as "go".
- Leave `eyebrow` as the product name; it is the overline the reader scans first.

## Usage

```vue
<script setup>
  import CustomerUseCases from '@aziontech/webkit/customer-use-cases'
</script>

<template>
  <CustomerUseCases
    eyebrow="SQL Database"
    title="What teams use SQL Database for"
    description="Teams use it to:"
    :primary-action="{ label: 'Docs', href: '/docs', trailing: true }"
    :items="[
      {
        icon: 'ai ai-comments',
        title: 'RAG Applications',
        description: 'Build topic-specific chatbots with the data stored in SQL Database.'
      },
      {
        icon: 'ai ai-search',
        title: 'Search Applications',
        description: 'Power search with vector similarity queries on stored embeddings.'
      }
    ]"
  />
</template>
```

## Props

| Prop            | Type                     | Default     | Required | JSDoc                                                                                                                             |
| --------------- | ------------------------ | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `eyebrow`       | `string`                 | `''`        | false    | Eyebrow above the headline in the title cell, closed by the blinking cursor.                                                      |
| `title`         | `string`                 | `''`        | false    | Headline of the band, rendered as its `h2` in the title cell.                                                                     |
| `description`   | `string`                 | `''`        | false    | One-line lead under the headline.                                                                                                 |
| `primaryAction` | `SectionTitleAction`     | `undefined` | false    | Button pinned to the foot of the title cell; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. |
| `items`         | `CustomerUseCasesItem[]` | `[]`        | false    | The use cases rendered as frame cells, in order; each item is `{ icon, title, description }`.                                     |
| `anchor`        | `string`                 | `''`        | false    | In-page id set on the band so a hash link can target it.                                                                          |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing — not the title cell, not the frame — because a use-case band with no use cases is absent from the page, not an `empty-state`
- The title cell spans two rows from `lg`, so four items fill a three-column grid exactly

## Motion & Animations

_none_

## Tokens

| Region                | Token (DESIGN.md)       |
| --------------------- | ----------------------- |
| typography (headline) | `.text-heading-lg`      |
| typography (lead)     | `.text-body-md`         |
| headline text         | `var(--text-default)`   |
| lead text             | `var(--text-muted)`     |
| title cell rhythm     | `var(--spacing-md)`     |
| lead to action gap    | `var(--spacing-xl)`     |
| frame rules and marks | `var(--border-default)` |
| cell fill             | `var(--bg-canvas)`      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `button`, whose anchor carries the `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: `Tab` reaches the action link; `Enter` follows it. Nothing else in the band is interactive.
- ARIA: the band is a `<section>` labelled by its `h2` (`aria-labelledby`); each use case is a `feature-item` with an `h3`, so the outline reads band → use cases. The overline is decorative text.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): headline `var(--text-default)`, lead `var(--text-muted)`; icon colours are `feature-item`'s.
- `motion-reduce:transition-none motion-reduce:transform-none` — the overline cursor and the button's hover belong to `eyebrow` and `button`, which carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the action is a large `button`.

## Internationalization

- No built-in strings: the eyebrow, title, description, items and action label are marketing copy passed through props.

## Right-to-left

- Layout: the composed `card-grid`, `registration-frame` and `feature-item` use logical utilities, so the intro cell sits at the inline start.
- Icons: the trailing chevron of the action is the `button`'s own and follows its mirroring.
- Keyboard: unchanged.

## Responsive

- Below large the intro cell and the use cases stack in one column; from large the intro cell spans two rows beside the use cases.
- No horizontal scroll at 320 px.

## Performance

- Bundle budget: 7 KB for `./customer-use-cases` gzip in `.size-limit.json`.
- Renders a handful of static cells; no state, timers or observers.

## Examples

- Default

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

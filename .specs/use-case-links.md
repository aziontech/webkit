---
name: use-case-links
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-04
last_updated: 2026-11-12
checksum: d85a992f4be59d280816a04f923d9d554ca02885cbb8ef2394a3c59dbdb8d3d6
---
# UseCaseLinks — Component Spec

## Purpose

The use-case directory band of a solution page: a left-aligned section title over a divider grid of linked topics, one per use case, each an icon, a heading and a sentence that link to the page that explains it — or, when the items carry no `href`, a plain grid of the same topics with nothing to follow. It is a page section — the site places it from a `{ _id: 'use-case-links', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `section-title`, `frame-box`, `card-grid` and `topic` rather than owning anatomy of its own.

## When to use

- When every use case has its own page and the band's job is to route the reader there.
- For three or six use cases of equal weight, in a three-column grid.
- For a link-less use-case grid under a left-aligned title (the KV Store page's "Use cases"): leave out every `href`.

## When NOT to use

- When the use cases carry no link and the band leads with one call to action → use `use-cases`.
- For features with artwork → use `feature-tiles`.

## Related

- `use-cases` — the sibling band with a title cell and one action instead of a link per case.
- `topic` — the linked icon-heading-sentence cell each use case is rendered with.

## Best practices

- Keep the count a multiple of three so the divider grid closes cleanly.
- Link every item or none: an item without `href` renders as a plain topic (no link, no arrow), and a band that mixes both reads as broken.
- Keep `description` to one sentence; the row height follows the longest cell.

## Usage

```vue
<script setup>
import UseCaseLinks from '@aziontech/webkit/use-case-links'
</script>

<template>
  <UseCaseLinks
    eyebrow="Use Cases"
    title="What teams use Application Accelerator for"
    description="Cache what standard CDN caching cannot, with the methods, query strings and cookies you choose."
    :items="[
      { icon: 'pi pi-code', title: 'Accelerate REST and GraphQL APIs', description: 'Cache API responses with query string and cookie-based segmentation.', href: '/solutions/api-gateway' },
      { icon: 'pi pi-bolt', title: 'Reduce API latency', description: 'Short TTLs for rapidly changing data endpoints.', href: '/docs' }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the left-aligned section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `items` | `UseCaseLinksItem[]` | `[]` | false | The use cases rendered as linked topics in a three-column divider grid, in order; each item is `{ icon, title, description, href? }`; an item without `href` renders as a plain, unlinked topic. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; `eyebrow` and `description` ride with it
- The items sit on `card-grid`'s balanced divider grid, three across from `lg`: a count that splits evenly fills every row (4 → 2 × 2), and a short last row keeps the column width with its trailing cell left empty, as on azion.com (5 → 3 + 2)
- An item with an `href` is a link (the whole cell, with the topic's link cue); an item without one is a plain topic, so a band with no `href` at all has no links

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| cell fill | `var(--bg-canvas)` |
| cell inset | `var(--spacing-xl)` |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `topic`, whose link carries the `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: `Tab` moves between the use-case links; `Enter` follows one.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2` and each use case is a `topic` with an `h3`, so the outline reads band → use cases.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): typography and colours belong to `section-title` and `topic`.
- `motion-reduce:transition-none motion-reduce:transform-none` — `topic`'s hover carries its own fallback; this band adds no motion.
- Touch target ≥40×40 px — each topic link spans its whole cell.

## Examples

- Default
- Without links — the same grid with no `href`, plain topics under a left title.

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

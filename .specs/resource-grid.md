---
name: resource-grid
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 0e6e6078b25eaf3aabe0c73482f6dcfee340cb7945501abb580dea87762c3d19
---
# ResourceGrid — Component Spec

## Purpose

A band that points readers to further reading on solution pages: an overline, a headline and a short lead with an optional button sit beside a two-column frame grid of linked resource cards, each a title and one sentence. A card whose link leaves the site opens in a new tab; past four cards the grid scrolls inside a fading scroll area so the band keeps its height. It is a page section — the site places it from a `{ _id: 'resource-grid', props }` entry and binds `props` straight onto it — and it composes `section-module`, `media-split`, `card-grid`, `topic`, `scroll-area` and `button`.

## When to use

- To close a solution page with documentation, articles and stories that go deeper into it.

## When NOT to use

- For related articles with covers → use `article-cards`.
- For linked use cases with media → use `use-case-links`.

## Related

- `media-split` — the copy-beside-media band that owns the heading and the named region.
- `topic` — the linked title-and-sentence cell each card is rendered with.

## Best practices

- Keep four cards for a full grid; more than four scroll.
- Give a card a full `http` link only when it leaves the site, so only those open in a new tab.

## Usage

```vue
<script setup>
import ResourceGrid from '@aziontech/webkit/sections/resource-grid'
</script>

<template>
  <ResourceGrid
    eyebrow="Go Deeper"
    title="Guides and Resources"
    description="Documentation, articles, and customer stories on building on a distributed architecture."
    :items="[
      { title: 'New to Azion? Start here', description: 'A guide to your first steps with Azion.', href: '/docs' },
      { title: 'Learning Center', description: 'Practical knowledge to speed up, secure, and scale applications.', href: '/learning' }
    ]"
    :primary-action="{ label: 'See all guides', href: '/docs/guides', trailing: true }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Overline above the headline. |
| `title` | `string` | `''` | false | Headline of the band, which also names its region and the scroll area. |
| `description` | `string` | `''` | false | Lead sentence beside the grid. |
| `items` | `ResourceGridItem[]` | `[]` | false | The resource cards, in order; each is `{ title, description?, href }`, and a card with no title is skipped. |
| `primaryAction` | `ResourceGridAction` | `undefined` | false | Button under the copy; dropped when its label or link is missing. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` and `focus-visible` on each card (owned by `topic`)
- `data-scrollable` is set when more than four cards render, and the grid scrolls inside a fading scroll area
- Empty: when no item has a title the band renders nothing
- The button renders only when `primaryAction` has a label and a link

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| card fill | `var(--bg-surface)` (owned by `card-grid-cell`) |
| frame rules | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `topic` and `button`.
- Keyboard map: `Tab` moves card to card, then to the button; `Enter` follows the link. The scroll area is keyboard-scrollable.
- ARIA: `media-split` renders the named region and the headline (`h2`); the root is a plain `div` so the band has one landmark; each card's title is an `h3`; the scroll area is named by the title; external cards carry `target="_blank"` and `rel="noopener noreferrer"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `media-split` and `topic`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — every card is a full-cell link.

## Stories (Storybook)

- Default
- Scrollable — six cards, so the grid scrolls inside the band.

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

---
name: doc-card-group
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: 685caa6fee3906771dc65b5c0303090261b79f45294a2c72d41911022127d131
created: 2026-08-22
last_updated: 2026-08-22
---

# DocCardGroup — Component Spec

## Purpose

The framed, responsive grid a `DocCard` set sits in. The group is the frame, not each card: `FrameBox` draws the perimeter and the four corner registration marks once around the whole set, the grid keeps 1px gaps, and every cell paints a 1px ring into them — so two neighbours share one hairline, an incomplete last row stays simply empty, and the set reads as one object the reader scans across rather than as loose tiles. `cols` names the widest column count; the grid always steps down toward one column on a phone unless a set of tiny cells opts into two with `mobileCols`.

## When to use

- Around every `DocCard` set — a card outside a group has no frame and no cell ring.
- The fan-out at the top of a landing or section-index page: product tiles, a framework grid, a "what you can build" band.

## When NOT to use

- When each entry needs a full-measure sentence to be understood — use `DocItem` rows, one column, instead of cells.
- As a general-purpose layout grid for application screens; it is documentation chrome, tied to the `DocProse` ladder.

## Related

- `DocCard` — the cell this frames; the group draws the perimeter and the cells paint the internal rules.
- `FrameBox` — the layout primitive that draws the frame and the corner registration marks.
- `DocProse` — the contract around it; `data-doc-block` puts the group on the block rung of the prose ladder.

## Best practices

- Pick `cols` for the widest screen and let the breakpoints do the rest; do not wrap the group in another grid.
- Leave `mobileCols` at 1 unless every cell is a mark plus one word — a card with copy needs the whole phone width.
- Let an incomplete last row be empty; do not stretch the last card to fill it.

## Usage

```vue
<script setup>
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
</script>

<template>
  <DocCardGroup :cols="2">
    <DocCard
      title="Edge Application"
      icon="pi pi-server"
      href="/docs/edge-application"
    >
      Serve and cache your application at the edge, close to the people using it.
    </DocCard>
    <DocCard
      title="Edge Firewall"
      icon="pi pi-shield"
      href="/docs/edge-firewall"
    >
      Filter and secure traffic before it reaches your origin.
    </DocCard>
  </DocCardGroup>
</template>
```

## Props

| Prop         | Type               | Default | Required | JSDoc                                                                         |
| ------------ | ------------------ | ------- | -------- | ----------------------------------------------------------------------------- |
| `cols`       | `1 \| 2 \| 3 \| 4` | `2`     | false    | Column count at the large breakpoint.                                         |
| `mobileCols` | `1 \| 2`           | `1`     | false    | Column count on a phone. Two only pays when the cells are a mark plus a word. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                   |
| --------- | ----- | ----------------------- |
| `default` | —     | The `DocCard` children. |

## States

- Visual states: `default` (the component is not interactive and holds no state)
- `data-cols` and `data-mobile-cols` mirror the props; Tailwind data-variants switch the grid's column count on them at the `sm` and `lg` breakpoints
- `data-doc-block` is the `DocProse` contract (the group takes the block rung of the ladder)

## Motion & Animations

_none_

## Tokens

| Region           | Token (DESIGN.md)       |
| ---------------- | ----------------------- |
| rule (cell ring) | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the group is not focusable; a linked `DocCard` inside it carries its own inset focus ring.
- Keyboard map: none of its own — `Tab` moves through the linked cards in DOM order, which follows the grid's reading order.
- ARIA: no role is added; the group is pure layout, so assistive tech reads the cards as a plain sequence of links.
- Contrast: the frame and the hairline rules are decorative; every readable surface belongs to the cells, which own their contrast.
- Touch target: not applicable; the component itself is not interactive.

## Stories (Storybook)

- Default — two linked cards on the default two-column grid.
- Columns — composite story at `cols` 3, this component's single variant axis (the column count), shown at an odd count so the incomplete-last-row behaviour is visible. It is the Types story under a name that matches the axis, justified here because the axis is numeric rather than a `kind`.

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

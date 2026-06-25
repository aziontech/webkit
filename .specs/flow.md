---
name: flow
category: data
structure: composition
status: approved
spec_version: 1
figma:
  url:
  node_id:
checksum: 1639b821be408187cef9eb07bd4b08f9cf22f7b3e802b85f44f28f50284ba0d5
created: 2026-06-25
last_updated: 2026-06-25
---

# Flow — Component Spec

## Purpose

Flow renders a directed flow diagram: a vertical sequence of steps (`flow-node`) joined by decorative connectors, with optional parallel branches (`flow-parallel`) and custom attachment points (`flow-anchor`). Use it to visualize pipelines, workflows, and step-by-step processes inside a data view; unlike `data-table` it expresses ordered/branching relationships rather than tabular records. Design source (rewritten to our conventions, never inherited as-is): the kumo "Flow" component group at https://kumo-ui.com/components/flow/. Scope boundary: large diagrams pan via a native `overflow: auto` scroll container on the root — free 2D drag-pan is intentionally out of scope (it would require an external positioning library forbidden by `.claude/rules/dependencies.md`). There is no Figma frame for this component; tokens are inferred from intent and recorded in the Theme gaps table.

## Usage

```vue
<script setup>
import Flow from '@aziontech/webkit/flow'
import FlowList from '@aziontech/webkit/flow-list'
import FlowNode from '@aziontech/webkit/flow-node'
import FlowParallel from '@aziontech/webkit/flow-parallel'
import FlowAnchor from '@aziontech/webkit/flow-anchor'
</script>

<template>
  <Flow align="center">
    <FlowList>
      <FlowNode>Source</FlowNode>
      <FlowNode>
        Transform
        <FlowAnchor type="end" />
      </FlowNode>
      <FlowParallel align="start">
        <FlowList>
          <FlowNode>Cache</FlowNode>
          <FlowNode disabled>Archive</FlowNode>
        </FlowList>
        <FlowList>
          <FlowNode>Deliver</FlowNode>
        </FlowList>
      </FlowParallel>
    </FlowList>
  </Flow>
</template>
```

## Sub-components

- `flow-node/flow-node.vue` — A single step in the flow. Connectors that touch a disabled node render at reduced opacity (mirrored by `data-disabled`). Content via the `default` slot.
- `flow-anchor/flow-anchor.vue` — Marks a custom connector attachment point inside a node. `type` restricts the anchor to the incoming (`start`) or outgoing (`end`) connector; omitted means both. Content via the `default` slot.
- `flow-parallel/flow-parallel.vue` — Container that lays out parallel branches side by side with junction connectors. `align` controls the horizontal alignment of the branches.
- `flow-list/flow-list.vue` — Container for a sequence of `flow-node` with automatic connectors drawn between consecutive nodes. Content via the `default` slot.

<!-- Resulting layout (composition):

  packages/webkit/src/components/data/flow/
  ├── flow.vue
  ├── package.json
  ├── injection-key.ts            (shared by every sub-component; one directory up from each sub-component)
  ├── flow-node/
  │   ├── flow-node.vue
  │   └── package.json
  ├── flow-anchor/
  │   ├── flow-anchor.vue
  │   └── package.json
  ├── flow-parallel/
  │   ├── flow-parallel.vue
  │   └── package.json
  └── flow-list/
      ├── flow-list.vue
      └── package.json

  Public exports in packages/webkit/package.json#exports stay flat
  (`./flow`, `./flow-node`, `./flow-anchor`, `./flow-parallel`, `./flow-list`). -->

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `align` | `'start' \\| 'center'` | `'start'` | no | Vertical alignment of nodes within the diagram. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Diagram content: `flow-list`, `flow-node`, `flow-parallel`. |

## States

- Visual states: `default`, `focus-visible`, `disabled`
- `data-disabled` mirrors the `disabled` prop on `flow-node`
- `data-align` mirrors the `align` prop on `flow` and `flow-parallel`
- `data-type` mirrors the `type` prop on `flow-anchor`

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (node label) | `.text-body-md` |
| typography (compact label) | `.text-label-md` |
| node surface | `var(--bg-surface)` |
| node border | `var(--border-default)` |
| node text | `var(--text-default)` |
| connector stroke | `var(--border-default)` |
| disabled text | `var(--text-disabled)` |
| spacing | `var(--spacing-md)` |
| shape | `var(--shape-button)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| raised node surface (`bg-surface-raised`) | `var(--bg-surface)` | TODO: tokenizar `--bg-surface-raised` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` moves focus through focusable nodes in document order; no arrow-key roving (the diagram is a static list/group).
- ARIA: root `flow` is `role="list"`; each `flow-node` is `role="listitem"` with accessible text content; `flow-parallel` is `role="group"`; connectors and anchors are decorative and carry `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` not required — the component is static (no motion).
- Touch target ≥40×40 px where a node is interactive.

## Stories (Storybook)

Composite stories are justified below because Flow is a composition component whose value is in how parts compose, not in a single `kind`/`size` axis:

- Default — a sequential `flow-list` of `flow-node` joined by connectors.
- Parallel — a `flow-parallel` rendering parallel branches with junction connectors (demonstrates the composition that a single `kind`/`size` axis cannot).
- Disabled — a `flow-node` with the `disabled` prop, showing the reduced-opacity connectors.

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
</content>
</invoke>

---
name: flow
category: data
structure: composition
status: approved
spec_version: 2
figma:
  url: https://www.figma.com/design/y38AUdg5uXuMeXofUkOxv6/Illustrations?node-id=129-2056
  node_id: 129:2056
checksum: d2f63e195f987c1389469b6e22288c1f9bc99cb0b48d53cf42493d9294bebcb9
created: 2026-06-25
last_updated: 2026-08-04
---

# Flow — Component Spec

## Purpose

Flow renders a directed flow diagram: a horizontal sequence of steps (`flow-node`) joined by decorative connectors, with optional parallel branches (`flow-parallel`) and custom connector-attachment points (`flow-anchor`). Use it to visualize pipelines, workflows, and step-by-step processes inside a data view; unlike `data-table` it expresses ordered/branching relationships rather than tabular records. Steps are written as direct children of `flow`; a `flow-parallel` between two steps fans out from the previous step and fans back into the next, and a `flow-parallel` at the start/end fans only inward/outward (no dangling stubs). A node can be styled (the default box) or `unstyled` so its slot content defines the entire node — a dot, a tall card, a multi-row card — while connectors still attach correctly, optionally at `flow-anchor` points inside the node. Connectors run port-to-port: a styled node renders a small square **connector port** just outside each of its edges, and a `flow-anchor` renders one outside the edge it attaches to, so a line always terminates on a visible attachment point instead of a bare edge (the port is the endpoint treatment — connectors carry no arrowheads). The port sits fully clear of the box rather than overlapping it, so neither the node's surface nor its focus ring crops it. A port is only rendered where a connector actually attaches: the leading child has no incoming connector and the trailing child no outgoing one, so those two edges show no port and the chain opens and closes on a node rather than on a stub. An `unstyled` node renders no ports, because its slot content owns its appearance; put a `flow-anchor` inside it to place ports on the parts a connector should touch. Design source (rewritten to our conventions, never inherited as-is): the kumo "Flow" component group at https://kumo-ui.com/components/flow/. Scope boundary: large diagrams pan via a native `overflow: auto` scroll container on the root — free 2D drag-pan is intentionally out of scope (it would require an external positioning library forbidden by `.claude/rules/dependencies.md`). The connector port is specified by the Figma frame in the frontmatter; the remaining tokens are inferred from intent and recorded in the Theme gaps table.

## Usage

Composition mode — one import of the root; every part is reached via dot-notation (`<Flow.Node>`, `<Flow.Parallel>`, `<Flow.Anchor>`). The root binding must be PascalCase (`Flow`); `flow` lowercase would not resolve to the component.

```vue
<script setup>
import Flow from '@aziontech/webkit/flow'
</script>

<template>
  <Flow align="center">
    <Flow.Node>Load balancer</Flow.Node>
    <Flow.Node unstyled>
      <div class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-overlay)">
        <Flow.Anchor type="end">
          <div class="flex h-10 items-center px-(--spacing-sm) text-label-md text-(--text-muted)">
            my-worker
          </div>
        </Flow.Anchor>
        <Flow.Anchor type="start">
          <div class="m-(--spacing-xxs) mt-0 rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xxs) text-label-md text-(--text-default)">
            Bindings
          </div>
        </Flow.Anchor>
      </div>
    </Flow.Node>
    <Flow.Parallel>
      <Flow.Node>DATABASE</Flow.Node>
      <Flow.Node>OTHER_SERVICE</Flow.Node>
    </Flow.Parallel>
  </Flow>
</template>
```

Each part is also a standalone import (`import FlowNode from '@aziontech/webkit/flow-node'`, …), and the root is published standalone (tree-shakeable) as `@aziontech/webkit/flow-root` — the path to use when only a few parts are needed.

## Sub-components

- `flow-node/flow-node.vue` — A single step in the flow. Renders the default node box; `unstyled` drops the box so the `default` slot defines the node's appearance (a dot, a card, a tall node). `disabled` marks the step disabled, rendering adjacent connectors at reduced opacity (mirrored by `data-disabled`). `terminal` ends the node's branch: it still receives an incoming connector but originates none, so the chain continues through its siblings while the branch stops there — the shape a **leaf** needs (an attached resource that hangs off the chain rather than passing it on). A terminal node therefore renders no outgoing port. Content via the `default` slot.
- `flow-anchor/flow-anchor.vue` — Marks a connector-attachment point inside a node and wraps the content that the connector should touch. `type="end"` is the incoming endpoint, `type="start"` the outgoing origin; omitted marks both. Content via the `default` slot.
- `flow-parallel/flow-parallel.vue` — Container whose direct `flow-node` children are laid out as parallel branches stacked vertically; the `flow` root draws the fan-out/fan-in junction connectors. `align` controls the horizontal alignment of the branches.

<!-- Resulting layout (composition):

  packages/webkit/src/components/data/flow/
  ├── flow.vue
  ├── index.ts                    (entry: attaches Flow.Node / Flow.Parallel / Flow.Anchor)
  ├── connectors.ts               (connector geometry composable, used by flow.vue)
  ├── injection-key.ts            (shared by every sub-component; one directory up from each sub-component)
  ├── flow-node/
  │   └── flow-node.vue
  ├── flow-anchor/
  │   └── flow-anchor.vue
  └── flow-parallel/
      └── flow-parallel.vue

  The compound `./flow` entry (index.ts) attaches the sub-components for
  dot-notation (`Flow.Node`, `Flow.Parallel`, `Flow.Anchor`) and re-exports them
  as named bindings from `@aziontech/webkit/flow`. The root is also published
  standalone (tree-shakeable) as `./flow-root`, and each sub-component as a flat
  export (`./flow-node`, `./flow-parallel`, `./flow-anchor`). There is no
  per-component `package.json` — the root `packages/webkit/package.json#exports`
  points every public path directly at source. -->

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `align` | `'start' \\| 'center'` | `'start'` | no | Vertical alignment of nodes within the diagram. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Diagram content: `flow-node` and `flow-parallel`, in flow order. |

## States

- Visual states: `default`, `focus-visible`, `disabled`
- `data-disabled` mirrors the `disabled` prop on `flow-node`
- `data-styled` is present on `flow-node` unless `unstyled` (gates the default box utilities)
- `data-align` mirrors the `align` prop on `flow` and `flow-parallel`
- `data-flow-anchor` mirrors the `type` prop on `flow-anchor` (`start` / `end` / `both`)
- `data-flow-port` marks a connector port and selects the edge it sits on (`start` = outgoing / right, `end` = incoming / left). Emitted on both edges of a styled `flow-node`, and on the attaching edge(s) of a `flow-anchor`. The port sits entirely **outside** the box, flush against that edge — never inside it, so the node's surface and its `focus-visible` ring cannot crop the port
- Port appearance follows the enclosing node: solid border by default, `border-dashed` under `data-disabled`
- `data-flow-terminal` mirrors the `terminal` prop on `flow-node`. The composable drops that branch's exit, so no connector is drawn leaving it; the root additionally hides any outgoing port inside it (including one rendered by a nested `flow-anchor`)
- `data-flow-leading` / `data-flow-trailing` are stamped by the connector composable on the first / last direct child of the diagram (both, when there is only one). The root hides the ports on those outer edges, because no connector reaches them. They are attributes rather than `:first-child` / `:last-child` rules because the connector `<svg>` is a sibling of the nodes in the same container
- A consuming component that wraps a node in its own card must not clip it (`overflow-hidden`): the ports are positioned outside the anchor's box, so a clipping ancestor renders them invisible
- `data-faded` marks a connector path whose endpoint node is disabled (drives the reduced opacity)

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| connector at rest (always, on every drawn connector) | `stroke-dasharray="4 4"` + `animate-flow-dash` — marching dashes along the stroke (`stroke-dashoffset` 24 → 0, 700ms linear infinite), so a connection reads as a live link rather than a static rule | `animate-flow-dash` (catalog) | `motion-reduce:animate-none` |
| connector whose endpoint node is `disabled` | motion suppressed via `data-[faded]:animate-none` — the dashes stay, the flow stops, because a disabled step is not carrying anything | — | already static |

> The dash cycle (8) divides the keyframe's travel (24), so the loop repeats seamlessly. A `stroke-dasharray` whose cycle does not divide 24 would visibly jump on each repeat. `linear` is deliberate: an endlessly looping animation must not accelerate, or the seam between repeats becomes visible (same reasoning as `spin` / `shimmer` in the catalog).

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (node label) | `.text-label-md` |
| node surface | `var(--bg-surface-raised)` |
| node border | `var(--border-default)` |
| node elevation | `var(--shadow-xs)` |
| node text | `var(--text-default)` |
| connector stroke | `var(--accent)` |
| connector port fill | `var(--accent)` |
| connector port border | `var(--border-muted)` |
| connector port shape | `var(--radius-sm)` |
| border width | `var(--border-width-default)` |
| disabled text | `var(--text-disabled)` |
| spacing | `var(--spacing-md)`, `var(--spacing-sm)`, `var(--spacing-xl)` |
| shape | `var(--shape-button)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `flow-dash` animation | added to `primitives/animations/{keyframes,animate}.js` (`--animate-flow-dash`) | done (this change) — the catalog had no stroke-dash animation |
| raised node surface (`bg-surface-raised`) | `var(--bg-surface-raised)` | TODO: confirm `--bg-surface-raised` is the canonical raised token |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` moves focus through focusable nodes in document order; no arrow-key roving (the diagram is a static list/group).
- ARIA: root `flow` is `role="list"`; each `flow-node` is `role="listitem"` with accessible text content; `flow-parallel` is `role="group"`; the connector SVG is decorative and carries `aria-hidden="true"`, as does every connector port (`data-flow-port`) — the ports are a visual attachment affordance and carry no meaning for AT. A `flow-anchor` wraps meaningful node content and is therefore not hidden.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` not required — the component is static (no motion).
- Touch target ≥40×40 px where a node is interactive.

## Stories (Storybook)

Composite stories are justified below because Flow is a composition component whose value is in how parts compose, not in a single `kind`/`size` axis:

- Default — a sequential flow of `flow-node` joined by connectors.
- Parallel — a `flow-parallel` fanning out and back in between two nodes (demonstrates the composition that a single `kind`/`size` axis cannot).
- Branches — leading and trailing `flow-parallel` (fan-in then fan-out), proving connectors route correctly at the edges of the sequence.
- CustomNodes — `unstyled` nodes whose slot content defines the appearance (a start dot, a tall node, a multi-row card with `flow-anchor` attachment points).
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

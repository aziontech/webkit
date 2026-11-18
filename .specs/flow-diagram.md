---
name: flow-diagram
category: data
structure: composition
status: implemented
spec_version: 8
figma:
  url: https://www.figma.com/design/y38AUdg5uXuMeXofUkOxv6/Illustrations?node-id=129-2056
  node_id: 129:2056
checksum: c0bb306945dacf30a13822e3748ac680713e4e41f43fa25725b75d3f88e82272
created: 2026-06-25
last_updated: 2026-11-18
---

# FlowDiagram — Component Spec

## Purpose

FlowDiagram renders a directed flow diagram: a horizontal sequence of steps (`flow-diagram-node`) joined by decorative connectors, with optional parallel branches (`flow-diagram-parallel`) and custom connector-attachment points (`flow-diagram-anchor`). Use it to visualize pipelines, workflows, and step-by-step processes inside a data view; unlike `table` it expresses ordered/branching relationships rather than tabular records. Steps are written as direct children of `flow-diagram`; a `flow-diagram-parallel` between two steps fans out from the previous step and fans back into the next, and a `flow-diagram-parallel` at the start/end fans only inward/outward (no dangling stubs). A node can be styled (the default box) or `unstyled` so its slot content defines the entire node — a dot, a tall card, a multi-row card — while connectors still attach correctly, optionally at `flow-diagram-anchor` points inside the node. Connectors run port-to-port: a styled node renders a small square **connector port** just outside each of its edges, and a `flow-diagram-anchor` renders one outside the edge it attaches to, so a line always terminates on a visible attachment point instead of a bare edge (the port is the endpoint treatment — connectors carry no arrowheads). The port sits fully clear of the box rather than overlapping it, so neither the node's surface nor its focus ring crops it. A port is only rendered where a connector actually attaches: the leading child has no incoming connector and the trailing child no outgoing one, so those two edges show no port and the chain opens and closes on a node rather than on a stub. An `unstyled` node renders no ports, because its slot content owns its appearance; put a `flow-diagram-anchor` inside it to place ports on the parts a connector should touch. Design source (rewritten to our conventions, never inherited as-is): the kumo "Flow" component group at https://kumo-ui.com/components/flow-diagram/. Scope boundary: large diagrams pan via a native `overflow: auto` scroll container on the root — free 2D drag-pan is intentionally out of scope (it would require an external positioning library forbidden by `.claude/rules/dependencies.md`). The connector port is specified by the Figma frame in the frontmatter; the remaining tokens are inferred from intent and recorded in the Theme gaps table.

## When to use

- Showing an ordered pipeline or request path as steps joined by connectors — build → deploy → serve, or a request through a load balancer, a function and its bindings.
- A request path whose steps must read as equal boxes (You → Azion → Application) — set `uniform`. A path whose hops carry a status and details uses `topology-diagram` instead, as the edge error page does.
- A step fans out to several parallel targets and (optionally) back in — wrap those steps in `FlowDiagram.Parallel`.
- A node with custom content (a card with several rows) where connectors must touch specific parts — mark them with `FlowDiagram.Anchor`.

## When NOT to use

- One of the official architecture drawings, or a node-and-connector picture for a marketing page → use `diagram`.
- Tabular records with no ordering between them → use `table`.
- A numbered set of instructions in documentation → use `doc-steps`.

## Related

- `diagram` — marketing architecture drawings from a closed library or a one-off spec; `flow-diagram` is the in-product, hand-composed pipeline.
- `doc-steps` — an ordered walkthrough of text steps joined by a rail, not connected nodes.
- `table` — records without ordered or branching relationships.

## Best practices

- Write steps as direct children of `FlowDiagram` in flow order; connectors are drawn between siblings, so wrapping nodes in extra elements breaks the chain.
- Use `unstyled` when the slot content is the whole node, and put a `FlowDiagram.Anchor` (`side="end"` incoming, `side="start"` outgoing) on each part a connector should touch — an unstyled node renders no ports of its own.
- Mark a leaf that hangs off the chain with `terminal`; it receives a connector but sends none on.
- Do not clip a node with `overflow-hidden` in a wrapping card — the connector ports sit outside the node's box and would disappear.
- Let a wide flow scroll in its own container; the root is an `overflow: auto` region, and there is no drag-to-pan.

## Usage

Composition mode — one import of the root; every part is reached via dot-notation (`<FlowDiagram.Node>`, `<FlowDiagram.Parallel>`, `<FlowDiagram.Anchor>`). The root binding must be PascalCase (`FlowDiagram`); `flow-diagram` lowercase would not resolve to the component.

```vue
<script setup>
  import FlowDiagram from '@aziontech/webkit/flow-diagram'
</script>

<template>
  <FlowDiagram align="center">
    <FlowDiagram.Node>Load balancer</FlowDiagram.Node>
    <FlowDiagram.Node unstyled>
      <div
        class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-overlay)"
      >
        <FlowDiagram.Anchor side="end">
          <div class="flex h-10 items-center px-(--spacing-sm) text-label-md text-(--text-muted)">
            my-worker
          </div>
        </FlowDiagram.Anchor>
        <FlowDiagram.Anchor side="start">
          <div
            class="m-(--spacing-2xs) mt-0 rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-2xs) text-label-md text-(--text-default)"
          >
            Bindings
          </div>
        </FlowDiagram.Anchor>
      </div>
    </FlowDiagram.Node>
    <FlowDiagram.Parallel>
      <FlowDiagram.Node>DATABASE</FlowDiagram.Node>
      <FlowDiagram.Node>OTHER_SERVICE</FlowDiagram.Node>
    </FlowDiagram.Parallel>
  </FlowDiagram>
</template>
```

Each part is also a standalone import (`import FlowDiagramNode from '@aziontech/webkit/flow-diagram-node'`, …), and the root is published standalone (tree-shakeable) as `@aziontech/webkit/flow-diagram-root` — the path to use when only a few parts are needed.

## Sub-components

- `flow-diagram-node/flow-diagram-node.vue` — A single step in the flow. Renders the default node box; `unstyled` drops the box so the `default` slot defines the node's appearance (a dot, a card, a tall node). `disabled` marks the step disabled, rendering adjacent connectors at reduced opacity (mirrored by `data-disabled`). `terminal` ends the node's branch: it still receives an incoming connector but originates none, so the chain continues through its siblings while the branch stops there — the shape a **leaf** needs (an attached resource that hangs off the chain rather than passing it on). A terminal node therefore renders no outgoing port. Content via the `default` slot.
- `flow-diagram-anchor/flow-diagram-anchor.vue` — Marks a connector-attachment point inside a node and wraps the content that the connector should touch. Prop `side?: 'start' | 'end'` (default `undefined`): `side="end"` is the incoming endpoint, `side="start"` the outgoing origin; omitted marks both. Content via the `default` slot. Its class merges with the consumer's through Vue's own class merge (no `cn`).
- `flow-diagram-parallel/flow-diagram-parallel.vue` — Container whose direct `flow-diagram-node` children are laid out as parallel branches stacked vertically; the `flow-diagram` root draws the fan-out/fan-in junction connectors. `align?: 'start' | 'end'` (default `'start'`) controls the horizontal alignment of the branches. Its class merges with the consumer's through Vue's own class merge (no `cn`).

<!-- Resulting layout (composition):

  packages/webkit/src/components/data/flow-diagram/
  ├── flow.vue
  ├── index.ts                    (entry: attaches FlowDiagram.Node / FlowDiagram.Parallel / FlowDiagram.Anchor)
  ├── connectors.ts               (connector geometry composable, used by flow.vue)
  ├── injection-key.ts            (shared by every sub-component; one directory up from each sub-component)
  ├── flow-diagram-node/
  │   └── flow-diagram-node.vue
  ├── flow-diagram-anchor/
  │   └── flow-diagram-anchor.vue
  └── flow-diagram-parallel/
      └── flow-diagram-parallel.vue

  The compound `./flow-diagram` entry (index.ts) attaches the sub-components for
  dot-notation (`FlowDiagram.Node`, `FlowDiagram.Parallel`, `FlowDiagram.Anchor`) and re-exports them
  as named bindings from `@aziontech/webkit/flow-diagram`. The root is also published
  standalone (tree-shakeable) as `./flow-diagram-root`, and each sub-component as a flat
  export (`./flow-diagram-node`, `./flow-diagram-parallel`, `./flow-diagram-anchor`). There is no
  per-component `package.json` — the root `packages/webkit/package.json#exports`
  points every public path directly at source. -->

## Props

| Prop      | Type                  | Default   | Required | JSDoc                                                                                          |
| --------- | --------------------- | --------- | -------- | ---------------------------------------------------------------------------------------------- |
| `align`   | `'start' \| 'center'` | `'start'` | false    | Vertical alignment of nodes within the diagram.                                                |
| `uniform` | `boolean`             | `false`   | false    | Gives every step the width and height of the largest one, so the steps line up as equal boxes. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                            |
| --------- | ----- | -------------------------------------------------------------------------------- |
| `default` | —     | Diagram content: `flow-diagram-node` and `flow-diagram-parallel`, in flow order. |

## States

- Visual states: `default`, `focus-visible`, `disabled`
- `data-disabled` mirrors the `disabled` prop on `flow-diagram-node`
- `data-styled` is present on `flow-diagram-node` unless `unstyled` (gates the default box utilities)
- `data-align` mirrors the `align` prop on `flow-diagram` and `flow-diagram-parallel`
- `data-uniform` mirrors the `uniform` prop on the inner container of `flow-diagram`: the steps become equal columns of a grid (each as wide as the widest step) and every step stretches to the tallest one, so a request path whose steps carry different amounts of text still reads as a row of identical boxes. `align` has no effect while `uniform` is set, because every step fills the row's height
- Part markers are `data-slot`: `flow-diagram-node`, `flow-diagram-parallel`, `flow-branches` (the nested list of a parallel step), `flow-diagram-anchor` and `flow-port`
- `data-side` mirrors the `side` prop on `flow-diagram-anchor` (`start` / `end`; absent when the anchor attaches on both edges)
- The root provides `testId` and `align` as computed refs, so a changed `data-testid` or `align` reaches every sub-component
- `data-slot="flow-port"` marks a connector port and its `data-side` selects the edge it sits on (`start` = outgoing / right, `end` = incoming / left). Emitted on both edges of a styled `flow-diagram-node`, and on the attaching edge(s) of a `flow-diagram-anchor`. The port sits entirely **outside** the box, flush against that edge — never inside it, so the node's surface and its `focus-visible` ring cannot crop the port
- Port appearance follows the enclosing node: solid border by default, `border-dashed` under `data-disabled`
- `data-flow-terminal` mirrors the `terminal` prop on `flow-diagram-node`. The composable drops that branch's exit, so no connector is drawn leaving it; the root additionally hides any outgoing port inside it (including one rendered by a nested `flow-diagram-anchor`)
- `data-flow-leading` / `data-flow-trailing` are stamped by the connector composable on the first / last direct child of the diagram (both, when there is only one). The root hides the ports on those outer edges, because no connector reaches them. They are attributes rather than `:first-child` / `:last-child` rules because the connector `<svg>` is a sibling of the nodes in the same container
- A consuming component that wraps a node in its own card must not clip it (`overflow-hidden`): the ports are positioned outside the anchor's box, so a clipping ancestor renders them invisible
- `data-faded` marks a connector path whose endpoint node is disabled (drives the reduced opacity)

## Motion & Animations

| Trigger                                     | Animation / Transition                                                                                                                                                                                               | Token                                | Reduced-motion fallback      |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------- |
| connector on mount (every drawn connector)  | `stroke-dasharray="4 4"` + `animate-flow-dash-settle` — marching dashes along the stroke (`stroke-dashoffset` 24 → 0, 700ms linear, six runs), so a connection reads as a live link, then the dashes rest after 4.2s | `animate-flow-dash-settle` (catalog) | `motion-reduce:animate-none` |
| connector whose endpoint node is `disabled` | motion suppressed via `data-[faded]:animate-none` — the dashes stay, the flow stops, because a disabled step is not carrying anything                                                                                | —                                    | already static               |

> The dash cycle (8) divides the keyframe's travel (24), so the loop repeats seamlessly. A `stroke-dasharray` whose cycle does not divide 24 would visibly jump on each repeat. `linear` is deliberate: an endlessly looping animation must not accelerate, or the seam between repeats becomes visible (same reasoning as `spin` / `shimmer` in the catalog).

## Tokens

| Region                  | Token (DESIGN.md)                                             |
| ----------------------- | ------------------------------------------------------------- |
| typography (node label) | `.text-label-md`                                              |
| node surface            | `var(--bg-surface-raised)`                                    |
| node border             | `var(--border-default)`                                       |
| node elevation          | `var(--shadow-xs)`                                            |
| node text               | `var(--text-default)`                                         |
| connector stroke        | `var(--accent)`                                               |
| connector port fill     | `var(--accent)`                                               |
| connector port border   | `var(--border-muted)`                                         |
| connector port shape    | `var(--radius-sm)`                                            |
| border width            | `var(--border-width-default)`                                 |
| disabled text           | `var(--text-disabled)`                                        |
| spacing                 | `var(--spacing-md)`, `var(--spacing-sm)`, `var(--spacing-xl)` |
| shape                   | `var(--shape-button)`                                         |
| ring                    | `var(--ring-color)`                                           |

## Theme gaps

| Figma variable                            | Temporary primitive                                                             | Follow-up                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `flow-dash` animation                     | added to `primitives/animations/{keyframes,animate}.js` (`--animate-flow-dash`) | done (this change) — the catalog had no stroke-dash animation     |
| raised node surface (`bg-surface-raised`) | `var(--bg-surface-raised)`                                                      | TODO: confirm `--bg-surface-raised` is the canonical raised token |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` moves focus through focusable nodes in document order; no arrow-key roving (the diagram is a static list). When the diagram is wider than its box, the scroll root itself takes `tabindex="0"` (measured with a resize observer, removed again when it fits) so keyboard users can scroll it with the arrow keys; it shows the focus ring inset.
- ARIA: root `flow-diagram` is `role="list"`; each `flow-diagram-node` is `role="listitem"` with accessible text content; `flow-diagram-parallel` is a `role="listitem"` (one step of the outer list) holding a nested `role="list"` (`data-flow-branches`, testid `<parallel testid>-branches`; it is the flex column that stacks and aligns the branches) of its branch nodes, because a `group` is not an allowed child of a `list` and its nodes would lose their `list` parent; the connector SVG is decorative and carries `aria-hidden="true"`, as does every connector port (`data-flow-port`) — the ports are a visual attachment affordance and carry no meaning for AT. A `flow-diagram-anchor` wraps meaningful node content and is therefore not hidden.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:animate-none` on the connector dashes; no other part moves.
- Pause, Stop, Hide (WCAG 2.2.2): the connector dashes march six times on mount and stop by themselves after 4.2 seconds, so the diagram needs no pause control.
- Touch target ≥40×40 px where a node is interactive.
- Right-to-left: under `dir="rtl"` the flow runs from the inline start (right) to the inline end (left). Connectors leave a node's inline-end edge and enter the next node's inline-start edge, the elbow bus sits between them, and the ports (`data-flow-port`) sit outside the node on the edge they mark.

## Examples

Composite stories are justified below because FlowDiagram is a composition component whose value is in how parts compose, not in a single `kind`/`size` axis:

- Default — a sequential flow of `flow-diagram-node` joined by connectors.
- Parallel — a `flow-diagram-parallel` fanning out and back in between two nodes (demonstrates the composition that a single `kind`/`size` axis cannot).
- Branches — leading and trailing `flow-diagram-parallel` (fan-in then fan-out), proving connectors route correctly at the edges of the sequence.
- CustomNodes — `unstyled` nodes whose slot content defines the appearance (a start dot, a tall node, a multi-row card with `flow-diagram-anchor` attachment points).
- Disabled — a `flow-diagram-node` with the `disabled` prop, showing the reduced-opacity connectors.
- Uniform — the `uniform` prop: three steps with different amounts of text (You → Azion → Application) drawn as identical boxes.

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

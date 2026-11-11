# Flow

> Flow renders a directed flow diagram: a horizontal sequence of steps (`flow-node`) joined by decorative connectors, with optional parallel branches (`flow-parallel`) and custom connector-attachment points (`flow-anchor`). Use it to visualize pipelines, workflows, and step-by-step processes inside a data view; unlike `table` it expresses ordered/branching relationships rather than tabular records. Steps are written as direct children of `flow`; a `flow-parallel` between two steps fans out from the previous step and fans back into the next, and a `flow-parallel` at the start/end fans only inward/outward (no dangling stubs). A node can be styled (the default box) or `unstyled` so its slot content defines the entire node — a dot, a tall card, a multi-row card — while connectors still attach correctly, optionally at `flow-anchor` points inside the node. Connectors run port-to-port: a styled node renders a small square **connector port** just outside each of its edges, and a `flow-anchor` renders one outside the edge it attaches to, so a line always terminates on a visible attachment point instead of a bare edge (the port is the endpoint treatment — connectors carry no arrowheads). The port sits fully clear of the box rather than overlapping it, so neither the node's surface nor its focus ring crops it. A port is only rendered where a connector actually attaches: the leading child has no incoming connector and the trailing child no outgoing one, so those two edges show no port and the chain opens and closes on a node rather than on a stub. An `unstyled` node renders no ports, because its slot content owns its appearance; put a `flow-anchor` inside it to place ports on the parts a connector should touch. Design source (rewritten to our conventions, never inherited as-is): the kumo "Flow" component group at https://kumo-ui.com/components/flow/. Scope boundary: large diagrams pan via a native `overflow: auto` scroll container on the root — free 2D drag-pan is intentionally out of scope (it would require an external positioning library forbidden by `.claude/rules/dependencies.md`). The connector port is specified by the Figma frame in the frontmatter; the remaining tokens are inferred from intent and recorded in the Theme gaps table.

- Import: `import FlowRoot from '@aziontech/webkit/flow-root'`
- Compound import (dot notation, not tree-shakeable): `import Flow from '@aziontech/webkit/flow'`
- Category: data · Surface: product · Structure: composition
- API as JSON: [flow.json](https://github.com/aziontech/webkit/blob/main/.specs/flow.json)

## When to use

- Showing an ordered pipeline or request path as steps joined by connectors — build → deploy → serve, or a request through a load balancer, a function and its bindings.
- A step fans out to several parallel targets and (optionally) back in — wrap those steps in `Flow.Parallel`.
- A node with custom content (a card with several rows) where connectors must touch specific parts — mark them with `Flow.Anchor`.

## Do

- Write steps as direct children of `Flow` in flow order; connectors are drawn between siblings, so wrapping nodes in extra elements breaks the chain.
- Use `unstyled` when the slot content is the whole node, and put a `Flow.Anchor` (`type="end"` incoming, `type="start"` outgoing) on each part a connector should touch — an unstyled node renders no ports of its own.
- Mark a leaf that hangs off the chain with `terminal`; it receives a connector but sends none on.
- Do not clip a node with `overflow-hidden` in a wrapping card — the connector ports sit outside the node's box and would disappear.
- Let a wide flow scroll in its own container; the root is an `overflow: auto` region, and there is no drag-to-pan.

## Don’t

- One of the official architecture drawings, or a node-and-connector picture for a marketing page → use `diagram`.
- Tabular records with no ordering between them → use `table`.
- A numbered set of instructions in documentation → use `doc-steps`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [diagram](diagram.md) — marketing architecture drawings from a closed library or a one-off spec; `flow` is the in-product, hand-composed pipeline.
- [doc-steps](doc-steps.md) — an ordered walkthrough of text steps joined by a rail, not connected nodes.
- [table](table.md) — records without ordered or branching relationships.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `align` | `'start' \| 'center'` | `'start'` | false | Vertical alignment of nodes within the diagram. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Diagram content: `flow-node` and `flow-parallel`, in flow order. |

## Sub-component imports

- `@aziontech/webkit/flow-node`
- `@aziontech/webkit/flow-parallel`
- `@aziontech/webkit/flow-anchor`

## Sub-components

- `flow-node/flow-node.vue` — A single step in the flow. Renders the default node box; `unstyled` drops the box so the `default` slot defines the node's appearance (a dot, a card, a tall node). `disabled` marks the step disabled, rendering adjacent connectors at reduced opacity (mirrored by `data-disabled`). `terminal` ends the node's branch: it still receives an incoming connector but originates none, so the chain continues through its siblings while the branch stops there — the shape a **leaf** needs (an attached resource that hangs off the chain rather than passing it on). A terminal node therefore renders no outgoing port. Content via the `default` slot.
- `flow-anchor/flow-anchor.vue` — Marks a connector-attachment point inside a node and wraps the content that the connector should touch. `type="end"` is the incoming endpoint, `type="start"` the outgoing origin; omitted marks both. Content via the `default` slot.
- `flow-parallel/flow-parallel.vue` — Container whose direct `flow-node` children are laid out as parallel branches stacked vertically; the `flow` root draws the fan-out/fan-in junction connectors. `align` controls the horizontal alignment of the branches.

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

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` moves focus through focusable nodes in document order; no arrow-key roving (the diagram is a static list). When the diagram is wider than its box, the scroll root itself takes `tabindex="0"` (measured with a resize observer, removed again when it fits) so keyboard users can scroll it with the arrow keys; it shows the focus ring inset.
- ARIA: root `flow` is `role="list"`; each `flow-node` is `role="listitem"` with accessible text content; `flow-parallel` is a `role="listitem"` (one step of the outer list) holding a nested `role="list"` (`data-flow-branches`, testid `<parallel testid>-branches`; it is the flex column that stacks and aligns the branches) of its branch nodes, because a `group` is not an allowed child of a `list` and its nodes would lose their `list` parent; the connector SVG is decorative and carries `aria-hidden="true"`, as does every connector port (`data-flow-port`) — the ports are a visual attachment affordance and carry no meaning for AT. A `flow-anchor` wraps meaningful node content and is therefore not hidden.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` not required — the component is static (no motion).
- Touch target ≥40×40 px where a node is interactive.
- Right-to-left: under `dir="rtl"` the flow runs from the inline start (right) to the inline end (left). Connectors leave a node's inline-end edge and enter the next node's inline-start edge, the elbow bus sits between them, and the ports (`data-flow-port`) sit outside the node on the edge they mark.

## Examples

### Default

```vue
<script setup>
  import Flow from '@aziontech/webkit/flow'
</script>

<template>
  <Flow align="center">
    <Flow.Node>Source</Flow.Node>
    <Flow.Node>Transform</Flow.Node>
    <Flow.Node>Deliver</Flow.Node>
  </Flow>
</template>
```

### Parallel

```vue
<script setup>
  import Flow from '@aziontech/webkit/flow'
</script>

<template>
  <Flow align="center">
    <Flow.Node>Start</Flow.Node>
    <Flow.Parallel>
      <Flow.Node>Branch A</Flow.Node>
      <Flow.Node>Branch B</Flow.Node>
      <Flow.Node>Branch C</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>End</Flow.Node>
  </Flow>
</template>
```

### Branches

```vue
<script setup>
  import Flow from '@aziontech/webkit/flow'
</script>

<template>
  <Flow align="center">
    <Flow.Parallel>
      <Flow.Node>HTTP Trigger</Flow.Node>
      <Flow.Node>Cron Trigger</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Process Request</Flow.Node>
    <Flow.Parallel>
      <Flow.Node>Log Analytics</Flow.Node>
      <Flow.Node>Update Cache</Flow.Node>
      <Flow.Node>Send Notification</Flow.Node>
    </Flow.Parallel>
    <Flow.Node>Complete</Flow.Node>
  </Flow>
</template>
```

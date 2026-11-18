---
name: node-diagram
category: data
structure: composition
status: draft
spec_version: 1
template: 2
created: 2026-11-18
last_updated: 2026-11-18
---

# NodeDiagram — Component Spec

## Purpose

PROPOSAL (RV-Y1, owner to approve): one in-product diagram replacing `flow-diagram` and `topology-diagram`. A naked root lays steps out and draws the connectors. **Data mode** (`nodes` + `edges`): edges set the columns and each node renders the richest card its data allows. **Composed mode**: hand-written parts in the default slot. `orientation="responsive"` stacks into a rail below a 36rem container.

## When to use

- A request path or pipeline: steps in order joined by connectors.
- A deployment or service topology with status, metrics, details and bind controls.

## When NOT to use

- A marketing architecture drawing from the official library → use `diagram`.
- A numbered set of instructions → use `doc-steps`.

## Related

- `diagram` — the marketing figure (closed drawing library).
- `status-indicator` — the status dot and text in a node header.

## Best practices

- Prefer data mode; compose by hand only for markup the card cannot express.
- Join adjacent columns; an edge that skips a column can cross it.
- Put timing or failure on the edge (`label`, `severity`) when the hop failed, on the node when the resource did.
- Use `orientation="horizontal"` for fixed-size scenes and mock-ups.
- A one-resource slot puts `node-diagram-bind` in the `actions` slot.

## Usage

```vue
<script setup>
  import NodeDiagram from '@aziontech/webkit/node-diagram'

  const nodes = [
    { id: 'you', title: 'You', description: 'Browser', status: 'Working', severity: 'success' },
    { id: 'edge', title: 'Azion edge', description: 'San Francisco, US', status: 'Working', severity: 'success' },
    { id: 'origin', title: 'Origin', description: 'api.example.com', status: 'Error', severity: 'danger' }
  ]
  const edges = [
    { from: 'you', to: 'edge', label: '18 ms' },
    { from: 'edge', to: 'origin', label: '502', severity: 'danger' }
  ]
</script>

<template>
  <NodeDiagram :nodes="nodes" :edges="edges" uniform aria-label="Request path" />

  <NodeDiagram aria-label="Build pipeline">
    <NodeDiagram.Node>Commit</NodeDiagram.Node>
    <NodeDiagram.Group label="Checks">
      <NodeDiagram.Node>Unit tests</NodeDiagram.Node>
      <NodeDiagram.Node>Lint</NodeDiagram.Node>
    </NodeDiagram.Group>
    <NodeDiagram.Node>
      <NodeDiagram.Header icon="az az-upload" eyebrow="Deploy" status="Running" severity="info" />
      <NodeDiagram.Title href="#deploy">production</NodeDiagram.Title>
      <NodeDiagram.Footer>
        <NodeDiagram.Item label="Regions">38 of 120</NodeDiagram.Item>
      </NodeDiagram.Footer>
    </NodeDiagram.Node>
  </NodeDiagram>
</template>
```

The root is also published standalone as `@aziontech/webkit/node-diagram-root`, and every part as `@aziontech/webkit/node-diagram-<part>`. The data-mode card is loaded as a lazy chunk, so a composed diagram never downloads it.

## Sub-components

- `node-diagram-node` — one step: a label box, a card when it holds a `Title`, or `unstyled`. Props `value` (identity for edges), `disabled`, `unstyled`, `terminal`, `dashed`.
- `node-diagram-group` — nodes side by side in one step (was Parallel / a topology level). Prop `label` (hidden).
- `node-diagram-anchor` — where a connector touches. Prop `side`.
- `node-diagram-header` — props `icon`, `eyebrow`, `status`, `severity`.
- `node-diagram-title` — prop `href`; `actions` slot.
- `node-diagram-description`, `node-diagram-footer`, `node-diagram-item` (prop `label`).
- `node-diagram-bind` — companion (not attached): bind with Apply and Cancel. Props `label`, `options`, `value`, `removable`; events `bind`, `remove`, `create`.

## Props

| Prop          | Type                                         | Default        | Required | JSDoc                                                                                                  |
| ------------- | -------------------------------------------- | -------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `nodes`       | `NodeDiagramNodeData[]`                      | `[]`           | false    | Nodes of a data-driven diagram; each renders as a full card. Leave empty to compose the parts by hand. |
| `edges`       | `NodeDiagramEdgeData[]`                      | `[]`           | false    | Connectors between nodes by id; they also decide the columns. Empty joins each step to the next.       |
| `orientation` | `'horizontal' \| 'vertical' \| 'responsive'` | `'responsive'` | false    | Lays the steps out in a row, in a column, or in a row that stacks when its container is narrow.        |
| `align`       | `'start' \| 'center'`                        | `'start'`      | false    | Vertical alignment of the steps in a row.                                                              |
| `uniform`     | `boolean`                                    | `false`        | false    | Gives every step the width and height of the largest one.                                              |
| `loading`     | `boolean`                                    | `false`        | false    | Shows placeholder steps while the diagram loads.                                                       |
| `ariaLabel`   | `string`                                     | `''`           | false    | Accessible name of the diagram. Empty uses the locale catalog (`Diagram`).                             |

Types: `NodeDiagramNodeData = { id; title?; eyebrow?; icon?; description?; href?; status?; severity?; metrics?: { label; value }[]; message?; fields?: { label; value; href?; copyable? }[]; dashed?; disabled?; terminal?; bindable?; bindOptions?; boundValue?; removable? }`; `NodeDiagramEdgeData = { from; to; label?; severity? }`; `NodeDiagramSeverity = Severity`.

## v-model

- **`v-model:openKeys`** — `string[]`, default `[]`. Ids of the data-mode nodes whose details are open.

## Events

| _none_ | — | — |

The root emits nothing; the bind events live on the `node-diagram-bind` companion.

## Slots

| Slot      | Scope                           | Notes                                                    |
| --------- | ------------------------------- | -------------------------------------------------------- |
| `default` | —                               | Composed mode: nodes and groups, in flow order.          |
| `actions` | `{ node: NodeDiagramNodeData }` | Data mode: controls at the end of a node's title row.    |
| `empty`   | —                               | Replaces the `EmptyState` shown when there are no nodes. |

## States

- List: `data-orientation`, `data-align`, `data-uniform`, `data-labelled` (wider gap for edge labels), `data-stacked` (rail drawn, ports hidden).
- Node: `data-disabled`, `data-dashed`, `data-terminal`, `data-node-key`, `data-entry` / `data-exit` (ports show only where a connector attaches).
- Data card: `data-state="open|closed"`; an unbound bindable node is dashed with `Not bound`; a pending bind dashes it too.
- Loading: `aria-busy`, skeleton cards, one `role="status"` line. Empty: `EmptyState` unless the `empty` slot replaces it.
- Edge `severity` colours the connector (`--<severity>-mark`); default `--accent`.

## Motion & Animations

| Trigger              | Animation / Transition                                                          | Token                                               | Reduced-motion fallback         |
| -------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------- |
| connectors, on mount | `animate-flow-dash-settle`                                                      | catalog `flow-dash-settle` (700ms × 6)              | `motion-reduce:animate-none`    |
| details open / close | `transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance` | duration `moderate-01`, curve `productive-entrance` | `motion-reduce:transition-none` |
| chevron, hover       | `transition-transform` / `transition-colors` `duration-moderate-01`             | duration `moderate-01`                              | `motion-reduce:transition-none` |

## Tokens

| Region          | Token                                                                               |
| --------------- | ----------------------------------------------------------------------------------- |
| box node        | `var(--bg-surface-raised)`, `var(--shape-button)`, `var(--shadow-xs)`               |
| card node       | `var(--bg-surface)`, `var(--shape-card)`, `var(--border-default)`                   |
| dividers        | `var(--border-muted)`                                                               |
| connector, port | `var(--accent)`; severity `var(--<severity>-mark)`                                  |
| edge label      | `var(--bg-canvas)`, `var(--border-default)`, `.text-body-xs`                        |
| text            | `.text-label-md` title, `.text-label-sm` eyebrow, `.text-body-xs` muted             |
| gaps            | `var(--spacing-xl)` steps, `var(--spacing-2xl)` labelled, `var(--spacing-md)` group |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Root `role="group"` named by `ariaLabel`; steps are a `list`, a group a nested list with a hidden label.
- Connectors, ports and edge labels are `aria-hidden`; data mode adds a hidden `Connections` list (`{from} to {to}, {label}`).
- `Tab` reaches links, the Details toggle (`aria-expanded`, closed details `inert`), copy and bind controls; the scroll area is focusable only when it overflows.
- Status is a dot plus text; the dashes stop after six runs; `motion-reduce:animate-none`; focus ring `--ring-color`.

## Internationalization

| Key                                                                      | English source                                      | Override prop |
| ------------------------------------------------------------------------ | --------------------------------------------------- | ------------- |
| `nodeDiagram.label`                                                      | Diagram                                             | `ariaLabel`   |
| `nodeDiagram.notBound`                                                   | Not bound                                           | node `status` |
| `nodeDiagram.bind` / `change` / `remove` / `create` / `apply` / `cancel` | Bind {kind} / Change {kind} / … / Cancel            | —             |
| `nodeDiagram.pending` / `existing` / `noOptions` / `copy`                | Pending / Existing / No options yet. / Copy {field} | —             |
| `nodeDiagram.details`                                                    | Details                                             | —             |
| `nodeDiagram.connections` / `connection`                                 | Connections / {from} to {to}                        | —             |
| `nodeDiagram.emptyTitle` / `loading`                                     | Nothing is connected yet. / Loading the diagram     | `empty` slot  |

- Formatting: none; metrics and labels arrive formatted.

## Right-to-left

- Logical utilities only; the engine reads `direction`, mirrors elbows and ports, and puts the rail and its labels on the inline start.

## Responsive

- `responsive` stacks below a 36rem container into a rail in reading order, labels beside it; `horizontal` scrolls in its own area; `vertical` always stacks.

## Performance

- Budgets (`.size-limit.json`): `node-diagram-root` and `node-diagram` are `entryOnly` — about 20 KB and 22 KB gzip, with the data-mode card as a lazy chunk (~9–11 KB, it carries `copy-button`); `node-diagram-bind` ~15 KB (dropdown-menu, tooltip); the card parts under 2.5 KB each.
- Connectors re-measure on resize, DOM mutations and edge changes, in one animation frame.

## Examples

- Default — the rich data-driven default (all fields, labelled edges, parallel column).
- Composed — the naked root composed by hand. Justified: the composition is the second half of the API.
- Request path — `uniform` and the responsive rail. Justified: replaces FlowDiagram's Uniform and the edge error page's second list.
- Topology — the bind companion. Justified: replaces TopologyDiagram's Default and Binding.

## Decisions and open questions

- **RV-Y1 (open, owner to approve)** — unify `flow-diagram` and `topology-diagram` into this component.
- Final name: keep `node-diagram`, or take over `flow-diagram` (fewer import changes, but the old FlowDiagram parts `Parallel` become `Group`).
- Bind control: companion part (recommended, keeps 15 KB off every diagram) or built into the default card.
- Status: dot and text (recommended, as the error page) instead of TopologyDiagram's tag.

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

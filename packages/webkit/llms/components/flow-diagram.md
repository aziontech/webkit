# Flow Diagram

> The one in-product diagram (owner decision RV-Y1, 2026-11-18): it kept the old FlowDiagram parts and replaced TopologyDiagram in the 6.0 clean break. A naked root lays steps out and draws the connectors. **Data mode** (`nodes` + `edges`): edges set the columns and each node renders the richest card its data allows. **Composed mode**: hand-written parts in the default slot. `orientation="responsive"` stacks into a rail below a 36rem container.

- Import: `import FlowDiagramRoot from '@aziontech/webkit/flow-diagram-root'`
- Compound import (dot notation, not tree-shakeable): `import FlowDiagram from '@aziontech/webkit/flow-diagram'`
- Category: data · Surface: app · Structure: composition
- API as JSON: [flow-diagram.json](flow-diagram.json)

## When to use

- A request path or pipeline: steps in order joined by connectors.
- A deployment or service topology with status, metrics, details and bind controls.

## Do

- Prefer data mode; compose by hand only for markup the card cannot express.
- Join adjacent columns; an edge that skips a column can cross it.
- Put timing or failure on the edge (`label`, `severity`) when the hop failed, on the node when the resource did.
- Use `orientation="horizontal"` for fixed-size scenes and mock-ups.
- A one-resource slot puts `flow-diagram-bind` in the `actions` slot.

## Don’t

- A marketing architecture drawing from the official library → use `diagram`.
- A numbered set of instructions → use `doc-steps`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [diagram](diagram.md) — the marketing figure (closed drawing library).
- [status-indicator](status-indicator.md) — the status dot and text in a node header.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `nodes` | `FlowDiagramNodeData[]` | `[]` | false | Nodes of a data-driven diagram; each renders as a full card. Leave empty to compose the parts by hand. |
| `edges` | `FlowDiagramEdgeData[]` | `[]` | false | Connectors between nodes by id; they also decide the columns. Empty joins each step to the next. |
| `orientation` | `'horizontal' \| 'vertical' \| 'responsive'` | `'responsive'` | false | Lays the steps out in a row, in a column, or in a row that stacks when its container is narrow. |
| `align` | `'start' \| 'center'` | `'start'` | false | Vertical alignment of the steps in a row. |
| `uniform` | `boolean` | `false` | false | Gives every step the width and height of the largest one. |
| `loading` | `boolean` | `false` | false | Shows placeholder steps while the diagram loads. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the diagram. Empty uses the locale catalog (`Diagram`). |
| `openKeys` | `string[]` | `() => []` | false | Two-way value (`v-model:openKeys`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Composed mode: nodes and groups, in flow order. |
| `actions` | { node: FlowDiagramNodeData } | Data mode: controls at the end of a node's title row. |
| `empty` | — | Replaces the `EmptyState` shown when there are no nodes. |

## Sub-component imports

- `@aziontech/webkit/flow-diagram-node`
- `@aziontech/webkit/flow-diagram-group`
- `@aziontech/webkit/flow-diagram-anchor`
- `@aziontech/webkit/flow-diagram-header`
- `@aziontech/webkit/flow-diagram-title`
- `@aziontech/webkit/flow-diagram-description`
- `@aziontech/webkit/flow-diagram-footer`
- `@aziontech/webkit/flow-diagram-item`
- `@aziontech/webkit/flow-diagram-bind`

## Sub-components

- `flow-diagram-node` — one step: a label box, a card when it holds a `Title`, or `unstyled`. Props `value` (identity for edges), `disabled`, `unstyled`, `terminal`, `dashed`.
- `flow-diagram-group` — parallel nodes stacked in one step (was `Parallel` and a topology level). Prop `label` (hidden).
- `flow-diagram-anchor` — where a connector touches. Prop `side`.
- `flow-diagram-header` — props `icon`, `eyebrow`, `status`, `severity`.
- `flow-diagram-title` — prop `href`; `actions` slot. Every title row is one control high with `--spacing-sm` below it, so a button keeps that space to the divider or border below and rows with and without controls line their connectors up.
- `flow-diagram-description`, `flow-diagram-footer`, `flow-diagram-item` (prop `label`).
- `flow-diagram-bind` — companion (not attached): bind with Apply and Cancel. Props `label`, `options`, `value`, `removable`; events `bind`, `remove`, `create`.

## v-model

- **`v-model:openKeys`** — `string[]`, default `[]`. Ids of the data-mode nodes whose details are open.

## States

- List: `data-orientation`, `data-align`, `data-uniform`, `data-labelled` (wider gap for edge labels), `data-stacked` (rail drawn, ports hidden).
- Node: `data-disabled`, `data-dashed`, `data-terminal`, `data-node-key`, `data-entry` / `data-exit` (ports show only where a connector attaches).
- Title: every row is one small control high (`min-h-7`) with `--spacing-sm` of bottom padding, so a button in the `actions` slot sits as far from the divider below as the header text sits from the border above, and cards with and without controls keep the same anchor height (their connectors stay level).
- Data card: `data-state="open|closed"`; an unbound bindable node is dashed with `Not bound`; a pending bind dashes it too.
- Loading: `aria-busy`, skeleton cards, one `role="status"` line. Empty: `EmptyState` unless the `empty` slot replaces it.
- Edge `severity` colours the connector (`--<severity>-mark`); default `--accent`.

- Its root carries `data-plain-ground`: it is content that must sit on a plain ground, so a `Texture` beside it hides itself, and the texture-backdrop check blocks placing it on a textured band (a texture is a backdrop for text only, RV-T2-1).

## Accessibility

- Root `role="group"` named by `ariaLabel`; steps are a `list`, a group a nested list with a hidden label.
- Connectors, ports and edge labels are `aria-hidden`; data mode adds a hidden `Connections` list (`{from} to {to}, {label}`).
- `Tab` reaches links, the Details toggle (`aria-expanded`, closed details `inert`), copy and bind controls; the scroll area is focusable only when it overflows.
- Status is a dot plus text; the dashes stop after six runs; `motion-reduce:animate-none`; focus ring `--ring-color`.

## Right-to-left

- Logical utilities only; the engine reads `direction`, mirrors elbows and ports, and puts the rail and its labels on the inline start.

## Internationalization

| Key                                                                      | English source                                      | Override prop |
| ------------------------------------------------------------------------ | --------------------------------------------------- | ------------- |
| `flowDiagram.label`                                                      | Diagram                                             | `ariaLabel`   |
| `flowDiagram.notBound`                                                   | Not bound                                           | node `status` |
| `flowDiagram.bind` / `change` / `remove` / `create` / `apply` / `cancel` | Bind {kind} / Change {kind} / … / Cancel            | —             |
| `flowDiagram.pending` / `existing` / `noOptions` / `copy`                | Pending / Existing / No options yet. / Copy {field} | —             |
| `flowDiagram.details`                                                    | Details                                             | —             |
| `flowDiagram.connections` / `connection`                                 | Connections / {from} to {to}                        | —             |
| `flowDiagram.emptyTitle` / `loading`                                     | Nothing is connected yet. / Loading the diagram     | `empty` slot  |

- Formatting: none; metrics and labels arrive formatted.

## Responsive

- `responsive` stacks below a 36rem container into a rail in reading order, labels beside it; `horizontal` scrolls in its own area; `vertical` always stacks.

## Examples

### Default

```vue
<script setup>
  import FlowDiagram from '@aziontech/webkit/flow-diagram-root'
  import { ref } from 'vue'

  const nodes = [
    {
      id: 'client',
      eyebrow: 'Client',
      icon: 'az az-user',
      title: 'Browsers',
      description: 'United States',
      metrics: [{ label: 'Requests', value: '1.2k/s' }]
    },
    {
      id: 'edge',
      eyebrow: 'Application',
      icon: 'az az-globe',
      title: 'shop.example.com',
      href: '#application',
      description: 'San Francisco, US',
      status: 'Healthy',
      severity: 'success',
      metrics: [
        { label: 'p95', value: '38 ms' },
        { label: 'Hit ratio', value: '91%' }
      ],
      fields: [
        { label: 'ID', value: '1482736015', copyable: true },
        { label: 'Domain', value: 'shop.example.com', href: 'https://shop.example.com' }
      ]
    },
    {
      id: 'function',
      eyebrow: 'Function',
      icon: 'az az-functions',
      title: 'checkout-router',
      status: 'Running',
      severity: 'success',
      metrics: [
        { label: 'p95', value: '12 ms' },
        { label: 'Errors', value: '0.1%' }
      ]
    },
    {
      id: 'cache',
      eyebrow: 'Cache',
      icon: 'az az-cache',
      title: 'static-assets',
      status: 'Warming',
      severity: 'warning',
      metrics: [{ label: 'Hit ratio', value: '64%' }],
      message: 'The cache refills after the deploy of 10:42 UTC.'
    },
    {
      id: 'origin',
      eyebrow: 'Origin',
      icon: 'az az-server',
      title: 'api.example.com',
      description: 'Ashburn, US',
      status: 'Degraded',
      severity: 'danger',
      metrics: [
        { label: 'p95', value: '840 ms' },
        { label: '5xx', value: '4.2%' }
      ]
    }
  ]

  const edges = [
    { from: 'client', to: 'edge', label: '6 ms' },
    { from: 'edge', to: 'function', label: '2 ms' },
    { from: 'edge', to: 'cache', label: '1 ms' },
    { from: 'function', to: 'origin', label: '840 ms', severity: 'danger' },
    { from: 'cache', to: 'origin', label: '96 ms' }
  ]

  const openKeys = ref([])
</script>

<template>
  <FlowDiagram
    v-model:open-keys="openKeys"
    :nodes="nodes"
    :edges="edges"
    aria-label="Request path of shop.example.com"
  />
</template>
```

### Composed

```vue
<script setup>
  import FlowDiagram from '@aziontech/webkit/flow-diagram'
</script>

<template>
  <FlowDiagram
    align="center"
    aria-label="Build pipeline"
  >
    <FlowDiagram.Node>Commit</FlowDiagram.Node>
    <FlowDiagram.Node>Build</FlowDiagram.Node>
    <FlowDiagram.Group label="Checks">
      <FlowDiagram.Node>Unit tests</FlowDiagram.Node>
      <FlowDiagram.Node>Lint</FlowDiagram.Node>
    </FlowDiagram.Group>
    <FlowDiagram.Node class="min-w-(--size-56)">
      <FlowDiagram.Header
        icon="az az-upload"
        eyebrow="Deploy"
        status="Running"
        severity="info"
      />
      <FlowDiagram.Title href="#deploy">production</FlowDiagram.Title>
      <FlowDiagram.Description>Started 2 minutes ago</FlowDiagram.Description>
      <FlowDiagram.Footer>
        <FlowDiagram.Item label="Regions">38 of 120</FlowDiagram.Item>
      </FlowDiagram.Footer>
    </FlowDiagram.Node>
  </FlowDiagram>
</template>
```

### Request path

```vue
<script setup>
  import FlowDiagram from '@aziontech/webkit/flow-diagram-root'

  const nodes = [
    {
      id: 'you',
      title: 'You',
      description: 'Browser',
      status: 'Working',
      severity: 'success'
    },
    {
      id: 'azion',
      title: 'Azion',
      description: 'San Francisco, US',
      status: 'Working',
      severity: 'success'
    },
    {
      id: 'application',
      title: 'Application',
      description: 'api.example.com',
      status: 'Error',
      severity: 'danger'
    }
  ]

  const edges = [
    { from: 'you', to: 'azion', label: '18 ms' },
    { from: 'azion', to: 'application', label: '502', severity: 'danger' }
  ]
</script>

<template>
  <FlowDiagram
    :nodes="nodes"
    :edges="edges"
    uniform
    aria-label="Request path"
  />
</template>
```

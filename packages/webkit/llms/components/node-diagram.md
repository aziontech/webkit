# Node Diagram

> PROPOSAL (RV-Y1, owner to approve): one in-product diagram replacing `flow-diagram` and `topology-diagram`. A naked root lays steps out and draws the connectors. **Data mode** (`nodes` + `edges`): edges set the columns and each node renders the richest card its data allows. **Composed mode**: hand-written parts in the default slot. `orientation="responsive"` stacks into a rail below a 36rem container.

- Import: `import NodeDiagramRoot from '@aziontech/webkit/node-diagram-root'`
- Compound import (dot notation, not tree-shakeable): `import NodeDiagram from '@aziontech/webkit/node-diagram'`
- Category: data · Surface: app · Structure: composition
- API as JSON: [node-diagram.json](node-diagram.json)

## When to use

- A request path or pipeline: steps in order joined by connectors.
- A deployment or service topology with status, metrics, details and bind controls.

## Do

- Prefer data mode; compose by hand only for markup the card cannot express.
- Join adjacent columns; an edge that skips a column can cross it.
- Put timing or failure on the edge (`label`, `severity`) when the hop failed, on the node when the resource did.
- Use `orientation="horizontal"` for fixed-size scenes and mock-ups.
- A one-resource slot puts `node-diagram-bind` in the `actions` slot.

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
| `nodes` | `NodeDiagramNodeData[]` | `[]` | false | Nodes of a data-driven diagram; each renders as a full card. Leave empty to compose the parts by hand. |
| `edges` | `NodeDiagramEdgeData[]` | `[]` | false | Connectors between nodes by id; they also decide the columns. Empty joins each step to the next. |
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
| `actions` | { node: NodeDiagramNodeData } | Data mode: controls at the end of a node's title row. |
| `empty` | — | Replaces the `EmptyState` shown when there are no nodes. |

## Sub-component imports

- `@aziontech/webkit/node-diagram-node`
- `@aziontech/webkit/node-diagram-group`
- `@aziontech/webkit/node-diagram-anchor`
- `@aziontech/webkit/node-diagram-header`
- `@aziontech/webkit/node-diagram-title`
- `@aziontech/webkit/node-diagram-description`
- `@aziontech/webkit/node-diagram-footer`
- `@aziontech/webkit/node-diagram-item`
- `@aziontech/webkit/node-diagram-bind`

## Sub-components

- `node-diagram-node` — one step: a label box, a card when it holds a `Title`, or `unstyled`. Props `value` (identity for edges), `disabled`, `unstyled`, `terminal`, `dashed`.
- `node-diagram-group` — nodes side by side in one step (was Parallel / a topology level). Prop `label` (hidden).
- `node-diagram-anchor` — where a connector touches. Prop `side`.
- `node-diagram-header` — props `icon`, `eyebrow`, `status`, `severity`.
- `node-diagram-title` — prop `href`; `actions` slot.
- `node-diagram-description`, `node-diagram-footer`, `node-diagram-item` (prop `label`).
- `node-diagram-bind` — companion (not attached): bind with Apply and Cancel. Props `label`, `options`, `value`, `removable`; events `bind`, `remove`, `create`.

## v-model

- **`v-model:openKeys`** — `string[]`, default `[]`. Ids of the data-mode nodes whose details are open.

## States

- List: `data-orientation`, `data-align`, `data-uniform`, `data-labelled` (wider gap for edge labels), `data-stacked` (rail drawn, ports hidden).
- Node: `data-disabled`, `data-dashed`, `data-terminal`, `data-node-key`, `data-entry` / `data-exit` (ports show only where a connector attaches).
- Data card: `data-state="open|closed"`; an unbound bindable node is dashed with `Not bound`; a pending bind dashes it too.
- Loading: `aria-busy`, skeleton cards, one `role="status"` line. Empty: `EmptyState` unless the `empty` slot replaces it.
- Edge `severity` colours the connector (`--<severity>-mark`); default `--accent`.

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
| `nodeDiagram.label`                                                      | Diagram                                             | `ariaLabel`   |
| `nodeDiagram.notBound`                                                   | Not bound                                           | node `status` |
| `nodeDiagram.bind` / `change` / `remove` / `create` / `apply` / `cancel` | Bind {kind} / Change {kind} / … / Cancel            | —             |
| `nodeDiagram.pending` / `existing` / `noOptions` / `copy`                | Pending / Existing / No options yet. / Copy {field} | —             |
| `nodeDiagram.details`                                                    | Details                                             | —             |
| `nodeDiagram.connections` / `connection`                                 | Connections / {from} to {to}                        | —             |
| `nodeDiagram.emptyTitle` / `loading`                                     | Nothing is connected yet. / Loading the diagram     | `empty` slot  |

- Formatting: none; metrics and labels arrive formatted.

## Responsive

- `responsive` stacks below a 36rem container into a rail in reading order, labels beside it; `horizontal` scrolls in its own area; `vertical` always stacks.

## Examples

### Default

```vue
<script setup>
  import NodeDiagram from '@aziontech/webkit/node-diagram-root'
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
  <NodeDiagram
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
  import NodeDiagram from '@aziontech/webkit/node-diagram'
</script>

<template>
  <NodeDiagram
    align="center"
    aria-label="Build pipeline"
  >
    <NodeDiagram.Node>Commit</NodeDiagram.Node>
    <NodeDiagram.Node>Build</NodeDiagram.Node>
    <NodeDiagram.Group label="Checks">
      <NodeDiagram.Node>Unit tests</NodeDiagram.Node>
      <NodeDiagram.Node>Lint</NodeDiagram.Node>
    </NodeDiagram.Group>
    <NodeDiagram.Node class="min-w-(--size-56)">
      <NodeDiagram.Header
        icon="az az-upload"
        eyebrow="Deploy"
        status="Running"
        severity="info"
      />
      <NodeDiagram.Title href="#deploy">production</NodeDiagram.Title>
      <NodeDiagram.Description>Started 2 minutes ago</NodeDiagram.Description>
      <NodeDiagram.Footer>
        <NodeDiagram.Item label="Regions">38 of 120</NodeDiagram.Item>
      </NodeDiagram.Footer>
    </NodeDiagram.Node>
  </NodeDiagram>
</template>
```

### Request path

```vue
<script setup>
  import NodeDiagram from '@aziontech/webkit/node-diagram-root'

  const nodes = [
    {
      id: 'you',
      title: 'You',
      description: 'Browser',
      status: 'Working',
      severity: 'success'
    },
    {
      id: 'edge',
      title: 'Azion edge',
      description: 'San Francisco, US',
      status: 'Working',
      severity: 'success'
    },
    {
      id: 'origin',
      title: 'Origin',
      description: 'api.example.com',
      status: 'Error',
      severity: 'danger'
    }
  ]

  const edges = [
    { from: 'you', to: 'edge', label: '18 ms' },
    { from: 'edge', to: 'origin', label: '502', severity: 'danger' }
  ]
</script>

<template>
  <NodeDiagram
    :nodes="nodes"
    :edges="edges"
    uniform
    aria-label="Request path"
  />
</template>
```

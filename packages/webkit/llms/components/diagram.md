# Diagram

> A node-and-connector diagram for marketing pages: the request path of an architecture, a routing policy, a product's place in the platform. The consumer names one of the official diagrams with `name` — the closed library of 28 drawings in webkit's assets, one starter architecture per Azion product plus the page diagrams the product pages tab through — or passes a one-off `spec`: the nodes, how they are arranged, and the edges between them. The component lays the nodes out with real CSS (rows, branches, grids and framed groups), then measures the laid-out nodes and draws every connector, port and edge label on top. Nothing is drawn on a fixed canvas: the layout reflows below its container breakpoint into a stacked column — centred on one axis, or an indented tree where the row branches — and the connectors are re-measured, so a diagram stays legible from a phone to a wide band.

- Import: `import Diagram from '@aziontech/webkit/diagram'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [diagram.json](https://github.com/aziontech/webkit/blob/main/.specs/diagram.json)

## When to use

- Showing how a request travels through Azion — client, application, the product the page is about, and its outcomes.
- Showing a routing or failover policy as nodes and labelled edges, with the path a request takes highlighted.
- Filling the media cell of a marketing band (`media-tabs`, `media-split`) with an architecture instead of a picture.

## Do

- Keep a diagram to about four columns in the wide layout so it fits a band's media cell; split a larger story into several diagrams.
- Light exactly one node with `lit` — the product the diagram is about — and mark the request path with `active` on its nodes and edges.
- Use `gap: 'wide'` on a row whose edges carry labels, so the chips have room between the nodes.
- Name an official diagram instead of rebuilding its `spec`, so the same architecture is the same drawing on every page. Reach for `spec` only for a diagram the library does not have.
- Every named diagram carries its own one-sentence description. Give a `spec` diagram an `ariaLabel` (in the prop or in the spec) that states what it shows; the drawing itself is hidden from assistive technology.
- Do: for a vertical flow in a docs column (a command → the CLI → the API → the resources), use one `row`. In the column it stacks centred, every connector runs through the horizontal centre of both nodes and an edge label sits centred on its line.
- Don't: nudge nodes or labels with wrappers, margins or spacer nodes to centre a flow; the layout does it.
- Reach for `card` for platform pieces, `item` for models and providers, `pill` for a client, `tile` for an icon-only grid cell, and `app` for the consumer's own application.

## Don’t

- For decorative product art → use `illustration`.
- For a world map of points of presence → use `network-map`.
- For a sequence of steps the reader follows in order → use `stepper` or an ordered list.
- For live data or anything the reader operates — a diagram is a figure, not a control.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [illustration](illustration.md) — the drawn scene library; a diagram is generated from data, an illustration is authored art. Both pick an official drawing by `name`.
- [media-tabs](media-tabs.md) — hosts one diagram per tab in its media column; key each `Diagram` by its tab so it re-measures.
- [frame-box](frame-box.md) — the registration frame a diagram's groups and tiles are drawn in.
- [tag](tag.md) — the status chip a card or item node carries.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `'ai-gateway' \| 'ai-gateway-latency-routing' \| 'ai-gateway-model-routing' \| 'ai-gateway-provider-failover' \| 'ai-gateway-response-cache' \| 'ai-inference' \| 'application-accelerator' \| 'applications' \| 'bot-manager' \| 'cache' \| 'data-stream' \| 'ddos-protection' \| 'edge-dns' \| 'firewall' \| 'functions' \| 'image-processor' \| 'kv-store' \| 'load-balancer' \| 'network-shield' \| 'object-storage' \| 'real-time-events' \| 'real-time-metrics' \| 'sql-database' \| 'web-application-firewall' \| 'workloads' \| 'workloads-gradual-rollout' \| 'workloads-isolate-per-request' \| 'workloads-security'` | `undefined` | false | Name of an official diagram in the asset library; ignored when spec is set. |
| `spec` | `DiagramSpec` | `undefined` | false | The nodes, their layout and the edges between them, for a diagram the library does not have. |
| `ariaLabel` | `string` | `''` | false | Accessible description of the whole diagram; empty uses the description the spec carries. |

## States

- **Layout.** The root is an inline-size container. At the `6xl` container width and up, `row` lays its items side by side and `branches` stacks its items beside the node before it; below that width every row stacks. A row with no `branches` in it stacks **centred** (`data-stack="centre"`): its nodes share one vertical axis. A row that holds `branches` stays an **indented tree** (`data-stack="tree"`, nodes at the start edge) and `branches` indents under the node it leaves, so the tree reads top to bottom. `grid` keeps its 2 or 3 columns at every width.
- **Connectors.** After layout, the component measures every node and group (each carries `data-diagram-node` with its key) and draws each edge whose two ends exist: a curve from the source's right edge into the target's left edge, centre to centre on the vertical axis, when the target sits to the right of the source; when the target sits below, a connector from the **bottom centre** of the source to the **top centre** of the target — a straight line when the two centres align, otherwise an orthogonal path that turns at the gap's midline with rounded corners — with its label chip centred on the line (at the midpoint of the gap). Inside an indented tree (both ends in a `tree` stack) the tree rail is kept instead: an elbow from the source's bottom edge, one inset in from its start, into the target's start edge when the target is indented to the right, and a straight drop along that inset otherwise. Each end gets a port; ports at the same point merge. Edges whose ends are missing are skipped. The drawing is re-measured on every resize of the canvas or of any node, when the web fonts settle, and when the edges change.
- **Named.** A `name` loads its spec on demand from the library; the root keeps its width and draws nothing until the spec arrives, and a `name` change clears the current drawing at once. A `name` outside the library (from untyped code), or a spec that fails to load, warns in development only and leaves the root empty; it never throws. With neither `name` nor `spec` the root is empty.
- **Label.** The root is announced as one image named by `ariaLabel`, or, when that is empty, by the description the spec carries; with neither it is a plain figure.
- **Ready.** The canvas sets `data-ready` once the first measure lands and fades in from transparent, so a diagram never shows unconnected nodes.
- **Active.** An `active` edge, its ports and its label chip are drawn in the accent colour and painted above the rest; an `active` node is part of the highlighted path.
- **Lit.** A `lit` card, item or pill gets a primary edge and a primary-and-accent glow; a `lit` tile gets a primary edge.
- **Groups.** A `group` draws its content inside a registration frame with a small label above it; `kind: 'dashed'` dashes its edge and `fill` tints it with the primary or secondary mask.
- **Node kinds.** `card` — header row (mark, logo or icon, eyebrow, status tag) over the title, clamped to two lines. `item` — a leading mark, logo or icon, the title with the eyebrow in a mono line under it, and an optional trailing status tag. `pill` — a rounded chip with an optional icon. `tile` — an icon-only cell inside a registration frame, its title shown in a tooltip. `app` — a quiet window placeholder (three dots, the title, placeholder bars) that fades out at the bottom.
- **Test ids.** Root fallback `marketing-diagram` (consumer override wins); `${testId}__canvas` on the measured canvas.

## Accessibility

- Visible focus: the diagram has no focusable parts.
- Keyboard map: none — the diagram is a figure and takes no input.
- ARIA: the root is a `figure`; with `ariaLabel` set it is `role="img"` named by it. The canvas is `aria-hidden="true"`, so the nodes, connectors and chips are never read one by one — the label carries the meaning.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): node and chip text use `var(--text-default)` / `var(--text-muted)` on `var(--bg-surface)`; connectors meet 3:1 as non-text graphics against `var(--bg-canvas)`.
- `motion-reduce:transition-none` on the canvas fade; nothing else moves.
- Touch target: not applicable — nothing in the diagram is interactive.

## Examples

### Default

```vue
<script setup>
  import Diagram from '@aziontech/webkit/diagram'
</script>

<template>
  <Diagram name="ai-gateway-model-routing" />
</template>
```

### Spec

```vue
<script setup>
  import Diagram from '@aziontech/webkit/diagram'

  const spec = {
    nodes: [
      {
        key: 'user',
        kind: 'pill',
        title: 'User',
        icon: 'pi pi-user',
        active: true
      },
      {
        key: 'routing',
        kind: 'card',
        eyebrow: 'Routing',
        title: 'Nearest data center',
        icon: 'pi pi-directions',
        active: true
      },
      {
        key: 'workload',
        kind: 'card',
        eyebrow: 'Workload',
        title: 'shop.example.com',
        icon: 'ai ai-workloads',
        status: {
          label: 'Live',
          severity: 'success'
        },
        active: true,
        lit: true
      },
      {
        key: 'cache',
        kind: 'item',
        eyebrow: 'Cache',
        title: 'Served from cache',
        icon: 'ai ai-tiered-cache',
        active: true
      },
      {
        key: 'origin',
        kind: 'item',
        eyebrow: 'Origin',
        title: 'origin.example.com',
        icon: 'pi pi-database'
      }
    ],
    layout: {
      gap: 'wide',
      row: [
        {
          node: 'user'
        },
        {
          node: 'routing'
        },
        {
          node: 'workload'
        },
        {
          branches: [
            {
              node: 'cache'
            },
            {
              node: 'origin'
            }
          ]
        }
      ]
    },
    edges: [
      {
        from: 'user',
        to: 'routing',
        active: true
      },
      {
        from: 'routing',
        to: 'workload',
        active: true
      },
      {
        from: 'workload',
        to: 'cache',
        label: 'hit',
        active: true
      },
      {
        from: 'workload',
        to: 'origin',
        label: 'miss'
      }
    ]
  }
</script>

<template>
  <Diagram
    :spec="spec"
    aria-label="A user request is routed to the nearest data center and reaches the workload, which serves it from cache on a hit and from the origin on a miss."
  />
</template>
```

### NodeKinds

```vue
<script setup>
  import Diagram from '@aziontech/webkit/diagram'

  const spec = {
    nodes: [
      {
        key: 'app',
        kind: 'app',
        title: 'App'
      },
      {
        key: 'user',
        kind: 'pill',
        title: 'User',
        icon: 'pi pi-user',
        active: true
      },
      {
        key: 'gateway',
        kind: 'card',
        eyebrow: 'AI Gateway',
        title: 'Route by cost',
        icon: 'ai ai-gateway',
        status: {
          label: 'On',
          severity: 'success'
        },
        active: true,
        lit: true
      },
      {
        key: 'model',
        kind: 'item',
        eyebrow: 'provider · general',
        title: 'General model',
        icon: 'pi pi-sparkles',
        status: {
          label: 'Primary',
          severity: 'info'
        },
        active: true
      },
      {
        key: 'cache',
        kind: 'tile',
        title: 'Response cache',
        icon: 'ai ai-tiered-cache'
      }
    ],
    layout: {
      gap: 'wide',
      row: [
        {
          node: 'app'
        },
        {
          node: 'user'
        },
        {
          node: 'gateway'
        },
        {
          branches: [
            {
              node: 'model'
            },
            {
              node: 'cache'
            }
          ]
        }
      ]
    },
    edges: [
      {
        from: 'user',
        to: 'gateway',
        label: 'prompt',
        active: true
      },
      {
        from: 'gateway',
        to: 'model',
        label: 'route',
        active: true
      },
      {
        from: 'gateway',
        to: 'cache',
        label: 'hit'
      }
    ]
  }
</script>

<template>
  <Diagram
    :spec="spec"
    aria-label="An app sends a prompt to the AI Gateway, which routes it to the general model or answers from the response cache."
  />
</template>
```

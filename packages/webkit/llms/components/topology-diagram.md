# Topology Diagram

> The deployment topology of a resource as a left-to-right diagram: each column is a depth (domains, project, policy, service, cache rules, integration, storage), each node a collapsible card with the resource kind, its status tag, its name and, when opened, a message and labelled fields; dashed connectors join every node of a column to the next. A node without a name is an unbound slot (dashed, Not bound) and a `bindable` node carries the bind control (bind an existing resource, change it, create one, remove it); a picked resource stays pending on the node until it is applied. Taken from the design sample's workload topology (`TopologyDiagramNodeData`, `TopologyNodeCard`, `TopologyBindNode`, `TopologyBindControl`, the empty node). It reuses `FlowDiagram`'s connector engine and anchors and draws its own list semantics, with no node-graph dependency.

- Import: `import TopologyDiagram from '@aziontech/webkit/topology-diagram'`
- Category: data · Surface: app · Structure: monolithic
- API as JSON: [topology-diagram.json](topology-diagram.json)

## When to use

- The topology tab of a project, service or workload: what serves its traffic, in order, and what is still unbound.
- A review before a deploy where binding or removing a resource is staged on the diagram.

## Do

- Keep a column per depth and put the nodes that serve in parallel in the same column.
- Mark a staged change `dashed` with a warning status and a message that says the deploy applies it.
- Mark the last node of each branch `terminal` so no connector leaves it.
- Give every unbound slot a message that says what happens without it.
- Give a node `href` when its resource has a page: the name becomes a link that ends in the open glyph (`az az-external-link`), as every resource name in the console does.
- A node that collects many resources and adds to itself, such as Domains (add a domain), puts its `+` in the `actions` slot: an `IconButton` (`az az-plus`, `variant="outline"`, `size="small"`) named `Add domain` inside a `Tooltip`, picked by `node.id`. `bindable` is for a slot that holds one resource (Firewall, Custom Page): it brings its own `+` with the bind menu. Do not hand-draw a node card to get the `+`.

## Don’t

- A sequence of steps or a pipeline without data cards → use `flow-diagram`.
- A nested list of items with no flow between them → use `tree`.
- A marketing architecture picture → use `diagram`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [flow-diagram](flow-diagram.md) — the connector engine and anchors this component reuses.
- [tree](tree.md) — hierarchical data without connectors.
- [dropdown-menu](dropdown-menu.md) — the bind control's menu.
- `detail/detail-resource` — the page whose topology tab holds it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `levels` | `TopologyDiagramLevel[]` | `[]` | false | Columns of the diagram, from the entry point to the last dependency. |
| `loading` | `boolean` | `false` | false | Shows placeholder cards while the topology loads. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the diagram. Empty uses the locale catalog (`Deployment topology`). |
| `openKeys` | `string[]` | `() => []` | false | Two-way value (`v-model:openKeys`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `bind` | `(event: MouseEvent \| KeyboardEvent, binding: { id: string; value: string })` | A pending pick was confirmed with Apply; `id` is the node's id, `value` the picked option. Picking an option no longer emits on its own (v6). |
| `remove` | `(event: MouseEvent, id: string)` | Remove was activated on a bound, removable node. |
| `create` | `(event: MouseEvent \| KeyboardEvent, id: string)` | Create was picked in the bind control. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `actions` | { node: TopologyDiagramNodeData } | Extra controls in a node's identity row, before the bind control. |
| `empty` | — | Replaces the default empty state (the package `EmptyState`, small, `topologyDiagram.emptyTitle`) shown when there are no levels. |

## v-model

- **`v-model:openKeys`** — `string[]`, default `[]`. Ids of the open node cards; a header click toggles its id.

## States

- Root: `data-loading` and `aria-busy` while `loading`; empty when `levels` is empty, rendered as the package `EmptyState` (small) unless the `empty` slot replaces it.
- Node card: `data-state` `open` | `closed`; `data-dashed` for a staged, unbound or pending node.
- Pending (internal, per node): picking an option other than `boundValue` holds it on the node with `data-pending` and the dashed outline; the identity row shows the picked label and the status tag reads `Pending` (warning). The action area swaps Remove for **Apply** (`az az-check`, primary, `Apply {kind}`) and **Cancel** (`az az-x`, `Cancel`). Apply emits `bind` and clears it; the node is controlled, so it then shows the `name` and `boundValue` its `levels` entry carries, and the app writes the applied value back in its `bind` handler (and clears it in `remove`) or the card returns to the previous binding; Cancel or `Esc` in the action area drops it without an event; picking the current value again clears it; Create emits `create` and clears it.
- Connectors: dashed, flowing; faded never (no disabled nodes).

## Accessibility

- Visible focus: header buttons `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`; the scroll area when it scrolls.
- Keyboard map: `Tab` moves through header buttons, links, copy, bind and remove controls in reading order; `Enter`/`Space` on a header toggles its card; the bind menu follows `dropdown-menu` (arrows, `Enter`, `Esc`). Picking an option that differs from the bound one moves focus to Apply, so `Enter` confirms it; `Esc` anywhere in the node's action area cancels the pending pick; after Apply or Cancel focus returns to the bind (pencil) control. The scroll area is focusable (`tabindex="0"`) only when it overflows, so arrow keys scroll it.
- ARIA: the root is a `section` named by `ariaLabel`; columns are an `ol` of `li`, each with an optional visually hidden label; each header is a `button` with `aria-expanded` and `aria-controls`; the collapsed body is `inert`; connectors are `aria-hidden`; icon-only controls are named (`Bind Policy`, `Remove Policy`, `Apply Policy`, `Cancel`, `Copy Domains Custom domain`) and carry a `Tooltip`; Apply is described by the pending label (`aria-describedby`), so focusing it reads what it applies, and no extra live region is added (the component's only one is the loading line); loading announces once through a `role="status"` line.
- The unbound dash is `aria-hidden`; the status tag says Not bound in words.
- Pause, Stop, Hide (WCAG 2.2.2): the connector dashes march six times on mount and stop by themselves after 4.2 seconds; `motion-reduce:animate-none` keeps them still.
- Contrast ≥4.5:1 from the semantic text tokens.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `text-start`); the columns run from the inline start.
- Connectors: the engine reads `direction` and mirrors the elbows; ports swap sides.
- Icons: the chevron rotates vertically and is not mirrored; kind icons are not mirrored.
- User data: field values carry `dir="auto"`.

## Internationalization

| Key                                                     | English source                                              | Override prop |
| ------------------------------------------------------- | ----------------------------------------------------------- | ------------- |
| `topologyDiagram.label`                                 | Deployment topology                                         | `ariaLabel`   |
| `topologyDiagram.notBound`                              | Not bound                                                   | node `status` |
| `topologyDiagram.bind` / `change` / `remove` / `create` | Bind {kind} / Change {kind} / Remove {kind} / Create {kind} | —             |
| `topologyDiagram.apply` / `cancel`                      | Apply {kind} / Cancel                                       | —             |
| `topologyDiagram.pending`                               | Pending                                                     | —             |
| `topologyDiagram.existing`                              | Existing                                                    | —             |
| `topologyDiagram.noOptions`                             | No options yet.                                             | —             |
| `topologyDiagram.copy`                                  | Copy {field}                                                | —             |
| `topologyDiagram.emptyTitle`                            | Nothing is connected yet.                                   | `empty` slot  |
| `topologyDiagram.loading`                               | Loading the topology                                        | —             |

- Formatting: none; kinds, names, statuses and fields are data.

## Responsive

- Container queries: none; each column keeps `min-w-(--size-56)` and grows to share the width.
- Narrow (≤ 640 px or a narrow container): the diagram scrolls inline in its own focusable area; the page does not.
- Touch: header buttons are full-width rows; bind, remove, apply, cancel and copy are small icon buttons with tooltips that also work on focus.
- Reflow: the diagram is a two-dimensional figure, an accepted exception to 1.4.10 inside its own scroll area.

## Examples

### Default

```vue
<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'
  import { computed, reactive, ref } from 'vue'

  const policies = [
    { value: 'edge-guard', label: 'edge-guard' },
    { value: 'strict-waf', label: 'strict-waf' }
  ]
  const errorPages = [{ value: 'maintenance', label: 'maintenance' }]

  const bound = reactive({ policy: 'edge-guard', 'error-page': '' })

  const bindingFields = (value, unbound) =>
    value
      ? { name: value, boundValue: value, status: 'Active', severity: 'success', message: '' }
      : { name: '', boundValue: '', status: '', severity: 'neutral', message: unbound }

  const levels = computed(() => [
    {
      id: 'domains',
      label: 'Domains',
      nodes: [
        {
          id: 'domains',
          type: 'Domains',
          icon: 'az az-globe',
          name: 'shop.example.com',
          status: '2 domains',
          severity: 'info',
          fields: [
            {
              label: 'Platform domain',
              value: 'web-app-k3x9q2.example.net',
              href: 'https://web-app-k3x9q2.example.net',
              copyable: true
            },
            {
              label: 'Custom domain',
              value: 'shop.example.com',
              href: 'https://shop.example.com',
              copyable: true
            }
          ]
        }
      ]
    },
    {
      id: 'project',
      label: 'Project',
      nodes: [
        {
          id: 'project',
          type: 'Project',
          icon: 'az az-folder',
          name: 'web-app',
          status: 'Live',
          severity: 'success',
          href: '#project',
          fields: [
            { label: 'ID', value: '1482736015', copyable: true },
            { label: 'Environment', value: 'Production' }
          ]
        }
      ]
    },
    {
      id: 'policy',
      label: 'Policy',
      nodes: [
        {
          id: 'policy',
          type: 'Policy',
          icon: 'az az-shield',
          href: '#policy',
          bindable: true,
          bindOptions: policies,
          removable: true,
          ...bindingFields(bound.policy, 'Requests reach the service without inspection.'),
          fields: [{ label: 'Rules', value: '12 rules, 3 rate limits' }]
        }
      ]
    },
    {
      id: 'service',
      label: 'Service',
      nodes: [
        {
          id: 'service',
          type: 'Service',
          icon: 'az az-server',
          name: 'web-app',
          status: 'Active',
          severity: 'success',
          href: '#service',
          fields: [{ label: 'Version', value: 'AEO25I38' }]
        },
        {
          id: 'error-page',
          type: 'Error page',
          icon: 'az az-file',
          terminal: true,
          bindable: true,
          bindOptions: errorPages,
          removable: true,
          ...bindingFields(bound['error-page'], 'Errors answer with the default page.')
        }
      ]
    },
    {
      id: 'cache',
      label: 'Cache rules',
      nodes: [
        {
          id: 'cache-static',
          type: 'Cache rule',
          icon: 'az az-bolt',
          name: 'static-assets',
          status: 'Active',
          severity: 'success',
          fields: [{ label: 'Lifetime', value: '30 days' }]
        },
        {
          id: 'cache-api',
          type: 'Cache rule',
          icon: 'az az-bolt',
          name: 'api-bypass',
          status: 'Active',
          severity: 'success',
          fields: [{ label: 'Lifetime', value: 'Bypass' }]
        }
      ]
    },
    {
      id: 'integration',
      label: 'Integration',
      nodes: [
        {
          id: 'integration',
          type: 'Integration',
          icon: 'az az-link',
          name: 'web-app-origin',
          status: 'Active',
          severity: 'success',
          message:
            'Routes traffic from the service to its origin. It can be re-pointed but not removed.',
          fields: [{ label: 'Origin', value: 'origin.example.com', copyable: true }]
        }
      ]
    },
    {
      id: 'storage',
      label: 'Storage',
      nodes: [
        {
          id: 'storage',
          type: 'Storage',
          icon: 'az az-inbox',
          name: 'web-app-assets',
          status: 'Private',
          severity: 'neutral',
          terminal: true,
          fields: [{ label: 'Objects', value: '24 files, 1.2 MB' }]
        }
      ]
    }
  ])

  const openKeys = ref(['project'])
  const note = ref('')

  const bind = (event, { id, value }) => {
    bound[id] = value
    note.value = `${value} bound to ${id}.`
  }
  const remove = (event, id) => {
    bound[id] = ''
    note.value = `Removed the ${id} binding.`
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <div class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)">
      <TopologyDiagram
        v-model:open-keys="openKeys"
        :levels="levels"
        @bind="bind"
        @remove="remove"
        @create="(event, id) => (note = `Create a new ${id}.`)"
      >
        <template #actions="{ node }">
          <Tooltip
            v-if="node.id === 'domains'"
            content="Add domain"
          >
            <IconButton
              icon="az az-plus"
              variant="outline"
              size="small"
              aria-label="Add domain"
              @click="note = 'Add a domain.'"
            />
          </Tooltip>
        </template>
      </TopologyDiagram>
    </div>
    <p
      role="status"
      class="text-body-sm text-(--text-muted)"
    >
      {{ note }}
    </p>
  </div>
</template>
```

### Binding

```vue
<script setup>
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'
  import { computed, reactive, ref } from 'vue'

  const targets = {
    policy: {
      type: 'Policy',
      icon: 'az az-shield',
      options: [
        { value: 'edge-guard', label: 'edge-guard' },
        { value: 'strict-waf', label: 'strict-waf' }
      ],
      unbound: 'Requests reach the service without inspection.'
    },
    'error-page': {
      type: 'Error page',
      icon: 'az az-file',
      options: [{ value: 'maintenance', label: 'maintenance' }],
      unbound: 'Errors answer with the default page.'
    }
  }

  const deployed = { policy: 'edge-guard', 'error-page': '' }
  const staged = reactive({})
  const openKeys = ref(['policy'])
  const note = ref('')

  const slot = (key) => {
    const target = targets[key]
    const pick = staged[key]
    const removing = pick === ''
    const value = pick === undefined ? deployed[key] : pick
    const base = {
      id: key,
      type: target.type,
      icon: target.icon,
      bindable: true,
      bindOptions: target.options,
      removable: true
    }
    if (!value) {
      return {
        ...base,
        status: removing ? 'Staged' : '',
        severity: removing ? 'warning' : 'neutral',
        dashed: true,
        message: removing ? `Deploy to remove this ${target.type.toLowerCase()}.` : target.unbound
      }
    }
    return {
      ...base,
      name: value,
      boundValue: value,
      status: pick === undefined ? 'Active' : 'Staged',
      severity: pick === undefined ? 'success' : 'warning',
      dashed: pick !== undefined,
      message: pick === undefined ? '' : `Deploy to apply this ${target.type.toLowerCase()}.`
    }
  }

  const levels = computed(() => [
    {
      id: 'project',
      nodes: [
        {
          id: 'project',
          type: 'Project',
          icon: 'az az-folder',
          name: 'web-app',
          status: 'Live',
          severity: 'success'
        }
      ]
    },
    { id: 'policy', nodes: [slot('policy')] },
    {
      id: 'service',
      nodes: [
        {
          id: 'service',
          type: 'Service',
          icon: 'az az-server',
          name: 'web-app',
          status: 'Active',
          severity: 'success'
        },
        { ...slot('error-page'), terminal: true }
      ]
    }
  ])

  const stagedCount = computed(() => Object.keys(staged).length)

  const bind = (event, { id: key, value }) => {
    if (value === deployed[key]) delete staged[key]
    else staged[key] = value
    note.value = `${value} staged on ${targets[key].type.toLowerCase()}.`
  }
  const remove = (event, key) => {
    if (deployed[key]) staged[key] = ''
    else delete staged[key]
    note.value = `${targets[key].type} staged for removal.`
  }
  const create = (event, key) => {
    note.value = `Opens the create flow for a new ${targets[key].type.toLowerCase()}.`
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <div class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)">
      <TopologyDiagram
        v-model:open-keys="openKeys"
        :levels="levels"
        @bind="bind"
        @remove="remove"
        @create="create"
      />
    </div>
    <p
      role="status"
      class="text-body-sm text-(--text-muted)"
    >
      {{ stagedCount ? `${stagedCount} staged. ${note}` : note }}
    </p>
  </div>
</template>
```

### Loading

```vue
<script setup>
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'
</script>

<template>
  <div class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)">
    <TopologyDiagram loading />
  </div>
</template>
```

# Topology Diagram

> The deployment topology of a resource as a left-to-right diagram: each column is a depth (domains, project, policy, service, cache rules, integration, storage), each node a collapsible card with the resource kind, its status tag, its name and, when opened, a message and labelled fields; dashed connectors join every node of a column to the next. A node without a name is an unbound slot (dashed, Not bound) and a `bindable` node carries the bind control (bind an existing resource, change it, create one, remove it). Taken from the design sample's workload topology (`TopologyNode`, `TopologyNodeCard`, `TopologyBindNode`, `TopologyBindControl`, the empty node). It reuses `Flow`'s connector engine and anchors and draws its own list semantics, with no node-graph dependency.

- Import: `import TopologyDiagram from '@aziontech/webkit/topology-diagram'`
- Category: data · Surface: product · Structure: monolithic
- API as JSON: [topology-diagram.json](https://github.com/aziontech/webkit/blob/main/.specs/topology-diagram.json)

## When to use

- The topology tab of a project, service or workload: what serves its traffic, in order, and what is still unbound.
- A review before a deploy where binding or removing a resource is staged on the diagram.

## Do

- Keep a column per depth and put the nodes that serve in parallel in the same column.
- Mark a staged change `dashed` with a warning status and a message that says the deploy applies it.
- Mark the last node of each branch `terminal` so no connector leaves it.
- Give every unbound slot a message that says what happens without it.

## Don’t

- A sequence of steps or a pipeline without data cards → use `flow`.
- A nested list of items with no flow between them → use `tree`.
- A marketing architecture picture → use `diagram`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [flow](flow.md) — the connector engine and anchors this component reuses.
- [tree](tree.md) — hierarchical data without connectors.
- [dropdown-menu](dropdown-menu.md) — the bind control's menu.
- platform/detail/details-page` — the page whose topology tab holds it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `levels` | `TopologyLevel[]` | `[]` | false | Columns of the diagram, from the entry point to the last dependency. |
| `loading` | `boolean` | `false` | false | Shows placeholder cards while the topology loads. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the diagram. Empty uses the locale catalog (`Deployment topology`). |
| `expanded` | `string[]` | `() => []` | false | Two-way value (`v-model:expanded`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `bind` | `[key: string, value: string]` | An existing option was picked in the bind control. |
| `remove` | `[key: string]` | Remove was activated on a bound, removable node. |
| `create` | `[key: string]` | Create was picked in the bind control. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `actions` | { node: TopologyNode } | Extra controls in a node's identity row, before the bind control. |
| `empty` | — | Replaces the line shown when there are no levels. |

## v-model

- **`v-model:expanded`** — `string[]`, default `[]`. Keys of the open node cards; a header click toggles its key.

## States

- Root: `data-loading` and `aria-busy` while `loading`; empty when `levels` is empty.
- Node card: `data-state` `open` | `closed`; `data-dashed` for a staged or unbound node.
- Connectors: dashed, flowing; faded never (no disabled nodes).

## Accessibility

- Visible focus: header buttons `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`; the scroll area when it scrolls.
- Keyboard map: `Tab` moves through header buttons, links, copy, bind and remove controls in reading order; `Enter`/`Space` on a header toggles its card; the bind menu follows `dropdown-menu` (arrows, `Enter`, `Esc`). The scroll area is focusable (`tabindex="0"`) only when it overflows, so arrow keys scroll it.
- ARIA: the root is a `section` named by `ariaLabel`; columns are an `ol` of `li`, each with an optional visually hidden label; each header is a `button` with `aria-expanded` and `aria-controls`; the collapsed body is `inert`; connectors are `aria-hidden`; icon-only controls are named (`Bind Policy`, `Remove Policy`, `Copy Domains Custom domain`) and carry a `Tooltip`; loading announces once through a `role="status"` line.
- The unbound dash is `aria-hidden`; the status tag says Not bound in words.
- Contrast ≥4.5:1 from the semantic text tokens.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `text-start`); the columns run from the inline start.
- Connectors: the engine reads `direction` and mirrors the elbows; ports swap sides.
- Icons: the chevron rotates vertically and is not mirrored; kind icons are not mirrored.
- User data: field values carry `dir="auto"`.

## Internationalization

| Key                          | English source              | Override prop |
| ---------------------------- | --------------------------- | ------------- |
| `topologyDiagram.label`     | Deployment topology         | `ariaLabel`   |
| `topologyDiagram.notBound`  | Not bound                   | node `status` |
| `topologyDiagram.bind` / `change` / `remove` / `create` | Bind {kind} / Change {kind} / Remove {kind} / Create {kind} | — |
| `topologyDiagram.existing`  | Existing                    | —             |
| `topologyDiagram.noOptions` | No options yet.             | —             |
| `topologyDiagram.copy`      | Copy {field}                | —             |
| `topologyDiagram.empty`     | Nothing is connected yet.   | `empty` slot  |
| `topologyDiagram.loading`   | Loading the topology        | —             |

- Formatting: none; kinds, names, statuses and fields are data.

## Responsive

- Container queries: none; each column keeps `min-w-(--size-56)` and grows to share the width.
- Narrow (≤ 640 px or a narrow container): the diagram scrolls inline in its own focusable area; the page does not.
- Touch: header buttons are full-width rows; bind, remove and copy are small icon buttons with tooltips that also work on focus.
- Reflow: the diagram is a two-dimensional figure, an accepted exception to 1.4.10 inside its own scroll area.

## Examples

### Default

```vue
<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'
  import { ref } from 'vue'

  const policies = [
    { value: 'edge-guard', label: 'edge-guard' },
    { value: 'strict-waf', label: 'strict-waf' }
  ]
  const errorPages = [{ value: 'maintenance', label: 'maintenance' }]

  const levels = [
    {
      key: 'domains',
      label: 'Domains',
      nodes: [
        {
          key: 'domains',
          kind: 'Domains',
          icon: 'pi pi-globe',
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
      key: 'project',
      label: 'Project',
      nodes: [
        {
          key: 'project',
          kind: 'Project',
          icon: 'pi pi-folder',
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
      key: 'policy',
      label: 'Policy',
      nodes: [
        {
          key: 'policy',
          kind: 'Policy',
          icon: 'pi pi-shield',
          name: 'edge-guard',
          status: 'Active',
          severity: 'success',
          href: '#policy',
          bindable: true,
          bindOptions: policies,
          boundValue: 'edge-guard',
          removable: true,
          fields: [{ label: 'Rules', value: '12 rules, 3 rate limits' }]
        }
      ]
    },
    {
      key: 'service',
      label: 'Service',
      nodes: [
        {
          key: 'service',
          kind: 'Service',
          icon: 'pi pi-server',
          name: 'web-app',
          status: 'Active',
          severity: 'success',
          href: '#service',
          fields: [{ label: 'Version', value: 'AEO25I38' }]
        },
        {
          key: 'error-page',
          kind: 'Error page',
          icon: 'pi pi-file',
          terminal: true,
          bindable: true,
          bindOptions: errorPages,
          message: 'Errors answer with the default page.'
        }
      ]
    },
    {
      key: 'cache',
      label: 'Cache rules',
      nodes: [
        {
          key: 'cache-static',
          kind: 'Cache rule',
          icon: 'pi pi-bolt',
          name: 'static-assets',
          status: 'Active',
          severity: 'success',
          fields: [{ label: 'Lifetime', value: '30 days' }]
        },
        {
          key: 'cache-api',
          kind: 'Cache rule',
          icon: 'pi pi-bolt',
          name: 'api-bypass',
          status: 'Active',
          severity: 'success',
          fields: [{ label: 'Lifetime', value: 'Bypass' }]
        }
      ]
    },
    {
      key: 'integration',
      label: 'Integration',
      nodes: [
        {
          key: 'integration',
          kind: 'Integration',
          icon: 'pi pi-link',
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
      key: 'storage',
      label: 'Storage',
      nodes: [
        {
          key: 'storage',
          kind: 'Storage',
          icon: 'pi pi-inbox',
          name: 'web-app-assets',
          status: 'Private',
          severity: 'neutral',
          terminal: true,
          fields: [{ label: 'Objects', value: '24 files, 1.2 MB' }]
        }
      ]
    }
  ]

  const expanded = ref(['project'])
  const event = ref('')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <TopologyDiagram
      v-model:expanded="expanded"
      :levels="levels"
      class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
      @bind="(key, value) => (event = `Bind ${value} to ${key}.`)"
      @remove="(key) => (event = `Remove ${key}.`)"
      @create="(key) => (event = `Create a new ${key}.`)"
    >
      <template #actions="{ node }">
        <Tooltip
          v-if="node.key === 'domains'"
          text="Add domain"
        >
          <IconButton
            icon="pi pi-plus"
            kind="outlined"
            size="small"
            aria-label="Add domain"
            @click="event = 'Add a domain.'"
          />
        </Tooltip>
      </template>
    </TopologyDiagram>
    <p
      role="status"
      class="text-body-sm text-(--text-muted)"
    >
      {{ event }}
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
      kind: 'Policy',
      icon: 'pi pi-shield',
      options: [
        { value: 'edge-guard', label: 'edge-guard' },
        { value: 'strict-waf', label: 'strict-waf' }
      ],
      unbound: 'Requests reach the service without inspection.'
    },
    'error-page': {
      kind: 'Error page',
      icon: 'pi pi-file',
      options: [{ value: 'maintenance', label: 'maintenance' }],
      unbound: 'Errors answer with the default page.'
    }
  }

  const deployed = { policy: 'edge-guard', 'error-page': '' }
  const staged = reactive({})
  const expanded = ref(['policy'])
  const note = ref('')

  const slot = (key) => {
    const target = targets[key]
    const pick = staged[key]
    const removing = pick === ''
    const value = pick === undefined ? deployed[key] : pick
    const base = {
      key,
      kind: target.kind,
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
        message: removing ? `Deploy to remove this ${target.kind.toLowerCase()}.` : target.unbound
      }
    }
    return {
      ...base,
      name: value,
      boundValue: value,
      status: pick === undefined ? 'Active' : 'Staged',
      severity: pick === undefined ? 'success' : 'warning',
      dashed: pick !== undefined,
      message: pick === undefined ? '' : `Deploy to apply this ${target.kind.toLowerCase()}.`
    }
  }

  const levels = computed(() => [
    {
      key: 'project',
      nodes: [
        {
          key: 'project',
          kind: 'Project',
          icon: 'pi pi-folder',
          name: 'web-app',
          status: 'Live',
          severity: 'success'
        }
      ]
    },
    { key: 'policy', nodes: [slot('policy')] },
    {
      key: 'service',
      nodes: [
        {
          key: 'service',
          kind: 'Service',
          icon: 'pi pi-server',
          name: 'web-app',
          status: 'Active',
          severity: 'success'
        },
        { ...slot('error-page'), terminal: true }
      ]
    }
  ])

  const stagedCount = computed(() => Object.keys(staged).length)

  const bind = (key, value) => {
    if (value === deployed[key]) delete staged[key]
    else staged[key] = value
    note.value = `${value} staged on ${targets[key].kind.toLowerCase()}.`
  }
  const remove = (key) => {
    if (deployed[key]) staged[key] = ''
    else delete staged[key]
    note.value = `${targets[key].kind} staged for removal.`
  }
  const create = (key) => {
    note.value = `Opens the create flow for a new ${targets[key].kind.toLowerCase()}.`
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <TopologyDiagram
      v-model:expanded="expanded"
      :levels="levels"
      class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
      @bind="bind"
      @remove="remove"
      @create="create"
    />
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
  <TopologyDiagram
    loading
    class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
  />
</template>
```

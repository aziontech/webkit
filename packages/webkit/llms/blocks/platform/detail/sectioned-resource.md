# SectionedResource (`platform/detail/sectioned-resource`)

> A resource page whose tab holds more sibling pages than a tab row can carry: the third navigation level, and the only sanctioned home for a `MenuRoot` inside a page body. A full-bleed `PageTabs` row names the resource's sections (here a policy: Web security, Network security, Private access, Data protection, Objects, Settings, Versions); the Private access tab carries 16 sibling pages in 4 groups. From `@3xl` of the tab body the local navigation is a `MenuRoot` of groups in a fixed `--container-3xs` column, its rows `href` links with no glyphs, like rail sub-rows, and exactly one row marked current, derived from the route; below `@3xl` it folds into a medium `Select` labelled with the tab name through `Field`, its options grouped the same way. Beside it the current page is the TableView body: a small `PageHeader` with an outlined Documentation and an outlined Add action, the `PropertyFilter` controls row with Refresh, and a flush `Card` around `TableRoot` driven by `useCollection`, with a No matching `EmptyState` inside the table. The container query sits on the tab body wrapper and the queries on its children, so the content column never drops below the page column minus the navigation column. Use it only when the rail does not already list these pages and the tab has more than 7 siblings; with 7 or fewer, use a `ToggleGroup` (the FewSiblings variant), tabs or sections of one page. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/detail/sectioned-resource/sectioned-resource.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/detail/sectioned-resource")`
- Components: [Button](../../../components/button.md), [Card](../../../components/card.md), [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [IconButton](../../../components/icon-button.md), `MenuRoot`, [PageHeader](../../../components/page-header.md), [PageTabs](../../../components/page-tabs.md), [PropertyFilter](../../../components/property-filter.md), [Select](../../../components/select.md), [Table](../../../components/table.md), `TableRoot`, [Tabs](../../../components/tabs.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md), `use-collection`
- Skills: `webkit-navigation`, `webkit-layout`, `webkit-tables`

## Asked as

local navigation; in-page navigation; section navigation; sub navigation; third level navigation; level 3 navigation; sectioned resource; resource sections; tab with many pages; many sibling pages; grouped sub pages; policy sections; side menu in page; navigation levels; navegação local; navegação de terceiro nível; submenu da página; seções do recurso; navegación local; secciones del recurso

The page of one resource whose tab holds more sibling pages than a tab row can carry: the rules of a policy, the records of a zone, the settings of one application. The user arrives from the resource's list row or its tabs and moves between the sibling pages without leaving the resource. A console screen shows one navigation per level: the rail lists modules and first-level pages, `PageTabs` lists the resource's sections, and this block adds the third level, at most one local navigation inside the active tab. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the breadcrumb, the ⌘K palette and the `main`.

## When to use

- One tab of a resource holds more than 7 sibling pages that only exist inside that resource, such as the Private access families of a policy.
- The siblings fall into a few named groups the reader scans before picking one.
- Each sibling page is a list or a form of its own, with its own route, so a link to it can be shared.

## When not to use

- The rail already lists these pages: a destination appears once per screen, so drop either the rail rows or the local navigation. Pages that need a resource are reached through the resource, never as rail rows.
- The tab has 7 or fewer siblings: use a `ToggleGroup` (the FewSiblings variant), tabs, or sections of one page.
- The pages do not belong to one resource: they are first-level pages and go in the rail.
- A resource whose tabs each hold one page: use `platform/detail/details-page` or `platform/detail/record-table`.

## Building blocks

### A. Tab bar — `PageTabs`, `Tabs` (required)

A full-bleed `PageTabs` with one `Tabs.Item` per section of the resource, in a `sticky top-0` wrapper on the canvas fill, so it stays in view while the layout's content region scrolls the tab under it. It is level 2; the breadcrumb names the resource and is not a level.

### B. Local navigation — `MenuRoot` (required)

From `@3xl` of the tab body, a `MenuRoot` with `groups` in a fixed `w-(--container-3xs)` column at the inline start. Its rows are `href` links with no glyphs, like the rail's sub-rows, grouped under short group labels. `active-id` comes from the route: the row whose `href` matches the current path is the one current row (`aria-current="page"`), and no row is current when the route is not one of them. Its `aria-label` is the tab name. `navigate` routes on a plain click and leaves modified clicks to the browser.

### C. Folded navigation — `Field`, `Select` (required)

Below `@3xl` of the tab body the menu is hidden and a medium `Select` takes its place, labelled with the tab name through `Field` and `Field.Label`, its options grouped like the menu with `Select.Group`. The value is the current route; picking an option navigates. The container query sits on the tab body wrapper (`@container/tab`) and the `@3xl/tab:` variants on its children, because a container query never matches its own container.

### D. Page heading — `PageHeader`, `Button` (required)

The current sibling opens with a small `PageHeader`: its name as the title, one sentence of description, then an outlined medium Documentation and an outlined medium `Add <Noun>`. Inside a resource no action is primary and the create verb is Add.

### E. Controls row — `PropertyFilter`, `Tooltip`, `IconButton` (required)

The TableView controls row: a `PropertyFilter` that grows to fill the row, bound to `useCollection`, then an outlined Refresh `IconButton` named by a `Tooltip`. Moving to another sibling clears the filters.

### F. List — `Card`, `TableRoot`, `Table.CellLink`, `Table.CellId`, `Table.CellStatus`, `Table.CellTime`, `EmptyState` (required)

`Card :padded="false"` around `TableRoot :bordered="false"` with the `useCollection` table props and sorting. Name is a `Table.CellLink` to the entry, ID a `Table.CellId`, Status a `Table.CellStatus` and Last Modified a `Table.CellTime` with its author. A filter that matches nothing shows a No matching `EmptyState` with Clear filters inside the table.

## Do

- Keep one control per navigation level: the rail, the tabs, and at most this one local navigation.
- Derive the current row from the route on every level, and make the current rows of all levels describe the same place.
- Keep the menu column at `--container-3xs`, so the list keeps the page column minus that column.
- Label the folded `Select` with the tab name, so the reader knows which set of pages it switches.
- Give every sibling page its own route, and let the menu rows be real links that open in a new tab on a modified click.

## Don't

- Don't render a `Menu` in a page body outside this block; local navigation is this block.
- Don't repeat in the local navigation a page the rail already offers, and don't add rail rows that route into a resource, not even as a shortcut into a default one.
- Don't use it for 7 or fewer siblings; a `ToggleGroup`, tabs or one page of sections carries them.
- Don't add glyphs to the menu rows or nest a second level inside the local navigation.
- Don't put the container query on the element that declares the container.

## Copy

- **Tabs:** short nouns, e.g. "Private access", "Settings".
- **Group labels:** one noun for the family, e.g. "Applications", "Access", "Monitoring".
- **Rows and options:** the page name in sentence case, plural, e.g. "Access rules", "Server groups".
- **Heading:** the page name as the title and one sentence that ends with a period, e.g. "Access rules of the acme-default policy."
- **Actions:** "Documentation" and "Add Rule", the noun of one entry.
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The local navigation is a `nav` named after the tab; exactly one row carries `aria-current="page"`, the one that matches the route.
- The folded `Select` is labelled by its `Field.Label`, and only one of the two forms is rendered at a time, so the reader never meets the same pages twice.
- Focus order follows reading order: tabs, local navigation, page actions, filter, Refresh, table, pagination.
- The filter has an `aria-label` that matches its placeholder; Refresh is named by its `aria-label` and a `Tooltip` with the same words.
- Every utility is logical (`ms-`, `ps-`, `start`), so the menu column sits on the inline start in right-to-left.
- The tab entrance respects reduced motion.

## States

- Default: the Private access tab of the acme-default policy, 16 sibling pages in 4 groups in the menu column, Access rules current and listed beside it.
- Narrow: the same tab below `@3xl` of the tab body: the menu folds into a Select labelled Private access, Server groups current, the list under it at full width.
- FewSiblings: the Network security tab with 6 siblings and no local navigation; a ToggleGroup labelled Network security switches between them above the list.

## Related

- `platform/view/table-view` — the list each sibling page renders, and the source of the controls row recipe.
- `platform/detail/details-page` — a resource whose tabs each hold one page.
- `platform/detail/record-table` — a resource with a settings tab and one dominant record list.
- `ConsoleLayout` — the rail (level 1) this block must not repeat; see `skills/webkit-navigation`.

## Variants

- `Default` — primary (the code below)
- `Narrow` — The same Private access tab in a narrow page, below `@3xl` of the tab body: the local navigation folds into a medium `Select` labelled Private access, its 16 options in the same 4 groups, with Server groups current; the list takes the full width under it.
- `FewSiblings` — The Network security tab with 6 sibling pages: no local navigation. A medium `ToggleGroup` labelled Network security switches between them above the list, the alternative rule 4 prescribes for 7 or fewer siblings.

Each variant is the same screen in another state: `get_pattern("platform/detail/sectioned-resource", { variant })`, or the file under `blocks/platform/detail/sectioned-resource/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import type { MenuGroupNode, MenuNode } from '@aziontech/webkit/menu'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  type EntryStatus = 'Active' | 'Inactive'

  type Entry = {
    id: string
    name: string
    status: EntryStatus
    owner: string
    modifiedAt: Date
  }

  type Sibling = {
    id: string
    label: string
    noun: string
  }

  const tabs = [
    { value: 'web-security', label: 'Web security' },
    { value: 'network-security', label: 'Network security' },
    { value: 'private-access', label: 'Private access' },
    { value: 'data-protection', label: 'Data protection' },
    { value: 'objects', label: 'Objects' },
    { value: 'settings', label: 'Settings' },
    { value: 'versions', label: 'Versions' }
  ]

  const activeTab = ref('private-access')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')

  const base = '/policies/acme-default/private-access'

  const sections: { label: string; items: Sibling[] }[] = [
    {
      label: 'Applications',
      items: [
        { id: 'app-segments', label: 'App segments', noun: 'Segment' },
        { id: 'segment-groups', label: 'Segment groups', noun: 'Group' },
        { id: 'server-groups', label: 'Server groups', noun: 'Server Group' },
        { id: 'connectors', label: 'Connectors', noun: 'Connector' }
      ]
    },
    {
      label: 'Access',
      items: [
        { id: 'access-rules', label: 'Access rules', noun: 'Rule' },
        { id: 'identity-providers', label: 'Identity providers', noun: 'Provider' },
        { id: 'posture-checks', label: 'Posture checks', noun: 'Check' },
        { id: 'device-groups', label: 'Device groups', noun: 'Device Group' }
      ]
    },
    {
      label: 'Network',
      items: [
        { id: 'tunnels', label: 'Tunnels', noun: 'Tunnel' },
        { id: 'dns-resolvers', label: 'DNS resolvers', noun: 'Resolver' },
        { id: 'split-routes', label: 'Split routes', noun: 'Route' },
        { id: 'ip-pools', label: 'IP pools', noun: 'Pool' }
      ]
    },
    {
      label: 'Monitoring',
      items: [
        { id: 'alerts', label: 'Alerts', noun: 'Alert' },
        { id: 'reports', label: 'Reports', noun: 'Report' },
        { id: 'log-streams', label: 'Log streams', noun: 'Stream' },
        { id: 'webhooks', label: 'Webhooks', noun: 'Webhook' }
      ]
    }
  ]

  const hrefOf = (sibling: Sibling) => `${base}/${sibling.id}`

  const groups: MenuGroupNode[] = sections.map((section) => ({
    label: section.label,
    items: section.items.map((sibling) => ({
      id: sibling.id,
      label: sibling.label,
      href: hrefOf(sibling)
    }))
  }))

  const siblings = sections.flatMap((section) => section.items)

  const routePath = ref(`${base}/access-rules`)

  const match = computed(() => siblings.find((sibling) => hrefOf(sibling) === routePath.value))
  const current = computed(() => match.value ?? siblings[0])

  const owners = ['Jane Doe', 'John Smith', 'Alex Morgan', 'Sam Lee', 'Priya Patel']

  const referenceTime = Date.UTC(2026, 10, 10, 12)

  const entries = computed<Entry[]>(() =>
    Array.from({ length: 6 }, (_, index) => {
      const n = index + 1
      const slug = current.value.noun.toLowerCase().replace(/\s+/g, '-')
      return {
        id: `${30410 + n * 157}`,
        name: `${slug}-${String(n).padStart(2, '0')}`,
        status: n === 5 ? 'Inactive' : 'Active',
        owner: owners[index % owners.length],
        modifiedAt: new Date(referenceTime - n * 9 * 86_400_000)
      }
    })
  )

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', options: [{ value: 'Active' }, { value: 'Inactive' }] },
    { key: 'owner', label: 'Author', options: owners.map((owner) => ({ value: owner })) }
  ]

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
    { accessorKey: 'modifiedAt', header: 'Last Modified', enableSorting: true, minWidth: 80 }
  ]

  const {
    tableProps,
    propertyFilterProps,
    clearFilters,
    loading: fetching
  } = useCollection({
    items: () => entries.value,
    columns,
    filtering: { fields: ['name', 'id', 'status', 'owner'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10 }
  })

  const go = (href: string) => {
    if (href === routePath.value) return
    routePath.value = href
    clearFilters()
  }

  const navigate = (event: MouseEvent, node: MenuNode) => {
    if (!node.href || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    go(node.href)
  }

  const pick = (value: string | undefined) => {
    if (value) go(value)
  }

  const labelOf = (value: string | undefined) =>
    siblings.find((sibling) => hrefOf(sibling) === value)?.label ?? ''

  const loading = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <section class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1">
      <div class="layout-column layout-boundary @container/tab flex min-w-0 flex-col">
        <div
          class="flex min-w-0 flex-col gap-(--layout-group-gap) @3xl/tab:flex-row @3xl/tab:items-start @3xl/tab:gap-(--layout-section-gap)"
        >
          <div class="hidden w-(--container-3xs) shrink-0 @3xl/tab:block">
            <MenuRoot
              :groups="groups"
              :active-id="match?.id ?? ''"
              :aria-label="tabLabel"
              @navigate="navigate"
            />
          </div>

          <div class="w-full max-w-(--layout-measure-control) @3xl/tab:hidden">
            <Field>
              <Field.Label>{{ tabLabel }}</Field.Label>
              <Select
                :model-value="routePath"
                size="medium"
                :display-value="labelOf"
                @update:model-value="pick"
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Group
                    v-for="section in sections"
                    :key="section.label"
                    :label="section.label"
                  >
                    <Select.Option
                      v-for="sibling in section.items"
                      :key="sibling.id"
                      :value="hrefOf(sibling)"
                    >
                      {{ sibling.label }}
                    </Select.Option>
                  </Select.Group>
                </Select.Content>
              </Select>
            </Field>
          </div>

          <div class="flex min-w-0 flex-1 flex-col">
            <PageHeader
              :title="current.label"
              :description="`${current.label} of the acme-default policy.`"
              size="small"
            >
              <template #actions>
                <Button
                  label="Documentation"
                  icon="pi pi-book"
                  kind="outlined"
                  size="medium"
                  href="https://example.com/docs/private-access"
                  target="_blank"
                />
                <Button
                  :label="`Add ${current.noun}`"
                  icon="pi pi-plus"
                  kind="outlined"
                  size="medium"
                />
              </template>
            </PageHeader>
            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex items-start gap-(--layout-group-gap)">
                <div class="flex min-w-0 grow">
                  <PropertyFilter
                    v-bind="propertyFilterProps"
                    :placeholder="`Filter ${current.label.toLowerCase()}`"
                    :aria-label="`Filter ${current.label.toLowerCase()}`"
                  />
                </div>
                <Tooltip
                  text="Refresh"
                  class="shrink-0"
                >
                  <IconButton
                    icon="pi pi-refresh"
                    kind="outlined"
                    size="medium"
                    :loading="loading"
                    aria-label="Refresh"
                    @click="refresh"
                  />
                </Tooltip>
              </header>
              <Card :padded="false">
                <template #content>
                  <TableRoot
                    v-bind="tableProps"
                    :loading="loading || fetching"
                    enable-sorting
                    :bordered="false"
                  >
                    <template #cell-name="{ row }">
                      <Table.CellLink
                        :label="row.name"
                        :to="`${routePath}/${row.id}`"
                        :destination="current.label"
                      />
                    </template>
                    <template #cell-id="{ value }">
                      <Table.CellId
                        :value="value"
                        :resource="current.noun.toLowerCase()"
                      />
                    </template>
                    <template #cell-status="{ value }">
                      <Table.CellStatus
                        :label="value"
                        :severity="value === 'Active' ? 'success' : 'secondary'"
                      />
                    </template>
                    <template #cell-modifiedAt="{ row }">
                      <Table.CellTime
                        :value="row.modifiedAt"
                        :author="row.owner"
                      />
                    </template>
                    <template #empty>
                      <EmptyState
                        size="medium"
                        icon="pi pi-filter-slash"
                        :title="`No matching ${current.label.toLowerCase()}`"
                        description="Nothing matches these filters."
                      >
                        <template #actions>
                          <Button
                            label="Clear filters"
                            kind="outlined"
                            size="small"
                            @click="clearFilters"
                          />
                        </template>
                      </EmptyState>
                    </template>
                  </TableRoot>
                </template>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
```

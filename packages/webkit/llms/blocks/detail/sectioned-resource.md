# SectionedResource (`detail/sectioned-resource`)

> A resource page whose tab holds more sibling pages than a tab row can carry: the third navigation level, and the only sanctioned home for a `SidebarMenuRoot` inside a page body. A full-bleed `PageTabs` row names the resource's sections (here a policy: Web security, Network security, Private access, Data protection, Objects, Settings, Versions); the Private access tab carries 16 sibling pages in 4 groups. From `@3xl` of the tab body the local navigation is a `SidebarMenuRoot` of groups in a fixed `--container-3xs` column, its rows `href` links with no glyphs, like rail sub-rows, and exactly one row marked current, derived from the route; below `@3xl` it folds into a medium `Select` labelled with the tab name through `Field`, its options grouped the same way. Beside it the current page is the TableView body: a small `PageHeader` with an outlined Documentation and an outlined Add action, the `PropertyFilter` controls row with Refresh, and a flush `Card` around `DataTable` driven by `useCollection`, with an `EmptyState` inside the table that tells a page with no entries (Add) apart from a filter that matches nothing (Clear filters); another tab shows an `EmptyState` linking to that tab's route. The container query sits on the tab body wrapper and the queries on its children, so the content column never drops below the page column minus the navigation column. Use it only when the rail does not already list these pages and the tab has more than 7 siblings; with 7 or fewer, use a `ToggleGroup` (the FewSiblings variant), tabs or sections of one page. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/detail/sectioned-resource/sectioned-resource.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/sectioned-resource")`
- Components: [Button](../../components/button.md), [Card](../../components/card.md), [DataTable](../../components/data-table.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [IconButton](../../components/icon-button.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), [PropertyFilter](../../components/property-filter.md), [Select](../../components/select.md), `SidebarMenuRoot`, `TableCellId`, `TableCellLink`, `TableCellStatus`, `TableCellTime`, [Tabs](../../components/tabs.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-collection`
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
- A resource whose tabs each hold one page: use `detail/resource-detail` or `detail/dns-zone-detail`.

## Building blocks

### A. Tab bar — `PageTabs`, `Tabs` (required)

A full-bleed `PageTabs` with one `Tabs.Trigger` per section of the resource, in a `sticky top-0` wrapper on the canvas fill, so it stays in view while the layout's content region scrolls the tab under it. It is level 2; the breadcrumb names the resource and is not a level. Each tab is its own route: this block renders the open tab's page, and another tab shows an `EmptyState` with an Open link to that tab's route, so no tab is ever dead.

### B. Local navigation — `SidebarMenuRoot` (required)

From `@3xl` of the tab body, a `SidebarMenuRoot` with `groups` in a fixed `w-(--container-3xs)` column at the inline start. Its rows are `href` links with no glyphs, like the rail's sub-rows, grouped under short group labels. `active-id` comes from the route: the row whose `href` matches the current path is the one current row (`aria-current="page"`), and no row is current when the route is not one of them. Its `aria-label` is the tab name. `navigate` routes on a plain click and leaves modified clicks to the browser.

### C. Folded navigation — `Field`, `Select` (required)

Below `@3xl` of the tab body the menu is hidden and a medium `Select` takes its place, labelled with the tab name through `Field` and `Field.Label`, its options grouped like the menu with `Select.Group`. The value is the current route; picking an option navigates. The container query sits on the tab body wrapper (`@container/tab`) and the `@3xl/tab:` variants on its children, because a container query never matches its own container.

### D. Few siblings — `ToggleGroup` (optional)

When `sections` hold 7 or fewer pages there is no menu and no folded `Select`: a medium `ToggleGroup` labelled with the tab name sits above the list and switches between them, at every width.

### E. Page heading — `PageHeader`, `Button` (required)

The current sibling opens with a small `PageHeader`: its name as the title, one sentence of description, then an outlined medium Documentation and an outlined medium `Add <Noun>`. Inside a resource no action is primary and the create verb is Add.

### F. Controls row — `PropertyFilter`, `Tooltip`, `IconButton` (required)

The TableView controls row: a `PropertyFilter` that grows to fill the row, bound to `useCollection`, then an outlined Refresh `IconButton` named by a `Tooltip`. Moving to another sibling clears the filters.

### G. List — `Card`, `DataTable`, `TableCellLink`, `TableCellId`, `TableCellStatus`, `TableCellTime`, `EmptyState` (required)

`Card :padded="false"` around `DataTable :bordered="false"` with the `useCollection` table props and sorting. Name is a `TableCellLink` to the entry, ID a `TableCellId`, Status a `TableCellStatus` and Last Modified a `TableCellTime` with its author. The table's `#empty` slot branches on `useCollection`'s `status`: a filter that matches nothing shows a No matching `EmptyState` with Clear filters; a sibling page with no entries yet (Posture checks, Webhooks, Exceptions here) shows `No <page> yet` with `Add <Noun>`.

## Data

The block takes its sibling pages and entries through props and emits every action; it fetches nothing. `SectionedResourceEntry`, `SectionedResourceSection`, `SectionedResourceSibling` and `SectionedResourceProps` are exported from `sectioned-resource.vue`, and `sample.ts` holds the sample pages and entries the block renders when `sections` or `entries` is left out (and never while `loading` is set).

| Prop            | Type                         | What it does                                                                                                                 |
| --------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `sections`      | `SectionedResourceSection[]` | The sibling pages of the open tab, in groups. More than 7 render the menu and the folded Select; 7 or fewer a `ToggleGroup`. |
| `entries`       | `SectionedResourceEntry[]`   | The rows of the current page; the filter, the sort and the pages run on them. Pass `[]` for a page with none.                |
| `loading`       | `boolean`                    | The entries are loading: Refresh spins and the table shows its loading state.                                                |
| `v-model:page`  | `string`                     | The id of the current sibling page; picking a row, an option or a toggle sets it.                                            |
| `currentTab`    | `string`                     | The tab whose page the block renders; every other tab links to its own route.                                                |
| `basePath`      | `string`                     | The resource route; tabs are `basePath/tab` and pages `basePath/currentTab/page`.                                            |
| `resourceLabel` | `string`                     | How the headings name the resource, e.g. "the acme-default policy".                                                          |

| Event         | Payload            | When                                                |
| ------------- | ------------------ | --------------------------------------------------- |
| `update:page` | `(page)`           | Another sibling page was picked; the filters clear. |
| `refresh`     | `(event)`          | Refresh.                                            |
| `add`         | `(event, sibling)` | `Add <Noun>` in the heading or on an empty page.    |

To go live, render the block from the tab route and pass the current page's entries:

```vue
<script setup lang="ts">
  import SectionedResource from './sectioned-resource.vue'

  const route = useRoute()
  const router = useRouter()
  const page = computed({
    get: () => String(route.params.page),
    set: (next) => router.push(`/policies/acme-default/private-access/${next}`)
  })
  const { data, pending, refresh } = usePolicyEntries(page)
</script>

<template>
  <SectionedResource
    v-model:page="page"
    :sections="privateAccessSections"
    :entries="data ?? []"
    :loading="pending"
    @refresh="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep one control per navigation level: the rail, the tabs, and at most this one local navigation.
- Derive the current row from the route on every level, and make the current rows of all levels describe the same place.
- Keep the menu column at `--container-3xs`, so the list keeps the page column minus that column.
- Label the folded `Select` with the tab name, so the reader knows which set of pages it switches.
- Tell an empty page (Add) apart from a filter that matches nothing (Clear filters).
- Give every sibling page its own route, and let the menu rows be real links that open in a new tab on a modified click.

## Don't

- Don't render a `SidebarMenu` in a page body outside this block; local navigation is this block.
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

- Default: `sections` with more than 7 pages; the Private access tab of the acme-default policy, 16 sibling pages in 4 groups in the menu column, Access rules current and listed beside it.
- Narrow: `page` set to Server groups; the same tab below `@3xl` of the tab body: the menu folds into a Select labelled Private access, Server groups current, the list under it at full width. The page keeps the primary's root, so `layout-column` alone sets the measure.
- FewSiblings: `sections` with 6 pages and `currentTab` set to Network security; the Network security tab with 6 siblings and no local navigation; a ToggleGroup labelled Network security switches between them above the list.

## Related

- `view/table-view` — the list each sibling page renders, and the source of the controls row recipe.
- `detail/resource-detail` — a resource whose tabs each hold one page.
- `detail/dns-zone-detail` — a resource with a settings tab and one dominant record list.
- `ConsoleLayout` — the rail (level 1) this block must not repeat; see `skills/webkit-navigation`.

## Variants

- `Default` — primary (the code below)
- `Narrow` — The same Private access tab in a narrow page, below `@3xl` of the tab body: the local navigation folds into a medium `Select` labelled Private access, its 16 options in the same 4 groups, with Server groups current; the list takes the full width under it.
- `FewSiblings` — The Network security tab with 6 sibling pages: no local navigation. A medium `ToggleGroup` labelled Network security switches between them above the list, the alternative rule 4 prescribes for 7 or fewer siblings.

Each variant is the same screen in another state: `get_block("detail/sectioned-resource", { variant })`, or the file under `blocks/detail/sectioned-resource/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import type { SidebarMenuGroupNode, SidebarMenuNode } from '@aziontech/webkit/sidebar-menu'
  import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tabs from '@aziontech/webkit/tabs'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  import { sampleEntriesFor, samplePage, sampleSections } from './sample'

  /** Status of one entry of a sibling page. */
  export type SectionedResourceEntryStatus = 'Active' | 'Inactive'

  /** One row of the current sibling page. */
  export interface SectionedResourceEntry {
    /** Entry id, shown in the ID column. */
    id: string
    /** Entry name, the link to the entry. */
    name: string
    /** Whether the entry is in effect. */
    status: SectionedResourceEntryStatus
    /** Who changed it last. */
    owner: string
    /** When it changed last. */
    modifiedAt: Date
  }

  /** One sibling page of the open tab. */
  export interface SectionedResourceSibling {
    /** Route segment of the page, also its model value. */
    id: string
    /** Page name, plural, in sentence case. */
    label: string
    /** Noun of one entry, used in Add. */
    noun: string
  }

  /** A named group of sibling pages. */
  export interface SectionedResourceSection {
    /** Group label in the menu and the folded Select. */
    label: string
    /** The pages of the group. */
    items: SectionedResourceSibling[]
  }

  export interface SectionedResourceProps {
    /** The sibling pages of the open tab, in groups; 7 or fewer switch with a ToggleGroup. Left out, the sample renders. */
    sections?: SectionedResourceSection[]
    /** Entries of the current sibling page. Left out, the sample renders. */
    entries?: SectionedResourceEntry[]
    /** A request for the entries is in flight. */
    loading?: boolean
    /** Value of the tab this block renders the page of. */
    currentTab?: string
    /** Route of the resource; tabs and sibling pages hang under it. */
    basePath?: string
    /** How the heading names the resource, e.g. the acme-default policy. */
    resourceLabel?: string
  }

  const props = withDefaults(defineProps<SectionedResourceProps>(), {
    sections: undefined,
    entries: undefined,
    loading: false,
    currentTab: 'private-access',
    basePath: '/policies/acme-default',
    resourceLabel: 'the acme-default policy'
  })

  const emit = defineEmits<{
    /** Refresh was pressed. */
    refresh: [event: MouseEvent]
    /** Add in the heading or the empty page was pressed. */
    add: [event: MouseEvent, sibling: SectionedResourceSibling]
  }>()

  const page = defineModel<string>('page', { default: '' })

  const tabs = [
    { value: 'web-security', label: 'Web security' },
    { value: 'network-security', label: 'Network security' },
    { value: 'private-access', label: 'Private access' },
    { value: 'data-protection', label: 'Data protection' },
    { value: 'objects', label: 'Objects' },
    { value: 'settings', label: 'Settings' },
    { value: 'versions', label: 'Versions' }
  ]

  const activeTab = ref(props.currentTab)
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')

  const sections = computed(() => props.sections ?? sampleSections)
  const siblings = computed(() => sections.value.flatMap((section) => section.items))
  const few = computed(() => siblings.value.length <= 7)

  const base = computed(() => `${props.basePath}/${props.currentTab}`)
  const hrefOf = (sibling: SectionedResourceSibling) => `${base.value}/${sibling.id}`

  const groups = computed<SidebarMenuGroupNode[]>(() =>
    sections.value.map((section) => ({
      label: section.label,
      items: section.items.map((sibling) => ({
        id: sibling.id,
        label: sibling.label,
        href: hrefOf(sibling)
      }))
    }))
  )

  const options = computed(() =>
    siblings.value.map((sibling) => ({ label: sibling.label, value: sibling.id }))
  )

  const pageId = computed(
    () => page.value || (props.sections ? (siblings.value[0]?.id ?? '') : samplePage)
  )
  const routePath = computed(() => `${base.value}/${pageId.value}`)

  const match = computed(() => siblings.value.find((sibling) => sibling.id === pageId.value))
  const current = computed(
    () => match.value ?? siblings.value[0] ?? { id: '', label: '', noun: '' }
  )

  const owners = ['Jane Doe', 'John Smith', 'Alex Morgan', 'Sam Lee', 'Priya Patel']

  const entries = computed<SectionedResourceEntry[]>(
    () => props.entries ?? (props.loading ? [] : sampleEntriesFor(current.value))
  )

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', options: [{ value: 'Active' }, { value: 'Inactive' }] },
    { key: 'owner', label: 'Author', options: owners.map((owner) => ({ value: owner })) }
  ]

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 104 },
    { accessorKey: 'modifiedAt', header: 'Last Modified', sortable: true, minWidth: 80 }
  ]

  const {
    tableProps,
    propertyFilterProps,
    status,
    clearFilters,
    loading: fetching
  } = useCollection({
    items: () => entries.value,
    columns,
    filtering: { fields: ['name', 'id', 'status', 'owner'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10 }
  })

  const go = (id: string) => {
    if (id === pageId.value) return
    page.value = id
    clearFilters()
  }

  const navigate = (event: MouseEvent, node: SidebarMenuNode) => {
    if (!node.href || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    const sibling = siblings.value.find((item) => hrefOf(item) === node.href)
    if (sibling) go(sibling.id)
  }

  const pick = (value: string | undefined) => {
    if (value) go(value)
  }

  const labelOf = (value: string | undefined) =>
    siblings.value.find((sibling) => sibling.id === value)?.label ?? ''
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <section
      v-if="activeTab === currentTab"
      class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1"
    >
      <div class="layout-column layout-boundary @container/tab flex min-w-0 flex-col">
        <div
          :data-nav="few ? 'toggle' : 'menu'"
          class="flex min-w-0 flex-col gap-(--layout-group-gap) data-[nav=menu]:@3xl/tab:flex-row data-[nav=menu]:@3xl/tab:items-start data-[nav=menu]:@3xl/tab:gap-(--layout-section-gap)"
        >
          <div
            v-if="few"
            class="flex min-w-0"
          >
            <ToggleGroup
              :model-value="pageId"
              :options="options"
              size="medium"
              :aria-label="tabLabel"
              @update:model-value="pick"
            />
          </div>

          <div
            v-if="!few"
            class="hidden w-(--container-3xs) shrink-0 @3xl/tab:block"
          >
            <SidebarMenuRoot
              :groups="groups"
              :active-id="match?.id ?? ''"
              :aria-label="tabLabel"
              @navigate="navigate"
            />
          </div>

          <div
            v-if="!few"
            class="w-full max-w-(--layout-measure-control) @3xl/tab:hidden"
          >
            <Field>
              <Field.Label>{{ tabLabel }}</Field.Label>
              <Select
                :model-value="pageId"
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
                    <Select.Item
                      v-for="sibling in section.items"
                      :key="sibling.id"
                      :value="sibling.id"
                    >
                      {{ sibling.label }}
                    </Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select>
            </Field>
          </div>

          <div class="flex min-w-0 flex-1 flex-col">
            <PageHeader
              :title="current.label"
              :description="`${current.label} of ${resourceLabel}.`"
              size="small"
            >
              <template #actions>
                <Button
                  label="Documentation"
                  icon="ai ai-book"
                  variant="outline"
                  size="medium"
                  href="https://example.com/docs/private-access"
                  target="_blank"
                />
                <Button
                  :label="`Add ${current.noun}`"
                  icon="ai ai-plus"
                  variant="outline"
                  size="medium"
                  @click="emit('add', $event, current)"
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
                  content="Refresh"
                  class="shrink-0"
                >
                  <IconButton
                    icon="ai ai-refresh"
                    variant="outline"
                    size="medium"
                    :loading="loading"
                    aria-label="Refresh"
                    @click="emit('refresh', $event)"
                  />
                </Tooltip>
              </header>
              <Card :padded="false">
                <template #default>
                  <DataTable
                    v-bind="tableProps"
                    :loading="loading || fetching"
                    sortable
                    :bordered="false"
                  >
                    <template #cell-name="{ row }">
                      <TableCellLink
                        :label="row.name"
                        :to="`${routePath}/${row.id}`"
                        :destination="current.label"
                      />
                    </template>
                    <template #cell-id="{ value }">
                      <TableCellId
                        :value="value"
                        :resource="current.noun.toLowerCase()"
                      />
                    </template>
                    <template #cell-status="{ value }">
                      <TableCellStatus
                        :label="value"
                        :severity="value === 'Active' ? 'success' : 'neutral'"
                      />
                    </template>
                    <template #cell-modifiedAt="{ row }">
                      <TableCellTime
                        :value="row.modifiedAt"
                        :author="row.owner"
                      />
                    </template>
                    <template #empty>
                      <EmptyState
                        key="empty-state-1"
                        v-if="status !== 'no-match'"
                        size="medium"
                        icon="ai ai-inbox"
                        :title="`No ${current.label.toLowerCase()} yet`"
                        :description="`Add the first ${current.noun.toLowerCase()} to this policy.`"
                      >
                        <template #actions>
                          <Button
                            :label="`Add ${current.noun}`"
                            icon="ai ai-plus"
                            variant="secondary"
                            size="small"
                            @click="emit('add', $event, current)"
                          />
                        </template>
                      </EmptyState>
                      <EmptyState
                        key="empty-state-2"
                        v-else
                        size="medium"
                        icon="ai ai-filter-off"
                        :title="`No matching ${current.label.toLowerCase()}`"
                        description="Nothing matches these filters."
                      >
                        <template #actions>
                          <Button
                            label="Clear filters"
                            variant="outline"
                            size="small"
                            @click="clearFilters"
                          />
                        </template>
                      </EmptyState>
                    </template>
                  </DataTable>
                </template>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </section>
    <section
      v-else
      class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1"
    >
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <div class="layout-section-start">
          <EmptyState
            size="medium"
            icon="ai ai-external-link"
            :title="tabLabel"
            :description="`${tabLabel} opens on its own page of ${resourceLabel}.`"
          >
            <template #actions>
              <Button
                :label="`Open ${tabLabel}`"
                variant="outline"
                size="small"
                :href="`${basePath}/${activeTab}`"
              />
            </template>
          </EmptyState>
        </div>
      </div>
    </section>
  </div>
</template>
```

## `sample.ts`

```ts
import type {
  SectionedResourceEntry,
  SectionedResourceSection,
  SectionedResourceSibling
} from './sectioned-resource.vue'

export const sampleSections: SectionedResourceSection[] = [
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

export const samplePage = 'access-rules'

export const sampleNetworkSections: SectionedResourceSection[] = [
  {
    label: 'Network security',
    items: [
      { id: 'network-lists', label: 'Network lists', noun: 'List' },
      { id: 'firewall-rules', label: 'Firewall rules', noun: 'Rule' },
      { id: 'rate-limits', label: 'Rate limits', noun: 'Limit' },
      { id: 'geo-blocks', label: 'Geo blocks', noun: 'Geo Block' },
      { id: 'port-rules', label: 'Port rules', noun: 'Port Rule' },
      { id: 'exceptions', label: 'Exceptions', noun: 'Exception' }
    ]
  }
]

const sampleOwners = ['Jane Doe', 'John Smith', 'Alex Morgan', 'Sam Lee', 'Priya Patel']

const referenceTime = Date.UTC(2026, 10, 10, 12)

const emptyPages = ['posture-checks', 'webhooks', 'exceptions']

export const sampleEntriesFor = (sibling: SectionedResourceSibling): SectionedResourceEntry[] =>
  Array.from({ length: emptyPages.includes(sibling.id) ? 0 : 6 }, (_, index) => {
    const n = index + 1
    const slug = sibling.noun.toLowerCase().replace(/\s+/g, '-')
    return {
      id: `${30410 + n * 157}`,
      name: `${slug}-${String(n).padStart(2, '0')}`,
      status: n === 5 ? 'Inactive' : 'Active',
      owner: sampleOwners[index % sampleOwners.length],
      modifiedAt: new Date(referenceTime - n * 9 * 86_400_000)
    }
  })
```

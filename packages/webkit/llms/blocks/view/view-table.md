# ViewTable (`view/view-table`)

> The canonical first-level list page: a medium page heading with the resource name and its one-line description, the outlined medium Documentation action and a primary medium Create Resource at the same height (on a phone they stack below the copy, each at full width), then the controls row and the resource table, laid out with the console page column and section rhythm. The whole list runs on `useCollection` in client mode: a `PropertyFilter` grows to fill the controls row and turns Name, Author, Status, Domain or free text into removable tokens (Match all or Match any, Clear filters, the match count), the sortable headers sort, the footer pages, and the filter, the sort and the page live in the URL so a filtered list can be shared. Beside the filter sit Refresh (the table’s loading state), Download CSV (every matching row) and `CollectionPreferences`, a dialog for the page size, the columns (shown, hidden and ordered; Name always shows), wrapped lines, striped rows and density, saved in localStorage. Any resource index takes this shape with its own columns and properties. The row menu's Delete opens a `ConfirmDialog` (the edit-delete-dialog pattern: a warning `Alert` and its typed confirmation phrase, the resource name). A filter that matches nothing shows a No matching resources `EmptyState` with Clear filters inside the table; when the account has no resources left, the page keeps its heading and the controls row, and the table, without its header and footer, gives way to a flush `Card` holding only a medium `EmptyState` (the resource glyph, then a small secondary Create Resource and a small outlined Documentation on one row), so the list survives its last row being deleted. Laid out with the theme’s `layout-boundary`, `layout-column` and `layout-section-start` utilities carrying the inset, the measure and the vertical rhythm. Its page-level parts are `PageHeader`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/view/view-table/view-table.vue` in `@aziontech/webkit`
- MCP: `get_block("view/view-table")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [CollectionPreferences](../../components/collection-preferences.md), [ConfirmDialog](../../components/confirm-dialog.md), [DataTable](../../components/data-table.md), `DataTablePagination`, `DropdownMenuGroup`, `DropdownMenuItem`, [EmptyState](../../components/empty-state.md), [IconButton](../../components/icon-button.md), [PageHeader](../../components/page-header.md), [PropertyFilter](../../components/property-filter.md), [StatusIndicator](../../components/status-indicator.md), `TableCellActions`, `TableCellId`, `TableCellLink`, `TableCellStatus`, `TableCellTime`, [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-collection`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-ui-states`

## Asked as

list; list page; resource list; module list; index page; resources index; list with filters; workloads list; listagem; lista de recursos; página de listagem; resource table; data table; table; sortable table; paginated table; table with copy id; listing table; tabela de listagem; tabela; tabela de recursos; tabela paginada; list controls; filter bar; search and filter; table toolbar; filter chips; column visibility; filtros; barra de filtros; busca e filtro; table view; index table; visualização em tabela; property filter; filter tokens; collection preferences; table preferences; saved preferences; filters in the url; shareable filters; use collection; filtro por propriedade; preferências da tabela; filtros na url; deployments list; deployment history; lista de deploys; histórico de deploys

The first-level index of one resource type, in rows. The user lands here from the sidebar to find a resource among many, narrow the list by its attributes, compare records column by column, and act on one: open it, deploy it, clone it, delete it, or create a new one. One `useCollection` call holds the filter, the sort, the page and the saved preferences, so the page is one heading over one band: the controls row and the table it narrows.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- The module the sidebar routes to lists resources of one type that has no dedicated block (applications, workloads, domains).
- Users compare many records by the same few attributes (status, domain, owner, last change) and need to sort, filter and page through them.
- The filtered list must survive a reload or a shared link, and each person's page size and columns must survive the next visit.
- The list must survive its last row being deleted: the page keeps its heading and controls and the table gives way to an empty state.

## When not to use

- Resources people recognise by a few fields or a picture rather than compare column by column: use `view/view-card`.
- A list nested inside one resource (a tab of a details page): use the table inside `detail/detail-resource` or `detail/detail-dns-zone`, with `Add <Module>` instead of `Create`.
- People on the account: use `account/account-users`. Teams and their permissions: use `account/account-team-permissions`. API tokens: use `account/account-personal-tokens`. The audit log: use `account/account-activity-history`.
- Files and folders of a storage resource: use `view/view-file-browser`.
- Events or logs explored over time with a chart and a document pane: use `view/view-events-explorer`.
- An account that has never created the resource: use `state/state-first-use`, which teaches the module before any list exists.
- Choosing one existing resource inside a form: use `create/create-resource-picker`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size carries the module name as the title and one sentence of purpose as the description. Its actions slot holds the outlined medium Documentation button, which opens the docs in a new tab, and the primary `Create <Object>` button at the same `size="medium"`, set apart by its colour, as `skills/webkit-lists` asks; everything on the controls row stays medium. On a phone the actions stack below the copy at full width. At first level this heading is the only place the module name appears; the breadcrumb starts at the second level.

### B. Property filter — `PropertyFilter` (required)

One `PropertyFilter` bound with `v-bind="propertyFilterProps"` grows to fill the controls row. Typing suggests a property, then an operator, then a value, and each choice becomes a removable token (`Status = Live`); text typed without a property is a free-text token over the `filtering.fields` (name, ID, domain, owner, status). Enumerable columns (Status, Author) are properties with `options`; free-text columns people name (Name, Domain) are plain properties. Two tokens or more offer Match all or Match any; the row ends on Clear filters and the match count. Every change rewinds to the first page. It replaces the search field, the filter popover, the chip row and any row of `Select`s.

### C. Listing actions — `Tooltip`, `IconButton` (optional)

Beside the filter, outlined medium `IconButton`s for Refresh (the button and the table show their loading state) and Download CSV (every matching row across all pages, not only the visible page; disabled when nothing matches), each named by a `Tooltip` and an `aria-label` with the same words. They act on the listing, never on one row.

### D. Table preferences — `CollectionPreferences` (required)

The last control of the row. `CollectionPreferences` bound with `v-bind="preferencesProps"` opens a dialog that edits a draft and applies it on Confirm: the page size (10, 25, 50), the columns (shown, hidden and reordered), wrapped lines, striped rows and density. The Name and actions columns are `hideable: false`, so the panel locks them. `preferences.storageKey` saves the choice in localStorage per list; `defaults.columns` hides the ID column until someone shows it.

### E. Resource table — `Card`, `DataTable`, `DataTablePagination` (required)

`Card :padded="false"` around `DataTable :bordered="false"` bound with `v-bind="tableProps"`, which hands it one page of rows, the ordered and visible columns, the sort, density, wrap and stripes, while `<DataTablePagination v-bind="paginationProps" manual />` in its `footer` slot is the pagination footer; the table renders and never filters or slices on its own. `sortable` makes Name, Status and Last modified sortable; `:loading` joins Refresh with the collection's own fetch. The Name column is `principal`; the actions column is `type: 'action'`. Status comes right after Name, so a phone shows the column people scan without scrolling. On a phone the table keeps its grid and scrolls sideways inside the card, as the console does; do not set `stackable` on a resource index, whose rows are compared across columns.

### F. Cell presets — `TableCellLink`, `TableCellId`, `TableCellStatus`, `TableCellTime` (optional)

Every cell is a preset from `@aziontech/webkit/table`, so the list reads like every other WebKit list. Name is `TableCellLink` with `to` and `destination="Resources"` (the tooltip says where it leads). ID is `TableCellId` (copy button named after the resource). The domain is `TableCellLink` with `href` (opens in a new tab, external mark, copy button) and the other domains as `more`: a `+N` `OverflowCount` whose popover counts them and searches once the list is long. Status is `TableCellStatus`. Last modified is `TableCellTime` on the `modifiedAt` timestamp: the author's avatar and a relative time that updates every minute, the absolute time in its tooltip.

### G. Row actions — `TableCellActions`, `DropdownMenuGroup`, `DropdownMenuItem` (required)

`TableCellActions` (an ellipsis button named after the row, e.g. "Actions for resource-01") opens a menu: the everyday actions (Deploy, View details, Clone) in one group, Delete alone in the last group. The root's `select` event hands the option value and the row to the page; Delete opens the confirmation below.

### H. Delete confirmation — `ConfirmDialog`, `Alert` (required)

The `edit/edit-delete-dialog` dialog, opened from the row menu without a trigger of its own: a medium `ConfirmDialog` titled `Delete resource`, a warning `Alert` (`Once confirmed, this action can't be reversed.`), one sentence of consequence, and the typed confirmation `ConfirmDialog` draws from `confirmation-phrase` (`Type <name> to confirm.`, exact and case-sensitive). The danger `Delete resource` enables only when the typed text matches the row's name; confirming removes the row. The typed text resets each time the dialog opens.

### I. No matching resources — `EmptyState`, `Button` (required)

When `status` is `no-match`, the table's `#empty` slot holds a medium `EmptyState` with the filter-slash glyph, "No matching resources", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`. The heading, the filter tokens and the table header stay, so the user can see and undo what hid the rows.

### J. Failed and empty listing — `Alert`, `Card`, `EmptyState`, `Button` (required)

When `status` is `error`, a danger `Alert` ("Couldn't load the resources. Check your connection and retry.") with a Retry action bound to the collection's `refresh` takes the table's place; the heading and the controls row stay.

When `status` is `empty`, the table and its header and footer give way to a flush `Card :padded="false"` holding only a medium `EmptyState`: the resource glyph, one sentence, then a small secondary `Create <Object>` with the heading's label and a small outlined Documentation on one row.

## Data

The block takes its records through props and emits every action; it fetches nothing. `TableViewResource` and `TableViewProps` are exported from `view-table.vue`, and `sample.ts` holds the sample rows the block renders when `resources` is left out (and never while `loading` or `error` is set). The filter row (the `PropertyFilter`, Refresh, Download CSV and preferences) is the private part `parts/collection-controls.vue`; the Deployments state is `parts/deployments-page.vue`, which renders `parts/deployments-table.vue` with the columns, properties and statuses of `lib/deployments.ts` and the sample runs `sampleDeployments` of `sample.ts`.

| Prop        | Type                  | What it does                                                                                                                                |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `resources` | `TableViewResource[]` | The rows; the filter, the sort and the pages run on them in the browser. Pass `[]` for an account with none.                                |
| `loading`   | `boolean`             | A request is in flight. With no rows it is the first load (the controls disable, the table shows skeleton rows); with rows it is a refresh. |
| `error`     | `string`              | Why the load failed, shown in the danger `Alert` with Retry that replaces the table.                                                        |

| Event        | Payload                        | When                                                                     |
| ------------ | ------------------------------ | ------------------------------------------------------------------------ |
| `create`     | `(event)`                      | Create Resource, in the heading or the empty card.                       |
| `refresh`    | `(event)`                      | Refresh.                                                                 |
| `retry`      | `(event)`                      | Retry in the error alert.                                                |
| `row-action` | `(event, { value, resource })` | Deploy, View details or Clone in the row menu.                           |
| `delete`     | `(event, resource)`            | The delete dialog was confirmed; the row is already gone from the table. |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import ViewTable from './view-table.vue'

  const { data, pending, error, refresh } = useResources()
  const loadError = "Couldn't load the resources. Check your connection and retry."
</script>

<template>
  <ViewTable
    :resources="data ?? []"
    :loading="pending"
    :error="error ? loadError : ''"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sampleResources` and its import (keep `sample.ts` only if you copied the Deployments state, which reads `sampleDeployments` from it). A list too large for the browser moves to `useCollection` server mode (`fetch`), which pages and filters on the server.

## Do

- Run the whole list on one `useCollection` call and bind its props with `v-bind`; let it own the filter, sort, page and preferences.
- Keep the controls row and the table in one band at the group gap; the heading sits one section step above.
- Set `url: true` so the tokens, the sort and the page live in the query string and a filtered list can be shared or reloaded.
- Give the list a `storageKey` of its own and lock the column that names the row.
- Keep `CollectionPreferences` the last control of the row and every control on it medium.
- Branch on `status`: `loading` shows the table's skeleton rows, `error` swaps the table for a danger `Alert` with Retry, `empty` swaps it for the empty listing, `no-match` fills the table's `#empty` slot with Clear filters.
- Give every icon-only control a `Tooltip` and an `aria-label` with the same words.
- Put Delete last in the row menu, in its own group, and always behind the confirmation dialog.

## Don't

- Don't add a search `Input`, a filter popover, a chip row or a row of `Select`s beside the `PropertyFilter`; one control narrows the list.
- Don't filter, sort or page rows in a `computed` outside the collection, or pass `:data`, a non-manual `DataTablePagination` or a `TableSearch` `v-model` by hand beside `tableProps`; page with `<DataTablePagination v-bind="paginationProps" manual />` in the `footer` slot.
- Don't build a columns popover of `Switch`es; column visibility and order belong to `CollectionPreferences`.
- Don't wrap a bordered table in a padded card, or let the page scroll sideways for a wide table.
- Don't add a second create button to the controls row.
- Don't show the state-first-use empty state when filters hide every row, or Clear filters when the account has none.
- Don't replace the heading and controls with a full-page empty state when the rows run out; only the table area changes.

## Copy

- **Title:** the module name as the sidebar shows it, e.g. "Resources". Description: one sentence with a period, e.g. "View and manage your resources."
- **Create action:** `Create <Object>` with the entity's capitalization, e.g. "Create Resource"; never "New" or a bare noun. The empty state repeats the same label.
- **Filter:** placeholder and `aria-label` name what is filtered, e.g. "Filter resources".
- **Properties:** the column header's words, e.g. "Name", "Author", "Status", "Domain".
- **Icon buttons:** a verb or noun in sentence case, e.g. "Refresh", "Download CSV", "Row actions". Preferences title: "Table preferences".
- **Column headers:** one or two words without punctuation, e.g. "Name", "Status", "ID", "Domains", "Last modified".
- **No match:** "No matching resources", then "No resource matches these filters.", and the action "Clear filters".
- **Empty:** title states the fact, e.g. "No resources yet"; description is one sentence with what to do, e.g. "Create a resource to start serving traffic on your domains."
- **Copy buttons:** name what they copy, e.g. "Copy resource ID", "Copy domain name".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The layout owns the one `main` landmark; the `PageHeader` title is the page's only `h1`.
- The `PropertyFilter` has an `aria-label` that matches its placeholder; each token's remove button names the token, and the match count is announced after each change.
- Every icon-only button has an `aria-label`; decorative icons carry `aria-hidden="true"`.
- Focus order follows reading order: heading actions, filter, Refresh, Download CSV, Preferences, table, pagination.
- The delete dialog traps focus, is named by its title and labels its input by the prompt.
- The preferences dialog traps focus, is named by its title and returns focus to its trigger when it closes.
- Sorting is announced by the table header; the row menu is reachable by keyboard and closes back to its trigger.
- `/` focuses the property filter from anywhere on the page, except while typing in a field.
- The rows are one tab stop: Arrow Up and Arrow Down move between rows, Home and End jump to the first and last, Enter opens the focused row as View details does (a click on the row itself does nothing; the name link opens it), and Delete or Backspace opens the delete dialog for it. After a delete, focus lands on the next row (the previous one when the last row went).
- Links that open a new tab add "(opens in a new tab)" in visually hidden text; the `+N` popover names its count and the copy buttons name what they copy.

## States

- Default: resources exist; the table shows them with the property filter, refresh, export, preferences, sorting and pagination wired, and filtering to nothing shows No matching resources with Clear filters.
- Empty: every resource was deleted on an account that is not new (`resources` is `[]`); `useCollection` reports `empty`, the heading and controls stay, and a flush card with Create Resource and Documentation replaces the table.
- Loading: the first load (`loading` with no `resources`); the heading stays, the filter, Download CSV and preferences are disabled, Refresh spins and the table shows its skeleton rows.
- Error: the resources could not load (`error` is set); the heading and the disabled controls stay, and a danger `Alert` with the message and Retry takes the table's place.
- Deployments: the deployments list with Version (Current tag), Status with a spinner while Building and the run's duration, the project link, the environment tag and the author with the time; a row click opens the deployment, the row menu holds View details, Redeploy (queues a new run, with a toast) and Promote to production (asks first), and Refresh, no match and empty behave as in Default and Empty.

## Related

- `view/view-card` — the same collection, rendered as selectable cards.
- `create/create-page` — where the Create action leads for a short form.
- `create/create-drawer` — create without leaving the list when the form is three fields or fewer.
- `detail/detail-resource` — where a row name leads; its Deployments tab renders the Deployments table without the page heading.
- `edit/edit-delete-dialog` — the dialog behind the row menu's Delete.
- `state/state-first-use` — the module before its first resource.
- `DataTable` and `useCollection` — the table this page wraps and the state behind it; see `skills/webkit-tables` and `skills/webkit-lists`.

## Variants

- `Default` — primary (the code below)
- `Empty` — Every resource deleted on an account that is not new: `useCollection` reports `empty` (not `no-match`), so the page keeps its heading and controls, and the table, without its header or footer, gives way to a flush Card that holds only a medium EmptyState led by the resource glyph, with a small secondary Create Resource and a small outlined Documentation button.
- `Loading` — The first load: the heading stays, the PropertyFilter, Download CSV and preferences are disabled, Refresh spins and the table shows its skeleton rows under the column header.
- `Error` — The resources could not load: the heading and the disabled controls row stay, and a danger Alert with Retry takes the table's place, as the primary does when `useCollection` reports `error`.
- `Deployments` — The deployments list, the same page with its own columns: a PropertyFilter over Version, Status, Project, Environment and Author with Refresh, Download CSV and preferences; Version with a Current `Tag`, a hidden ID, Status as a `StatusIndicator` (a spinner while Building) with the run's duration, the project as a `TableCellLink`, the environment as a rounded `Tag` and the author avatar with the relative time. Clicking a row opens the deployment; its menu holds View details, Redeploy and Promote to production (disabled unless the run is Ready and not already in Production): Redeploy queues a new run at the top and says so in a toast, and Promote to production asks in a `ConfirmDialog`, then makes the run the Current production deployment of its project. Refresh shows the table's loading state, a filter with no match shows No matching deployments, and an account with no deployments shows the flush empty card. The detail-resource Deployments tabs reuse this table without the page heading.

Each variant is the same screen in another state: `get_block("view/view-table", { variant })`, or the file under `blocks/view/view-table/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable, {
    type DropdownMenuItemValue,
    type TableColumn,
    type TableExposed
  } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref, watch } from 'vue'

  import CollectionControls from './parts/collection-controls.vue'
  import { sampleResources } from './sample'

  /** Whether a resource serves traffic. */
  export type TableViewResourceStatus = 'Live' | 'Inactive'

  /** One row of the table. */
  export interface TableViewResource {
    /** Stable key, shown in the hidden ID column. */
    id: string
    /** Display name, linked to the resource page. */
    name: string
    /** The first domain, shown in the row. */
    domain: string
    /** Every domain, the first one included; the rest open from the row's more link. */
    domains: string[]
    /** Whether the resource serves traffic. */
    status: TableViewResourceStatus
    /** Who changed it last. */
    owner: string
    /** When it changed last. */
    modifiedAt: Date
  }

  export interface TableViewProps {
    /** The resources to list; filtered, sorted and paged in the browser. Left out, the sample renders. */
    resources?: TableViewResource[]
    /** A request is in flight: with no rows it is the first load, with rows a refresh. */
    loading?: boolean
    /** Why the resources could not load; a danger alert with Retry replaces the table. */
    error?: string
  }

  const props = withDefaults(defineProps<TableViewProps>(), {
    resources: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    create: [event: MouseEvent]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'row-action': [
      event: Event,
      payload: { value: DropdownMenuItemValue; resource: TableViewResource }
    ]
    delete: [event: Event, resource: TableViewResource]
  }>()

  const source = computed<TableViewResource[]>(
    () => props.resources ?? (props.loading || props.error ? [] : sampleResources)
  )
  const items = ref<TableViewResource[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )

  const firstLoad = computed(() => props.loading && items.value.length === 0)
  const blocked = computed(() => firstLoad.value || props.error !== '')

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'name', label: 'Name' },
    {
      key: 'owner',
      label: 'Author',
      options: [...new Set(items.value.map((item) => item.owner))].map((value) => ({ value }))
    },
    { key: 'status', label: 'Status', options: [{ value: 'Live' }, { value: 'Inactive' }] },
    { key: 'domain', label: 'Domain' }
  ])

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 104 },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'domain', header: 'Domains', grow: 2 },
    { accessorKey: 'modifiedAt', header: 'Last modified', sortable: true, minWidth: 80 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const {
    paginationProps,
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = useCollection({
    items,
    columns,
    filtering: { fields: ['name', 'id', 'domain', 'owner', 'status'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'resources-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    },
    url: true
  })

  const resourcesTableEl = ref<TableExposed<TableViewResource> | null>(null)
  const exportCsv = () => resourcesTableEl.value?.exportCsv({ filename: 'resources.csv' })

  const pending = ref<TableViewResource | null>(null)
  const deleteOpen = ref(false)

  const askDelete = (row: TableViewResource) => {
    pending.value = row
    deleteOpen.value = true
  }

  const onRowOpen = (event: MouseEvent | KeyboardEvent, row: TableViewResource) => {
    if (event instanceof KeyboardEvent) emit('row-action', event, { value: 'view', resource: row })
  }

  const onRowAction = (event: Event, value: DropdownMenuItemValue, row: TableViewResource) => {
    if (value !== 'delete') {
      emit('row-action', event, { value, resource: row })
      return
    }
    askDelete(row)
  }

  const confirmDelete = (event: Event) => {
    const resource = pending.value
    if (!resource) return
    items.value = items.value.filter((item) => item.id !== resource.id)
    deleteOpen.value = false
    emit('delete', event, resource)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Resources"
        description="View and manage your resources."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/resources"
            target="_blank"
          />
          <Button
            label="Create Resource"
            icon="az az-plus"
            variant="primary"
            size="medium"
            @click="(event: MouseEvent) => emit('create', event)"
          />
        </template>
      </PageHeader>
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <CollectionControls
            :property-filter-props="propertyFilterProps"
            :preferences-props="preferencesProps"
            label="Filter resources"
            :loading="loading"
            :disabled="blocked"
            :download-disabled="blocked || !matchingItems.length"
            @refresh="(event: MouseEvent) => emit('refresh', event)"
            @download="exportCsv"
          />
          <section class="flex min-h-0 flex-col">
            <Alert
              v-if="error"
              severity="danger"
              :label="error"
              action-label="Retry"
              @action="(event: MouseEvent) => emit('retry', event)"
            />
            <Card
              key="card-1"
              v-else-if="status === 'empty' && !loading"
              :padded="false"
            >
              <template #default>
                <EmptyState
                  size="medium"
                  icon="az az-box"
                  title="No resources yet"
                  description="Create a resource to start serving traffic on your domains."
                >
                  <template #actions>
                    <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                      <Button
                        label="Create Resource"
                        icon="az az-plus"
                        variant="secondary"
                        size="small"
                        @click="(event: MouseEvent) => emit('create', event)"
                      />
                      <Button
                        label="Documentation"
                        icon="az az-book"
                        variant="outline"
                        size="small"
                        href="https://example.com/docs/resources"
                        target="_blank"
                      />
                    </div>
                  </template>
                </EmptyState>
              </template>
            </Card>
            <Card
              key="card-2"
              v-else
              :padded="false"
            >
              <template #default>
                <DataTable
                  ref="resourcesTableEl"
                  v-bind="tableProps"
                  :loading="loading || fetching"
                  sortable
                  :bordered="false"
                  @row-click="onRowOpen"
                  @row-remove="(_event, row) => askDelete(row)"
                >
                  <template #cell-name="{ row }">
                    <TableCellLink
                      :label="row.name"
                      :to="`/resources/${row.id}`"
                      destination="Resources"
                    />
                  </template>
                  <template #cell-id="{ value }">
                    <TableCellId
                      :value="value"
                      resource="resource"
                    />
                  </template>
                  <template #cell-domain="{ row }">
                    <TableCellLink
                      :label="row.domain"
                      :href="`https://${row.domain}`"
                      :more="
                        row.domains.slice(1).map((label) => ({ label, href: `https://${label}` }))
                      "
                      :noun="{ one: 'domain', other: 'domains' }"
                      copyable
                    />
                  </template>
                  <template #cell-status="{ value }">
                    <TableCellStatus
                      :label="value"
                      :severity="value === 'Live' ? 'success' : 'neutral'"
                    />
                  </template>
                  <template #cell-modifiedAt="{ row }">
                    <TableCellTime
                      :value="row.modifiedAt"
                      :author="row.owner"
                    />
                  </template>
                  <template #cell-actions="{ row }">
                    <TableCellActions
                      :name="row.name"
                      @select="(event, value) => onRowAction(event, value, row)"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="deploy"
                          label="Deploy"
                        >
                          <template #leading
                            ><i
                              class="az az-cloud-upload"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          value="view"
                          label="View details"
                        >
                          <template #leading
                            ><i
                              class="az az-eye"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          value="duplicate"
                          label="Clone"
                        >
                          <template #leading
                            ><i
                              class="az az-copy"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="delete"
                          label="Delete"
                        >
                          <template #leading
                            ><i
                              class="az az-trash"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </TableCellActions>
                  </template>
                  <template #empty>
                    <EmptyState
                      size="medium"
                      icon="az az-filter-off"
                      title="No matching resources"
                      description="No resource matches these filters."
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
                  <template #footer>
                    <DataTablePagination
                      v-bind="paginationProps"
                      manual
                    />
                  </template>
                </DataTable>
              </template>
            </Card>
          </section>
        </section>
      </section>
    </div>
    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete resource"
      size="medium"
      confirm-label="Delete resource"
      :confirmation-phrase="pending?.name ?? ''"
      @confirm="confirmDelete"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          The selected resource will be deleted, along with its domains and settings.
        </p>
      </div>
    </ConfirmDialog>
  </div>
</template>
```

## `sample.ts`

```ts
import type { Deployment } from './lib/deployments'
import type { TableViewResource, TableViewResourceStatus } from './view-table.vue'

const referenceTime = Date.UTC(2026, 10, 10, 12)
const daysAgo = (days: number) => new Date(referenceTime - days * 86_400_000)

const resource = (
  n: number,
  owner: string,
  days: number,
  status: TableViewResourceStatus = 'Live'
): TableViewResource => {
  const name = `resource-${String(n).padStart(2, '0')}`
  const domain = `${name}.example.com`
  return {
    id: `10${20482 + n * 173}`,
    name,
    domain,
    domains: [
      domain,
      ...Array.from({ length: n * 7 }, (_, j) => `${name}-alias-${j + 1}.example.com`)
    ],
    status,
    owner,
    modifiedAt: daysAgo(days)
  }
}

export const sampleResources: TableViewResource[] = [
  resource(1, 'Ethan Brooks', 0),
  resource(2, 'Jordan Kim', 18),
  resource(3, 'Taylor Reed', 36),
  resource(4, 'John Smith', 54),
  resource(5, 'Sam Lee', 72),
  resource(6, 'Priya Patel', 90),
  resource(7, 'Chris Taylor', 108),
  resource(8, 'Riley Carter', 126),
  resource(9, 'Ethan Brooks', 144, 'Inactive'),
  resource(10, 'Jordan Kim', 162)
]

const minutesAgo = (minutes: number) => new Date(referenceTime - minutes * 60_000)

export const deploymentsReferenceTime = referenceTime

export const sampleDeployments: Deployment[] = [
  {
    id: '1048213',
    version: 'AWPT11GA',
    current: false,
    status: 'Building',
    duration: '',
    project: 'acme-store',
    projectId: '1020655',
    environment: 'Preview',
    author: 'Jane Doe',
    deployedAt: minutesAgo(2)
  },
  {
    id: '1048207',
    version: 'AY3MQWWR',
    current: true,
    status: 'Ready',
    duration: '48s',
    project: 'acme-store',
    projectId: '1020655',
    environment: 'Production',
    author: 'John Smith',
    deployedAt: minutesAgo(95)
  },
  {
    id: '1048199',
    version: 'AZHGGSD8',
    current: false,
    status: 'Failed',
    duration: '1m 12s',
    project: 'docs-site',
    projectId: '1020711',
    environment: 'Staging',
    author: 'Alex Morgan',
    deployedAt: minutesAgo(260)
  },
  {
    id: '1048184',
    version: 'A1VA6NTP',
    current: true,
    status: 'Ready',
    duration: '36s',
    project: 'docs-site',
    projectId: '1020711',
    environment: 'Production',
    author: 'Sam Lee',
    deployedAt: minutesAgo(1_440)
  },
  {
    id: '1048172',
    version: 'A393WJA6',
    current: false,
    status: 'Queued',
    duration: '',
    project: 'site-assets',
    projectId: '1020734',
    environment: 'Preview',
    author: 'Priya Patel',
    deployedAt: minutesAgo(1_445)
  },
  {
    id: '1048160',
    version: 'ATNSEE8Y',
    current: false,
    status: 'Canceled',
    duration: '9s',
    project: 'site-assets',
    projectId: '1020734',
    environment: 'Staging',
    author: 'Jane Doe',
    deployedAt: minutesAgo(2_900)
  },
  {
    id: '1048151',
    version: 'AV1M49PF',
    current: true,
    status: 'Ready',
    duration: '52s',
    project: 'site-assets',
    projectId: '1020734',
    environment: 'Production',
    author: 'John Smith',
    deployedAt: minutesAgo(4_320)
  }
]
```

## `lib/deployments.ts`

```ts
import type { TableColumn } from '@aziontech/webkit/data-table'
import type { StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
import type { TagSeverity } from '@aziontech/webkit/tag'
import type { FilteringProperty } from '@aziontech/webkit/use-collection'

/** Where a deployment run stands. */
export type DeploymentStatus = 'Ready' | 'Building' | 'Failed' | 'Queued' | 'Canceled'

/** One run of the deployments list. */
export interface Deployment {
  /** The run id, the row key. */
  id: string
  /** The version the run deployed. */
  version: string
  /** The run serves its project's environment now. */
  current: boolean
  /** Where the run stands. */
  status: DeploymentStatus
  /** How long the run took, empty while it has not finished. */
  duration: string
  /** The project name. */
  project: string
  /** The project id, for its link. */
  projectId: string
  /** The environment the run deployed to. */
  environment: string
  /** Who started the run. */
  author: string
  /** When the run started. */
  deployedAt: Date
}

export const DEPLOYMENT_STATUS: Record<
  DeploymentStatus,
  { severity: StatusIndicatorSeverity; loading: boolean }
> = {
  Ready: { severity: 'success', loading: false },
  Building: { severity: 'info', loading: true },
  Failed: { severity: 'danger', loading: false },
  Queued: { severity: 'neutral', loading: false },
  Canceled: { severity: 'neutral', loading: false }
}

export const environmentSeverity = (environment: string): TagSeverity =>
  environment === 'Production' ? 'info' : 'neutral'

const authors = ['Jane Doe', 'John Smith', 'Alex Morgan', 'Sam Lee', 'Priya Patel']

export const deploymentProperties: FilteringProperty[] = [
  { key: 'version', label: 'Version' },
  {
    key: 'status',
    label: 'Status',
    options: (Object.keys(DEPLOYMENT_STATUS) as DeploymentStatus[]).map((value) => ({ value }))
  },
  { key: 'project', label: 'Project' },
  {
    key: 'environment',
    label: 'Environment',
    options: [{ value: 'Production' }, { value: 'Staging' }, { value: 'Preview' }]
  },
  { key: 'author', label: 'Author', options: authors.map((value) => ({ value })) }
]

export const deploymentColumns: TableColumn[] = [
  {
    accessorKey: 'version',
    header: 'Version',
    sortable: true,
    principal: true,
    hideable: false
  },
  { accessorKey: 'id', header: 'ID', minWidth: 80 },
  { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 128 },
  { accessorKey: 'project', header: 'Project', sortable: true, grow: 2 },
  { accessorKey: 'environment', header: 'Environment', sortable: true, minWidth: 104 },
  { accessorKey: 'deployedAt', header: 'Deployed', sortable: true, minWidth: 120 },
  { id: 'actions', type: 'action', hideable: false }
]
```

## `parts/collection-controls.vue`

```ts
<script setup lang="ts">
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import IconButton from '@aziontech/webkit/icon-button'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Tooltip from '@aziontech/webkit/tooltip'
  import type {
    CollectionPreferencesProps,
    CollectionPropertyFilterProps
  } from '@aziontech/webkit/use-collection'

  withDefaults(
    defineProps<{
      propertyFilterProps: CollectionPropertyFilterProps
      preferencesProps: CollectionPreferencesProps
      label: string
      loading?: boolean
      disabled?: boolean
      downloadDisabled?: boolean
    }>(),
    { loading: false, disabled: false, downloadDisabled: false }
  )

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    download: [event: MouseEvent]
  }>()
</script>

<template>
  <header class="flex items-start gap-(--layout-group-gap)">
    <div class="flex min-w-0 grow">
      <PropertyFilter
        v-bind="propertyFilterProps"
        :placeholder="label"
        :aria-label="label"
        :disabled="disabled"
      />
    </div>
    <div class="flex shrink-0 items-center gap-(--spacing-xs)">
      <Tooltip
        content="Refresh"
        class="shrink-0"
      >
        <IconButton
          icon="az az-refresh"
          variant="outline"
          size="medium"
          :loading="loading"
          aria-label="Refresh"
          @click="(event: MouseEvent) => emit('refresh', event)"
        />
      </Tooltip>
      <Tooltip
        content="Download CSV"
        class="shrink-0"
      >
        <IconButton
          icon="az az-download"
          variant="outline"
          size="medium"
          :disabled="downloadDisabled"
          aria-label="Download CSV"
          @click="(event: MouseEvent) => emit('download', event)"
        />
      </Tooltip>
      <CollectionPreferences
        v-bind="preferencesProps"
        title="Table preferences"
        :disabled="disabled"
      />
    </div>
  </header>
</template>
```

## `parts/deployments-page.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'
  import { toast } from '@aziontech/webkit/toast'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { ref } from 'vue'

  import { type Deployment, deploymentColumns, deploymentProperties } from '../lib/deployments'
  import { deploymentsReferenceTime, sampleDeployments } from '../sample'
  import CollectionControls from './collection-controls.vue'
  import DeploymentsTable from './deployments-table.vue'

  const items = ref<Deployment[]>(sampleDeployments)

  const {
    paginationProps,
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = useCollection({
    items,
    columns: deploymentColumns,
    filtering: { fields: ['version', 'id', 'project', 'environment', 'author', 'status'] },
    propertyFiltering: { properties: deploymentProperties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'deployments-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    },
    url: true
  })

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

  const deploymentsTableEl = ref<InstanceType<typeof DeploymentsTable> | null>(null)
  const exportCsv = () => deploymentsTableEl.value?.exportCsv('deployments.csv')

  const openDeployment = (row: Deployment) => {
    window.location.assign(`/deployments/${row.id}`)
  }

  let nextDeploymentId = Math.max(...sampleDeployments.map((row) => Number(row.id)))

  const redeploy = (row: Deployment) => {
    nextDeploymentId += 1
    items.value = [
      {
        ...row,
        id: String(nextDeploymentId),
        current: false,
        status: 'Queued',
        duration: '',
        deployedAt: new Date(deploymentsReferenceTime)
      },
      ...items.value
    ]
    toast.success(`${row.version} queued for redeploy.`, { description: row.project })
  }

  const pendingPromotion = ref<Deployment | null>(null)
  const promoteOpen = ref(false)

  const confirmPromote = () => {
    const promoted = pendingPromotion.value
    if (!promoted) return
    items.value = items.value.map((row) => {
      if (row.id === promoted.id) return { ...row, environment: 'Production', current: true }
      if (row.project === promoted.project && row.environment === 'Production')
        return { ...row, current: false }
      return row
    })
    promoteOpen.value = false
    toast.success(`${promoted.version} promoted to production.`, {
      description: promoted.project
    })
  }

  const onRowAction = (value: DropdownMenuItemValue, row: Deployment) => {
    if (value === 'view') openDeployment(row)
    if (value === 'redeploy') redeploy(row)
    if (value === 'promote') {
      pendingPromotion.value = row
      promoteOpen.value = true
    }
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Deployments"
        description="Every deployment of your projects, newest first."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/deployments"
            target="_blank"
          />
        </template>
      </PageHeader>
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <CollectionControls
            :property-filter-props="propertyFilterProps"
            :preferences-props="preferencesProps"
            label="Filter deployments"
            :loading="loading"
            :download-disabled="!matchingItems.length"
            @refresh="refresh"
            @download="exportCsv"
          />
          <section class="flex min-h-0 flex-col">
            <Card
              key="card-1"
              v-if="status === 'empty'"
              :padded="false"
            >
              <template #default>
                <EmptyState
                  size="medium"
                  icon="az az-cloud-upload"
                  title="No deployments yet"
                  description="Deploy a project and every run shows up here, with its version, status and environment."
                >
                  <template #actions>
                    <Button
                      label="Documentation"
                      icon="az az-book"
                      variant="outline"
                      size="small"
                      href="https://example.com/docs/deployments"
                      target="_blank"
                    />
                  </template>
                </EmptyState>
              </template>
            </Card>
            <Card
              key="card-2"
              v-else
              :padded="false"
            >
              <template #default>
                <DeploymentsTable
                  ref="deploymentsTableEl"
                  :table-props="tableProps"
                  :pagination-props="paginationProps"
                  :loading="loading || fetching"
                  @open="(_event, row) => openDeployment(row)"
                  @action="(_event, { value, row }) => onRowAction(value, row)"
                  @clear-filters="clearFilters"
                />
              </template>
            </Card>
          </section>
        </section>
      </section>
    </div>
    <ConfirmDialog
      v-model:open="promoteOpen"
      title="Promote to production"
      variant="primary"
      size="medium"
      confirm-label="Promote"
      @confirm="confirmPromote"
    >
      <p class="m-0 text-body-sm text-(--text-muted)">
        {{ pendingPromotion?.version }} becomes the current production deployment of
        {{ pendingPromotion?.project }}, in place of the one serving traffic now.
      </p>
    </ConfirmDialog>
  </div>
</template>
```

## `parts/deployments-table.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DataTable, {
    type DropdownMenuItemValue,
    type TableColumn,
    type TableExposed
  } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import EmptyState from '@aziontech/webkit/empty-state'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag from '@aziontech/webkit/tag'
  import type {
    CollectionPaginationProps,
    CollectionTableProps
  } from '@aziontech/webkit/use-collection'
  import { ref } from 'vue'

  import { type Deployment, DEPLOYMENT_STATUS, environmentSeverity } from '../lib/deployments'

  defineProps<{
    tableProps: CollectionTableProps<Deployment, TableColumn>
    paginationProps: CollectionPaginationProps
    loading: boolean
  }>()

  const emit = defineEmits<{
    open: [event: MouseEvent | KeyboardEvent, row: Deployment]
    action: [event: Event, payload: { value: DropdownMenuItemValue; row: Deployment }]
    'clear-filters': [event: MouseEvent]
  }>()

  const tableEl = ref<TableExposed<Deployment> | null>(null)

  defineExpose({
    exportCsv: (filename: string) => tableEl.value?.exportCsv({ filename })
  })
</script>

<template>
  <DataTable
    ref="tableEl"
    v-bind="tableProps"
    :loading="loading"
    sortable
    :bordered="false"
    @row-click="(event, row) => emit('open', event, row)"
  >
    <template #cell-version="{ row }">
      <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
        <span class="truncate tabular-nums text-body-sm text-(--text-default)">
          {{ row.version }}
        </span>
        <Tag
          v-if="row.current"
          label="Current"
          severity="info"
          size="small"
          icon="az az-circle-arrow-up"
          class="shrink-0"
        />
      </span>
    </template>
    <template #cell-id="{ value }">
      <TableCellId
        :value="value"
        resource="deployment"
      />
    </template>
    <template #cell-status="{ row }">
      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
        <StatusIndicator
          :severity="DEPLOYMENT_STATUS[row.status].severity"
          :loading="DEPLOYMENT_STATUS[row.status].loading"
          :label="row.status"
        />
        <span
          v-if="row.duration"
          class="shrink-0 tabular-nums text-body-xs text-(--text-muted)"
        >
          {{ row.duration }}
        </span>
      </span>
    </template>
    <template #cell-project="{ row }">
      <TableCellLink
        :label="row.project"
        :to="`/projects/${row.projectId}`"
        destination="Projects"
        icon="az az-box"
      />
    </template>
    <template #cell-environment="{ value }">
      <Tag
        :label="value"
        :severity="environmentSeverity(value)"
        size="medium"
        rounded
      />
    </template>
    <template #cell-deployedAt="{ row }">
      <TableCellTime
        :value="row.deployedAt"
        :author="row.author"
      />
    </template>
    <template #cell-actions="{ row }">
      <TableCellActions
        :name="row.version"
        @select="(event, value) => emit('action', event, { value, row })"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            value="view"
            label="View details"
          >
            <template #leading
              ><i
                class="az az-eye"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
          <DropdownMenuItem
            value="redeploy"
            label="Redeploy"
          >
            <template #leading
              ><i
                class="az az-refresh"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
          <DropdownMenuItem
            value="promote"
            label="Promote to production"
            :disabled="row.environment === 'Production' || row.status !== 'Ready'"
          >
            <template #leading
              ><i
                class="az az-circle-arrow-up"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </TableCellActions>
    </template>
    <template #empty>
      <EmptyState
        size="medium"
        icon="az az-filter-off"
        title="No matching deployments"
        description="No deployment matches these filters."
      >
        <template #actions>
          <Button
            label="Clear filters"
            variant="outline"
            size="small"
            @click="(event: MouseEvent) => emit('clear-filters', event)"
          />
        </template>
      </EmptyState>
    </template>
    <template #footer>
      <DataTablePagination
        v-bind="paginationProps"
        manual
      />
    </template>
  </DataTable>
</template>
```

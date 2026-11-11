# TableView (`platform/view/table-view`)

> The canonical first-level list page: a medium page heading with the resource name and its one-line description, the outlined medium Documentation action and a primary large Create Resource, the page's only large control (on a phone they stack below the copy, each at full width), then the controls row and the resource table, laid out with the console page column and section rhythm. The whole list runs on `useCollection` in client mode: a `PropertyFilter` grows to fill the controls row and turns Name, Author, Status, Domain or free text into removable tokens (Match all or Match any, Clear filters, the match count), the sortable headers sort, the footer pages, and the filter, the sort and the page live in the URL so a filtered list can be shared. Beside the filter sit Refresh (the table’s loading state), Download CSV (every matching row) and `CollectionPreferences`, a dialog for the page size, the columns (shown, hidden and ordered; Name always shows), wrapped lines, striped rows and density, saved in localStorage. Any resource index takes this shape with its own columns and properties. The row menu's Delete opens a `ConfirmDialog` (the delete-with-confirmation pattern: a warning `Alert` and an `Input` that must match the resource name). A filter that matches nothing shows a No matching resources `EmptyState` with Clear filters inside the table; when the account has no resources left, the page keeps its heading and the controls row, and the table, without its header and footer, gives way to a flush `Card` holding only a medium `EmptyState` (the resource glyph, then a small secondary Create Resource and a small outlined Documentation on one row), so the list survives its last row being deleted. Laid out with the theme’s `layout-boundary`, `layout-column` and `layout-section-start` utilities carrying the inset, the measure and the vertical rhythm. Its page-level parts are `PageHeader`.

- Surface: product
- Source: `blocks/platform/view/table-view/table-view.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/view/table-view")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [CollectionPreferences](../../../components/collection-preferences.md), [ConfirmDialog](../../../components/confirm-dialog.md), [CopyButton](../../../components/copy-button.md), `DropdownMenuGroup`, `DropdownMenuOption`, `DropdownMenuRoot`, `DropdownMenuTrigger`, [EmptyState](../../../components/empty-state.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [PageHeader](../../../components/page-header.md), `PopoverContent`, `PopoverRoot`, `PopoverTrigger`, [PropertyFilter](../../../components/property-filter.md), [Skeleton](../../../components/skeleton.md), `TableRoot`, [Tag](../../../components/tag.md), [Tooltip](../../../components/tooltip.md), `use-collection`, `utils/csv`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-ui-states`

## Asked as

list; list page; resource list; module list; index page; resources index; list with filters; workloads list; listagem; lista de recursos; página de listagem; resource table; data table; table; sortable table; paginated table; table with copy id; listing table; tabela de listagem; tabela; tabela de recursos; tabela paginada; list controls; filter bar; search and filter; table toolbar; filter chips; column visibility; filtros; barra de filtros; busca e filtro; users; users management; users list; team members; members list; invite user; invite teammate; manage users; remove user; usuários; gestão de usuários; lista de usuários; convidar usuário; membros; teams and permissions; teams; permissions; roles and permissions; access control; team list; create team; user groups; times e permissões; permissões; controle de acesso; equipes; credentials; api tokens; personal tokens; api keys; access tokens; token list; revoke token; credenciais; tokens de api; chaves de api; environments; environments list; production stage preview; deployment environments; deployment policies; create environment; ambientes; lista de ambientes; ambientes de deploy; activity history; audit log; activity log; audit trail; account activity; event history; user actions log; histórico de atividades; log de auditoria; registro de atividades; table view; index table; visualização em tabela; property filter; filter tokens; collection preferences; table preferences; saved preferences; filters in the url; shareable filters; use collection; filtro por propriedade; preferências da tabela; filtros na url

The first-level index of one resource type, in rows. The user lands here from the sidebar to find a resource among many, narrow the list by its attributes, compare records column by column, and act on one: open it, deploy it, clone it, delete it, or create a new one. One `useCollection` call holds the filter, the sort, the page and the saved preferences, so the page is one heading over one band: the controls row and the table it narrows.

## When to use

- The module the sidebar routes to lists resources of one type (applications, workloads, users, tokens, environments, activity history).
- Users compare many records by the same few attributes (status, domain, owner, last change) and need to sort, filter and page through them.
- The filtered list must survive a reload or a shared link, and each person's page size and columns must survive the next visit.
- The list must survive its last row being deleted: the page keeps its heading and controls and the table gives way to an empty state.

## When not to use

- Resources people recognise by a few fields or a picture rather than compare column by column: use `platform/view/card-view`.
- A list nested inside one resource (a tab of a details page): use the table inside `platform/detail/details-page` or `platform/detail/record-table`, with `Add <Module>` instead of `Create`.
- Files and folders of a storage resource: use `platform/view/file-browser`.
- Events or logs explored over time with a chart and a document pane: use `platform/view/split-view`.
- An account that has never created the resource: use `platform/states/first-use`, which teaches the module before any list exists.
- Choosing one existing resource inside a form: use `platform/create/resource-picker`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size carries the module name as the title and one sentence of purpose as the description. Its actions slot holds the outlined medium Documentation button, which opens the docs in a new tab, and the primary `Create <Object>` button at `size="large"`, the page's only large control, as `skills/webkit-lists` asks; everything on the controls row stays medium. On a phone the actions stack below the copy at full width. At first level this heading is the only place the module name appears; the breadcrumb starts at the second level.

### B. Property filter — `PropertyFilter` (required)

One `PropertyFilter` bound with `v-bind="propertyFilterProps"` grows to fill the controls row. Typing suggests a property, then an operator, then a value, and each choice becomes a removable token (`Status = Live`); text typed without a property is a free-text token over the `filtering.fields` (name, ID, domain, owner, status). Enumerable columns (Status, Author) are properties with `options`; free-text columns people name (Name, Domain) are plain properties. Two tokens or more offer Match all or Match any; the row ends on Clear filters and the match count. Every change rewinds to the first page. It replaces the search field, the filter popover, the chip row and any row of `Select`s.

### C. Listing actions — `Tooltip`, `IconButton` (optional)

Beside the filter, outlined medium `IconButton`s for Refresh (the button and the table show their loading state) and Download CSV (every matching row across all pages, not only the visible page; disabled when nothing matches), each named by a `Tooltip` and an `aria-label` with the same words. They act on the listing, never on one row.

### D. Table preferences — `CollectionPreferences` (required)

The last control of the row. `CollectionPreferences` bound with `v-bind="preferencesProps"` opens a dialog that edits a draft and applies it on Confirm: the page size (10, 25, 50), the columns (shown, hidden and reordered), wrapped lines, striped rows and density. The Name and actions columns are `hideable: false`, so the panel locks them. `preferences.storageKey` saves the choice in localStorage per list; `defaults.columns` hides the ID column until someone shows it.

### E. Resource table — `Card`, `TableRoot` (required)

`Card :padded="false"` around `TableRoot :bordered="false"` bound with `v-bind="tableProps"`, which hands it one page of rows, the ordered and visible columns, the sort, the pagination footer, density, wrap and stripes; the table renders and never filters or slices on its own. `enable-sorting` makes Name, Status and Last Modified sortable; `:loading` joins Refresh with the collection's own fetch. The Name column is `principal`; the actions column is `kind: 'action'`. Below the container width the rows stack into label and value cards instead of scrolling sideways.

### F. Cell recipes — `CopyButton`, `Tag`, `Tooltip`, `Avatar`, `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `Input`, `Skeleton`, `Button` (optional)

The name cell pairs the resource glyph with a truncated, underline-on-hover name. ID and domain cells end with a `CopyButton`. The domain is a link that opens in a new tab, named by a `Tooltip`; a resource with more domains adds a `+N` `Tag` that opens a popover with its own count, a search `Input` past ten domains, a `Skeleton` per row while more load and a Load more `Button`. Status is a `Tag`. Last Modified pairs the author `Avatar`, named in a `Tooltip`, with the relative time in one column.

### G. Row actions — `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuGroup`, `DropdownMenuOption`, `IconButton`, `Tooltip` (required)

An ellipsis `IconButton` named Row actions opens a menu placed `bottom-end`: the everyday actions (Deploy, View details, Clone) in one group, Delete alone in the last group. The root's `select` event hands the option value and the row to the page; Delete opens the confirmation below.

### H. Delete confirmation — `ConfirmDialog`, `Alert`, `Input` (required)

The `platform/delete/delete-with-confirmation` dialog, opened from the row menu without a trigger of its own: a medium `ConfirmDialog` titled `Delete resource`, a warning `Alert` (`Once confirmed, this action can't be reversed.`), one sentence of consequence, and an `Input` labelled by `Type <name> to confirm.` The danger `Delete resource` enables only when the typed text matches the row's name; confirming removes the row. The typed text resets each time the dialog opens.

### I. No matching resources — `EmptyState`, `Button` (required)

When `status` is `no-match`, the table's `#empty` slot holds a medium `EmptyState` with the filter-slash glyph, "No matching resources", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`. The heading, the filter tokens and the table header stay, so the user can see and undo what hid the rows.

### J. Empty listing — `Card`, `EmptyState`, `Button` (required)

When `status` is `empty`, the table and its header and footer give way to a flush `Card :padded="false"` holding only a medium `EmptyState`: the resource glyph, one sentence, then a small secondary `Create <Object>` with the heading's label and a small outlined Documentation on one row.

## Do

- Run the whole list on one `useCollection` call and bind its props with `v-bind`; let it own the filter, sort, page and preferences.
- Keep the controls row and the table in one band at the group gap; the heading sits one section step above.
- Set `url: true` so the tokens, the sort and the page live in the query string and a filtered list can be shared or reloaded.
- Give the list a `storageKey` of its own and lock the column that names the row.
- Keep `CollectionPreferences` the last control of the row and every control on it medium.
- Branch on `status`: `empty` swaps the table for the empty listing, `no-match` fills the table's `#empty` slot with Clear filters.
- Give every icon-only control a `Tooltip` and an `aria-label` with the same words.
- Put Delete last in the row menu, in its own group, and always behind the confirmation dialog.

## Don't

- Don't add a search `Input`, a filter popover, a chip row or a row of `Select`s beside the `PropertyFilter`; one control narrows the list.
- Don't filter, sort or page rows in a `computed` outside the collection, or pass `:data`, `paginated` and `v-model:globalFilter` by hand beside `tableProps`.
- Don't build a columns popover of `Switch`es; column visibility and order belong to `CollectionPreferences`.
- Don't wrap a bordered table in a padded card, or let the page scroll sideways for a wide table.
- Don't add a second create button to the controls row.
- Don't show the first-use empty state when filters hide every row, or Clear filters when the account has none.
- Don't replace the heading and controls with a full-page empty state when the rows run out; only the table area changes.

## Copy

- **Title:** the module name as the sidebar shows it, e.g. "Resources". Description: one sentence with a period, e.g. "View and manage your resources."
- **Create action:** `Create <Object>` with the entity's capitalization, e.g. "Create Resource"; never "New" or a bare noun. The empty state repeats the same label.
- **Filter:** placeholder and `aria-label` name what is filtered, e.g. "Filter resources".
- **Properties:** the column header's words, e.g. "Name", "Author", "Status", "Domain".
- **Icon buttons:** a verb or noun in sentence case, e.g. "Refresh", "Download CSV", "Row actions". Preferences title: "Table preferences".
- **Column headers:** one or two words without punctuation, e.g. "Name", "ID", "Domains", "Status", "Last Modified".
- **No match:** "No matching resources", then "No resource matches these filters.", and the action "Clear filters".
- **Empty:** title states the fact, e.g. "No resources yet"; description is one sentence with what to do, e.g. "Create a resource to start serving traffic on your domains."
- **Copy buttons:** name what they copy, e.g. "Copy resource ID", "Copy domain name".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- One `main` landmark; the `PageHeader` title is the page's only `h1`.
- The `PropertyFilter` has an `aria-label` that matches its placeholder; each token's remove button names the token, and the match count is announced after each change.
- Every icon-only button has an `aria-label`; decorative icons carry `aria-hidden="true"`.
- Focus order follows reading order: heading actions, filter, Refresh, Download CSV, Preferences, table, pagination.
- The delete dialog traps focus, is named by its title and labels its input by the prompt.
- The preferences dialog traps focus, is named by its title and returns focus to its trigger when it closes.
- Sorting is announced by the table header; the row menu is reachable by keyboard and closes back to its trigger.
- Links that open a new tab add "(opens in a new tab)" in visually hidden text; the domain popover announces its count and its loading in a `status` region.

## States

- Default: resources exist; the table shows them with the property filter, refresh, export, preferences, sorting and pagination wired, and filtering to nothing shows No matching resources with Clear filters.
- Empty: every resource was deleted on an account that is not new; `useCollection` reports `empty`, the heading and controls stay, and a flush card with Create Resource and Documentation replaces the table.

## Related

- `platform/view/card-view` — the same collection, rendered as selectable cards.
- `platform/create/single-page-create` — where the Create action leads for a short form.
- `platform/create/create-in-drawer` — create without leaving the list when the form is three fields or fewer.
- `platform/detail/details-page` — where a row name leads.
- `platform/delete/delete-with-confirmation` — the dialog behind the row menu's Delete.
- `platform/states/first-use` — the module before its first resource.
- `TableRoot` and `useCollection` — the table this page wraps and the state behind it; see `skills/webkit-tables` and `skills/webkit-lists`.

## Variants

- `Default` — primary (the code below)
- `Empty` — Every resource deleted on an account that is not new: `useCollection` reports `empty` (not `no-match`), so the page keeps its heading and controls, and the table, without its header or footer, gives way to a flush Card that holds only a medium EmptyState led by the resource glyph, with a small secondary Create Resource and a small outlined Documentation button.

Each variant is the same screen in another state: `get_pattern("platform/view/table-view", { variant })`, or the file under `blocks/platform/view/table-view/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Skeleton from '@aziontech/webkit/skeleton'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref, useId } from 'vue'

  const avatars = {
    'Robson Junior': 'https://ca.slack-edge.com/TDVATDGUU-UDW2MSZAP-81cad567c9a1-512',
    'Isaque Böck': 'https://ca.slack-edge.com/TDVATDGUU-U09745PDX6D-971b0e576ab1-512',
    'Rafael Garbinatto': 'https://ca.slack-edge.com/TDVATDGUU-ULU0NHDSM-5c3d561a39e1-512',
    'Herbert Júlio': 'https://ca.slack-edge.com/TDVATDGUU-U036GK4J347-399781903ba3-512',
    'Rafael Umman': 'https://ca.slack-edge.com/TDVATDGUU-UDUPJUL1E-d70389018587-512',
    'Marcus Grando': 'https://ca.slack-edge.com/TDVATDGUU-UDVG1K05Q-g75bb0e36e1c-512',
    'Bruno Germano': 'https://ca.slack-edge.com/TDVATDGUU-U08HZ0M4P1D-16b5a8e0519a-512',
    'Gab Lisboa': 'https://ca.slack-edge.com/TDVATDGUU-U0279S2BC12-d09077d857f7-512'
  }

  const properties = [
    { key: 'name', label: 'Name' },
    {
      key: 'owner',
      label: 'Author',
      options: Object.keys(avatars).map((owner) => ({ value: owner }))
    },
    { key: 'status', label: 'Status', options: [{ value: 'Live' }, { value: 'Inactive' }] },
    { key: 'domain', label: 'Domain' }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'domain', header: 'Domains', grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const referenceTime = Date.UTC(2026, 10, 10, 12)
  const daysAgo = (days) => new Date(referenceTime - days * 86_400_000)

  const resource = (n, owner, days, lastModified, status = 'Live') => {
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
      domainCount: n * 7,
      status,
      owner,
      modifiedAt: daysAgo(days),
      lastModified
    }
  }

  const rows = [
    resource(1, 'Robson Junior', 0, 'just now'),
    resource(2, 'Isaque Böck', 18, '3 weeks ago'),
    resource(3, 'Rafael Garbinatto', 36, '1 month ago'),
    resource(4, 'Herbert Júlio', 54, '2 months ago'),
    resource(5, 'Rafael Umman', 72, '2 months ago'),
    resource(6, 'Marcus Grando', 90, '3 months ago'),
    resource(7, 'Bruno Germano', 108, '4 months ago'),
    resource(8, 'Gab Lisboa', 126, '4 months ago'),
    resource(9, 'Robson Junior', 144, '5 months ago', 'Inactive'),
    resource(10, 'Isaque Böck', 162, '5 months ago')
  ]

  const items = ref(rows)

  const {
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

  const loading = ref(false)
  let refreshTimer
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const resourcesTable = ref(null)
  const exportCsv = () => resourcesTable.value?.exportCsv({ filename: 'resources.csv' })

  const DOMAIN_PAGE = 10
  const WIRE_WIDTHS = ['92%', '74%', '86%', '68%', '90%', '78%', '84%', '70%', '88%', '76%']
  const domainQuery = ref({})
  const domainShown = ref({})
  const domainLoading = ref({})
  const matchingDomains = (row) => {
    const needle = (domainQuery.value[row.id] ?? '').trim().toLowerCase()
    return needle
      ? row.domains.filter((domain) => domain.toLowerCase().includes(needle))
      : row.domains
  }
  const visibleDomains = (row) =>
    matchingDomains(row).slice(0, domainShown.value[row.id] ?? DOMAIN_PAGE)
  const remainingDomains = (row) => matchingDomains(row).length - visibleDomains(row).length
  const nextDomains = (row) => Math.min(DOMAIN_PAGE, remainingDomains(row))
  const domainSummary = (row) => {
    const total = row.domains.length
    const shown = visibleDomains(row).length
    const matched = matchingDomains(row).length
    const searching = Boolean(domainQuery.value[row.id])
    if (remainingDomains(row)) {
      return searching ? `${shown} of ${matched} matching domains` : `${shown} of ${total} domains`
    }
    return searching ? `${matched} of ${total} domains` : `${total} domains`
  }
  const searchDomains = (row, value) => {
    domainQuery.value = { ...domainQuery.value, [row.id]: value }
    domainShown.value = { ...domainShown.value, [row.id]: DOMAIN_PAGE }
    domainLoading.value = { ...domainLoading.value, [row.id]: false }
  }
  const openDomains = (row, open) => {
    if (open) searchDomains(row, '')
  }
  const loadMoreDomains = (row) => {
    if (domainLoading.value[row.id] || !remainingDomains(row)) return
    domainLoading.value = { ...domainLoading.value, [row.id]: true }
    setTimeout(() => {
      domainShown.value = {
        ...domainShown.value,
        [row.id]: (domainShown.value[row.id] ?? DOMAIN_PAGE) + DOMAIN_PAGE
      }
      domainLoading.value = { ...domainLoading.value, [row.id]: false }
    }, 420)
  }

  const pending = ref(null)
  const deleteOpen = ref(false)
  const confirmation = ref('')
  const confirmLabelId = useId()
  const canDelete = computed(
    () => Boolean(pending.value) && confirmation.value.trim() === pending.value.name
  )

  const onRowAction = (value, row) => {
    if (value !== 'delete') return
    pending.value = row
    confirmation.value = ''
    deleteOpen.value = true
  }

  const confirmDelete = () => {
    if (!canDelete.value) return
    items.value = items.value.filter((item) => item.id !== pending.value.id)
    deleteOpen.value = false
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Resources"
        description="View and manage your resources."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/resources"
            target="_blank"
          />
          <Button
            label="Create Resource"
            icon="pi pi-plus"
            kind="primary"
            size="large"
          />
        </template>
      </PageHeader>
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header class="flex items-start gap-(--layout-group-gap)">
            <div class="flex min-w-0 grow">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter resources"
                aria-label="Filter resources"
              />
            </div>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
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
              <Tooltip
                text="Download CSV"
                class="shrink-0"
              >
                <IconButton
                  icon="pi pi-download"
                  kind="outlined"
                  size="medium"
                  :disabled="!matchingItems.length"
                  aria-label="Download CSV"
                  @click="exportCsv"
                />
              </Tooltip>
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Table preferences"
              />
            </div>
          </header>
          <section class="flex min-h-0 flex-col">
            <Card
              v-if="status === 'empty'"
              :padded="false"
            >
              <template #content>
                <EmptyState
                  size="medium"
                  icon="pi pi-box"
                  title="No resources yet"
                  description="Create a resource to start serving traffic on your domains."
                >
                  <template #actions>
                    <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                      <Button
                        label="Create Resource"
                        icon="pi pi-plus"
                        kind="secondary"
                        size="small"
                      />
                      <Button
                        label="Documentation"
                        icon="pi pi-book"
                        kind="outlined"
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
              v-else
              :padded="false"
            >
              <template #content>
                <TableRoot
                  ref="resourcesTable"
                  v-bind="tableProps"
                  :loading="loading || fetching"
                  enable-sorting
                  :bordered="false"
                >
                  <template #cell-name="{ value }">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="pi pi-box shrink-0 text-body-lg text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    </div>
                  </template>
                  <template #cell-id="{ value }">
                    <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                      <span class="min-w-0 flex-1 truncate tabular-nums">{{ value }}</span>
                      <CopyButton
                        v-if="value"
                        kind="outlined"
                        :value="value"
                        aria-label="Copy resource ID"
                      />
                    </div>
                  </template>
                  <template #cell-domain="{ row, value }">
                    <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="pi pi-globe shrink-0 text-body-lg text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <div class="min-w-0">
                        <Tooltip
                          :text="'Open ' + value + ' in a new tab'"
                          class="w-full"
                        >
                          <a
                            :href="'https://' + value"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-link
                            class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                            @click.stop
                          >
                            <span
                              dir="ltr"
                              class="truncate underline-offset-2 group-hover/link:underline"
                              >{{ value }}</span
                            >
                            <span class="sr-only">(opens in a new tab)</span>
                            <i
                              class="pi pi-external-link shrink-0 text-body-xs leading-none"
                              aria-hidden="true"
                            />
                          </a>
                        </Tooltip>
                      </div>
                      <PopoverRoot
                        v-if="row.domainCount"
                        placement="bottom-start"
                        width="small"
                        @update:open="(open) => openDomains(row, open)"
                      >
                        <PopoverTrigger @click.stop>
                          <div class="shrink-0 cursor-pointer">
                            <Tag
                              :label="'+' + row.domainCount"
                              severity="secondary"
                              size="small"
                            />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent @click.stop>
                          <div
                            class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
                          >
                            <p class="text-label-sm text-(--text-muted)">
                              {{ domainSummary(row) }}
                            </p>
                            <Input
                              v-if="row.domains.length > 10"
                              :model-value="domainQuery[row.id] ?? ''"
                              size="medium"
                              placeholder="Search domains"
                              aria-label="Search domains"
                              @update:model-value="(value) => searchDomains(row, value)"
                            >
                              <template #iconLeft>
                                <i
                                  class="pi pi-search"
                                  aria-hidden="true"
                                />
                              </template>
                            </Input>
                          </div>
                          <div
                            class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)"
                          >
                            <a
                              v-for="domain in visibleDomains(row)"
                              :key="domain"
                              :href="'https://' + domain"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                              @click.stop
                            >
                              <span class="truncate">{{ domain }}</span>
                              <i
                                class="pi pi-external-link ms-auto shrink-0 text-body-xs leading-none"
                                aria-hidden="true"
                              />
                            </a>
                            <div v-if="domainLoading[row.id]">
                              <div
                                v-for="index in nextDomains(row)"
                                :key="index"
                                class="flex h-7 items-center px-(--spacing-xs)"
                              >
                                <Skeleton
                                  height="var(--size-3)"
                                  :width="WIRE_WIDTHS[(index - 1) % WIRE_WIDTHS.length]"
                                />
                              </div>
                            </div>
                            <p
                              v-if="!matchingDomains(row).length"
                              class="px-(--spacing-xs) py-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
                            >
                              No domain matches “{{ domainQuery[row.id] }}”.
                            </p>
                          </div>
                          <div
                            v-if="remainingDomains(row)"
                            class="border-t border-(--border-default) p-(--spacing-xxs)"
                          >
                            <Button
                              :label="'Load ' + nextDomains(row) + ' more'"
                              kind="transparent"
                              size="small"
                              :loading="domainLoading[row.id]"
                              class="w-full"
                              @click.stop="loadMoreDomains(row)"
                            />
                          </div>
                          <span
                            class="sr-only"
                            role="status"
                          >
                            {{
                              domainLoading[row.id]
                                ? 'Loading ' + nextDomains(row) + ' more domains'
                                : domainSummary(row)
                            }}
                          </span>
                        </PopoverContent>
                      </PopoverRoot>
                      <div class="shrink-0 ms-auto">
                        <CopyButton
                          kind="outlined"
                          :value="value"
                          aria-label="Copy domain name"
                        />
                      </div>
                    </div>
                  </template>
                  <template #cell-status="{ value }">
                    <Tag
                      :label="value"
                      :severity="value === 'Live' ? 'success' : 'secondary'"
                      size="medium"
                    />
                  </template>
                  <template #cell-lastModified="{ row, value }">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <Tooltip
                        v-if="row.owner"
                        :text="row.owner"
                      >
                        <Avatar
                          :src="avatars[row.owner]"
                          :alt="row.owner"
                          :label="row.owner"
                          size="small"
                          kind="square"
                        />
                      </Tooltip>
                      <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
                    </div>
                  </template>
                  <template #cell-actions="{ row }">
                    <DropdownMenuRoot
                      placement="bottom-end"
                      @select="(event, value) => onRowAction(value, row)"
                    >
                      <DropdownMenuTrigger>
                        <Tooltip text="Row actions">
                          <IconButton
                            icon="pi pi-ellipsis-h"
                            kind="outlined"
                            size="small"
                            aria-label="Row actions"
                          />
                        </Tooltip>
                      </DropdownMenuTrigger>
                      <DropdownMenuGroup>
                        <DropdownMenuOption
                          value="deploy"
                          label="Deploy"
                        >
                          <template #left
                            ><i
                              class="pi pi-cloud-upload"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                        <DropdownMenuOption
                          value="view"
                          label="View details"
                        >
                          <template #left
                            ><i
                              class="pi pi-eye"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                        <DropdownMenuOption
                          value="duplicate"
                          label="Clone"
                        >
                          <template #left
                            ><i
                              class="pi pi-clone"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                      </DropdownMenuGroup>
                      <DropdownMenuGroup>
                        <DropdownMenuOption
                          value="delete"
                          label="Delete"
                        >
                          <template #left
                            ><i
                              class="pi pi-trash"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                      </DropdownMenuGroup>
                    </DropdownMenuRoot>
                  </template>
                  <template #empty>
                    <EmptyState
                      size="medium"
                      icon="pi pi-filter-slash"
                      title="No matching resources"
                      description="No resource matches these filters."
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
        </section>
      </section>
    </main>
    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete resource"
      size="medium"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          The selected resource will be deleted, along with its domains and settings.
        </p>
        <p
          :id="confirmLabelId"
          class="m-0 text-body-sm text-(--text-default)"
        >
          Type <code class="text-label-code-sm">{{ pending?.name }}</code> to confirm.
        </p>
        <Input
          v-model="confirmation"
          :aria-labelledby="confirmLabelId"
          autocomplete="off"
          class="w-full"
          @keydown.enter="confirmDelete"
        />
      </div>
      <template #actions="{ close }">
        <Button
          label="Cancel"
          kind="outlined"
          size="medium"
          @click="close"
        />
        <Button
          label="Delete resource"
          kind="danger"
          size="medium"
          :disabled="!canDelete"
          @click="confirmDelete"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
```

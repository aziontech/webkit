# CardView (`platform/view/card-view`)

> The card form of a first-level list page, for resources people recognise by a few fields rather than compare column by column: a medium page heading with the resource name and its one-line description and the outlined medium Documentation action beside a primary large Create Application, the page's only large control, then the controls row: a `PropertyFilter` (Name, Status, Region, Requests, or free text) that grows to fill the row, a Delete button that counts the selected cards and opens a `ConfirmDialog` (the delete-with-confirmation pattern: a warning `Alert`, the selected names and an `Input` that must read delete), and `CollectionPreferences` for the page size and which fields every card shows; then `Cards` and a `Pagination`. Each card is named by a link to the resource and lists its fields as label and value pairs (the status as a `Tag`, the domain isolated in `bdi`, the request count in compact notation). Four cards a row in a wide container, down to one in a narrow one (container queries). A visible Select all items sits above the cards and the selection survives paging. All of it runs on `useCollection` in client mode: the filter, the sort and the page live in the URL, and the page size and the visible fields are saved per account in localStorage. An account with no applications keeps the heading and the controls and shows a medium `EmptyState` with a Create action; a filter that matches nothing shows a No matching applications state with Clear filters. Laid out with the theme’s `layout-boundary`, `layout-column` and `layout-section-start` utilities. Its page-level parts are `PageHeader`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/view/card-view/card-view.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/view/card-view")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Cards](../../../components/cards.md), [CollectionPreferences](../../../components/collection-preferences.md), [ConfirmDialog](../../../components/confirm-dialog.md), [EmptyState](../../../components/empty-state.md), [Input](../../../components/input.md), [PageHeader](../../../components/page-header.md), [Pagination](../../../components/pagination.md), [PropertyFilter](../../../components/property-filter.md), [Tag](../../../components/tag.md), `use-collection`
- Skills: `webkit-lists`, `webkit-ui-states`

## Asked as

card view; cards view; card list; cards list; resource cards; grid of cards; card grid page; gallery of resources; applications as cards; selectable cards; cards with filters; cards with pagination; visualização em cards; lista em cards; cartões de recursos; grade de cards

The first-level index of one resource type, in cards. The user lands here from the sidebar to find a resource they recognise by its name and a few fields (its status, domain, region, traffic), narrow the list by those fields, open one, or select several and act on them together. One `useCollection` call holds the filter, the sort, the page, the selection across pages and the saved preferences, so the page is one heading over one band: the controls row, the cards and the pagination.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- The module the sidebar routes to lists resources people tell apart by a handful of fields or a picture rather than by comparing one column across many rows (applications, sites, templates, images).
- Each item has a short, stable set of fields (four to six) that reads well as label and value pairs.
- Users act on several items at once (delete, move, tag) and need the selection to survive paging and filtering.
- The filtered list must survive a reload or a shared link, and each person's page size and visible fields must survive the next visit.

## When not to use

- Records compared and sorted column by column, or more than six fields per item: use `platform/view/table-view`.
- A list nested inside one resource (a tab of a details page): use `platform/detail/details-page` or `platform/detail/record-table`, with `Add <Module>` instead of `Create`.
- Choosing a starting point to create from (templates, products): use `platform/create/create-hub` or `platform/create/deploy-template`.
- Files and folders of a storage resource: use `platform/view/file-browser`.
- An account that has never created the resource: use `platform/states/first-use`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size carries the module name as the title and one sentence of purpose as the description. Its actions slot holds the outlined medium Documentation button, which opens the docs in a new tab, and the primary `Create <Object>` button at `size="large"`, the page's only large control, as `skills/webkit-lists` asks; everything on the controls row stays medium. On a phone the actions stack below the copy at full width. At first level this heading is the only place the module name appears.

### B. Property filter — `PropertyFilter` (required)

One `PropertyFilter` bound with `v-bind="propertyFilterProps"` grows to fill the controls row. Status and Region are properties with `options`, in the domain's order (Active, Degraded, Inactive); Requests is `type: 'number'`, which adds `>`, `<`, `>=` and `<=`; Name is a plain property. Text typed without a property is a free-text token over the name, domain and owner. Two tokens or more offer Match all or Match any; the row ends on Clear filters and the match count. Every change rewinds to the first page.

### C. Bulk action — `Button` (required)

An outlined medium Delete `Button` with the trash icon beside the filter acts on the selected cards. Its label counts the selection, `Delete (3)`, from `selectedCount`, and it is disabled at zero. It is the trigger of the confirmation dialog below. A list with more bulk actions keeps the most common one as a button and moves the rest into one Actions menu beside it.

### D. Delete confirmation — `ConfirmDialog`, `Alert`, `Input` (required)

The `platform/delete/delete-with-confirmation` pattern adapted to a selection: a medium `ConfirmDialog` whose trigger is the Delete (n) button, titled with the count (`Delete 3 applications`, `Delete application` for one). The body stacks the warning `Alert` (`Once confirmed, this action can't be reversed.`), one sentence of consequence that lists the selected names, and an `Input` labelled by `Type delete to confirm.` (a list of names cannot be retyped, so the confirmation is the verb). The actions are Cancel and a danger `Delete applications` that enables only once the word matches; confirming removes the selected items and clears the selection. The typed word resets each time the dialog opens.

### E. Card preferences — `CollectionPreferences` (required)

The last control of the row. `CollectionPreferences` bound with `v-bind="preferencesProps"` and `:sections="['page-size', 'columns']"` opens a dialog that edits a draft and applies it on Confirm: the page size (12, 24, 48, multiples of the four-card row) and which fields every card shows, in what order. `preferences.storageKey` saves the choice per list; `defaults.columns` hides Owner until someone shows it. The card's name is never a field, so it cannot be hidden.

### F. Cards — `Cards`, `Tag` (required)

`Cards` bound with `v-bind="cardsProps"` (one page of items, the selection mode and the selected keys) and an `aria-label` naming the collection. The `header` slot names each card with a link to the resource; the default slot lists the visible fields as a `dl` of label and value pairs, in the order the preferences set. Status is a small `Tag` with the same severity on every card (success, warning, secondary); the domain is isolated in `bdi`; the request count uses compact notation with tabular numerals. Each card has a checkbox labelled by its name, and a visible Select all items sits above the grid; the selection is a set of keys, so it survives paging and sorting. Four cards a row in a wide container, down to one in a narrow one, through container queries.

### G. Pagination — `Pagination` (required)

`Pagination` bound with `v-bind="paginationProps"` sits below the cards and carries the page, the total and the page size from the preferences. It hides when nothing matches.

### H. No matching applications — `EmptyState`, `Button` (required)

When `status` is `no-match`, the `Cards` `#empty` slot holds a medium `EmptyState` with the filter-slash glyph, "No matching applications", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`. The heading and the filter tokens stay, so the user can see and undo what hid the cards.

### I. Empty listing — `EmptyState`, `Button` (required)

When `status` is `empty`, the cards and the pagination give way to a medium `EmptyState` with the module glyph, one sentence, and a small secondary `Create <Object>` with the heading's label. The heading and the controls row stay.

## Do

- Run the whole list on one `useCollection` call with `selection: { mode: 'multi' }` and bind `cardsProps`, `paginationProps`, `propertyFilterProps` and `preferencesProps` with `v-bind`.
- Keep the controls row, the cards and the pagination in one band at the group gap; the heading sits one section step above.
- Name every card with a link to the resource in the `header` slot, and keep its fields to the few that tell one item from another.
- Render the fields from `preferences.columns`, so the order and visibility set in the dialog reach every card.
- Count the selection in the bulk action's label and disable it at zero.
- Put every Delete behind the confirmation dialog, with the count in its title and the names in its body.
- Set `url: true` so the tokens, the sort and the page live in the query string, and give the list a `storageKey` of its own.
- Choose page sizes that fill whole rows of four.
- Branch on `status`: `empty` replaces the cards with the create state, `no-match` fills the `#empty` slot with Clear filters.

## Don't

- Don't add a search `Input`, a filter popover or a row of `Select`s beside the `PropertyFilter`.
- Don't make the whole card a link or a click target when it is also selectable; the name link opens it and the checkbox selects it.
- Don't put row-style action menus on every card for actions the bulk action already covers.
- Don't vary a card's height or field order from one card to the next; every card shows the same fields in the same order, with a dash for a missing value.
- Don't truncate the name in the header to fit a badge; the status lives in the fields.
- Don't hide Delete when nothing is selected; disable it so its place in the row stays put.
- Don't show the first-use empty state when filters hide every card, or Clear filters when the account has none.

## Copy

- **Title:** the module name as the sidebar shows it, e.g. "Applications". Description: one sentence with a period.
- **Create action:** `Create <Object>` with the entity's capitalization, e.g. "Create Application"; never "New" or a bare noun. The empty state repeats the same label.
- **Filter:** placeholder and `aria-label` name what is filtered, e.g. "Filter applications".
- **Bulk action:** the verb, then the count in parentheses, e.g. "Delete", "Delete (3)".
- **Field labels:** one or two words, sentence case, no colon, e.g. "Status", "Domain", "Region", "Requests in 24h", "Owner". Preferences title: "Card preferences".
- **Delete dialog:** title `Delete <n> applications`, consequence `The selected applications will be deleted, along with their domains and settings:` followed by the names, prompt `Type delete to confirm.`, actions `Cancel` and `Delete applications` (singular for one).
- **No match:** "No matching applications", then "No application matches these filters.", and the action "Clear filters".
- **Empty:** title states the fact, e.g. "No applications yet"; description is one sentence with what to do, e.g. "Create an application to start serving traffic."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The layout owns the one `main` landmark; the `PageHeader` title is the page's only `h1`.
- `Cards` is a list named by its `aria-label`; each card is labelled by its header, and its checkbox is named by the same text.
- Select all items is a visible, labelled checkbox, not an icon; its state is mixed when part of the page is selected.
- Field labels and values are a `dl`, so each value is read with its label; status is a `Tag` with text, never color alone.
- The `PropertyFilter` has an `aria-label` that matches its placeholder, and the match count is announced after each change.
- Focus order follows reading order: heading actions, filter, Delete, Preferences, Select all items, each card's checkbox and link, pagination.
- The delete dialog traps focus, names itself by its title, labels its input by the prompt and returns focus to Delete (n) when it closes.
- The preferences dialog traps focus, is named by its title and returns focus to its trigger when it closes.

## States

- Default: applications exist; the cards show them with the property filter, multi-select with Delete (n) behind its confirmation dialog, preferences and pagination wired, and filtering to nothing shows No matching applications with Clear filters.
- Empty: the account has no applications; `useCollection` reports `empty`, the heading and controls stay, and a medium empty state with Create Application replaces the cards.

## Related

- `platform/view/table-view` — the same collection, rendered as a sortable table.
- `platform/delete/delete-with-confirmation` — the dialog behind Delete (n).
- `platform/create/single-page-create` — where the Create action leads for a short form.
- `platform/detail/details-page` — where a card's name leads.
- `platform/states/first-use` — the module before its first resource.
- `useCollection`, `Cards` and `Pagination` — see `skills/webkit-lists`.

## Variants

- `Default` — primary (the code below)
- `Empty` — An account with no applications: the heading and the controls stay, and the cards give way to a medium EmptyState with a small secondary Create Application button.

Each variant is the same screen in another state: `get_pattern("platform/view/card-view", { variant })`, or the file under `blocks/platform/view/card-view/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Cards from '@aziontech/webkit/cards'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Pagination from '@aziontech/webkit/pagination-root'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref, useId, watch } from 'vue'

  type ApplicationStatus = 'Active' | 'Degraded' | 'Inactive'

  type Application = {
    id: string
    name: string
    status: ApplicationStatus
    domain: string
    region: string
    requests: number
    owner: string
  }

  interface Field {
    id: Exclude<keyof Application, 'id' | 'name'>
    header: string
  }

  const app = (
    n: number,
    name: string,
    status: ApplicationStatus,
    domain: string,
    region: string,
    requests: number,
    owner: string
  ): Application => ({
    id: `app-${String(n).padStart(2, '0')}`,
    name,
    status,
    domain,
    region,
    requests,
    owner
  })

  const applications: Application[] = [
    app(1, 'storefront', 'Active', 'shop.example.com', 'sa-east', 1240000, 'Robson Junior'),
    app(2, 'checkout', 'Active', 'pay.example.com', 'us-east', 310000, 'Isaque Böck'),
    app(3, 'blog', 'Inactive', 'blog.example.com', 'eu-west', 0, 'Gab Lisboa'),
    app(4, 'docs', 'Active', 'docs.example.com', 'sa-east', 88000, 'Marcus Grando'),
    app(5, 'status-page', 'Active', 'status.example.com', 'us-east', 42000, 'Bruno Germano'),
    app(6, 'image-resizer', 'Active', 'img.example.com', 'eu-west', 2900000, 'Herbert Júlio'),
    app(7, 'auth-gateway', 'Degraded', 'auth.example.com', 'sa-east', 520000, 'Rafael Umman'),
    app(8, 'landing', 'Inactive', 'www.example.com', 'us-east', 0, 'Rafael Garbinatto'),
    app(9, 'api', 'Active', 'api.example.com', 'eu-west', 4100000, 'Robson Junior'),
    app(10, 'search', 'Active', 'search.example.com', 'sa-east', 760000, 'Isaque Böck'),
    app(11, 'webhooks', 'Degraded', 'hooks.example.com', 'us-east', 12000, 'Gab Lisboa'),
    app(12, 'reports', 'Active', 'reports.example.com', 'eu-west', 9000, 'Marcus Grando'),
    app(13, 'media', 'Active', 'media.example.com', 'sa-east', 1800000, 'Bruno Germano'),
    app(14, 'admin', 'Inactive', 'admin.example.com', 'us-east', 300, 'Herbert Júlio')
  ]

  const fields: Field[] = [
    { id: 'status', header: 'Status' },
    { id: 'domain', header: 'Domain' },
    { id: 'region', header: 'Region' },
    { id: 'requests', header: 'Requests in 24h' },
    { id: 'owner', header: 'Owner' }
  ]

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'status',
      label: 'Status',
      options: [{ value: 'Active' }, { value: 'Degraded' }, { value: 'Inactive' }]
    },
    {
      key: 'region',
      label: 'Region',
      options: [{ value: 'sa-east' }, { value: 'us-east' }, { value: 'eu-west' }]
    },
    { key: 'requests', label: 'Requests', type: 'number' }
  ]

  const items = ref<Application[]>([...applications])

  const {
    cardsProps,
    paginationProps,
    propertyFilterProps,
    preferencesProps,
    preferences,
    status,
    totalCount,
    selectedCount,
    selectedItems,
    clearSelection,
    clearFilters
  } = useCollection({
    items,
    columns: fields,
    filtering: { fields: ['name', 'domain', 'owner'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 12, pageSizeOptions: [12, 24, 48] },
    selection: { mode: 'multi' },
    preferences: {
      storageKey: 'applications-cards',
      defaults: { columns: [{ id: 'owner', visible: false }] }
    },
    url: true
  })

  const shownFields = computed(() =>
    preferences.value.columns
      .filter((column) => column.visible)
      .map((column) => fields.find((field) => field.id === column.id))
      .filter((field): field is Field => field !== undefined)
  )

  const requestsFormat = new Intl.NumberFormat('en-US', { notation: 'compact' })
  const severityOf = (value: ApplicationStatus): TagSeverity =>
    value === 'Active' ? 'success' : value === 'Degraded' ? 'warning' : 'secondary'

  const CONFIRM_WORD = 'delete'
  const deleteOpen = ref(false)
  const confirmation = ref('')
  const confirmLabelId = useId()
  const deleteNoun = computed(() =>
    selectedCount.value === 1 ? 'application' : `${selectedCount.value} applications`
  )
  const deleteConsequence = computed(() =>
    selectedCount.value === 1
      ? 'The selected application will be deleted, along with its domains and settings:'
      : 'The selected applications will be deleted, along with their domains and settings:'
  )
  const canDelete = computed(() => confirmation.value.trim().toLowerCase() === CONFIRM_WORD)

  watch(deleteOpen, (isOpen) => {
    if (isOpen) confirmation.value = ''
  })

  const confirmDelete = () => {
    if (!canDelete.value) return
    const doomed = new Set(selectedItems.value.map((item) => item.id))
    items.value = items.value.filter((item) => !doomed.has(item.id))
    clearSelection()
    deleteOpen.value = false
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Applications"
        description="Every application on this account, as cards."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/applications"
            target="_blank"
          />
          <Button
            label="Create Application"
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
                placeholder="Filter applications"
                aria-label="Filter applications"
              />
            </div>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <ConfirmDialog
                v-model:open="deleteOpen"
                :title="`Delete ${deleteNoun}`"
                size="medium"
              >
                <template #trigger>
                  <Button
                    :label="selectedCount ? `Delete (${selectedCount})` : 'Delete'"
                    icon="pi pi-trash"
                    kind="outlined"
                    size="medium"
                    :disabled="!selectedCount"
                  />
                </template>
                <div class="flex flex-col gap-(--spacing-md)">
                  <Alert
                    severity="warning"
                    label="Once confirmed, this action can't be reversed."
                  />
                  <p class="m-0 text-body-sm text-(--text-muted)">
                    {{ deleteConsequence }}
                    <bdi class="text-(--text-default)">{{
                      selectedItems.map((item) => item.name).join(', ')
                    }}</bdi
                    >.
                  </p>
                  <p
                    :id="confirmLabelId"
                    class="m-0 text-body-sm text-(--text-default)"
                  >
                    Type <code class="text-label-code-sm">{{ CONFIRM_WORD }}</code> to confirm.
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
                    :label="selectedCount === 1 ? 'Delete application' : 'Delete applications'"
                    kind="danger"
                    size="medium"
                    :disabled="!canDelete"
                    @click="confirmDelete"
                  />
                </template>
              </ConfirmDialog>
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Card preferences"
                :sections="['page-size', 'columns']"
              />
            </div>
          </header>

          <EmptyState
            v-if="status === 'empty'"
            size="medium"
            icon="pi pi-th-large"
            title="No applications yet"
            description="Create an application to start serving traffic."
          >
            <template #actions>
              <Button
                label="Create Application"
                icon="pi pi-plus"
                kind="secondary"
                size="small"
              />
            </template>
          </EmptyState>

          <template v-else>
            <Cards
              v-bind="cardsProps"
              aria-label="Applications"
            >
              <template #header="{ item }">
                <a
                  :href="'/applications/' + item.id"
                  class="truncate text-(--text-default) no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                  >{{ item.name }}</a
                >
              </template>
              <template #default="{ item }">
                <dl
                  class="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-(--spacing-sm) gap-y-(--spacing-xs)"
                >
                  <template
                    v-for="field in shownFields"
                    :key="field.id"
                  >
                    <dt class="truncate text-label-sm text-(--text-muted)">{{ field.header }}</dt>
                    <dd class="min-w-0 truncate">
                      <Tag
                        v-if="field.id === 'status'"
                        :label="item.status"
                        :severity="severityOf(item.status)"
                        size="small"
                      />
                      <bdi v-else-if="field.id === 'domain'">{{ item.domain }}</bdi>
                      <span
                        v-else-if="field.id === 'requests'"
                        class="tabular-nums"
                        >{{ requestsFormat.format(item.requests) }}</span
                      >
                      <template v-else>{{ item[field.id] }}</template>
                    </dd>
                  </template>
                </dl>
              </template>
              <template #empty>
                <EmptyState
                  size="medium"
                  icon="pi pi-filter-slash"
                  title="No matching applications"
                  description="No application matches these filters."
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
            </Cards>
            <Pagination
              v-if="totalCount > 0"
              v-bind="paginationProps"
            />
          </template>
        </section>
      </section>
    </div>
  </div>
</template>
```

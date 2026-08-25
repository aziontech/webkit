<script setup>
  // SQL Database list — the Azion Console "SQL Database" module (Store area). The
  // app shell (sidebar + GlobalHeader with the module breadcrumb) comes from
  // AppLayout; this page renders only its content: a PageHeading (title +
  // description + the primary "Create database" action) over a data-driven
  // <Table>. As a first-level module list it carries no navigation tabs — the
  // table's own search narrows the set.
  //
  // When there are no databases the table's own empty body would read as a blank
  // grid, so the whole content region swaps to an EmptyState with the single next
  // action (the /ux-heuristics "empty = one clear action" rule).
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { daysAgo, formatListDate, hoursAgo } from '@shared/lib/dates'
  import { authorAt } from '@shared/lib/people'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import AuthorCell from '../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import IdCell from '../../components/list/IdCell.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../lib/behavior/filter-bar'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../lib/behavior/table-columns'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  // The sample's EMPTY version: this module before it owns anything. The same block the
  // /empty-states gallery reviews, rendered in the module's own page
  // (../lib/sample-mode.js, ./ui/ProductFirstUse.vue).
  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('sql-database')

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The database records that back the table (data-driven mode). The Last Modified
  // avatar comes from the shared team roster (src/lib/people.js), assigned
  // round-robin per row.
  const databases = ref(
    [
      {
        id: 'db-store-sessions',
        name: 'store-sessions',
        status: 'Created',
        tables: 4,
        modifiedAt: daysAgo(1)
      },
      {
        id: 'db-analytics-events',
        name: 'analytics-events',
        status: 'Created',
        tables: 12,
        modifiedAt: daysAgo(9)
      },
      {
        id: 'db-feature-flags',
        name: 'feature-flags',
        status: 'Creating',
        tables: 0,
        modifiedAt: hoursAgo(3)
      }
    ].map((db, index) => {
      const person = authorAt(index)
      // `modifiedAt` is the real instant — the Last Modified field compares it — and
      // `lastModified` (the sortable display string) is derived from it by one
      // formatter rather than hand-written per row (src/lib/dates.js).
      return {
        ...db,
        author: person.name,
        authorAvatar: person.avatar,
        lastModified: formatListDate(db.modifiedAt)
      }
    })
  )

  // Switching organization, account or workspace reloads the module: skeletons while
  // the new scope's databases arrive (src/lib/tenancy-reload.js), and a database
  // belongs to one place in the tenancy chain, so the seed is projected through the
  // scope in force (src/lib/tenancy-scope.js).
  const scopedDatabases = computed(() => tenancyRows(databases.value, 'sql-database'))

  // ── The filter catalog ────────────────────────────────────────────────────
  // Status is the one enumerable column and Last Modified becomes the same relative
  // periods every other list offers; Name, ID and Tables are covered by the search
  // field (Tables is a magnitude — a chip per table count would be one option per row).
  const filterFields = [
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Created', label: 'Created' },
        { value: 'Creating', label: 'Creating' }
      ],
      match: (db, values) => values.includes(db.status)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (db, values) => matchDate(db.modifiedAt, values)
    }
  ]

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleDatabases,
    loading,
    refresh
  } = useListFilters(filterFields, scopedDatabases)

  // The table the controls row drives. Download CSV calls the DS's own `exportCsv()`
  // through it (../../components/list/ExportButton.vue), so the file honours the
  // visible columns and the filtered rows instead of re-serialising them here.
  const tableRef = ref(null)

  // Which columns are switched off, driven by the Columns button beside the filter
  // (../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever recorded, so this
  // never has to be kept in step with the column model above.
  //
  // ID SHIPS OFF. It is the column an operator wants when they are quoting a resource
  // into a support thread or an API call, and almost never while scanning the list —
  // so it starts hidden and is one switch away. That is the whole point of the panel:
  // a column can be available without being in the way by default.
  const columnVisibility = ref({ id: false })

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'tables', header: 'Tables', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // Entering the module and choosing "create" opens the dedicated create PAGE (a
  // focused creation shell at /sql-database/new), not a modal — see
  // CreateSqlDatabase.vue.
  const createDatabase = () =>
    router.push({ path: '/sql-database/new', query: { email: userEmail.value } })

  // Opening a database enters its detail view (Tables / Editor tabs), carrying its
  // name so the header reads it without a round-trip.
  const openDatabase = (event, row) =>
    router.push({
      path: `/sql-database/${row.id}`,
      query: { email: userEmail.value, name: row.name }
    })

  // Deleting is the one row action with no undo, so the menu click only ARMS it: the
  // row waits here until the dialog has been given its name back.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    databases.value = databases.value.filter((db) => db.id !== row.id)
    toast.success(`Database "${row.name}" deleted.`)
    pendingDelete.value = null
  }

  const onRowAction = (event, value, row) => {
    if (value === 'open') {
      openDatabase(event, row)
      return
    }
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(`Editing ${row.name}`, { description: `Database ID ${row.id}` })
  }
</script>

<template>
  <AppLayout
    active="sql-database"
    :breadcrumb="[{ label: 'SQL Database' }]"
  >
    <main
      class="flex min-h-full flex-col"
      :class="accountEmpty ? 'layout-column-focused' : 'layout-column'"
    >
      <!-- THE PAGE HEADING. A first-level resource page names itself: the module name
           over one line saying what the module is, with the module's own action on the
           right. The breadcrumb says WHERE you are; the heading says WHAT this page is,
           and it gives that action one fixed home above the list instead of a control
           that rides the row narrowing it.
           The action stays here over an EMPTY list as well: where a page's action sits is
           a property of the page, not of how many rows it has. The empty state's own
           button is the in-content door — a `secondary` inside the card — not this same
           control moving.
           `size="medium"` is the first-level list scale (components/page/PageHeading.vue):
           the title names the collection, and the table under it is what the page is for.
           The parent section below is no longer `:first-child`, so `.layout-section-start`
           opens it at the boundary step — the list sits tight under the heading (theme
           semantic/layouts § "THE PAGE SHAPE"). -->
      <PageHeading
        v-if="!accountEmpty"
        size="medium"
        title="SQL Database"
        description="Create and manage SQL Database instances accessed by Applications, Functions, and APIs."
        :documentation="firstUse.learnMore.href"
      >
        <template #actions>
          <HeadingAction
            label="Create database"
            kind="primary"
            icon="pi pi-plus"
            @click="createDatabase"
          />
        </template>
      </PageHeading>

      <!-- FIRST USE, IN HOME'S CONTAINER.
           The same box the first access uses on /home (./HomeEmptyState.vue) and the
           /empty-states gallery around it (../ProductEmptyStates.vue): centred in the
           viewport rather than hanging from the top edge. This screen and that one are the
           same KIND of screen — a short block answering "there is nothing here yet" — and a
           short block pinned to the top with a void under it reads as content that failed
           to load. The section step is gone with it: a centred box measures from the middle,
           and a top margin would only pull it off centre.
           CENTRED WITH AUTO MARGINS, not `min-h-full justify-center`. That pair looks
           right and does nothing: `min-height: 100%` resolves against a parent whose own
           height is `auto` (main is `min-h-full`, not `h-full`), so the box stayed at
           content height and `justify-center` then centred the content inside itself — a
           no-op. `my-auto` asks the flex parent to split its free space above and below
           this one item, which is the definition of centred; and when the block is TALLER
           than the viewport the auto margins collapse to 0 instead of clipping its top,
           which is what `flex-1 justify-center` would have done. -->
      <div
        v-if="accountEmpty"
        class="my-auto flex w-full flex-col py-(--spacing-xl)"
      >
        <ProductFirstUse :product="firstUse" />
      </div>

      <section
        v-else
        class="layout-section-start flex min-h-0 min-w-0 flex-1 flex-col gap-(--layout-section-gap)"
      >
        <!-- ONE section — the module's list band: either the controls row over the
             table it narrows (at --layout-group-gap), or the empty state that replaces
             both. `flex-1` is passed down from the parent so that empty state can
             still centre itself in the page. -->
        <section class="flex min-h-0 min-w-0 flex-1 flex-col gap-(--layout-group-gap)">
          <!-- The CONTROLS row, under the heading: the narrowing, on a list the page can
               already show — search on the left, nothing on the right, because the
               module's action sits in the heading above.
               Rendered only when there are rows: a search field with nothing to search is
               noise. -->
          <ControlsHeader v-if="scopedDatabases.length">
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search databases"
              aria-label="Search databases"
              class="min-w-36 grow basis-(--container-2xs)"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>
            <template #actions>
              <!-- THE RIGHT GROUP: the three controls that act on the LISTING rather
                   than narrow it — fetch it again, take it away as a file, choose which
                   columns it shows. All glyphs, all `medium`, so the row shares one
                   32px height with the field and the Filter button opposite. -->
              <RefreshButton
                :loading="loading"
                @refresh="refresh"
              />
              <ExportButton
                :table="tableRef"
                filename="databases.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="columns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-if="scopedDatabases.length"
            v-model="filters"
            :fields="filterFields"
          />

          <!-- Empty = one clear next action; otherwise the borderless Table in a
               flush CardBox, framed edge-to-edge. -->
          <section
            v-if="!scopedDatabases.length"
            class="flex min-h-0 flex-1 items-center justify-center"
          >
            <CardBox class="w-full max-w-(--container-2xl)">
              <template #content>
                <!-- Empty-state pattern (CreationCenter): a solid CardBox framing a
                     dashed, raised EmptyState surface with a featured icon tile
                     (concentric translucent squares) + one clear action. -->
                <EmptyState
                  size="medium"
                  title="No databases yet"
                  description="Create your first SQL Database to store relational and vector data at the edge."
                  class="flex-1 rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
                >
                  <template #icon>
                    <span class="relative flex size-10 items-center justify-center">
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                      />
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                      />
                      <span
                        class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                      >
                        <i
                          class="ai ai-edge-sql text-[1rem] leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Create database"
                      kind="secondary"
                      size="large"
                      icon="pi pi-plus"
                      @click="createDatabase"
                    />
                  </template>
                </EmptyState>
              </template>
            </CardBox>
          </section>

          <section
            v-else
            class="flex min-h-0 flex-col"
          >
            <CardBox :padded="false">
              <template #content>
                <Table
                  ref="tableRef"
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  v-model:columnVisibility="columnVisibility"
                  :data="visibleDatabases"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="loading"
                  @row-click="openDatabase"
                >
                  <template #cell-name="{ value }">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="ai ai-edge-sql shrink-0 text-[1.15em] text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    </div>
                  </template>

                  <template #cell-id="{ value }">
                    <IdCell
                      :value="value"
                      resource="database"
                    />
                  </template>

                  <template #cell-status="{ value }">
                    <Tag
                      :label="value"
                      :severity="value === 'Created' ? 'success' : 'warning'"
                      size="medium"
                    />
                  </template>
                  <!-- WHO and WHEN are two columns now, so each cell says one thing:
                       the face and the name here, the relative time next to it. -->
                  <template #cell-author="{ row }">
                    <AuthorCell
                      :author="row.author"
                      :avatar-src="row.authorAvatar"
                    />
                  </template>

                  <template #cell-lastModified="{ value }">
                    <LastModifiedCell :date="value" />
                  </template>

                  <template #cell-actions="{ row }">
                    <Dropdown
                      placement="bottom-end"
                      @select="(event, value) => onRowAction(event, value, row)"
                    >
                      <Dropdown.Trigger>
                        <Tooltip text="Row actions">
                          <IconButton
                            icon="pi pi-ellipsis-h"
                            kind="outlined"
                            size="small"
                            aria-label="Row actions"
                          />
                        </Tooltip>
                      </Dropdown.Trigger>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="open"
                          label="Open"
                        >
                          <template #left
                            ><i
                              class="pi pi-arrow-up-right"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="edit"
                          label="Edit"
                        >
                          <template #left
                            ><i
                              class="pi pi-pencil"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                      </Dropdown.Group>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="delete"
                          label="Delete"
                        >
                          <template #left
                            ><i
                              class="pi pi-trash"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                      </Dropdown.Group>
                    </Dropdown>
                  </template>
                </Table>
              </template>
            </CardBox>
          </section>
        </section>
      </section>

      <DeleteDialog
        v-model:open="deleteOpen"
        kind="Database"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </main>
  </AppLayout>
</template>

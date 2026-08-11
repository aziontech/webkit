<script setup>
  // SQL Database list — the Azion Console "SQL Database" module (Store area). The
  // app shell (sidebar + GlobalHeader with the module breadcrumb) comes from
  // AppLayout; this page renders only its content: a PageHeading (title +
  // description + the primary "Create Database" action) over a data-driven
  // <Table>. As a first-level module list it carries no navigation tabs — the
  // table's own search narrows the set.
  //
  // When there are no databases the table's own empty body would read as a blank
  // grid, so the whole content region swaps to an EmptyState with the single next
  // action (the /ux-heuristics "empty = one clear action" rule).
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { daysAgo, formatListDate, hoursAgo } from '../lib/dates'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../lib/filter-bar'
  import { useListFilters } from '../lib/list-state'
  import { authorAt } from '../lib/people'
  import { tenancyRows } from '../lib/tenancy-scope'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import FilterBar from './ui/FilterBar.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'

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
    loading: tenancyReloading
  } = useListFilters(filterFields, scopedDatabases)

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'id', header: 'ID', enableSorting: true, grow: 2 },
    { accessorKey: 'tables', header: 'Tables', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
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

  const onRowAction = (event, value, row) => {
    if (value === 'open') {
      openDatabase(event, row)
      return
    }
    if (value === 'delete') {
      databases.value = databases.value.filter((db) => db.id !== row.id)
      toast.success(`Database "${row.name}" deleted.`)
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
    <main class="layout-column flex min-h-full flex-col">
      <!-- The page's parent section. A module list opens straight on it (no
           PageHeading — the module name is the breadcrumb crumb), so the
           `:first-child` rule zeroes its step and the boundary is its top space. -->
      <section
        class="layout-section-start flex min-h-0 min-w-0 flex-1 flex-col gap-[var(--layout-section-gap)]"
      >
        <!-- ONE section — the module's list band: either the controls row over the
             table it narrows (at --layout-group-gap), or the empty state that replaces
             both. `flex-1` is passed down from the parent so that empty state can
             still centre itself in the page. -->
        <section class="flex min-h-0 min-w-0 flex-1 flex-col gap-[var(--layout-group-gap)]">
          <!-- First-level module list: no PageHeading — the module name already IS the
               header breadcrumb crumb (AppLayout). The page opens with its CONTROLS row
               (search, with the module's own actions on the right); the table follows.
               Rendered only when there are rows: over an empty state the single clear
               next action is the state's own, and a search field with nothing to search
               is noise. -->
          <ControlsHeader v-if="scopedDatabases.length">
            <InputText
              v-model="search"
              size="large"
              placeholder="Search databases..."
              aria-label="Search databases"
              class="min-w-36 grow basis-[var(--container-2xs)]"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>

            <template #actions>
              <Button
                label="Create Database"
                kind="primary"
                size="large"
                icon="pi pi-plus"
                @click="createDatabase"
              />
            </template>
          </ControlsHeader>

          <!-- The filter bar takes its own row: it grows as filters are applied, so
               sharing the controls row would make the search field jump width. -->
          <FilterBar
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
            <CardBox class="w-full max-w-[var(--container-2xl)]">
              <template #content>
                <!-- Empty-state pattern (CreationCenter): a solid CardBox framing a
                     dashed, raised EmptyState surface with a featured icon tile
                     (concentric translucent squares) + one clear action. -->
                <EmptyState
                  size="medium"
                  title="No databases yet"
                  description="Create your first SQL Database to store relational and vector data at the edge."
                  class="flex-1 rounded-[var(--shape-card)] border border-dashed border-[var(--border-default)] bg-[var(--bg-surface-raised)]"
                >
                  <template #icon>
                    <span class="relative flex size-10 items-center justify-center">
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-5"
                      />
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-[var(--shape-card)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-10"
                      />
                      <span
                        class="relative flex size-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)]"
                      >
                        <i
                          class="ai ai-edge-sql text-[1rem] leading-none text-[var(--text-default)]"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Create Database"
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
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  :data="visibleDatabases"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="tenancyReloading"
                  @row-click="openDatabase"
                >
                  <template #cell-name="{ value }">
                    <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                      <i
                        class="ai ai-edge-sql shrink-0 text-[1.15em] text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                      <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    </div>
                  </template>

                  <template #cell-id="{ value }">
                    <div class="flex w-full min-w-0 items-center gap-[var(--spacing-xs)]">
                      <!-- An id is data, not code: it keeps the cell's own type and
                           --text-default, so every column of a row reads at one weight
                           (Applications.vue renders its ID column the same way). -->
                      <span class="min-w-0 truncate">{{ value }}</span>
                      <CopyButton
                        kind="outlined"
                        :value="value"
                        aria-label="Copy database ID"
                        class="ml-auto shrink-0"
                        @click.stop
                      />
                    </div>
                  </template>

                  <template #cell-status="{ value }">
                    <Tag
                      :label="value"
                      :severity="value === 'Created' ? 'success' : 'warning'"
                      size="medium"
                    />
                  </template>

                  <template #cell-lastModified="{ value, row }">
                    <LastModifiedCell
                      :author="row.author"
                      :avatar-src="row.authorAvatar"
                      :date="value"
                    />
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
    </main>
  </AppLayout>
</template>

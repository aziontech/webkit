<script setup>
  // The Variables module — the Azion Console "Variables" list. Unlike Applications
  // (whose create flow is a dedicated PAGE), Variables creates inline: the "Create
  // Variable" button opens ./AddVariableDrawer.vue, which owns the whole create form
  // (the repeated Key / Value / Note triad, the Sensitive / Environments / Projects
  // settings, and the two `.env` bulk paths). This page keeps only what a LIST owns:
  // the records, the narrowing, and appending whatever the drawer created.
  //
  // Narrowing follows the module-list pattern (the webkit-lists skill): a FILTER
  // BUTTON (list/FilterButton.vue) beside the search. The COLUMNS decide
  // the fields — every enumerable column becomes one field (Author, Type) and the
  // date column becomes relative periods plus a Custom month grid (Last Modified),
  // while the free-text columns (Key, Value) are covered by the search field instead
  // of one field each. The button pre-filters `:data`; the search narrows what is left,
  // through the table's own global filter.
  //
  // This replaced the generic field/operator/value builder that sat in the table's
  // own toolbar: `Table.Filter` / `Table.AppliedFilters` read the table's filter
  // state through `inject`, so they could never be hoisted out of the card — and
  // `lastEditor` is not a column at all (it renders inside the Last Modified cell),
  // so the table's own filter state could not have hosted that field either.
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { formatListDate } from '@shared/lib/dates'
  import { computed, ref, watch } from 'vue'
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
  import { VARIABLES } from '../../lib/data/variables'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'
  import AddVariableDrawer from './AddVariableDrawer.vue'

  // The sample's EMPTY version: this module before it owns anything. The same block the
  // /empty-states gallery reviews, rendered in the module's own page
  // (../lib/sample-mode.js, ./ui/ProductFirstUse.vue).
  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('variables')

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')
  const editorName = computed(() => userEmail.value.split('@')[0])

  // --- The records that back the table (data-driven mode) -------------------
  // The seed lives in ../../lib/data/variables.js — one module per resource type, so
  // global search can index it (../../lib/data/search-index.js). This is the page's own
  // mutable copy: rows created and deleted here never touch the seed.
  const variables = ref([...VARIABLES])

  // Switching organization, account or workspace reloads the module: skeletons while
  // the new scope's variables arrive (src/lib/tenancy-reload.js). A variable belongs
  // to the scope it was set in, so the seed is projected through the one in force; a
  // variable created in this session is the operator's own and always shows
  // (src/lib/tenancy-scope.js).
  const scopedVariables = computed(() => tenancyRows(variables.value, 'variables'))

  // Column model. `key` is the principal (emphasized) column; the trailing
  // `actions` column (kind: 'action') auto-pins to the right edge.
  const columns = [
    { accessorKey: 'key', header: 'Key', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: FIT_COLUMN },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'secret', header: 'Type', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'lastEditor', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── The filter catalog ────────────────────────────────────────────────────
  // One field per enumerable column, in the order the COLUMNS read. Authors come
  // from the data, so the field can never offer someone with no rows in the list.
  // (The column is "Last Modified"; the person renders inside that cell as
  // `lastEditor`.) Each carries that person's photo, so the filter identifies them
  // the way the cell does — by face first, name second.
  //
  // A getter rather than an array: the drawer appends rows, and a new variable's
  // editor has to become offerable without a reload.
  const authorOptions = computed(() =>
    [
      ...new Map(
        variables.value.map((variable) => [variable.lastEditor, variable.lastEditorAvatar])
      )
    ]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([author, avatar]) => ({ value: author, label: author, avatar }))
  )

  const filterFields = [
    {
      id: 'lastEditor',
      label: 'Author',
      kind: 'options',
      get options() {
        return authorOptions.value
      },
      match: (variable, values) => values.includes(variable.lastEditor)
    },
    {
      // The Type column is a boolean in the record and a Tag in the cell; the field
      // speaks the words the cell shows, not `true` / `false`.
      id: 'type',
      label: 'Type',
      kind: 'options',
      options: [
        { value: 'variable', label: 'Variable' },
        { value: 'secret', label: 'Secret' }
      ],
      match: (variable, values) => values.includes(variable.secret ? 'secret' : 'variable')
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (variable, values) => matchDate(variable.modifiedAt, values)
    }
  ]

  // Filter state, search value, surviving rows and their pagination — one place,
  // including the rewind (src/lib/list-state.js). `loading` is the tenancy reload
  // window.
  const {
    filters,
    search,
    pagination,
    visibleRows: filteredVariables,
    loading,
    refresh
  } = useListFilters(filterFields, scopedVariables, { pageSize: 10 })

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

  // Secret values are masked in the list — never render a stored secret in plain
  // text once saved (mirrors the console).
  const displayValue = (row) => (row.secret ? '••••••••••••' : row.value)

  // --- Create flow ---------------------------------------------------------
  // The drawer owns the form (and its own success toast); the list owns the rows. It
  // also needs the keys already taken, so a duplicate is caught in the form instead
  // of landing as a second row with the same key.
  const drawerOpen = ref(false)
  const existingKeys = computed(() => variables.value.map((variable) => variable.key))

  const openCreate = () => {
    drawerOpen.value = true
  }

  // ── ARRIVING WITH THE CREATE FLOW ASKED FOR (`?create=variable`) ──
  //
  // Variables is the one module whose create flow is a DRAWER, so its first-use gates
  // have no page to route to (./ui/ProductFirstUse.vue routes; it does not reach into a
  // host's refs). The gate asks for the flow in the URL instead, and this reads it — so
  // the same gate works from this page's own first use AND from the /empty-states
  // gallery, and `/variables?create=variable` is a link somebody can send.
  //
  // `watch` with `immediate`, not `onMounted`: arriving from this page's own first-use
  // gate is a query change on a route that is already mounted, which `onMounted` would
  // never see. The query is read and then dropped from the address bar — it is a way IN
  // to the flow, not part of the route (the same treatment `?state=` gets in
  // ../lib/sample-mode.js).
  watch(
    () => route.query.create,
    (requested) => {
      if (requested !== 'variable') return
      openCreate()
      router.replace({ path: route.path, query: { ...route.query, create: undefined } })
    },
    { immediate: true }
  )

  // One create can carry several variables (Add Another, an imported `.env`), so the
  // drawer emits a LIST. Each one lands with the same shape as a seeded row: the
  // instant is the record and the display string is derived from it, so a new row
  // sorts and filters like every other one. Newest first, in the order created.
  const onCreated = (created) => {
    const modifiedAt = new Date()
    variables.value = [
      ...created.map((variable, index) => ({
        ...variable,
        id: `v-${Date.now()}-${index}`,
        lastEditor: editorName.value,
        lastEditorAvatar: '',
        modifiedAt,
        lastModified: formatListDate(modifiedAt)
      })),
      ...variables.value
    ]
  }

  // A variable's KEY is its name here — it is what the row shows and what code reads,
  // so it is also the phrase the delete dialog asks back before removing it.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    variables.value = variables.value.filter((item) => item.id !== row.id)
    toast.success(`${row.key} deleted.`)
    pendingDelete.value = null
  }

  const onRowAction = (event, value, row) => {
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    const copy = {
      edit: `Editing ${row.key}`,
      duplicate: `Duplicating ${row.key}`
    }
    toast.info(copy[value] ?? row.key, { description: `Variable ${row.id}` })
  }
</script>

<template>
  <AppLayout
    active="variables"
    :breadcrumb="[{ label: 'Variables' }]"
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
           `large` was tried and reverted — at 30px the title outweighed the table it
           introduces, which is the wrong emphasis for a page whose whole job is the rows.
           The ladder still reads without it: medium here, `small` on a resource's tabs
           and settings sub-pages.
           The parent section below is no longer `:first-child`, so `.layout-section-start`
           opens it at the boundary step — the list sits tight under the heading (theme
           semantic/layouts § "THE PAGE SHAPE"). -->
      <PageHeading
        v-if="!accountEmpty"
        size="medium"
        title="Variables"
        description="Configure variable names, values, and settings for use across Azion's products."
        :documentation="firstUse.learnMore.href"
      >
        <template #actions>
          <HeadingAction
            label="Create variable"
            kind="primary"
            icon="pi pi-plus"
            @click="openCreate"
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
        class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
      >
        <!-- ONE section: the controls row narrows the table under it, so the two
             sit at --layout-group-gap. -->
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <!-- The CONTROLS row, under the heading: the narrowing, on a list the page can
               already show — search on the left, nothing on the right, because the
               module's action sits in the heading above.
               Rendered only when there are rows: a search field with nothing to search is
               noise. -->
          <ControlsHeader v-if="scopedVariables.length">
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <!-- Search drives the table's global filter from outside the card, so the
                 field is a plain InputText (`Table.Search` is context-aware and only works
                 inside `<Table>`). It keeps the whole row: the filters sit below. -->
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search variables"
              aria-label="Search variables"
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
                filename="variables.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="columns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-if="scopedVariables.length"
            v-model="filters"
            :fields="filterFields"
          />

          <!-- Variables table -->
          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <Table
                  ref="tableRef"
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  v-model:columnVisibility="columnVisibility"
                  :data="filteredVariables"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="10"
                  :border="false"
                  :loading="loading"
                >
                  <!-- A key and a value are data, not code: both keep the cell's own type
                       and --text-default, so a row reads at one weight across its columns
                       (Applications.vue's list is the reference). -->
                  <template #cell-key="{ value }">
                    <span class="min-w-0 truncate">{{ value }}</span>
                  </template>

                  <template #cell-id="{ value }">
                    <IdCell
                      :value="value"
                      resource="variable"
                    />
                  </template>

                  <template #cell-value="{ row }">
                    <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                      <span class="min-w-0 truncate">{{ displayValue(row) }}</span>
                      <CopyButton
                        v-if="!row.secret"
                        kind="outlined"
                        :value="row.value"
                        aria-label="Copy value"
                        class="ml-auto shrink-0"
                      />
                    </div>
                  </template>
                  <!-- WHO and WHEN are two columns now, so each cell says one thing:
                       the face and the name here, the relative time next to it. -->
                  <template #cell-lastEditor="{ row }">
                    <AuthorCell
                      :author="row.lastEditor"
                      :avatar-src="row.lastEditorAvatar"
                    />
                  </template>

                  <template #cell-lastModified="{ value }">
                    <LastModifiedCell :date="value" />
                  </template>

                  <template #cell-secret="{ value }">
                    <Tag
                      :label="value ? 'Secret' : 'Variable'"
                      :severity="value ? 'warning' : 'secondary'"
                      size="medium"
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
                          value="edit"
                          label="Edit"
                        >
                          <template #left>
                            <i
                              class="pi pi-pencil"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="duplicate"
                          label="Clone"
                        >
                          <template #left>
                            <i
                              class="pi pi-clone"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
                      </Dropdown.Group>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="delete"
                          label="Delete"
                        >
                          <template #left>
                            <i
                              class="pi pi-trash"
                              aria-hidden="true"
                            />
                          </template>
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

    <!-- Create flow — the whole form lives in ./AddVariableDrawer.vue: it can carry
         several variables at once (Add Another, or an imported `.env`), so it emits a
         LIST and the list appends them. -->
    <AddVariableDrawer
      v-model:open="drawerOpen"
      :existing-keys="existingKeys"
      @created="onCreated"
    />

    <!-- The phrase is the KEY, not a display name: it is what the row shows and what
         code reads, so it is the only string a reader can confirm against. -->
    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Variable"
      :name="pendingDelete?.key ?? ''"
      description="The selected Variable will be deleted, and anything reading it will stop receiving a value. Check the"
      @confirm="confirmDelete"
    />
  </AppLayout>
</template>

<script setup>
  // Custom Pages — the Azion Console "Custom Pages" module. The app shell (single sidebar +
  // GlobalHeader with the module breadcrumb) comes from AppLayout; this page renders
  // only its content, in the shape every module list takes (the webkit-lists skill):
  // a CONTROLS HEADER over a FILTER BAR over a data-driven <Table> in a flush CardBox.
  // As a first-level module list it carries no navigation tabs and no page heading —
  // the module name already IS the header breadcrumb crumb.
  //
  // A CUSTOM PAGE is what the edge serves instead of a default error body: which HTTP
  // statuses it covers, and where the content comes from. It is one of the three
  // things a Deployment setting binds, which is why it is a module and not a tab.
  //
  // Narrowing is the shared FILTER BAR of chips (ui/FilterBar.vue): the COLUMNS decide
  // the fields, the bar pre-filters `:data`, and the search field narrows what is left
  // through the table's own global filter.
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
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { createResourcePath, resourceSettingsPath } from '../lib/create-resources'
  import { CUSTOM_PAGES } from '../lib/custom-pages'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../lib/filter-bar'
  import { useListFilters } from '../lib/list-state'
  import { useSampleMode } from '../lib/sample-mode'
  import { tenancyRows } from '../lib/tenancy-scope'
  import { productFirstUse } from '../product-empty-states'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import DeleteDialog from './ui/DeleteDialog.vue'
  import FilterBar from './ui/FilterBar.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'
  import ProductFirstUse from './ui/ProductFirstUse.vue'

  // The sample's EMPTY version: this module before it owns anything. The same block the
  // /empty-states gallery reviews, rendered in the module's own page
  // (../lib/sample-mode.js, ./ui/ProductFirstUse.vue).
  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('custom-pages')

  // This page holds its own copy of the seed because it deletes rows; mutating the
  // shared array would leak that into every surface reading it.
  const pages = ref([...CUSTOM_PAGES])

  // A custom page belongs to one place in the tenancy chain, so the seed is projected
  // through the organization / account / workspace in force (src/lib/tenancy-scope.js).
  const scopedPages = computed(() => tenancyRows(pages.value, 'custom-pages'))

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'statusCodes', header: 'Status Codes', grow: 2 },
    { accessorKey: 'connector', header: 'Connector', enableSorting: true, grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── The filter catalog ────────────────────────────────────────────────────
  // Status and Connector are the enumerable columns. Status Codes is a LIST per
  // row, so it is a column but not a field: a field over it would ask “covers any of
  // these”, a different question from the membership every other field asks.
  const filterFields = [
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Draft', label: 'Draft' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      match: (page, values) => values.includes(page.status)
    },
    {
      id: 'connector',
      label: 'Connector',
      kind: 'options',
      options: [...new Set(CUSTOM_PAGES.map((page) => page.connector))]
        .sort((a, b) => a.localeCompare(b))
        .map((connector) => ({ value: connector, label: connector })),
      match: (page, values) => values.includes(page.connector)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (page, values) => matchDate(page.modifiedAt, values)
    }
  ]

  // Filter state, search value, surviving rows and their pagination — one place,
  // including the rewind that keeps a narrowed list off a page offset it no longer
  // has rows for (src/lib/list-state.js). `loading` is the tenancy reload window.
  const {
    filters,
    search,
    pagination,
    visibleRows: visiblePages,
    loading: tenancyReloading
  } = useListFilters(filterFields, scopedPages, { pageSize: 8 })

  // Creating: the module's own create page. Its fields come from this resource's
  // POST body in the Azion v4 API (../lib/create-resources.js), so the form asks for
  // what the platform actually takes. The email rides along the way every route in this
  // prototype carries it.
  const route = useRoute()
  const router = useRouter()

  const create = () =>
    router.push({
      path: createResourcePath('custom-pages'),
      query: { email: route.query.email || undefined }
    })

  // Deleting is the one row action here with no undo, so the menu click only ARMS it:
  // the row is held until the dialog has been given its name back.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    pages.value = pages.value.filter((item) => item.id !== row.id)
    toast.success(`${row.name} deleted.`)
    pendingDelete.value = null
  }

  const onRowAction = (event, action, row) => {
    // EDIT OPENS THE SETTINGS PAGE. It used to raise "edit is disabled in the demo", which
    // left a reader able to create a custom pages and unable to change one. The page is
    // generated from the same fields as the create page (../lib/create-resources.js via
    // ./ResourceSettings.vue), and the row hands over the name it already knows.
    if (action === 'edit') {
      router.push({
        path: resourceSettingsPath('custom-pages', row.id),
        query: { name: row.name, email: route.query.email || undefined }
      })
      return
    }
    if (action === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(row.name, { description: `${action} is disabled in the demo.` })
  }

  const statusSeverity = (status) =>
    ({ Active: 'success', Draft: 'info', Inactive: 'secondary' })[status] ?? 'secondary'
</script>

<template>
  <AppLayout
    active="custom-pages"
    :breadcrumb="[{ label: 'Custom Pages' }]"
  >
    <main
      class="flex min-h-full flex-col"
      :class="accountEmpty ? 'layout-column-focused' : 'layout-column'"
    >
      <!-- The page's parent section. A module list opens straight on it (no
           PageHeading — the module name is the breadcrumb crumb), so the
           `:first-child` rule zeroes its step and the boundary is its top space. -->
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
        class="my-auto flex w-full flex-col py-[var(--spacing-xl)]"
      >
        <ProductFirstUse :product="firstUse" />
      </div>

      <section
        v-else
        class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]"
      >
        <!-- ONE band: the controls, the filters and the rows they narrow. -->
        <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
          <ControlsHeader v-if="scopedPages.length">
            <InputText
              v-model="search"
              size="large"
              placeholder="Search custom pages..."
              aria-label="Search custom pages..."
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
                label="Custom Page"
                kind="primary"
                size="large"
                icon="pi pi-plus"
                @click="create"
              />
            </template>
          </ControlsHeader>

          <!-- The filter bar takes its own row: it grows as filters are applied, so
               sharing the controls row would make the search field jump width. -->
          <FilterBar
            v-if="scopedPages.length"
            v-model="filters"
            :fields="filterFields"
          />

          <!-- Empty = one clear next action; otherwise the borderless Table in a
               flush CardBox, framed edge-to-edge. -->
          <section
            v-if="!scopedPages.length"
            class="flex min-h-0 flex-1 items-center justify-center"
          >
            <CardBox class="w-full max-w-[var(--container-2xl)]">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No custom pages yet"
                  description="Create a custom page so an error or a maintenance window still looks like your product."
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
                          class="ai ai-custom-pages text-[1rem] leading-none text-[var(--text-default)]"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Custom Page"
                      kind="secondary"
                      size="large"
                      icon="pi pi-plus"
                      @click="create"
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
                  :data="visiblePages"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="tenancyReloading"
                >
                  <template #cell-statusCodes="{ row }">
                    <span class="flex min-w-0 flex-wrap items-center gap-[var(--spacing-xxs)]">
                      <Tag
                        v-for="code in row.statuses"
                        :key="code"
                        :label="String(code)"
                        severity="secondary"
                        size="small"
                      />
                    </span>
                  </template>

                  <template #cell-status="{ value }">
                    <Tag
                      :label="value"
                      :severity="statusSeverity(value)"
                      size="medium"
                    />
                  </template>

                  <template #cell-lastModified="{ row }">
                    <LastModifiedCell
                      :author="row.author"
                      :avatar-src="row.authorAvatar"
                      :date="row.modifiedAt"
                    />
                  </template>

                  <template #cell-actions="{ row }">
                    <Dropdown
                      placement="bottom-end"
                      @select="(event, action) => onRowAction(event, action, row)"
                    >
                      <Dropdown.Trigger>
                        <Tooltip text="Actions">
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
                          <template #left
                            ><i
                              class="pi pi-pencil"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="clone"
                          label="Clone"
                        >
                          <template #left
                            ><i
                              class="pi pi-clone"
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
        kind="Custom page"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </main>
  </AppLayout>
</template>

<script setup>
  // Functions — the Azion Console "Functions" module. The app shell (single sidebar +
  // GlobalHeader with the module breadcrumb) comes from AppLayout; this page renders
  // only its content, in the shape every module list takes (the webkit-lists skill):
  // a CONTROLS HEADER over a FILTER BAR over a data-driven <Table> in a flush CardBox.
  // As a first-level module list it carries no navigation tabs and no page heading —
  // the module name already IS the header breadcrumb crumb.
  //
  // A FUNCTION is the code itself, written once and instanced per application (an
  // application's Functions Instances tab binds one with its own arguments). So this
  // list is the library, not the bindings: a row is a function, its runtime and how
  // many instances currently run it.
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

  import { DATE_PRESETS, formatDateRange, matchDate } from '../lib/filter-bar'
  import { FUNCTIONS } from '../lib/functions'
  import { useListFilters } from '../lib/list-state'
  import { tenancyRows } from '../lib/tenancy-scope'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import FilterBar from './ui/FilterBar.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'

  // This page holds its own copy of the seed because it deletes rows; mutating the
  // shared array would leak that into every surface reading it.
  const functions = ref([...FUNCTIONS])

  // A function belongs to one place in the tenancy chain, so the seed is projected
  // through the organization / account / workspace in force (src/lib/tenancy-scope.js).
  const scopedFunctions = computed(() => tenancyRows(functions.value, 'functions'))

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'id', header: 'ID', enableSorting: true },
    { accessorKey: 'runtime', header: 'Runtime', enableSorting: true },
    { accessorKey: 'instances', header: 'Instances', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── The filter catalog ────────────────────────────────────────────────────
  // Runtime and Status are the enumerable columns; Instances is a magnitude, and
  // Name and ID are free text covered by the search field.
  const filterFields = [
    {
      id: 'runtime',
      label: 'Runtime',
      kind: 'options',
      options: [
        { value: 'JavaScript', label: 'JavaScript' },
        { value: 'WebAssembly', label: 'WebAssembly' }
      ],
      match: (fn, values) => values.includes(fn.runtime)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Draft', label: 'Draft' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      match: (fn, values) => values.includes(fn.status)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (fn, values) => matchDate(fn.modifiedAt, values)
    }
  ]

  // Filter state, search value, surviving rows and their pagination — one place,
  // including the rewind that keeps a narrowed list off a page offset it no longer
  // has rows for (src/lib/list-state.js). `loading` is the tenancy reload window.
  const {
    filters,
    search,
    pagination,
    visibleRows: visibleFunctions,
    loading: tenancyReloading
  } = useListFilters(filterFields, scopedFunctions, { pageSize: 8 })

  const create = () =>
    toast.info('Function', { description: 'Creating a function is disabled in the demo.' })

  const onRowAction = (event, action, row) => {
    if (action === 'delete') {
      functions.value = functions.value.filter((item) => item.id !== row.id)
      toast.success(`${row.name} deleted.`)
      return
    }
    toast.info(row.name, { description: `${action} is disabled in the demo.` })
  }

  const statusSeverity = (status) =>
    ({ Active: 'success', Draft: 'info', Inactive: 'secondary' })[status] ?? 'secondary'
</script>

<template>
  <AppLayout
    active="functions"
    :breadcrumb="[{ label: 'Functions' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <!-- The page's parent section. A module list opens straight on it (no
           PageHeading — the module name is the breadcrumb crumb), so the
           `:first-child` rule zeroes its step and the boundary is its top space. -->
      <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
        <!-- ONE band: the controls, the filters and the rows they narrow. -->
        <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
          <ControlsHeader v-if="scopedFunctions.length">
            <InputText
              v-model="search"
              size="large"
              placeholder="Search functions..."
              aria-label="Search functions..."
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
                label="Function"
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
            v-if="scopedFunctions.length"
            v-model="filters"
            :fields="filterFields"
          />

          <!-- Empty = one clear next action; otherwise the borderless Table in a
               flush CardBox, framed edge-to-edge. -->
          <section
            v-if="!scopedFunctions.length"
            class="flex min-h-0 flex-1 items-center justify-center"
          >
            <CardBox class="w-full max-w-[var(--container-2xl)]">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No functions yet"
                  description="Write your first function to run code at the edge, then instance it on an application."
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
                          class="ai ai-edge-functions text-[1rem] leading-none text-[var(--text-default)]"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Function"
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
                  :data="visibleFunctions"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="tenancyReloading"
                >
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
    </main>
  </AppLayout>
</template>

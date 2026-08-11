<script setup>
  // Connectors — the Azion Console "Connectors" module. The app shell (single sidebar +
  // GlobalHeader with the module breadcrumb) comes from AppLayout; this page renders
  // only its content, in the shape every module list takes (the webkit-lists skill):
  // a CONTROLS HEADER over a FILTER BAR over a data-driven <Table> in a flush CardBox.
  // As a first-level module list it carries no navigation tabs and no page heading —
  // the module name already IS the header breadcrumb crumb.
  //
  // A CONNECTOR is where an application fetches from when the edge does not already
  // hold the answer: an HTTP origin, a storage bucket, or a live-ingest endpoint. The
  // TYPE decides what the address means, so it leads the columns and the fields.
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

  import { connectorMeta, CONNECTORS, connectorTypeOptions } from '../lib/connectors'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../lib/filter-bar'
  import { useListFilters } from '../lib/list-state'
  import { tenancyRows } from '../lib/tenancy-scope'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import FilterBar from './ui/FilterBar.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'

  // This page holds its own copy of the seed because it deletes rows; mutating the
  // shared array would leak that into every surface reading it.
  const connectors = ref([...CONNECTORS])

  // A connector belongs to one place in the tenancy chain, so the seed is projected
  // through the organization / account / workspace in force (src/lib/tenancy-scope.js).
  const scopedConnectors = computed(() => tenancyRows(connectors.value, 'connectors'))

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'typeLabel', header: 'Type', enableSorting: true },
    { accessorKey: 'address', header: 'Address', grow: 3 },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── The filter catalog ────────────────────────────────────────────────────
  // Type and Status are the enumerable columns; Name and Address are free text,
  // covered by the search field. The type options come from the same map the cell
  // renders its glyph from (src/lib/connectors.js), so the two cannot disagree.
  const filterFields = [
    {
      id: 'type',
      label: 'Type',
      kind: 'options',
      options: connectorTypeOptions,
      match: (connector, values) => values.includes(connector.type)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      match: (connector, values) => values.includes(connector.status)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (connector, values) => matchDate(connector.modifiedAt, values)
    }
  ]

  // Filter state, search value, surviving rows and their pagination — one place,
  // including the rewind that keeps a narrowed list off a page offset it no longer
  // has rows for (src/lib/list-state.js). `loading` is the tenancy reload window.
  const {
    filters,
    search,
    pagination,
    visibleRows: visibleConnectors,
    loading: tenancyReloading
  } = useListFilters(filterFields, scopedConnectors, { pageSize: 8 })

  const create = () =>
    toast.info('Connector', { description: 'Creating a connector is disabled in the demo.' })

  const onRowAction = (event, action, row) => {
    if (action === 'delete') {
      connectors.value = connectors.value.filter((item) => item.id !== row.id)
      toast.success(`${row.name} deleted.`)
      return
    }
    toast.info(row.name, { description: `${action} is disabled in the demo.` })
  }

  const statusSeverity = (status) =>
    ({ Active: 'success', Inactive: 'secondary' })[status] ?? 'secondary'
</script>

<template>
  <AppLayout
    active="connectors"
    :breadcrumb="[{ label: 'Connectors' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <!-- The page's parent section. A module list opens straight on it (no
           PageHeading — the module name is the breadcrumb crumb), so the
           `:first-child` rule zeroes its step and the boundary is its top space. -->
      <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
        <!-- ONE band: the controls, the filters and the rows they narrow. -->
        <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
          <ControlsHeader v-if="scopedConnectors.length">
            <InputText
              v-model="search"
              size="large"
              placeholder="Search connectors..."
              aria-label="Search connectors..."
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
                label="Connector"
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
            v-if="scopedConnectors.length"
            v-model="filters"
            :fields="filterFields"
          />

          <!-- Empty = one clear next action; otherwise the borderless Table in a
               flush CardBox, framed edge-to-edge. -->
          <section
            v-if="!scopedConnectors.length"
            class="flex min-h-0 flex-1 items-center justify-center"
          >
            <CardBox class="w-full max-w-[var(--container-2xl)]">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No connectors yet"
                  description="Add a connector so your applications have somewhere to fetch from on a cache miss."
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
                          class="ai ai-edge-connectors text-[1rem] leading-none text-[var(--text-default)]"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Connector"
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
                  :data="visibleConnectors"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="tenancyReloading"
                >
                  <template #cell-typeLabel="{ row, value }">
                    <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                      <i
                        :class="connectorMeta(row.type).icon"
                        class="shrink-0 text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                      <span class="truncate">{{ value }}</span>
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
    </main>
  </AppLayout>
</template>

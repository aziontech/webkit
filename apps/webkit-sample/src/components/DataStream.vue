<script setup>
  // Data Stream — the Azion Console "Data Stream" module. The app shell (single sidebar +
  // GlobalHeader with the module breadcrumb) comes from AppLayout; this page renders
  // only its content, in the shape every module list takes (the webkit-lists skill):
  // a CONTROLS HEADER over a FILTER BAR over a data-driven <Table> in a flush CardBox.
  // As a first-level module list it carries no navigation tabs and no page heading —
  // the module name already IS the header breadcrumb crumb.
  //
  // A DATA STREAM ships one SOURCE of events (HTTP requests, WAF events, function
  // invocations…) to one ENDPOINT (an S3 bucket, a Kafka topic, an HTTP collector).
  // Both are what people narrow by — which streams feed Datadog, who is still
  // shipping WAF events — so both become fields.
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

  import { DATA_STREAMS, streamEndpointOptions, streamSourceOptions } from '../lib/data-streams'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../lib/filter-bar'
  import { useListFilters } from '../lib/list-state'
  import { tenancyRows } from '../lib/tenancy-scope'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import FilterBar from './ui/FilterBar.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'

  // This page holds its own copy of the seed because it deletes rows; mutating the
  // shared array would leak that into every surface reading it.
  const streams = ref([...DATA_STREAMS])

  // A data stream belongs to one place in the tenancy chain, so the seed is projected
  // through the organization / account / workspace in force (src/lib/tenancy-scope.js).
  const scopedStreams = computed(() => tenancyRows(streams.value, 'data-stream'))

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true },
    { accessorKey: 'sourceLabel', header: 'Source', enableSorting: true, grow: 2 },
    { accessorKey: 'endpointLabel', header: 'Endpoint', enableSorting: true, grow: 2 },
    { accessorKey: 'samplingLabel', header: 'Sampling' },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── The filter catalog ────────────────────────────────────────────────────
  // Source, Endpoint and Status are the enumerable columns; Sampling is a
  // percentage and Name is free text, covered by the search field.
  const filterFields = [
    {
      id: 'source',
      label: 'Source',
      kind: 'options',
      options: streamSourceOptions,
      match: (stream, values) => values.includes(stream.source)
    },
    {
      id: 'endpoint',
      label: 'Endpoint',
      kind: 'options',
      options: streamEndpointOptions,
      match: (stream, values) => values.includes(stream.endpoint)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      match: (stream, values) => values.includes(stream.status)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (stream, values) => matchDate(stream.modifiedAt, values)
    }
  ]

  // Filter state, search value, surviving rows and their pagination — one place,
  // including the rewind that keeps a narrowed list off a page offset it no longer
  // has rows for (src/lib/list-state.js). `loading` is the tenancy reload window.
  const {
    filters,
    search,
    pagination,
    visibleRows: visibleStreams,
    loading: tenancyReloading
  } = useListFilters(filterFields, scopedStreams, { pageSize: 8 })

  const create = () =>
    toast.info('Data Stream', { description: 'Creating a data stream is disabled in the demo.' })

  const onRowAction = (event, action, row) => {
    if (action === 'delete') {
      streams.value = streams.value.filter((item) => item.id !== row.id)
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
    active="data-stream"
    :breadcrumb="[{ label: 'Data Stream' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <!-- The page's parent section. A module list opens straight on it (no
           PageHeading — the module name is the breadcrumb crumb), so the
           `:first-child` rule zeroes its step and the boundary is its top space. -->
      <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
        <!-- ONE band: the controls, the filters and the rows they narrow. -->
        <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
          <ControlsHeader v-if="scopedStreams.length">
            <InputText
              v-model="search"
              size="large"
              placeholder="Search data streams..."
              aria-label="Search data streams..."
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
                label="Data Stream"
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
            v-if="scopedStreams.length"
            v-model="filters"
            :fields="filterFields"
          />

          <!-- Empty = one clear next action; otherwise the borderless Table in a
               flush CardBox, framed edge-to-edge. -->
          <section
            v-if="!scopedStreams.length"
            class="flex min-h-0 flex-1 items-center justify-center"
          >
            <CardBox class="w-full max-w-[var(--container-2xl)]">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No data streams yet"
                  description="Create a stream to ship edge events to your own observability or storage platform."
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
                          class="ai ai-data-stream text-[1rem] leading-none text-[var(--text-default)]"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Data Stream"
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
                  :data="visibleStreams"
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

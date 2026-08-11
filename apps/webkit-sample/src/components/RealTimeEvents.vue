<script setup>
  // Real-Time Events — the Azion Console "Real-Time Events" module. The app shell
  // (single sidebar + GlobalHeader with the module breadcrumb) comes from AppLayout;
  // this page renders only its content, in the shape every module list takes (the
  // webkit-lists skill): a CONTROLS HEADER over a FILTER BAR over a data-driven
  // <Table> in a flush CardBox.
  //
  // It is the one list in the console read newest-first and in a WINDOW: nobody
  // browses the whole event log, they look at the last hour of one source. Three
  // things follow from that, and they are the only ways this page differs from every
  // other module list:
  //
  //   THE PERIOD FIELD IS SHORT. 15 minutes to 24 hours, not 7 days to 3 months. A
  //     week of edge events is not a list, it is a query — that is Real-Time Metrics.
  //   THERE IS NO CREATE ACTION. Events are emitted, not authored; the controls row's
  //     action is Refresh, the only thing a reader of a live log actually wants.
  //   THERE ARE NO ROW ACTIONS. An event is a fact — it cannot be edited, cloned or
  //     deleted — so the trailing action column every other list carries is absent
  //     rather than present-and-inert.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'

  import { useListFilters } from '../lib/list-state'
  import {
    EVENT_PERIODS,
    eventLevelOptions,
    eventLevelSeverity,
    eventSourceOptions,
    matchPeriod,
    REAL_TIME_EVENTS
  } from '../lib/real-time-events'
  import { tenancyRows } from '../lib/tenancy-scope'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import FilterBar from './ui/FilterBar.vue'

  const events = ref([...REAL_TIME_EVENTS])

  // Events belong to the scope that produced them, so the seed is projected through
  // the organization / account / workspace in force (src/lib/tenancy-scope.js).
  const scopedEvents = computed(() => tenancyRows(events.value, 'real-time-events'))

  const columns = [
    { accessorKey: 'time', header: 'Time', enableSorting: true, grow: 2 },
    { accessorKey: 'level', header: 'Level', enableSorting: true },
    { accessorKey: 'sourceLabel', header: 'Source', enableSorting: true },
    { accessorKey: 'message', header: 'Event', principal: true, grow: 4 },
    { accessorKey: 'host', header: 'Host', grow: 2 },
    { accessorKey: 'ip', header: 'IP Address' }
  ]

  // ── The filter catalog ────────────────────────────────────────────────────
  // Period leads, because "when" is the first thing asked of a log and the other two
  // fields only make sense inside a window. Source and Level are the enumerable
  // columns; Event, Host and IP Address are free text, covered by the search field.
  const filterFields = [
    {
      id: 'period',
      label: 'Period',
      kind: 'range',
      options: EVENT_PERIODS,
      match: (event, values) => matchPeriod(event.at, values)
    },
    {
      id: 'source',
      label: 'Source',
      kind: 'options',
      options: eventSourceOptions,
      match: (event, values) => values.includes(event.source)
    },
    {
      id: 'level',
      label: 'Level',
      kind: 'options',
      options: eventLevelOptions,
      match: (event, values) => values.includes(event.level)
    }
  ]

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleEvents,
    loading: tenancyReloading
  } = useListFilters(filterFields, scopedEvents, { pageSize: 10 })

  const refresh = () =>
    toast.info('Events refreshed.', { description: 'Live streaming is disabled in the demo.' })
</script>

<template>
  <AppLayout
    active="real-time-events"
    :breadcrumb="[{ label: 'Real-Time Events' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <!-- The page's parent section. A module list opens straight on it (no
           PageHeading — the module name is the breadcrumb crumb), so the
           `:first-child` rule zeroes its step and the boundary is its top space. -->
      <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
        <!-- ONE band: the controls, the filters and the rows they narrow. -->
        <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
          <ControlsHeader>
            <InputText
              v-model="search"
              size="large"
              placeholder="Search events..."
              aria-label="Search events"
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
              <!-- Refresh, not Create: events are emitted, not authored. -->
              <Button
                label="Refresh"
                kind="outlined"
                size="large"
                icon="pi pi-refresh"
                @click="refresh"
              />
            </template>
          </ControlsHeader>

          <!-- The filter bar takes its own row: it grows as filters are applied, so
               sharing the controls row would make the search field jump width. -->
          <FilterBar
            v-model="filters"
            :fields="filterFields"
          />

          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <Table
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  :data="visibleEvents"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="10"
                  :border="false"
                  :loading="tenancyReloading"
                >
                  <template #cell-level="{ value }">
                    <Tag
                      :label="value"
                      :severity="eventLevelSeverity(value)"
                      size="medium"
                    />
                  </template>

                  <!-- A window that matches nothing is the normal state of a live log,
                       not a failure — so it says what to widen rather than offering a
                       create action the module does not have. -->
                  <template #empty>
                    <EmptyState
                      size="small"
                      icon="pi pi-filter-slash"
                      title="No events in this window"
                      description="Widen the period or clear a filter to see more of the log."
                    />
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

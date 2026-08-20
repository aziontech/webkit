<script setup>
  // Real-Time Metrics — the Azion Console "Real-Time Metrics" module. Not a list: there is no row to
  // open, no create action, nothing to select. It answers "how is it going" with a
  // metric strip and a panel per series, over a WINDOW.
  //
  // Traffic as the EDGE saw it: requests, bytes, how much never reached your
  // origin, and how much failed. The counterpart to Edge Pulse, which measures the
  // same delivery from the browser's side.
  //
  // That window is the one control it shares with every list in the console, and
  // deliberately the same one: the Filter button (list/FilterButton.vue) holding a single
  // `kind: 'range'` field, so picking a period here is the same gesture as picking a
  // status anywhere else. It narrows nothing locally — the fixture reshapes per
  // period instead (src/lib/observability.js) — so it is bound directly rather
  // than through useListFilters, which exists to filter ROWS.
  import CardBox from '@aziontech/webkit/card-box'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import MetricPanel from '../../components/observability/MetricPanel.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import {
    DEFAULT_PERIOD,
    METRIC_PERIODS,
    metricsFor,
    periodLabel
  } from '../../lib/data/observability'

  // Seeded with the default window rather than empty: a dashboard that opens on "pick
  // a period" shows nothing at the moment it is most likely to be glanced at.
  const filters = ref({ period: [DEFAULT_PERIOD] })

  const filterFields = [
    {
      id: 'period',
      label: 'Period',
      kind: 'range',
      options: METRIC_PERIODS,
      // Never called: the field re-queries rather than narrowing rows in place. The
      // catalog still declares it, because a field without a `match` is a field the
      // next reader has to check twice.
      match: () => true
    }
  ]

  const period = computed(() => filters.value.period?.[0] ?? DEFAULT_PERIOD)
  const windowLabel = computed(() => periodLabel(period.value))
  const data = computed(() => metricsFor(period.value))
</script>

<template>
  <AppLayout
    active="real-time-metrics"
    :breadcrumb="[{ label: 'Real-Time Metrics' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <!-- ONE band: the window control, the strip it re-queries, and the panels. -->
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <!-- No ControlsHeader: there is no search (nothing to search) and no create
               action, so that row would be an empty container around one button. The
               filter is here all the same — the window control is a filter like any
               other, and it reads the same on this page as on every list. -->
          <FilterButton
            v-model="filters"
            :fields="filterFields"
          />
          <FilterChips
            v-model="filters"
            :fields="filterFields"
          />

          <!-- The strip: the four numbers worth reading before any chart. -->
          <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4">
            <li
              v-for="metric in data.strip"
              :key="metric.label"
              class="flex"
            >
              <CardBox class="w-full">
                <template #content>
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <Tooltip :text="metric.hint">
                      <span class="min-w-0 truncate text-body-sm text-(--text-muted)">
                        {{ metric.label }}
                      </span>
                    </Tooltip>
                    <p class="flex items-baseline gap-(--spacing-xxs)">
                      <span class="text-heading-lg text-(--text-default)">
                        {{ metric.value }}
                      </span>
                      <span
                        v-if="metric.unit"
                        class="text-body-md text-(--text-muted)"
                        >{{ metric.unit }}</span
                      >
                    </p>
                  </div>
                </template>
              </CardBox>
            </li>
          </ul>

          <!-- The panels. Two up from `md`, so a series keeps enough width to read as
               a shape rather than a spike. -->
          <div class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-2">
            <MetricPanel
              v-for="panel in data.panels"
              :key="panel.title"
              :title="panel.title"
              :unit="panel.unit"
              :period="windowLabel"
              :series="panel.series"
            />
          </div>
        </section>
      </section>
    </main>
  </AppLayout>
</template>

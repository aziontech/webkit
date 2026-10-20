<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'

  import FilterButton from '@shared/ui/filter/FilterButton.vue'
  import FilterChips from '@shared/ui/filter/FilterChips.vue'
  import MetricPanel from '../../components/observability/MetricPanel.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import {
    DEFAULT_PERIOD,
    METRIC_DASHBOARDS,
    METRIC_PERIODS,
    metricsFor,
    periodLabel
  } from '../../lib/data/observability'

  const route = useRoute()

  const dashboard = computed(
    () => METRIC_DASHBOARDS.find((entry) => entry.id === route.query.dashboard) ?? null
  )

  const activeId = computed(() =>
    dashboard.value ? `rtm-${dashboard.value.id}` : 'real-time-metrics'
  )

  const heading = computed(() => dashboard.value?.label ?? 'Real-Time Metrics')

  const description = computed(
    () =>
      dashboard.value?.description ??
      'Traffic as the edge served it — requests, data transferred and errors, for the selected period.'
  )

  const crumbs = computed(() =>
    dashboard.value
      ? [
          { label: 'Real-Time Metrics', href: '/real-time-metrics' },
          { label: dashboard.value.label }
        ]
      : [{ label: 'Real-Time Metrics' }]
  )

  const filters = ref({ period: [DEFAULT_PERIOD] })

  const filterFields = [
    {
      id: 'period',
      label: 'Period',
      kind: 'range',
      options: METRIC_PERIODS,
      match: () => true
    }
  ]

  const period = computed(() => filters.value.period?.[0] ?? DEFAULT_PERIOD)
  const windowLabel = computed(() => periodLabel(period.value))
  const data = computed(() => metricsFor(period.value))
</script>

<template>
  <AppLayout
    :active="activeId"
    :breadcrumb="crumbs"
  >
    <main class="layout-column flex min-h-full flex-col">
      <PageHeading
        size="medium"
        :title="heading"
        :description="description"
      />

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <FilterButton
            v-model="filters"
            :fields="filterFields"
          />
          <FilterChips
            v-model="filters"
            :fields="filterFields"
          />

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

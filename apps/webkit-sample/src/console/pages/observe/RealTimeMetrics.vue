<script setup>
  import Hint from '@aziontech/webkit/hint'
  import Link from '@aziontech/webkit/link'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { computed, onScopeDispose, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import MetricReportCard from '../../components/observability/MetricReportCard.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import {
    comparisonLabel,
    resolveReport,
    resolveSummary,
    RTM_DEFAULT_PERIOD,
    RTM_HIGHLIGHTS,
    RTM_PERIODS,
    RTM_SUMMARY,
    rtmPage
  } from '../../lib/data/real-time-metrics'
  import { useSampleMode } from '../../lib/state/sample-mode'

  const route = useRoute()
  const router = useRouter()
  const { accountEmpty } = useSampleMode()

  const page = computed(() => rtmPage(route.query.dashboard))

  const dashboardOptions = computed(
    () => page.value?.dashboards.map(({ id, label }) => ({ label, value: id })) ?? []
  )

  const dashboard = computed(
    () =>
      page.value?.dashboards.find((entry) => entry.id === route.query.view) ??
      page.value?.dashboards[0] ??
      null
  )

  const dashboardId = computed({
    get: () => dashboard.value?.id ?? '',
    set: (view) => router.replace({ query: { ...route.query, view } })
  })

  const activeId = computed(() => (page.value ? `rtm-${page.value.id}` : 'real-time-metrics'))

  const heading = computed(() => page.value?.label ?? 'Real-Time Metrics')

  const description = computed(
    () =>
      page.value?.description ?? 'Operational metrics from every Azion product, in near real time.'
  )

  const crumbs = computed(() =>
    page.value
      ? [{ label: 'Real-Time Metrics', href: '/real-time-metrics' }, { label: page.value.label }]
      : [{ label: 'Real-Time Metrics' }]
  )

  const filters = ref({ period: [RTM_DEFAULT_PERIOD] })

  const filterFields = [
    {
      id: 'period',
      label: 'Period',
      kind: 'range',
      options: RTM_PERIODS,
      match: () => true
    }
  ]

  const period = computed(() => filters.value.period?.[0] ?? RTM_DEFAULT_PERIOD)
  const comparison = computed(() => comparisonLabel(period.value))

  const loading = ref(true)
  const refetching = ref(false)
  const activeIndex = ref(null)
  let timer = null

  const settle = (state, delay) => {
    globalThis.clearTimeout(timer)
    state.value = true
    timer = globalThis.setTimeout(() => {
      state.value = false
    }, delay)
  }

  settle(loading, 700)

  watch([() => route.query.dashboard, () => dashboard.value?.id], () => {
    activeIndex.value = null
    settle(loading, 500)
  })

  watch(period, () => {
    activeIndex.value = null
    settle(refetching, 600)
  })

  onScopeDispose(() => globalThis.clearTimeout(timer))

  const refresh = () => settle(refetching, 600)

  const resolve = (report, dataset) =>
    resolveReport({ ...report, dataset }, period.value, { empty: accountEmpty.value })

  const reports = computed(() =>
    (dashboard.value?.reports ?? []).map((report) => resolve(report, dashboard.value.dataset))
  )

  const figures = computed(() => reports.value.filter((report) => report.type === 'big-numbers'))
  const panels = computed(() => reports.value.filter((report) => report.type !== 'big-numbers'))

  const summary = computed(() =>
    RTM_SUMMARY.map((entry) => resolveSummary(entry, period.value, { empty: accountEmpty.value }))
  )

  const highlights = computed(() =>
    RTM_HIGHLIGHTS.map((entry) => ({
      ...entry,
      pageLabel: rtmPage(entry.page)?.label ?? '',
      report: resolve(entry.source, entry.source.dataset)
    }))
  )

  const dashboardRoute = (pageId, view) => ({
    path: '/real-time-metrics',
    query: { dashboard: pageId, view }
  })

  const openDashboard = (event, pageId, view) => {
    event.preventDefault()
    router.push(dashboardRoute(pageId, view))
  }
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
          <ControlsHeader>
            <SegmentedButton
              v-if="dashboardOptions.length > 1"
              v-model="dashboardId"
              :options="dashboardOptions"
              size="medium"
              :aria-label="`${heading} dashboards`"
            />
            <FilterButton
              v-model="filters"
              :fields="filterFields"
              size="medium"
            />

            <template #actions>
              <RefreshButton
                :loading="refetching"
                @refresh="refresh"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-model="filters"
            :fields="filterFields"
          />

          <template v-if="page">
            <ul
              v-if="figures.length"
              class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4"
            >
              <li
                v-for="figure in figures"
                :key="figure.id"
                class="flex min-w-0 flex-col"
              >
                <StatTile
                  :label="figure.label"
                  :value="figure.value"
                  :format-value="figure.format"
                  :delta="accountEmpty ? null : figure.delta"
                  :delta-label="comparison"
                  :inverse="figure.variation === 'inverse'"
                  :trend="figure.trend"
                  :loading="loading"
                >
                  <template #aside>
                    <Hint :text="figure.description" />
                  </template>
                </StatTile>
              </li>
            </ul>

            <div
              class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
            >
              <MetricReportCard
                v-for="report in panels"
                :key="`${dashboard.id}:${report.id}`"
                v-model:active-index="activeIndex"
                :report="report"
                :empty="accountEmpty"
                :loading="loading"
                :refetching="refetching"
              />
            </div>
          </template>

          <template v-else>
            <ul
              class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6"
            >
              <li
                v-for="tile in summary"
                :key="tile.id"
                class="flex min-w-0 flex-col"
              >
                <StatTile
                  :label="tile.label"
                  :value="tile.value"
                  :format-value="tile.format"
                  :delta="accountEmpty ? null : tile.delta"
                  :delta-label="comparison"
                  :inverse="tile.variation === 'inverse'"
                  :trend="tile.trend"
                  :loading="loading"
                />
              </li>
            </ul>

            <div
              class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
            >
              <MetricReportCard
                v-for="highlight in highlights"
                :key="highlight.report.id"
                v-model:active-index="activeIndex"
                :report="highlight.report"
                :empty="accountEmpty"
                :loading="loading"
                :refetching="refetching"
              >
                <template #footer>
                  <Link
                    :label="`Open ${highlight.pageLabel} dashboard`"
                    size="medium"
                    :show-icon="false"
                    :href="router.resolve(dashboardRoute(highlight.page, highlight.dashboard)).href"
                    @click="(event) => openDashboard(event, highlight.page, highlight.dashboard)"
                  />
                </template>
              </MetricReportCard>
            </div>
          </template>
        </section>
      </section>
    </main>
  </AppLayout>
</template>

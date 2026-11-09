<script setup>
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, onScopeDispose, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import EdgeHealthDashboard from '../../components/dashboards/EdgeHealthDashboard.vue'
  import ThreatDashboard from '../../components/dashboards/ThreatDashboard.vue'
  import TrafficDashboard from '../../components/dashboards/TrafficDashboard.vue'
  import UsageDashboard from '../../components/dashboards/UsageDashboard.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { comparisonLabel, RTM_DEFAULT_PERIOD, RTM_PERIODS } from '../../lib/data/real-time-metrics'
  import { useSampleMode } from '../../lib/state/sample-mode'

  const VIEWS = [
    { label: 'Traffic', value: 'traffic', component: TrafficDashboard },
    { label: 'Usage', value: 'usage', component: UsageDashboard },
    { label: 'Edge health', value: 'health', component: EdgeHealthDashboard },
    { label: 'Threats', value: 'threats', component: ThreatDashboard }
  ]

  const route = useRoute()
  const router = useRouter()
  const { accountEmpty } = useSampleMode()

  const view = computed({
    get: () => VIEWS.find((entry) => entry.value === route.query.view)?.value ?? VIEWS[0].value,
    set: (next) => router.replace({ query: { ...route.query, view: next } })
  })

  const active = computed(() => VIEWS.find((entry) => entry.value === view.value) ?? VIEWS[0])

  const viewOptions = VIEWS.map(({ label, value }) => ({ label, value }))

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
  let timer = null

  const settle = (state, delay) => {
    globalThis.clearTimeout(timer)
    state.value = true
    timer = globalThis.setTimeout(() => {
      state.value = false
    }, delay)
  }

  settle(loading, 700)

  watch(view, () => settle(loading, 500))
  watch(period, () => settle(refetching, 600))

  onScopeDispose(() => globalThis.clearTimeout(timer))

  const refresh = () => settle(refetching, 600)
</script>

<template>
  <AppLayout
    active="dashboards"
    :breadcrumb="[{ label: 'Dashboards' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <PageHeading
        size="medium"
        title="Dashboards"
        description="Traffic, usage, health and threats across every workload, in one place."
      />

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader>
            <div class="flex min-w-0 grow flex-wrap items-center gap-(--spacing-xs)">
              <SegmentedButton
                v-model="view"
                :options="viewOptions"
                size="medium"
                aria-label="Dashboard"
              />
              <FilterButton
                v-model="filters"
                :fields="filterFields"
                size="medium"
              />
              <div class="ml-auto flex shrink-0 items-center">
                <RefreshButton
                  :loading="refetching"
                  @refresh="refresh"
                />
              </div>
            </div>
          </ControlsHeader>

          <FilterChips
            v-model="filters"
            :fields="filterFields"
          />

          <div :key="active.value">
            <component
              :is="active.component"
              :period="period"
              :comparison="comparison"
              :loading="loading"
              :refetching="refetching"
              :empty="accountEmpty"
            />
          </div>
        </section>
      </section>
    </main>
  </AppLayout>
</template>

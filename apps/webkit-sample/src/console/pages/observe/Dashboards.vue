<script setup>
  import Select from '@aziontech/webkit/select'
  import { computed, onScopeDispose, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ActivityOutcomesDashboard from '../../components/dashboards/ActivityOutcomesDashboard.vue'
  import CustomDashboard from '../../components/dashboards/CustomDashboard.vue'
  import EdgeHealthDashboard from '../../components/dashboards/EdgeHealthDashboard.vue'
  import ExecutiveSummaryDashboard from '../../components/dashboards/ExecutiveSummaryDashboard.vue'
  import FunnelDashboard from '../../components/dashboards/FunnelDashboard.vue'
  import HealthScoreDashboard from '../../components/dashboards/HealthScoreDashboard.vue'
  import ProjectStatusDashboard from '../../components/dashboards/ProjectStatusDashboard.vue'
  import ScanResultsDashboard from '../../components/dashboards/ScanResultsDashboard.vue'
  import SpendDashboard from '../../components/dashboards/SpendDashboard.vue'
  import ThreatDashboard from '../../components/dashboards/ThreatDashboard.vue'
  import TrafficDashboard from '../../components/dashboards/TrafficDashboard.vue'
  import UsageDashboard from '../../components/dashboards/UsageDashboard.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import {
    comparisonLabel,
    RTM_DEFAULT_PERIOD,
    RTM_PERIODS
  } from '../../lib/data/real-time-metrics'
  import { useSampleMode } from '../../lib/state/sample-mode'

  const VIEW_GROUPS = [
    {
      label: 'Platform',
      views: [
        { label: 'Traffic', value: 'traffic', component: TrafficDashboard },
        { label: 'Usage', value: 'usage', component: UsageDashboard },
        { label: 'Edge health', value: 'health', component: EdgeHealthDashboard },
        { label: 'Health score', value: 'score', component: HealthScoreDashboard }
      ]
    },
    {
      label: 'Security',
      views: [
        { label: 'Threats', value: 'threats', component: ThreatDashboard },
        { label: 'Activity outcomes', value: 'activity', component: ActivityOutcomesDashboard },
        { label: 'Scan results', value: 'scans', component: ScanResultsDashboard }
      ]
    },
    {
      label: 'Business',
      views: [
        {
          label: 'Executive summary',
          value: 'summary',
          component: ExecutiveSummaryDashboard,
          ownPeriod: true
        },
        { label: 'Spend', value: 'spend', component: SpendDashboard, ownPeriod: true },
        { label: 'Funnel and cohorts', value: 'funnel', component: FunnelDashboard },
        {
          label: 'Project status',
          value: 'project',
          component: ProjectStatusDashboard,
          ownPeriod: true
        }
      ]
    },
    {
      label: 'Yours',
      views: [{ label: 'Custom', value: 'custom', component: CustomDashboard }]
    }
  ]

  const VIEWS = VIEW_GROUPS.flatMap((group) => group.views)

  const route = useRoute()
  const router = useRouter()
  const { accountEmpty } = useSampleMode()

  const view = computed({
    get: () => VIEWS.find((entry) => entry.value === route.query.view)?.value ?? VIEWS[0].value,
    set: (next) => router.replace({ query: { ...route.query, view: next } })
  })

  const active = computed(() => VIEWS.find((entry) => entry.value === view.value) ?? VIEWS[0])

  const viewLabel = (value) => VIEWS.find((entry) => entry.value === value)?.label ?? ''

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
        description="Traffic, security and business views across every workload, plus a layout of your own."
      />

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader>
            <div class="flex min-w-0 grow flex-wrap items-center gap-(--spacing-xs)">
              <div class="w-full min-w-0 sm:w-(--container-3xs)">
                <Select
                  v-model="view"
                  size="medium"
                  :display-value="viewLabel"
                >
                  <Select.Trigger aria-label="Dashboard">
                    <template #iconLeft>
                      <i
                        class="pi pi-chart-bar text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </template>
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group
                      v-for="group in VIEW_GROUPS"
                      :key="group.label"
                      :label="group.label"
                    >
                      <Select.Option
                        v-for="option in group.views"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Group>
                  </Select.Content>
                </Select>
              </div>
              <FilterButton
                v-if="!active.ownPeriod"
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
            v-if="!active.ownPeriod"
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

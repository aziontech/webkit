<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import { computed } from 'vue'

  import { homeMetricDefinitions } from './home-metrics'
  import HomeFirstAccess from './parts/home-first-access.vue'
  import HomePanels from './parts/home-panels.vue'
  import HomeUsageBand from './parts/home-usage-band.vue'
  import {
    sampleDomains,
    sampleMetrics,
    sampleProjects,
    sampleRecents,
    sampleResources,
    sampleUserName
  } from './sample'

  /** The four tiles of the usage band, in the order they render. */
  export type HomeDashboardMetricId =
    'data-transferred' | 'requests-per-second' | 'bandwidth-saving' | 'data-offload'

  /** The measured part of one usage tile. */
  export interface HomeDashboardMetric {
    /** The figure in the tile's unit; null reads as a dash. */
    value: number | null
    /** Change against the previous window, in percent; null hides the delta. */
    delta: number | null
  }

  /** The usage figures by tile; a tile left out reads as a dash. */
  export type HomeDashboardMetrics = Partial<Record<HomeDashboardMetricId, HomeDashboardMetric>>

  /** One row of a resource panel. */
  export interface HomeDashboardResource {
    /** Stable key. */
    id: string
    /** Display name. */
    name: string
    /** The resource page the whole row links to. */
    href: string
    /** The kind of resource, shown before the name in Recents. */
    typeLabel?: string
    /** Icon class of the project preset, shown before the name in Projects. */
    presetIcon?: string
    /** Name of the project preset, the icon's title. */
    presetLabel?: string
  }

  /** The availability answer for a domain the reader typed. */
  export interface HomeDashboardDomainAvailability {
    /** The domain the answer is for. */
    name: string
    /** True when the domain is taken. */
    registered: boolean
  }

  export interface HomeDashboardProps {
    /** First name in the greeting. Left out, the sample name renders. */
    userName?: string
    /** Time-of-day greeting before the name. */
    greeting?: string
    /** The usage band figures. Left out, the sample renders. */
    metrics?: HomeDashboardMetrics
    /** What every usage delta compares against, read beside it. */
    comparison?: string
    /** Rows of the Projects panel. */
    projects?: HomeDashboardResource[]
    /** Rows of the Resources panel. */
    resources?: HomeDashboardResource[]
    /** Rows of the Domains panel. */
    domains?: HomeDashboardResource[]
    /** Rows of the Recents panel, most recent first. */
    recents?: HomeDashboardResource[]
    /** Answer to the last check-domain event; the first-access screen shows it once its name matches the field. */
    domainAvailability?: HomeDashboardDomainAvailability
    /** Home's data is loading; the tiles and the panels hold a skeleton. */
    loading?: boolean
    /** Why Home's data could not load; the usage band and every panel show it in a danger alert with Retry. */
    error?: string
  }

  const props = withDefaults(defineProps<HomeDashboardProps>(), {
    userName: undefined,
    greeting: 'Good morning',
    metrics: undefined,
    comparison: 'vs previous 24 hours',
    projects: undefined,
    resources: undefined,
    domains: undefined,
    recents: undefined,
    domainAvailability: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    'create-project': [event: MouseEvent]
    'check-domain': [name: string]
    'register-domain': [event: MouseEvent, name: string]
    'copy-prompt': [event: MouseEvent]
  }>()

  const agentSetup = defineModel<boolean>('agentSetup', { default: true })

  type PanelKey = 'projects' | 'resources' | 'domains' | 'recents'

  const panelDefinitions: {
    key: PanelKey
    label: string
    path: string
    recent: boolean
    marked: boolean
  }[] = [
    { key: 'projects', label: 'Projects', path: '/projects', recent: false, marked: true },
    { key: 'resources', label: 'Resources', path: '/resources', recent: false, marked: false },
    { key: 'domains', label: 'Domains', path: '', recent: false, marked: false },
    { key: 'recents', label: 'Recents', path: '', recent: true, marked: false }
  ]

  const failed = computed(() => props.error !== '')
  const blank = computed(() => props.loading || failed.value)
  const fallback = <T,>(value: T | undefined, sample: T, empty: T): T =>
    value ?? (blank.value ? empty : sample)

  const name = computed(() => props.userName ?? sampleUserName)
  const metricValues = computed(() => fallback(props.metrics, sampleMetrics, {}))
  const tiles = computed(() =>
    homeMetricDefinitions.map((definition) => ({
      ...definition,
      ...(metricValues.value[definition.id] ?? { value: null, delta: null })
    }))
  )

  const lists = computed<Record<PanelKey, HomeDashboardResource[]>>(() => ({
    projects: fallback(props.projects, sampleProjects, []),
    resources: fallback(props.resources, sampleResources, []),
    domains: fallback(props.domains, sampleDomains, []),
    recents: fallback(props.recents, sampleRecents, [])
  }))
  const panels = computed(() =>
    panelDefinitions.map((definition) => ({
      ...definition,
      resources: lists.value[definition.key]
    }))
  )
  const firstAccess = computed(
    () => !blank.value && Object.values(lists.value).every((list) => list.length === 0)
  )
</script>

<template>
  <div
    v-if="!firstAccess"
    data-layout-fill
    class="layout-column layout-boundary relative flex h-dvh flex-col justify-center-safe overflow-y-auto xl:justify-start"
  >
    <header class="flex items-center">
      <h1 class="text-title-md text-(--text-muted)">
        {{ greeting }},
        <span class="text-(--text-default)">{{ name }}</span>
      </h1>
    </header>
    <Alert
      v-if="error"
      severity="danger"
      :label="`Couldn't load your usage and resources. ${error}`"
      action-label="Retry"
      data-testid="dashboard-home__error"
      @action="(event: MouseEvent) => emit('retry', event)"
    />

    <div
      class="layout-section-start flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1"
    >
      <HomeUsageBand
        v-model:agent-setup="agentSetup"
        :tiles="tiles"
        :comparison="comparison"
        :loading="loading"
        :error="error"
      />
      <HomePanels
        :panels="panels"
        :loading="loading"
        :error="error"
      />
    </div>
  </div>

  <HomeFirstAccess
    v-else
    :greeting="greeting"
    :name="name"
    :domain-availability="domainAvailability"
    @create-project="(event) => emit('create-project', event)"
    @check-domain="(value) => emit('check-domain', value)"
    @register-domain="(event, value) => emit('register-domain', event, value)"
    @copy-prompt="(event) => emit('copy-prompt', event)"
  />
</template>

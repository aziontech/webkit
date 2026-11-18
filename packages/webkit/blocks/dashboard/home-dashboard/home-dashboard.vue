<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Illustration from '@aziontech/webkit/illustration'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Popover from '@aziontech/webkit/popover'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
  import ThirdPartyLogo from '@aziontech/webkit/third-party-logo'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useConsoleLayout } from '@aziontech/webkit/use-console-layout'
  import { computed, onScopeDispose, reactive, ref, watch } from 'vue'

  import {
    sampleDomains,
    sampleMetrics,
    sampleProjects,
    sampleRecents,
    sampleRegisteredDomains,
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

  const layout = useConsoleLayout({ optional: true })

  const openSearch = () => layout?.openSearch()

  type PanelKey = 'projects' | 'resources' | 'domains' | 'recents'

  const metricDefinitions: {
    id: HomeDashboardMetricId
    label: string
    unit: string
    hint: string
  }[] = [
    {
      label: 'Data transferred',
      id: 'data-transferred',
      unit: 'GB',
      hint: 'Total bytes delivered across all your resources.'
    },
    {
      label: 'Requests per second',
      id: 'requests-per-second',
      unit: '/s',
      hint: 'Average requests handled per second in the selected window.'
    },
    {
      label: 'Bandwidth saving',
      id: 'bandwidth-saving',
      unit: 'GB',
      hint: 'Bytes served from cache instead of your origin.'
    },
    {
      label: 'Data offload',
      id: 'data-offload',
      unit: '%',
      hint: 'Share of traffic served from cache instead of your origin.'
    }
  ]

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

  const agentMarks = [
    { name: 'Claude', src: claudeMark, mono: false },
    { name: 'Codex', src: codexMark, mono: true },
    { name: 'Gemini', src: geminiMark, mono: false },
    { name: 'Cursor', src: cursorMark, mono: true }
  ]

  const failed = computed(() => props.error !== '')
  const blank = computed(() => props.loading || failed.value)
  const fallback = <T,>(value: T | undefined, sample: T, empty: T): T =>
    value ?? (blank.value ? empty : sample)

  const name = computed(() => props.userName ?? sampleUserName)
  const metricValues = computed(() => fallback(props.metrics, sampleMetrics, {}))
  const tiles = computed(() =>
    metricDefinitions.map((definition) => ({
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

  const DOMAIN_SHAPE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i
  const CHECK_DEBOUNCE_MS = 900

  const domain = ref('')
  const check = reactive({ open: false, pending: false, name: '' })
  const sampleVerdict = ref<HomeDashboardDomainAvailability | null>(null)
  const verdict = computed(() => {
    const answer = props.domainAvailability ?? sampleVerdict.value
    return !check.pending && answer?.name === check.name ? answer : null
  })
  const fieldWidth = ref(0)
  let checkTimer: ReturnType<typeof globalThis.setTimeout> | undefined

  const measureField = (event: Event) => {
    const form = (event.target as Element | null)?.closest?.('form')
    if (form) fieldWidth.value = Math.round(form.offsetWidth)
  }

  watch(domain, (value) => {
    globalThis.clearTimeout(checkTimer)
    const next = value.trim().toLowerCase()
    if (!DOMAIN_SHAPE.test(next)) {
      check.open = false
      check.pending = false
      return
    }
    check.open = true
    check.pending = true
    check.name = next
    checkTimer = globalThis.setTimeout(() => {
      check.pending = false
      if (props.domainAvailability === undefined)
        sampleVerdict.value = { name: next, registered: sampleRegisteredDomains.includes(next) }
      emit('check-domain', next)
    }, CHECK_DEBOUNCE_MS)
  })

  onScopeDispose(() => globalThis.clearTimeout(checkTimer))

  const onCheckOpen = (value: boolean) => {
    if (!value) check.open = false
  }
</script>

<template>
  <div
    v-if="!firstAccess"
    data-layout-fill
    class="layout-column layout-boundary relative flex h-dvh flex-col justify-center-safe overflow-y-auto xl:justify-start"
  >
    <header class="flex items-center">
      <h1 class="text-heading-sm text-(--text-muted)">
        {{ greeting }},
        <span class="text-(--text-default)">{{ name }}</span>
      </h1>
    </header>

    <div
      class="layout-section-start flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1"
    >
      <aside
        class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
        aria-label="Usage"
      >
        <div class="min-w-0 xl:flex-1">
          <Alert
            v-if="failed"
            severity="danger"
            :label="`Couldn't load usage. ${error}`"
            action-label="Retry"
            @action="(event) => emit('retry', event)"
          />
          <StatTileGroup v-else>
            <StatTile
              v-for="metric in tiles"
              :key="metric.label"
              :label="metric.label"
              :value="metric.value"
              :unit="metric.unit"
              :delta="metric.delta"
              :loading="loading"
            >
              <template #aside>
                <Hint :content="metric.hint" />
              </template>
            </StatTile>
          </StatTileGroup>
        </div>

        <Transition
          leave-active-class="transition-[scale,translate,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none"
          leave-to-class="scale-95 translate-y-(--spacing-xs) opacity-0"
        >
          <div
            v-if="agentSetup"
            class="relative w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)"
          >
            <Card
              :padded="false"
              class="w-full"
            >
              <template #default>
                <Item
                  href="/agents/setup"
                  class="h-full"
                >
                  <span class="flex min-w-0 flex-col items-start gap-(--spacing-md)">
                    <span
                      class="flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover/item:[&>*+*]:-ms-1.5 group-focus-visible/item:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none"
                      aria-hidden="true"
                    >
                      <span
                        v-for="agent in agentMarks"
                        :key="agent.name"
                        class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised) text-(--text-default)"
                      >
                        <ThirdPartyLogo
                          :name="agent.name"
                          :src="agent.src"
                          :variant="agent.mono ? 'current' : 'color'"
                          decorative
                          size="small"
                        />
                      </span>
                    </span>

                    <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                      <span class="text-heading-2xs text-(--text-default)"
                        >Set up your coding agent</span
                      >
                      <span class="text-pretty text-body-sm text-(--text-muted)"
                        >Give your editor a prompt that teaches it to build and deploy here.</span
                      >
                    </span>
                  </span>
                </Item>
              </template>
            </Card>
            <div class="absolute end-(--spacing-xs) top-(--spacing-xs)">
              <Tooltip
                content="Dismiss"
                side="top"
              >
                <IconButton
                  icon="az az-x"
                  variant="ghost"
                  size="small"
                  aria-label="Dismiss agent setup"
                  @click="agentSetup = false"
                />
              </Tooltip>
            </div>
          </div>
        </Transition>
      </aside>

      <section
        class="animate-content-enter motion-reduce:animate-none mt-(--spacing-lg) grid w-full min-w-0 grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:flex-1 xl:grid-cols-5 xl:gap-(--layout-section-gap) [--content-enter-delay:var(--transition-duration-fast-01)]"
        aria-label="Resources"
      >
        <div
          v-for="panel in panels"
          :key="panel.key"
          class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
          :class="panel.recent ? 'sm:col-span-2 lg:col-span-3 xl:col-span-2' : ''"
        >
          <h2
            class="flex min-h-(--size-6) items-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
          >
            <span
              v-if="panel.marked || panel.recent"
              class="shrink-0"
              aria-hidden="true"
            />
            <Link
              v-if="panel.path"
              :href="panel.path"
              :label="panel.label"
              size="small"
              icon="az az-chevron-right"
            />
            <span v-else>{{ panel.label }}</span>
          </h2>

          <div class="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain">
            <Alert
              v-if="failed"
              severity="danger"
              :label="`Couldn't load ${panel.label.toLowerCase()}. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <div
              v-else-if="loading"
              key="panel-loading"
              class="flex flex-col gap-(--spacing-xs)"
            >
              <Skeleton
                v-for="line in 3"
                :key="line"
                height="2rem"
              />
            </div>
            <Item.List
              v-else-if="panel.resources.length"
              key="panel-rows"
            >
              <Item
                v-for="resource in panel.resources"
                :key="resource.href"
                :href="resource.href"
                size="small"
              >
                <Item.Content>
                  <Item.Title class="w-full">
                    <template v-if="panel.recent">
                      <span
                        class="flex shrink-0 items-center justify-center"
                        aria-hidden="true"
                      >
                        <i class="az az-history text-body-xs leading-none text-(--text-muted)" />
                      </span>
                      <span class="min-w-(--size-24) shrink-0 text-body-sm text-(--text-muted)"
                        >{{ resource.typeLabel }} /</span
                      >
                    </template>

                    <span
                      v-else-if="panel.marked"
                      class="flex shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <i
                        v-if="resource.presetIcon"
                        :class="resource.presetIcon"
                        class="text-body-lg leading-none"
                        :title="resource.presetLabel"
                      />
                    </span>
                    <span class="min-w-0 truncate text-label-md text-(--text-default)">
                      {{ resource.name }}
                    </span>
                  </Item.Title>
                </Item.Content>

                <Item.Actions>
                  <i
                    class="az az-chevron-right shrink-0 text-body-xs text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </Item>
            </Item.List>

            <EmptyState
              v-else
              size="small"
              :title="panel.recent ? 'Nothing opened yet' : `No ${panel.label.toLowerCase()} yet`"
              :description="
                panel.recent
                  ? 'Resources you open show up here.'
                  : `${panel.label} you create show up here.`
              "
            />
          </div>
        </div>
      </section>
    </div>
  </div>

  <div
    v-else
    class="layout-column layout-boundary relative flex min-h-full flex-1 flex-col"
  >
    <div class="my-auto flex w-full flex-col gap-(--layout-section-gap) py-(--spacing-xl)">
      <div
        class="animate-content-enter motion-reduce:animate-none flex flex-col items-center gap-(--spacing-lg)"
      >
        <div class="flex flex-col items-center gap-(--spacing-xs)">
          <p class="text-center text-body-md text-(--text-muted)">{{ greeting }}, {{ name }}</p>
          <h1 class="text-balance text-center text-heading-lg text-(--text-default)">
            Let's build something new.
          </h1>
        </div>

        <div class="flex w-full max-w-(--container-2xl) flex-col items-stretch">
          <SearchTrigger
            class="w-full"
            label="Search resources, pages and commands"
            @open="openSearch"
          />
        </div>
      </div>

      <div
        class="animate-content-enter motion-reduce:animate-none grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3 [--content-enter-delay:var(--transition-duration-fast-01)]"
      >
        <Card :padded="false">
          <template #default>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <Illustration name="modern-frontends" />
              </div>

              <div
                class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
              >
                <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                  <h3 class="text-label-md text-(--text-default)">Ship something new</h3>
                  <p class="text-pretty text-body-sm text-(--text-muted)">
                    Deploy a static site or a full-stack app, with compute, AI, storage and media on
                    the same build.
                  </p>
                </div>
                <div class="flex items-center gap-(--spacing-xs)">
                  <Button
                    label="Create Project"
                    variant="outline"
                    size="medium"
                    @click="(event) => emit('create-project', event)"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
        <Card :padded="false">
          <template #default>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <Illustration name="dns-protection" />
              </div>

              <div
                class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
              >
                <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                  <h3 class="text-label-md text-(--text-default)">Add a domain</h3>
                  <p class="text-pretty text-body-sm text-(--text-muted)">
                    Register a new one or bring your own. DNS, automatic HTTPS and DDoS protection
                    come with it.
                  </p>
                </div>
                <div class="flex items-center gap-(--spacing-xs)">
                  <Popover
                    :open="check.open"
                    side="bottom"
                    align="start"
                    :side-offset="8"
                    class="w-full"
                    @update:open="onCheckOpen"
                  >
                    <Popover.Trigger class="w-full">
                      <form
                        class="w-full"
                        @submit.prevent
                      >
                        <Input
                          v-model="domain"
                          placeholder="Type in your domain"
                          size="medium"
                          aria-label="Domain to add"
                          @input="measureField"
                        />
                      </form>
                    </Popover.Trigger>

                    <Popover.Content>
                      <div
                        class="overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                        :style="fieldWidth ? { width: fieldWidth + 'px' } : {}"
                      >
                        <Transition
                          mode="out-in"
                          enter-active-class="animate-fade-in motion-reduce:animate-none"
                          leave-active-class="animate-fade-out motion-reduce:animate-none"
                        >
                          <div
                            v-if="!verdict"
                            key="checking"
                            class="flex items-center justify-center gap-(--spacing-xs) p-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
                          >
                            <div class="contents text-(--text-muted)">
                              <Spinner class="shrink-0" />
                            </div>
                            Checking {{ check.name }}...
                          </div>

                          <div
                            v-else
                            key="verdict"
                            class="flex flex-col gap-(--spacing-sm) p-(--spacing-sm)"
                          >
                            <p class="text-body-sm text-(--text-default)">
                              <template v-if="verdict.registered">
                                {{ check.name }} is already registered. Try another name.
                              </template>
                              <template v-else>
                                {{ check.name }} is available. We register it and issue the
                                certificate.
                              </template>
                            </p>
                            <Button
                              v-if="!verdict.registered"
                              label="Register"
                              variant="secondary"
                              size="medium"
                              class="w-full"
                              @click="(event) => emit('register-domain', event, check.name)"
                            />
                          </div>
                        </Transition>
                      </div>
                    </Popover.Content>
                  </Popover>
                </div>
              </div>
            </div>
          </template>
        </Card>
        <Card :padded="false">
          <template #default>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <Illustration name="ai-applications" />
              </div>

              <div
                class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
              >
                <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                  <h3 class="text-label-md text-(--text-default)">Onboard your agent</h3>
                  <p class="text-pretty text-body-sm text-(--text-muted)">
                    Give Claude, Cursor, Windsurf, Codex or OpenCode a prompt that sets your project
                    up to deploy here.
                  </p>
                </div>
                <div class="flex items-center gap-(--spacing-xs)">
                  <Button
                    label="Copy prompt"
                    variant="outline"
                    size="medium"
                    icon="az az-copy"
                    @click="(event) => emit('copy-prompt', event)"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

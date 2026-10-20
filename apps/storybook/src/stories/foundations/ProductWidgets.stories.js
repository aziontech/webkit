import SegmentedButton from '@aziontech/webkit/segmented-button'
import { markRaw, reactive, ref } from 'vue'

import FunctionsStartScene from '../../../../webkit-sample/src/site/ui/FunctionsStartScene.vue'
import ApplicationCacheFragment from '../../../../webkit-sample/src/site/ui/mockup/widgets/ApplicationCacheFragment.vue'
import ApplicationFunctionFragment from '../../../../webkit-sample/src/site/ui/mockup/widgets/ApplicationFunctionFragment.vue'
import ApplicationRuleFragment from '../../../../webkit-sample/src/site/ui/mockup/widgets/ApplicationRuleFragment.vue'
import ApplicationVersionWidget from '../../../../webkit-sample/src/site/ui/mockup/widgets/ApplicationVersionWidget.vue'
import WorkloadDeployFragment from '../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadDeployFragment.vue'
import WorkloadDeploymentsWidget from '../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadDeploymentsWidget.vue'
import WorkloadDomainFragment from '../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadDomainFragment.vue'
import WorkloadDomainsWidget from '../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadDomainsWidget.vue'
import WorkloadOverviewWidget from '../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadOverviewWidget.vue'
import WorkloadsListWidget from '../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadsListWidget.vue'
import WorkloadTopologyWidget from '../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadTopologyWidget.vue'
import {
  PageContainer,
  PageHeader,
  PageSection
} from '../../foundations/components/layout/index.js'

const HOSTS = {
  panel: {
    label: 'ConsolePanel',
    frame: 'w-full max-w-(--container-5xl)',
    body: 'aspect-square w-full md:aspect-[1.9/1]'
  },
  tabs: {
    label: 'FeatureTabs',
    frame: 'w-full max-w-(--container-xl) bg-(--bg-surface)',
    body: 'h-96 w-full min-w-0'
  },
  split: {
    label: 'MediaSplitStack',
    frame: 'w-full max-w-(--container-xl) bg-(--bg-canvas)',
    body: 'h-96 w-full min-w-0 p-(--spacing-xl)'
  },
  grid: {
    label: 'WidgetGrid, 2 columns',
    frame: 'w-full max-w-(--container-lg) bg-(--bg-surface)',
    body: 'h-80 w-full min-w-0 overflow-x-visible overflow-y-clip px-(--spacing-xl) pt-(--spacing-xl) [--mockup-fade-color:var(--bg-surface)]'
  },
  'grid-3': {
    label: 'WidgetGrid, 3 columns',
    frame: 'w-full max-w-(--container-sm) bg-(--bg-surface)',
    body: 'h-80 w-full min-w-0 overflow-x-visible overflow-y-clip px-(--spacing-xl) pt-(--spacing-xl) [--mockup-fade-color:var(--bg-surface)]'
  }
}

const FADES = ['none', 'bottom', 'top', 'left', 'right', 'y']
const TEXTURES = ['none', 'dots', 'grid', 'lines', 'dither', 'pixelate']
const KINDS = ['window', 'bare']

const WORKLOAD_OVERVIEW_TABS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Topology', value: 'topology' },
  { label: 'Deploy', value: 'deploy' }
]

const APPLICATION_VERSION_TABS = [
  { label: 'Main settings', value: 'main-settings' },
  { label: 'Cache settings', value: 'cache-settings' },
  { label: 'Device groups', value: 'device-groups' },
  { label: 'Functions', value: 'functions' },
  { label: 'Rules engine', value: 'rules-engine' }
]

const FUNCTIONS_START_TABS = [
  { label: 'Ask your coding agent', value: 'agents' },
  { label: 'Build it in the Console', value: 'console' },
  { label: 'Ship it from the terminal', value: 'cli' }
]

const BARE_TAB_PROPS = { kind: 'bare', chrome: false, width: 680 }

const WIDGETS = [
  {
    key: 'workload-overview',
    product: 'workloads',
    name: 'WorkloadOverviewWidget',
    component: WorkloadOverviewWidget,
    host: 'panel',
    usage: 'Workloads page, the "Everything a workload is, on one screen" band.',
    description:
      'The workload overview screen with the console rail, stat tiles, a request chart and status codes. Each tab replays one beat: overview, topology, deploy.',
    props: { fade: 'bottom' },
    tabs: WORKLOAD_OVERVIEW_TABS,
    controls: { tab: WORKLOAD_OVERVIEW_TABS, fade: FADES, texture: TEXTURES, active: 'boolean' }
  },
  {
    key: 'workloads-list',
    product: 'workloads',
    name: 'WorkloadsListWidget',
    component: WorkloadsListWidget,
    host: 'tabs',
    usage: 'Workloads page, the console FeatureTabs band, first tab.',
    description: 'The workloads list: name, domain, status and last deployment for each workload.',
    props: BARE_TAB_PROPS,
    controls: { kind: KINDS, chrome: 'boolean', width: 'number', fade: FADES, active: 'boolean' }
  },
  {
    key: 'workload-topology',
    product: 'workloads',
    name: 'WorkloadTopologyWidget',
    component: WorkloadTopologyWidget,
    host: 'tabs',
    usage: 'Workloads page, the console FeatureTabs band, second tab.',
    description:
      'The workload topology: domains, the workload, and the applications and firewalls it serves through.',
    props: BARE_TAB_PROPS,
    controls: { kind: KINDS, chrome: 'boolean', width: 'number', fade: FADES, active: 'boolean' }
  },
  {
    key: 'workload-domains',
    product: 'workloads',
    name: 'WorkloadDomainsWidget',
    component: WorkloadDomainsWidget,
    host: 'tabs',
    usage: 'Workloads page, the console FeatureTabs band, third tab.',
    description: 'The workload domain settings: domains, certificates and the TLS floor.',
    props: BARE_TAB_PROPS,
    controls: { kind: KINDS, chrome: 'boolean', width: 'number', fade: FADES, active: 'boolean' }
  },
  {
    key: 'workload-deployments',
    product: 'workloads',
    name: 'WorkloadDeploymentsWidget',
    component: WorkloadDeploymentsWidget,
    host: 'split',
    usage: 'Workloads page, the "Go fast, or slow" band.',
    description:
      'The deployments screen: promote to every location, shift a share of traffic, or roll back.',
    props: { fade: 'bottom' },
    controls: { fade: FADES, active: 'boolean' }
  },
  {
    key: 'workload-deploy',
    product: 'workloads',
    name: 'WorkloadDeployFragment',
    component: WorkloadDeployFragment,
    host: 'grid',
    usage: 'Workloads page, Built in grid, "Deploys that report themselves".',
    description: 'A bare fragment of the deploy pipeline. Hover steps through the stages.',
    props: {},
    hover: true,
    controls: { hover: 'boolean', active: 'boolean' }
  },
  {
    key: 'workload-domain',
    product: 'workloads',
    name: 'WorkloadDomainFragment',
    component: WorkloadDomainFragment,
    host: 'grid',
    usage: 'Workloads page, Built in grid, "Domains with TLS handled".',
    description:
      'A bare fragment of the domain list. Hover steps through the domains and their certificates.',
    props: {},
    hover: true,
    controls: { hover: 'boolean', active: 'boolean' }
  },
  {
    key: 'application-version',
    product: 'applications',
    name: 'ApplicationVersionWidget',
    component: ApplicationVersionWidget,
    host: 'panel',
    usage: 'Applications page, the "Everything an application runs with, in one version" band.',
    description:
      'An application version in the legacy console: main settings, cache settings, device groups, functions and rules engine, one tab each.',
    props: {},
    tabs: APPLICATION_VERSION_TABS,
    controls: { tab: APPLICATION_VERSION_TABS, fade: FADES, texture: TEXTURES, active: 'boolean' }
  },
  {
    key: 'application-cache',
    product: 'applications',
    name: 'ApplicationCacheFragment',
    component: ApplicationCacheFragment,
    host: 'grid-3',
    usage: 'Cache page, "Cache settings you reuse".',
    description: 'A legacy-console fragment of a cache setting. Hover edits the edge TTL.',
    props: {},
    hover: true,
    controls: { hover: 'boolean', active: 'boolean' }
  },
  {
    key: 'application-rule',
    product: 'applications',
    name: 'ApplicationRuleFragment',
    component: ApplicationRuleFragment,
    host: 'grid-3',
    usage: 'Cache page, "Rules that decide what is cached".',
    description:
      'A legacy-console fragment of a rules engine rule. Hover inserts and types a criteria line.',
    props: {},
    hover: true,
    controls: { hover: 'boolean', active: 'boolean' }
  },
  {
    key: 'application-function',
    product: 'applications',
    name: 'ApplicationFunctionFragment',
    component: ApplicationFunctionFragment,
    host: 'grid-3',
    usage: 'Cache page, "Functions for the cases rules miss".',
    description: 'A legacy-console fragment of a function instance that rewrites cache headers.',
    props: {},
    hover: true,
    controls: { hover: 'boolean', active: 'boolean' }
  },
  {
    key: 'functions-start',
    product: 'functions',
    name: 'FunctionsStartScene',
    component: FunctionsStartScene,
    host: 'grid-3',
    usage: 'Functions page, "Start where you already work", one tile per tab.',
    description:
      'Three ways to ship a function: a coding agent session, the Console editor (FunctionCodeFragment), and a terminal deploy.',
    props: {},
    hover: true,
    tiles: FUNCTIONS_START_TABS,
    controls: { tab: FUNCTIONS_START_TABS, hover: 'boolean', active: 'boolean' }
  }
].map((widget) => ({ ...widget, component: markRaw(widget.component) }))

const PRODUCTS = [
  [
    'workloads',
    'Workloads',
    'Mocks of the workload screens: overview, list, topology, domains and deployments.'
  ],
  [
    'applications',
    'Applications',
    'Mocks of an application version and its cache, rules and function settings, drawn in the legacy console.'
  ],
  ['functions', 'Functions', 'The three start paths of a function: agent, Console and terminal.']
].map(([key, title, description]) => ({
  key,
  title,
  description,
  widgets: WIDGETS.filter((widget) => widget.product === key)
}))

const LIBRARY_ENTRIES = PRODUCTS.flatMap((product) =>
  product.widgets.flatMap((widget) =>
    widget.tiles
      ? widget.tiles.map((tile) => ({ ...widget, key: `${widget.key}-${tile.value}`, tile }))
      : [widget]
  )
)

const LIBRARY_SECTIONS = PRODUCTS.map((product) => ({
  ...product,
  entries: LIBRARY_ENTRIES.filter((entry) => entry.product === product.key)
}))

const argTypeFor = (control) => {
  if (control === 'boolean') return { control: 'boolean' }
  if (control === 'number') return { control: { type: 'number', step: 20 } }
  const options = control.map((option) => (typeof option === 'string' ? option : option.value))
  return { control: 'select', options }
}

const widgetStory = (key) => {
  const widget = WIDGETS.find((entry) => entry.key === key)
  const host = HOSTS[widget.host]
  const defaults = {
    ...(widget.controls.tab ? { tab: widget.controls.tab[0].value } : {}),
    ...(widget.controls.hover ? { hover: false } : {}),
    active: true,
    ...widget.props
  }

  return {
    name: widget.name,
    args: defaults,
    argTypes: Object.fromEntries(
      Object.entries(widget.controls).map(([prop, control]) => [prop, argTypeFor(control)])
    ),
    parameters: {
      controls: { disable: false },
      docs: { description: { story: `${widget.description} Used on the ${widget.usage}` } }
    },
    render: (args) => ({
      components: { Widget: widget.component },
      setup() {
        const pointer = ref(false)
        return { args, host, widget, pointer }
      },
      template: /* html */ `
        <div class="flex flex-col gap-(--spacing-md)">
          <p class="m-0 text-body-sm text-(--text-muted)">{{ widget.usage }} Hosted by {{ host.label }}.</p>
          <div
            :class="host.frame"
            class="overflow-hidden rounded-(--shape-card) border border-(--border-default)"
            @pointerenter="pointer = true"
            @pointermove="pointer = true"
            @pointerleave="pointer = false"
          >
            <div :class="host.body">
              <Widget
                v-bind="args"
                v-bind:hover="widget.hover ? args.hover || pointer : undefined"
              />
            </div>
          </div>
        </div>
      `
    })
  }
}

export default {
  title: 'Foundations/Assets/Product Widgets',
  parameters: {
    options: { showPanel: true },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Console mockups the Site draws its product bands with. Each widget is a ShellMockup frame composed of staggered MockupPart beats, scaled to fit whatever cell hosts it. They live in the sample app under site/ui/mockup and are not package exports.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

export const Library = {
  name: 'Library',
  parameters: { options: { showPanel: false } },
  render: () => ({
    components: { PageContainer, PageHeader, PageSection, SegmentedButton },
    setup() {
      const hovered = ref('')
      const tabs = reactive(
        Object.fromEntries(
          LIBRARY_ENTRIES.filter((entry) => entry.tabs).map((entry) => [
            entry.key,
            entry.tabs[0].value
          ])
        )
      )
      const sceneProps = (entry) => ({
        ...entry.props,
        ...(entry.tabs ? { tab: tabs[entry.key] } : {}),
        ...(entry.tile ? { tab: entry.tile.value } : {}),
        ...(entry.hover ? { hover: hovered.value === entry.key } : {})
      })
      return { SECTIONS: LIBRARY_SECTIONS, HOSTS, hovered, tabs, sceneProps, total: WIDGETS.length }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Product Widgets">
          {{ total }} console mockups the Site uses to show the product. Each one is a ShellMockup
          frame of staggered MockupPart beats that scales to its host, replays its entrance when it
          becomes active, and fades into the band behind it. Every widget below is drawn in the
          cell that hosts it on the page. Hover the grid fragments to play their beat.
        </PageHeader>

        <PageSection v-for="section in SECTIONS" :key="section.key" :title="section.title" :description="section.description">
          <div class="flex flex-wrap items-start gap-(--spacing-lg)">
            <figure
              v-for="entry in section.entries"
              :key="entry.key"
              :class="HOSTS[entry.host].frame"
              class="m-0 flex flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default)"
              @pointerenter="hovered = entry.key"
              @pointermove="hovered = entry.key"
              @pointerleave="hovered = ''"
            >
              <div
                v-if="entry.tabs"
                class="flex justify-center border-b border-(--border-default) bg-(--bg-canvas) p-(--spacing-sm)"
              >
                <SegmentedButton
                  v-model="tabs[entry.key]"
                  :options="entry.tabs"
                  size="small"
                  :aria-label="entry.name + ' tab'"
                />
              </div>
              <div :class="HOSTS[entry.host].body">
                <component
                  :is="entry.component"
                  v-bind="sceneProps(entry)"
                />
              </div>
              <figcaption class="flex flex-col gap-(--spacing-xxs) border-t border-(--border-default) bg-(--bg-canvas) p-(--spacing-md)">
                <span class="text-label-md text-(--text-default)">
                  {{ entry.name }}<template v-if="entry.tile"> · {{ entry.tile.label }}</template>
                </span>
                <span class="text-body-sm text-(--text-muted)">{{ entry.description }}</span>
                <span class="text-body-xs text-(--text-muted)">{{ entry.usage }} Hosted by {{ HOSTS[entry.host].label }}.</span>
              </figcaption>
            </figure>
          </div>
        </PageSection>
      </PageContainer>
    `
  })
}

export const WorkloadOverview = widgetStory('workload-overview')
export const WorkloadsList = widgetStory('workloads-list')
export const WorkloadTopology = widgetStory('workload-topology')
export const WorkloadDomains = widgetStory('workload-domains')
export const WorkloadDeployments = widgetStory('workload-deployments')
export const WorkloadDeploy = widgetStory('workload-deploy')
export const WorkloadDomain = widgetStory('workload-domain')
export const ApplicationVersion = widgetStory('application-version')
export const ApplicationCache = widgetStory('application-cache')
export const ApplicationRule = widgetStory('application-rule')
export const ApplicationFunction = widgetStory('application-function')
export const FunctionsStart = widgetStory('functions-start')

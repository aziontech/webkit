import ProductWidget from '@aziontech/webkit/product-widget'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import { h, markRaw, reactive, ref } from 'vue'

import {
  PageContainer,
  PageHeader,
  PageSection
} from '../../foundations/components/layout/index.js'

const productWidget = (name) => {
  const Widget = (_props, { attrs }) => h(ProductWidget, { ...attrs, name })
  Widget.displayName = `ProductWidget(${name})`
  return markRaw(Widget)
}

const ApplicationVersionWidget = productWidget('application-version')
const WorkloadDeploymentsWidget = productWidget('workload-deployments')
const WorkloadDomainsWidget = productWidget('workload-domains')
const WorkloadOverviewWidget = productWidget('workload-overview')
const WorkloadsListWidget = productWidget('workloads-list')
const WorkloadTopologyWidget = productWidget('workload-topology')
const FunctionsStartWidget = productWidget('functions-start')
const CliTerminalDeployWidget = productWidget('cli-terminal-deploy')
const WorkloadDeployLogsWidget = productWidget('workload-deploy-logs')
const WorkloadRolloutRowsWidget = productWidget('workload-rollout-rows')
const WorkloadTopologyChainWidget = productWidget('workload-topology-chain')
const WorkloadTopologyFlowWidget = productWidget('workload-topology-flow')

const HOSTS = {
  hero: {
    label: 'Heroes, beside the title',
    frame: 'w-full max-w-(--container-5xl) bg-(--bg-canvas)',
    body: 'w-full min-w-0 p-(--spacing-xl)'
  },
  cli: {
    label: 'CliTerminal',
    frame: 'w-full max-w-(--container-4xl) bg-(--bg-canvas)',
    body: 'h-(--size-72) w-full min-w-0 md:h-(--size-96)'
  },
  scroll: {
    label: 'FeatureScroll',
    frame: 'w-full max-w-(--container-xl) bg-(--bg-surface)',
    body: 'h-96 w-full min-w-0'
  },
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
    label: 'FeatureWidgets, 2 columns',
    frame: 'w-full max-w-(--container-lg) bg-(--bg-surface)',
    body: 'h-80 w-full min-w-0 overflow-x-visible overflow-y-clip px-(--spacing-xl) pt-(--spacing-xl) [--mockup-fade-color:var(--bg-surface)]'
  },
  'grid-3': {
    label: 'FeatureWidgets, 3 columns',
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
const BARE_SCROLL_PROPS = { kind: 'bare', chrome: false, width: 600 }
const FRAMED_CONTROLS = {
  kind: KINDS,
  chrome: 'boolean',
  width: 'number',
  active: 'boolean'
}

const pascal = (key) =>
  key
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')

const builtIn = (product, key, usage, description) => ({
  key,
  product,
  name: `${pascal(key)}Fragment`,
  component: productWidget(key),
  host: 'grid-3',
  usage,
  description,
  props: {},
  hover: true,
  controls: { hover: 'boolean', active: 'boolean' }
})

const BUILT_IN = [
  builtIn(
    'workloads',
    'workload-deploy',
    'Workloads page, Built in grid, "Deploys that report themselves".',
    'A bare fragment of the deploy pipeline. Hover steps through the stages.'
  ),
  builtIn(
    'workloads',
    'workload-domain',
    'Workloads page, Built in grid, "Domains with TLS handled".',
    'A bare fragment of the domain list. Hover steps through the domains and their certificates.'
  ),
  builtIn(
    'applications',
    'applications-create-method',
    'Applications page, Built in grid, "Deploy the way you already work".',
    'The create methods of an application: import from Git, sync with the Azion CLI, or start from a template.'
  ),
  builtIn(
    'applications',
    'applications-device-group',
    'Applications page, Built in grid, "Behavior defined by device".',
    'A device group form. Hover types the mobile user-agent expression.'
  ),
  builtIn(
    'applications',
    'applications-rule-phases',
    'Applications page, Built in grid, "Rules for requests and responses".',
    'Rules engine rules split across the request and response phases.'
  ),
  builtIn(
    'cache',
    'application-cache',
    'Cache page, Built in grid, "Cache settings you reuse".',
    'A legacy-console fragment of a cache setting. Hover edits the edge TTL.'
  ),
  builtIn(
    'cache',
    'application-rule',
    'Cache page, Built in grid, "Rules that decide what is cached".',
    'A legacy-console fragment of a rules engine rule. Hover inserts and types a criteria line.'
  ),
  builtIn(
    'cache',
    'application-function',
    'Cache page, Built in grid, "Functions for the cases rules miss".',
    'A legacy-console fragment of a function instance that rewrites cache headers.'
  ),
  builtIn(
    'application-accelerator',
    'application-accelerator-cookie',
    'Application Accelerator page, Built in grid, "Vary cache by cookie".',
    'A legacy-console cache setting keyed by cookie. Hover adds a cart cookie next to the session one.'
  ),
  builtIn(
    'application-accelerator',
    'application-accelerator-method',
    'Application Accelerator page, Built in grid, "Cache POST and OPTIONS requests".',
    'A legacy-console cache setting with the POST and OPTIONS method switches. Hover turns them on.'
  ),
  builtIn(
    'application-accelerator',
    'application-accelerator-query-string',
    'Application Accelerator page, Built in grid, "Vary cache by query string".',
    'A legacy-console cache key by query string. Hover picks Allowlist and adds the page and lang fields.'
  ),
  builtIn(
    'ai-inference',
    'ai-inference-template',
    'AI Inference page, Built in grid, "Quick start with templates".',
    'The template picker: recommended templates, Azion templates and frameworks.'
  ),
  builtIn(
    'ai-inference',
    'ai-inference-model',
    'AI Inference page, Built in grid, "Pick the model your app runs".',
    'The model field of an AI Inference function. Hover types the model name.'
  ),
  builtIn(
    'ai-inference',
    'ai-inference-function',
    'AI Inference page, Built in grid, "From hello world to production AI workloads".',
    'A function editor whose code calls the model, with its Code and Arguments tabs.'
  ),
  builtIn(
    'sql-database',
    'sql-database-table',
    'SQL Database page, Built in grid, "Tables you define column by column".',
    'A table definition. Hover adds and names a column.'
  ),
  builtIn(
    'sql-database',
    'sql-database-query',
    'SQL Database page, Built in grid, "Queries you run and read back".',
    'A query editor with a SELECT on users. Hover runs it and shows the result rows.'
  ),
  builtIn(
    'sql-database',
    'sql-database-row',
    'SQL Database page, Built in grid, "Rows your functions read".',
    'The data view of a table. Hover inserts a row.'
  ),
  builtIn(
    'kv-store',
    'kv-store-key',
    'KV Store page, Built in grid, "Keys that expire on their own".',
    'A legacy-console key form with a JSON value. Hover sets the key to expire and adds it.'
  ),
  builtIn(
    'kv-store',
    'kv-store-function',
    'KV Store page, Built in grid, "From key-value to full application state".',
    'A legacy-console function editor whose code writes to KV Store.'
  ),
  builtIn(
    'kv-store',
    'kv-store-security-list',
    'KV Store page, Built in grid, "Security lists read in real time".',
    'A legacy-console list of security entries read from a namespace.'
  ),
  builtIn(
    'object-storage',
    'object-storage-buckets',
    'Object Storage page, Built in grid, "Store application data at scale".',
    'The buckets list.'
  ),
  builtIn(
    'object-storage',
    'object-storage-browser',
    'Object Storage page, Built in grid, "Host static sites from buckets".',
    'The file browser of a site assets bucket. Hover opens the assets folder.'
  ),
  builtIn(
    'object-storage',
    'object-storage-access',
    'Object Storage page, Built in grid, "From storage to full application delivery".',
    'The access setting of a bucket: read and write, read only, or restricted. Hover changes it.'
  ),
  builtIn(
    'edge-dns',
    'edge-dns-record',
    'Edge DNS page, Built in grid, "Developer-first API".',
    'A record form. Hover opens the record type picker and picks CNAME.'
  ),
  builtIn(
    'edge-dns',
    'edge-dns-nameserver',
    'Edge DNS page, Built in grid, "Fast DNS answers worldwide".',
    'The Azion nameservers a zone delegates to.'
  ),
  builtIn(
    'edge-dns',
    'edge-dns-dnssec',
    'Edge DNS page, Built in grid, "DNSSEC and cryptographic authentication".',
    'The DNSSEC switch of a zone. Hover turns it on and reveals the key tag, algorithm and digest.'
  ),
  builtIn(
    'load-balancer',
    'load-balancer-address',
    'Load Balancer page, Built in grid, "Route traffic the way you choose".',
    'A legacy-console origin address with its ports and server role.'
  ),
  builtIn(
    'load-balancer',
    'load-balancer-method',
    'Load Balancer page, Built in grid, "Session persistence for stateful applications".',
    'A legacy-console balancing method with its retries and timeouts. Hover opens the method picker.'
  ),
  builtIn(
    'load-balancer',
    'load-balancer-origins',
    'Load Balancer page, Built in grid, "Redundancy across clouds and on-premises".',
    'A legacy-console list of origin addresses. Hover adds a primary address.'
  ),
  builtIn(
    'firewall',
    'firewall-modules',
    'Firewall page, Built in grid, "Turn on the modules each application needs".',
    'The legacy-console firewall modules: DDoS Protection, Functions, Network Shield and WAF.'
  ),
  builtIn(
    'firewall',
    'firewall-rules-order',
    'Firewall page, Built in grid, "Rules that run in the order you set".',
    'A legacy-console list of firewall rules. Hover raises the WAF rule two places.'
  ),
  builtIn(
    'firewall',
    'firewall-function',
    'Firewall page, Built in grid, "Functions for custom security logic".',
    'A legacy-console function instance in a firewall. Hover opens the function picker.'
  ),
  builtIn(
    'web-application-firewall',
    'waf-threat',
    'WAF page, Built in grid, "Turn on OWASP protection, tune the rules".',
    'The legacy-console threat families with their sensitivity. Hover raises one.'
  ),
  builtIn(
    'web-application-firewall',
    'waf-firewall-rule',
    'WAF page, Built in grid, "Detect advanced threats with behavioral analysis".',
    'A legacy-console firewall rule that runs the WAF. Hover picks between Logging and Blocking.'
  ),
  builtIn(
    'web-application-firewall',
    'waf-allowed-rule',
    'WAF page, Built in grid, "Adapt protection to legitimate traffic".',
    'A legacy-console allowed rule. Hover adds a condition and picks it.'
  ),
  builtIn(
    'ddos-protection',
    'ddos-firewall-modules',
    'DDoS Protection page, Built in grid, "Reduce security complexity".',
    'The legacy-console firewall modules. Hover turns on DDoS Protection Unmetered.'
  ),
  builtIn(
    'ddos-protection',
    'ddos-requests-metric',
    'DDoS Protection page, Built in grid, "Respond in under 3 seconds".',
    'A legacy-console requests chart around an attack peak.'
  ),
  builtIn(
    'ddos-protection',
    'ddos-http-events',
    'DDoS Protection page, Built in grid, "Monitor attacks in real time".',
    'Legacy-console HTTP events of the attack.'
  ),
  builtIn(
    'network-shield',
    'network-shield-lists',
    'Network Shield page, Built in grid, "Share lists across firewalls".',
    'The legacy-console network lists.'
  ),
  builtIn(
    'network-shield',
    'network-shield-ip-list',
    'Network Shield page, Built in grid, "Automate threat response at scale".',
    'A legacy-console IP/CIDR network list. Hover adds an entry.'
  ),
  builtIn(
    'network-shield',
    'network-shield-rule',
    'Network Shield page, Built in grid, "Protect any environment consistently".',
    'A legacy-console firewall rule that matches a network list. Hover picks the countries list.'
  ),
  builtIn(
    'bot-manager',
    'bot-manager-rule',
    'Bot Manager page, Built in grid, "Reduce infrastructure costs".',
    'A legacy-console fragment of a firewall rule. Hover opens the function picker and sends the path to the Bot Manager Lite instance.'
  ),
  builtIn(
    'bot-manager',
    'bot-manager-traffic',
    'Bot Manager page, Built in grid, "Preserve legitimate user experience".',
    'A legacy-console fragment of the Top Bot Traffic chart: legitimate, bad bot, good bot and under evaluation. Hover isolates the bad bot share.'
  ),
  builtIn(
    'bot-manager',
    'bot-manager-metrics',
    'Bot Manager page, Built in grid, "See bot traffic as it happens".',
    'A legacy-console fragment of the Bot Manager dashboards. Hover switches from the overview big numbers to the impacted URLs breakdown.'
  ),
  builtIn(
    'image-processor',
    'image-processor-module',
    'Image Processor page, Built in grid, "From source images to optimized delivery".',
    'The legacy-console application modules. Hover turns on Image Processor.'
  ),
  builtIn(
    'image-processor',
    'image-processor-rule',
    'Image Processor page, Built in grid, "Rules that decide which images are optimized".',
    'A legacy-console rules engine rule. Hover opens the behavior picker.'
  ),
  builtIn(
    'image-processor',
    'image-processor-events',
    'Image Processor page, Built in grid, "Every processed image in Real-Time Events".',
    'Legacy-console events of processed images. Hover brings in a new event.'
  ),
  builtIn(
    'data-stream',
    'data-stream-source',
    'Data Stream page, Built in grid, "Unified data collection".',
    'A legacy-console stream source. Hover opens the source picker and picks WAF Events.'
  ),
  builtIn(
    'data-stream',
    'data-stream-sampling',
    'Data Stream page, Built in grid, "Reduce SIEM costs".',
    'The legacy-console workload scope of a stream: all workloads, or a filtered set.'
  ),
  builtIn(
    'data-stream',
    'data-stream-connector',
    'Data Stream page, Built in grid, "Integrate your existing stack".',
    'A legacy-console stream connector. Hover opens the connector picker and picks Splunk.'
  ),
  builtIn(
    'real-time-events',
    'real-time-events-filter',
    'Real-Time Events page, Built in grid, "Filter, group, and sort with precision".',
    'The events filter by period, source and level. Hover drills into the values.'
  ),
  builtIn(
    'real-time-events',
    'real-time-events-volume',
    'Real-Time Events page, Built in grid, "Build dashboards teams actually use".',
    'An events volume chart stacked by level, with a spike.'
  ),
  builtIn(
    'real-time-events',
    'real-time-events-log',
    'Real-Time Events page, Built in grid, "Export for audits and troubleshooting".',
    'The events log. Hover opens an event and exports it.'
  ),
  builtIn(
    'real-time-metrics',
    'real-time-metrics-panel',
    'Real-Time Metrics page, Built in grid, "Build custom dashboards".',
    'Metric panels: requests per second, data transferred, cache hit ratio and 5xx status codes.'
  ),
  builtIn(
    'real-time-metrics',
    'real-time-metrics-filter',
    'Real-Time Metrics page, Built in grid, "Filter and share views".',
    'The metrics period filter over the summary strip. Hover opens the period picker.'
  ),
  builtIn(
    'real-time-metrics',
    'real-time-metrics-dashboard',
    'Real-Time Metrics page, Built in grid, "Track security threats".',
    'The metrics dashboard groups. Hover picks a product group.'
  )
]

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
    product: 'website-bundle',
    name: 'WorkloadsListWidget',
    component: WorkloadsListWidget,
    host: 'scroll',
    usage: 'Website Bundle page, FeatureScroll, "Every workload on one list".',
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
    product: 'website-bundle',
    name: 'WorkloadDomainsWidget',
    component: WorkloadDomainsWidget,
    host: 'scroll',
    usage: 'Website Bundle page, FeatureScroll, "Domains and TLS, handled".',
    description: 'The workload domain settings: domains, certificates and the TLS floor.',
    props: BARE_SCROLL_PROPS,
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
    key: 'workload-topology-flow',
    product: 'workloads',
    name: 'WorkloadTopologyFlowWidget',
    component: WorkloadTopologyFlowWidget,
    host: 'hero',
    usage:
      'Workloads page, the hero art under "Put your application close to users in seconds", from lg up.',
    description:
      'The workload topology drawn as a flow: domains into the workload, and out to the applications and firewalls it serves through.',
    props: {},
    controls: { active: 'boolean' }
  },
  {
    key: 'workload-rollout-rows',
    product: 'workloads',
    name: 'WorkloadRolloutRowsWidget',
    component: WorkloadRolloutRowsWidget,
    host: 'grid-3',
    usage:
      'Workloads page, Built in grid, "Versions you promote or roll back". Also on the Website Bundle page, FeatureScroll, "Gradual rollouts and instant rollback".',
    description: 'The deployment rows of a workload: each version, its share and its status.',
    props: {},
    controls: FRAMED_CONTROLS
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
    key: 'functions-start',
    product: 'functions',
    name: 'FunctionsStartWidget',
    component: FunctionsStartWidget,
    host: 'grid-3',
    usage: 'Functions page, "Start where you already work", one tile per tab.',
    description:
      'Three ways to ship a function: a coding agent session, the Console editor (FunctionCodeFragment), and a terminal deploy.',
    props: {},
    hover: true,
    tiles: FUNCTIONS_START_TABS,
    controls: { tab: FUNCTIONS_START_TABS, hover: 'boolean', active: 'boolean' }
  },
  {
    key: 'workload-topology-chain',
    product: 'website-bundle',
    name: 'WorkloadTopologyChainWidget',
    component: WorkloadTopologyChainWidget,
    host: 'scroll',
    usage: 'Website Bundle page, FeatureScroll, "Read the deployment topology".',
    description:
      'The domains, the application and the firewall a workload serves, drawn as one chain.',
    props: BARE_SCROLL_PROPS,
    controls: FRAMED_CONTROLS
  },
  {
    key: 'workload-deploy-logs',
    product: 'website-bundle',
    name: 'WorkloadDeployLogsWidget',
    component: WorkloadDeployLogsWidget,
    host: 'scroll',
    usage: 'Website Bundle page, FeatureScroll, "Ship a version in seconds".',
    description:
      'The deploy logs of a version: build, upload, application, rules and deploy, then the summary.',
    props: BARE_SCROLL_PROPS,
    controls: { ...FRAMED_CONTROLS, interval: 'number' }
  },
  {
    key: 'cli-terminal-deploy',
    product: 'website-bundle',
    name: 'CliTerminalDeployWidget',
    component: CliTerminalDeployWidget,
    host: 'cli',
    usage:
      'Website Bundle page, the CliTerminal band "Deploy your first function in two commands".',
    description: 'A terminal session that links a project and deploys it with the Azion CLI.',
    props: {},
    controls: { active: 'boolean' }
  },
  ...BUILT_IN
].map((widget) => ({ ...widget, component: markRaw(widget.component) }))

const PRODUCTS = [
  [
    'workloads',
    'Workloads',
    'The workload hero flow, its deploy, domain and rollout fragments, and the overview, topology and deployments screens.'
  ],
  [
    'applications',
    'Applications',
    'An application version and the create methods, device groups and rule phases it is built from.'
  ],
  ['cache', 'Cache', 'Cache settings, rules and functions, drawn in the legacy console.'],
  [
    'application-accelerator',
    'Application Accelerator',
    'Advanced cache keys by cookie, method and query string, drawn in the legacy console.'
  ],
  ['functions', 'Functions', 'The three start paths of a function: agent, Console and terminal.'],
  [
    'ai-inference',
    'AI Inference',
    'Templates, model choice and the function that calls the model.'
  ],
  ['sql-database', 'SQL Database', 'Tables, queries and rows of a database.'],
  [
    'kv-store',
    'KV Store',
    'Keys, the function that writes them and the security lists read from them, drawn in the legacy console.'
  ],
  ['object-storage', 'Object Storage', 'Buckets, the file browser and bucket access.'],
  ['edge-dns', 'Edge DNS', 'Records, nameservers and DNSSEC of a zone.'],
  [
    'load-balancer',
    'Load Balancer',
    'Origin addresses, balancing method and redundancy, drawn in the legacy console.'
  ],
  [
    'firewall',
    'Firewall',
    'Firewall modules, rule order and functions, drawn in the legacy console.'
  ],
  [
    'web-application-firewall',
    'WAF',
    'Threat families, the WAF rule and allowed rules, drawn in the legacy console.'
  ],
  [
    'ddos-protection',
    'DDoS Protection',
    'The DDoS module, the attack in requests and its HTTP events, drawn in the legacy console.'
  ],
  [
    'network-shield',
    'Network Shield',
    'Network lists and the firewall rules that match them, drawn in the legacy console.'
  ],
  [
    'bot-manager',
    'Bot Manager',
    'Mocks of the firewall rule that sends traffic to Bot Manager, its traffic classification and its dashboards, drawn in the legacy console.'
  ],
  [
    'image-processor',
    'Image Processor',
    'The Image Processor module, its rules and its events, drawn in the legacy console.'
  ],
  [
    'data-stream',
    'Data Stream',
    'Stream source, workload scope and connector, drawn in the legacy console.'
  ],
  ['real-time-events', 'Real-Time Events', 'The events filter, volume chart and log.'],
  [
    'real-time-metrics',
    'Real-Time Metrics',
    'Metric panels, the period filter and dashboard groups.'
  ],
  [
    'website-bundle',
    'Website Bundle',
    'The workload FeatureScroll screens and the CLI deploy terminal.'
  ]
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
          'Console mockups the Site draws its product bands with. Each widget is a ShellMockup frame composed of staggered ShellMockup.Part beats, scaled to fit whatever cell hosts it. They ship in webkit as ProductWidget, picked by name.'
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
          frame of staggered ShellMockup.Part beats that scales to its host, replays its entrance when it
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
export const BotManagerRule = widgetStory('bot-manager-rule')
export const BotManagerTraffic = widgetStory('bot-manager-traffic')
export const BotManagerMetrics = widgetStory('bot-manager-metrics')
export const WorkloadTopologyFlow = widgetStory('workload-topology-flow')
export const WorkloadRolloutRows = widgetStory('workload-rollout-rows')
export const WorkloadTopologyChain = widgetStory('workload-topology-chain')
export const WorkloadDeployLogs = widgetStory('workload-deploy-logs')
export const CliTerminalDeploy = widgetStory('cli-terminal-deploy')
export const ApplicationsCreateMethod = widgetStory('applications-create-method')
export const ApplicationsDeviceGroup = widgetStory('applications-device-group')
export const ApplicationsRulePhases = widgetStory('applications-rule-phases')
export const ApplicationAcceleratorCookie = widgetStory('application-accelerator-cookie')
export const ApplicationAcceleratorMethod = widgetStory('application-accelerator-method')
export const ApplicationAcceleratorQueryString = widgetStory('application-accelerator-query-string')
export const AiInferenceTemplate = widgetStory('ai-inference-template')
export const AiInferenceModel = widgetStory('ai-inference-model')
export const AiInferenceFunction = widgetStory('ai-inference-function')
export const SqlDatabaseTable = widgetStory('sql-database-table')
export const SqlDatabaseQuery = widgetStory('sql-database-query')
export const SqlDatabaseRow = widgetStory('sql-database-row')
export const KvStoreKey = widgetStory('kv-store-key')
export const KvStoreFunction = widgetStory('kv-store-function')
export const KvStoreSecurityList = widgetStory('kv-store-security-list')
export const ObjectStorageBuckets = widgetStory('object-storage-buckets')
export const ObjectStorageBrowser = widgetStory('object-storage-browser')
export const ObjectStorageAccess = widgetStory('object-storage-access')
export const EdgeDnsRecord = widgetStory('edge-dns-record')
export const EdgeDnsNameserver = widgetStory('edge-dns-nameserver')
export const EdgeDnsDnssec = widgetStory('edge-dns-dnssec')
export const LoadBalancerAddress = widgetStory('load-balancer-address')
export const LoadBalancerMethod = widgetStory('load-balancer-method')
export const LoadBalancerOrigins = widgetStory('load-balancer-origins')
export const FirewallModules = widgetStory('firewall-modules')
export const FirewallRulesOrder = widgetStory('firewall-rules-order')
export const FirewallFunction = widgetStory('firewall-function')
export const WafThreat = widgetStory('waf-threat')
export const WafFirewallRule = widgetStory('waf-firewall-rule')
export const WafAllowedRule = widgetStory('waf-allowed-rule')
export const DdosFirewallModules = widgetStory('ddos-firewall-modules')
export const DdosRequestsMetric = widgetStory('ddos-requests-metric')
export const DdosHttpEvents = widgetStory('ddos-http-events')
export const NetworkShieldLists = widgetStory('network-shield-lists')
export const NetworkShieldIpList = widgetStory('network-shield-ip-list')
export const NetworkShieldRule = widgetStory('network-shield-rule')
export const ImageProcessorModule = widgetStory('image-processor-module')
export const ImageProcessorRule = widgetStory('image-processor-rule')
export const ImageProcessorEvents = widgetStory('image-processor-events')
export const DataStreamSource = widgetStory('data-stream-source')
export const DataStreamSampling = widgetStory('data-stream-sampling')
export const DataStreamConnector = widgetStory('data-stream-connector')
export const RealTimeEventsFilter = widgetStory('real-time-events-filter')
export const RealTimeEventsVolume = widgetStory('real-time-events-volume')
export const RealTimeEventsLog = widgetStory('real-time-events-log')
export const RealTimeMetricsPanel = widgetStory('real-time-metrics-panel')
export const RealTimeMetricsFilter = widgetStory('real-time-metrics-filter')
export const RealTimeMetricsDashboard = widgetStory('real-time-metrics-dashboard')

import {
  GATEWAY_REQUEST_PATH,
  GRADUAL_ROLLOUT,
  ISOLATE_PER_REQUEST,
  LATENCY_ROUTING,
  MODEL_ROUTING,
  PROVIDER_FAILOVER,
  RESPONSE_CACHE,
  WORKLOAD_REQUEST_PATH,
  WORKLOAD_SECURITY
} from '../../../../webkit-sample/src/site/data/diagrams.js'
import {
  PRODUCT_ARCHITECTURE_GROUPS,
  PRODUCT_ARCHITECTURES
} from '../../../../webkit-sample/src/site/data/product-architectures.js'
import Diagram from '../../../../webkit-sample/src/site/ui/diagram/Diagram.vue'
import {
  CodeBlock,
  PageContainer,
  PageHeader,
  PageSection
} from '../../foundations/components/layout/index.js'

const PAGE_DIAGRAMS = [
  ['WORKLOAD_REQUEST_PATH', 'Workloads · Request path', WORKLOAD_REQUEST_PATH],
  ['ISOLATE_PER_REQUEST', 'Workloads · Isolate per request', ISOLATE_PER_REQUEST],
  ['GRADUAL_ROLLOUT', 'Workloads · Gradual rollout', GRADUAL_ROLLOUT],
  ['WORKLOAD_SECURITY', 'Workloads · Security on the workload', WORKLOAD_SECURITY],
  ['GATEWAY_REQUEST_PATH', 'AI Gateway · Request path', GATEWAY_REQUEST_PATH],
  ['PROVIDER_FAILOVER', 'AI Gateway · Provider failover', PROVIDER_FAILOVER],
  ['MODEL_ROUTING', 'AI Gateway · Cost routing', MODEL_ROUTING],
  ['LATENCY_ROUTING', 'AI Gateway · Latency routing', LATENCY_ROUTING],
  ['RESPONSE_CACHE', 'AI Gateway · Response cache', RESPONSE_CACHE]
].map(([name, title, spec]) => ({ name, title, spec }))

const GROUPS = PRODUCT_ARCHITECTURE_GROUPS.map((group) => ({
  ...group,
  architectures: PRODUCT_ARCHITECTURES.filter((architecture) => architecture.group === group.key)
}))

const NODE_KINDS = [
  ['pill', 'A small rounded label: the user, a request, a yes/no question.'],
  [
    'card',
    'A product or a platform step: a header row with the glyph, the product name and a status chip, then the title.'
  ],
  [
    'item',
    'A leaf: glyph, title and a mono line under it, with an optional status chip. Models, origins, records, outcomes.'
  ],
  ['app', 'A quiet browser window that stands for the caller’s application.'],
  ['tile', 'An icon-only box whose title shows on hover.']
]

const LAYOUT_ITEMS = [
  ['{ node }', 'One leaf, by key.'],
  [
    '{ row: [...] }',
    'Left to right at container width 6xl, stacked below it. gap: ‘wide’ leaves room for edge labels.'
  ],
  ['{ branches: [...] }', 'Stacked alternatives that fan out of the item before them.'],
  ['{ grid: [...] }', 'Two or three columns of leaves.'],
  [
    '{ group, label, content }',
    'A labelled frame around a sub-layout; edges can attach to the group key.'
  ]
]

const SPEC_SAMPLE = `export const KV_STORE = {
  nodes: [
    { key: 'user', kind: 'pill', title: 'Request', icon: 'pi pi-user', active: true },
    { key: 'function', kind: 'card', eyebrow: 'Functions', title: 'session-check', icon: 'ai ai-edge-functions', active: true },
    { key: 'kv', kind: 'card', eyebrow: 'KV Store', title: 'sessions namespace', icon: 'ai ai-edge-kv', status: { label: 'Low latency', severity: 'success' }, active: true, lit: true },
    { key: 'get', kind: 'item', eyebrow: 'get', title: 'Value from the edge', icon: 'pi pi-bolt', active: true },
    { key: 'put', kind: 'item', eyebrow: 'put', title: 'Replicated everywhere', icon: 'pi pi-globe' }
  ],
  layout: {
    gap: 'wide',
    row: [{ node: 'user' }, { node: 'function' }, { node: 'kv' }, { branches: [{ node: 'get' }, { node: 'put' }] }]
  },
  edges: [
    { from: 'user', to: 'function', active: true },
    { from: 'function', to: 'kv', active: true },
    { from: 'kv', to: 'get', label: 'read', active: true },
    { from: 'kv', to: 'put', label: 'write' }
  ]
}`

const USAGE_SAMPLE = `import Diagram from '@site/ui/diagram/Diagram.vue'
import { PRODUCT_ARCHITECTURES, PLATFORM_ARCHITECTURE_BAND } from '@site/data/product-architectures.js'

const kv = PRODUCT_ARCHITECTURES.find((architecture) => architecture.key === 'kv-store')

// One diagram, standalone
<Diagram :spec="kv.spec" :label="kv.ariaLabel" />

// Several diagrams on a page go through an ArchitectureTabs section
sections: [PLATFORM_ARCHITECTURE_BAND]`

const FRAME_CLASS =
  'm-0 flex w-full flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)'

const CAPTION_CLASS =
  'flex flex-col gap-(--spacing-xxs) border-t border-(--border-default) bg-(--bg-canvas) p-(--spacing-md)'

export default {
  title: 'Foundations/Assets/Diagrams',
  parameters: {
    options: { showPanel: true },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Architecture diagrams the Site draws its product bands with. Each one is a data spec (nodes, a layout tree and edges) rendered by the Diagram engine in the sample app: real CSS layout that reflows below the container breakpoint, connectors measured from the laid-out nodes, and only design tokens for every size, stroke and colour. One starter architecture ships per Azion product, grouped the way the products page groups them.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

export const Library = {
  name: 'Library',
  parameters: { options: { showPanel: false } },
  render: () => ({
    components: { PageContainer, PageHeader, PageSection, CodeBlock, Diagram },
    setup() {
      return {
        GROUPS,
        PAGE_DIAGRAMS,
        NODE_KINDS,
        LAYOUT_ITEMS,
        SPEC_SAMPLE,
        USAGE_SAMPLE,
        FRAME_CLASS,
        CAPTION_CLASS,
        total: PRODUCT_ARCHITECTURES.length
      }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Diagrams">
          {{ total }} starter architectures, one per Azion product, plus the page diagrams the
          Workloads and AI Gateway pages already plot. Every diagram is a spec in the sample app
          under site/data, drawn by site/ui/diagram. The highlighted path is the request the product
          is about; the lit node is the product itself. Resize the canvas to watch a row fold into a
          column below the container breakpoint.
        </PageHeader>

        <PageSection
          v-for="group in GROUPS"
          :key="group.key"
          :title="group.label"
          :description="group.title + '. ' + group.description"
        >
          <div class="flex flex-col gap-(--spacing-lg)">
            <figure v-for="architecture in group.architectures" :key="architecture.key" :class="FRAME_CLASS">
              <Diagram :spec="architecture.spec" :label="architecture.ariaLabel" />
              <figcaption :class="CAPTION_CLASS">
                <span class="text-label-md text-(--text-default)">{{ architecture.title }}</span>
                <span class="text-body-sm text-(--text-muted)">{{ architecture.summary }}</span>
                <code class="font-code text-code text-(--text-muted)">PRODUCT_ARCHITECTURES · key: '{{ architecture.key }}'</code>
              </figcaption>
            </figure>
          </div>
        </PageSection>

        <PageSection title="Page diagrams" description="Diagrams a product page plots beyond its starter architecture, exported by name from site/data/diagrams.js. The Workloads and AI Gateway ArchitectureTabs bands use these.">
          <div class="flex flex-col gap-(--spacing-lg)">
            <figure v-for="entry in PAGE_DIAGRAMS" :key="entry.name" :class="FRAME_CLASS">
              <Diagram :spec="entry.spec" :label="entry.title" />
              <figcaption :class="CAPTION_CLASS">
                <span class="text-label-md text-(--text-default)">{{ entry.title }}</span>
                <code class="font-code text-code text-(--text-muted)">import { {{ entry.name }} } from '@site/data/diagrams.js'</code>
              </figcaption>
            </figure>
          </div>
        </PageSection>

        <PageSection title="Anatomy of a spec" description="A spec is three lists. Nodes are the leaves, each with a key, a kind and its text; the layout is a tree of rows, branches, grids and groups that places them; the edges name the connectors between keys. active marks the highlighted path and lit the one node the diagram is about.">
          <div class="flex flex-col gap-(--spacing-lg)">
            <div class="grid gap-(--spacing-md) md:grid-cols-2">
              <div class="flex flex-col gap-(--spacing-xs)">
                <span class="text-label-sm text-(--text-muted)">Node kinds</span>
                <dl class="m-0 flex flex-col gap-(--spacing-xs)">
                  <div v-for="[kind, use] in NODE_KINDS" :key="kind" class="flex flex-col gap-(--spacing-1)">
                    <dt><code class="font-code text-code text-(--text-default)">{{ kind }}</code></dt>
                    <dd class="m-0 text-body-sm text-(--text-muted)">{{ use }}</dd>
                  </div>
                </dl>
              </div>
              <div class="flex flex-col gap-(--spacing-xs)">
                <span class="text-label-sm text-(--text-muted)">Layout items</span>
                <dl class="m-0 flex flex-col gap-(--spacing-xs)">
                  <div v-for="[item, use] in LAYOUT_ITEMS" :key="item" class="flex flex-col gap-(--spacing-1)">
                    <dt><code class="font-code text-code text-(--text-default)">{{ item }}</code></dt>
                    <dd class="m-0 text-body-sm text-(--text-muted)">{{ use }}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <CodeBlock label="The KV Store spec" :content="SPEC_SAMPLE" />
            <CodeBlock label="Using a diagram" :content="USAGE_SAMPLE" />
          </div>
        </PageSection>

        <PageSection title="Adding a diagram" description="Write the spec next to the others in site/data, keep it to one row of four or five columns so it fits an ArchitectureTabs media cell at its 28rem floor, give the product node lit and the request path active, add the entry to PRODUCT_ARCHITECTURES with its group, summary and ariaLabel, and give it a standalone story here. To show several on a page, plot them through the ArchitectureTabs template, never a hand-made tab control.">
        </PageSection>
      </PageContainer>
    `
  })
}

const STANDALONE_CLASS = 'w-full max-w-(--container-7xl)'

const diagramStory = ({ title, spec, label, description }) => ({
  name: title,
  parameters: {
    docs: { description: { story: description } }
  },
  render: () => ({
    components: { Diagram },
    setup: () => ({ spec, label, STANDALONE_CLASS }),
    template: '<Diagram :spec="spec" :label="label" :class="STANDALONE_CLASS" />'
  })
})

const product = (key) => {
  const architecture = PRODUCT_ARCHITECTURES.find((entry) => entry.key === key)
  return diagramStory({
    title: architecture.title,
    spec: architecture.spec,
    label: architecture.ariaLabel,
    description: `${architecture.summary} PRODUCT_ARCHITECTURES, key '${key}'.`
  })
}

const page = (name) => {
  const entry = PAGE_DIAGRAMS.find((candidate) => candidate.name === name)
  return diagramStory({
    title: entry.title,
    spec: entry.spec,
    label: entry.title,
    description: `Page diagram ${name} from site/data/diagrams.js.`
  })
}

export const Workloads = product('workloads')
export const Applications = product('applications')
export const Functions = product('functions')
export const ApplicationAccelerator = product('application-accelerator')
export const Cache = product('cache')
export const ImageProcessor = product('image-processor')
export const LoadBalancer = product('load-balancer')
export const Dns = product('edge-dns')
export const AiInference = product('ai-inference')
export const AiGateway = product('ai-gateway')
export const ObjectStorage = product('object-storage')
export const SqlDatabase = product('sql-database')
export const KvStore = product('kv-store')
export const Waf = product('web-application-firewall')
export const BotManagement = product('bot-manager')
export const Firewall = product('firewall')
export const NetworkShield = product('network-shield')
export const DdosProtection = product('ddos-protection')
export const DataStream = product('data-stream')
export const RealTimeEvents = product('real-time-events')
export const RealTimeMetrics = product('real-time-metrics')

export const IsolatePerRequest = page('ISOLATE_PER_REQUEST')
export const GradualRollout = page('GRADUAL_ROLLOUT')
export const WorkloadSecurity = page('WORKLOAD_SECURITY')
export const ProviderFailover = page('PROVIDER_FAILOVER')
export const CostRouting = page('MODEL_ROUTING')
export const LatencyRouting = page('LATENCY_ROUTING')
export const ResponseCache = page('RESPONSE_CACHE')

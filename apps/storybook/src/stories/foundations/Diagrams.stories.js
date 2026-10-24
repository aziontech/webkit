import Diagram from '@aziontech/webkit/diagram'

import {
  CodeBlock,
  PageContainer,
  PageHeader,
  PageSection
} from '../../foundations/components/layout/index.js'

const GROUPS = [
  {
    key: 'build',
    label: 'Build',
    diagrams: [
      ['workloads', 'Workloads'],
      ['applications', 'Applications'],
      ['functions', 'Functions']
    ]
  },
  {
    key: 'deliver',
    label: 'Deliver',
    diagrams: [
      ['application-accelerator', 'Application Accelerator'],
      ['cache', 'Cache'],
      ['image-processor', 'Image Processor'],
      ['load-balancer', 'Load Balancer'],
      ['edge-dns', 'Edge DNS']
    ]
  },
  {
    key: 'ai',
    label: 'AI',
    diagrams: [
      ['ai-inference', 'AI Inference'],
      ['ai-gateway', 'AI Gateway']
    ]
  },
  {
    key: 'store',
    label: 'Store',
    diagrams: [
      ['object-storage', 'Object Storage'],
      ['sql-database', 'SQL Database'],
      ['kv-store', 'KV Store']
    ]
  },
  {
    key: 'secure',
    label: 'Secure',
    diagrams: [
      ['web-application-firewall', 'WAF'],
      ['bot-manager', 'Bot Manager'],
      ['firewall', 'Firewall'],
      ['network-shield', 'Network Shield'],
      ['ddos-protection', 'DDoS Protection']
    ]
  },
  {
    key: 'observe',
    label: 'Observe',
    diagrams: [
      ['data-stream', 'Data Stream'],
      ['real-time-events', 'Real-Time Events'],
      ['real-time-metrics', 'Real-Time Metrics']
    ]
  },
  {
    key: 'pages',
    label: 'Page diagrams',
    diagrams: [
      ['workloads-isolate-per-request', 'Workloads · Isolate per request'],
      ['workloads-gradual-rollout', 'Workloads · Gradual rollout'],
      ['workloads-security', 'Workloads · Security on the workload'],
      ['ai-gateway-provider-failover', 'AI Gateway · Provider failover'],
      ['ai-gateway-model-routing', 'AI Gateway · Cost routing'],
      ['ai-gateway-latency-routing', 'AI Gateway · Latency routing'],
      ['ai-gateway-response-cache', 'AI Gateway · Response cache']
    ]
  }
].map((group) => ({
  ...group,
  diagrams: group.diagrams.map(([name, title]) => ({ name, title }))
}))

const ENTRIES = GROUPS.flatMap((group) => group.diagrams)

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

const USAGE_SAMPLE = `import Diagram from '@aziontech/webkit/diagram'

// An official diagram, by name; it carries its own description
<Diagram name="kv-store" />

// A diagram the library does not have, as a one-off spec
<Diagram :spec="spec" aria-label="What the diagram shows, in one sentence" />`

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
          'The official diagrams webkit ships, picked by name with `<Diagram name>`. Each one is a data spec (nodes, a layout tree and edges) in the webkit asset library, drawn with real CSS layout that reflows below the container breakpoint, connectors measured from the laid-out nodes, and only design tokens for every size, stroke and colour. One starter architecture ships per Azion product, plus the page diagrams the product pages tab through.'
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
        NODE_KINDS,
        LAYOUT_ITEMS,
        SPEC_SAMPLE,
        USAGE_SAMPLE,
        FRAME_CLASS,
        CAPTION_CLASS,
        total: ENTRIES.length
      }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Diagrams">
          {{ total }} official diagrams in webkit: one starter architecture per Azion product, plus
          the page diagrams the Workloads and AI Gateway pages tab through. Name one with
          Diagram name and it loads with its own description. The highlighted path is the request
          the product is about; the lit node is the product itself. Resize the canvas to watch a row
          fold into a column below the container breakpoint.
        </PageHeader>

        <PageSection v-for="group in GROUPS" :key="group.key" :title="group.label">
          <div class="flex flex-col gap-(--spacing-lg)">
            <figure v-for="entry in group.diagrams" :key="entry.name" :class="FRAME_CLASS">
              <Diagram :name="entry.name" />
              <figcaption :class="CAPTION_CLASS">
                <span class="text-label-md text-(--text-default)">{{ entry.title }}</span>
                <code class="font-code text-code text-(--text-muted)">name="{{ entry.name }}"</code>
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

        <PageSection title="Adding a diagram" description="Add the spec as one file in webkit's diagram library (src/assets/diagrams) with its ariaLabel, register its name, keep it to one row of four or five columns so it fits an ArchitectureTabs media cell at its 28rem floor, give the product node lit and the request path active, and give it a standalone story here. To show several on a page, plot them through the ArchitectureTabs template, never a hand-made tab control.">
        </PageSection>
      </PageContainer>
    `
  })
}

const STANDALONE_CLASS = 'w-full max-w-(--container-7xl)'

const named = (name) => {
  const entry = ENTRIES.find((candidate) => candidate.name === name)
  return {
    name: entry.title,
    parameters: {
      docs: { description: { story: `The official diagram named '${name}'.` } }
    },
    render: () => ({
      components: { Diagram },
      setup: () => ({ name, STANDALONE_CLASS }),
      template: '<Diagram :name="name" :class="STANDALONE_CLASS" />'
    })
  }
}

export const Workloads = named('workloads')
export const Applications = named('applications')
export const Functions = named('functions')
export const ApplicationAccelerator = named('application-accelerator')
export const Cache = named('cache')
export const ImageProcessor = named('image-processor')
export const LoadBalancer = named('load-balancer')
export const Dns = named('edge-dns')
export const AiInference = named('ai-inference')
export const AiGateway = named('ai-gateway')
export const ObjectStorage = named('object-storage')
export const SqlDatabase = named('sql-database')
export const KvStore = named('kv-store')
export const Waf = named('web-application-firewall')
export const BotManagement = named('bot-manager')
export const Firewall = named('firewall')
export const NetworkShield = named('network-shield')
export const DdosProtection = named('ddos-protection')
export const DataStream = named('data-stream')
export const RealTimeEvents = named('real-time-events')
export const RealTimeMetrics = named('real-time-metrics')

export const IsolatePerRequest = named('workloads-isolate-per-request')
export const GradualRollout = named('workloads-gradual-rollout')
export const WorkloadSecurity = named('workloads-security')
export const ProviderFailover = named('ai-gateway-provider-failover')
export const CostRouting = named('ai-gateway-model-routing')
export const LatencyRouting = named('ai-gateway-latency-routing')
export const ResponseCache = named('ai-gateway-response-cache')

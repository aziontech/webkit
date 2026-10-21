import Diagram from '@aziontech/webkit/diagram'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Diagram from '@aziontech/webkit/diagram'"

const REQUEST_PATH = {
  nodes: [
    { key: 'user', kind: 'pill', title: 'User', icon: 'pi pi-user', active: true },
    {
      key: 'routing',
      kind: 'card',
      eyebrow: 'Routing',
      title: 'Nearest data center',
      icon: 'pi pi-directions',
      active: true
    },
    {
      key: 'workload',
      kind: 'card',
      eyebrow: 'Workload',
      title: 'shop.example.com',
      icon: 'ai ai-workloads',
      status: { label: 'Live', severity: 'success' },
      active: true,
      lit: true
    },
    {
      key: 'cache',
      kind: 'item',
      eyebrow: 'Cache',
      title: 'Served from cache',
      icon: 'ai ai-tiered-cache',
      active: true
    },
    {
      key: 'origin',
      kind: 'item',
      eyebrow: 'Origin',
      title: 'origin.example.com',
      icon: 'pi pi-database'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'routing' },
      { node: 'workload' },
      { branches: [{ node: 'cache' }, { node: 'origin' }] }
    ]
  },
  edges: [
    { from: 'user', to: 'routing', active: true },
    { from: 'routing', to: 'workload', active: true },
    { from: 'workload', to: 'cache', label: 'hit', active: true },
    { from: 'workload', to: 'origin', label: 'miss' }
  ]
}

const NODE_KINDS = {
  nodes: [
    { key: 'app', kind: 'app', title: 'App' },
    { key: 'user', kind: 'pill', title: 'User', icon: 'pi pi-user', active: true },
    {
      key: 'gateway',
      kind: 'card',
      eyebrow: 'AI Gateway',
      title: 'Route by cost',
      icon: 'ai ai-gateway',
      status: { label: 'On', severity: 'success' },
      active: true,
      lit: true
    },
    {
      key: 'model',
      kind: 'item',
      eyebrow: 'provider · general',
      title: 'General model',
      icon: 'pi pi-sparkles',
      status: { label: 'Primary', severity: 'info' },
      active: true
    },
    { key: 'cache', kind: 'tile', title: 'Response cache', icon: 'ai ai-tiered-cache' }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'app' },
      { node: 'user' },
      { node: 'gateway' },
      { branches: [{ node: 'model' }, { node: 'cache' }] }
    ]
  },
  edges: [
    { from: 'user', to: 'gateway', label: 'prompt', active: true },
    { from: 'gateway', to: 'model', label: 'route', active: true },
    { from: 'gateway', to: 'cache', label: 'hit' }
  ]
}

const GROUPS = {
  nodes: [
    { key: 'user', kind: 'pill', title: 'User', icon: 'pi pi-user', active: true },
    { key: 'functions', kind: 'tile', title: 'Functions', icon: 'ai ai-edge-functions', lit: true },
    { key: 'cache', kind: 'tile', title: 'Cache', icon: 'ai ai-tiered-cache' },
    { key: 'firewall', kind: 'tile', title: 'Firewall', icon: 'ai ai-edge-firewall' },
    { key: 'storage', kind: 'tile', title: 'Object Storage', icon: 'ai ai-edge-storage' },
    {
      key: 'origin',
      kind: 'item',
      eyebrow: 'Origin',
      title: 'origin.example.com',
      icon: 'pi pi-database'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      {
        group: 'platform',
        label: 'Azion',
        content: {
          grid: [
            { node: 'functions' },
            { node: 'cache' },
            { node: 'firewall' },
            { node: 'storage' }
          ]
        }
      },
      {
        group: 'backend',
        label: 'Your backend',
        kind: 'dashed',
        fill: 'secondary',
        content: { node: 'origin' }
      }
    ]
  },
  edges: [
    { from: 'user', to: 'platform', active: true },
    { from: 'platform', to: 'backend', label: 'miss' }
  ]
}

const specScript = (spec) => `const spec = ${JSON.stringify(spec, null, 2)}`

const meta = {
  title: 'Components/Marketing/Diagram',
  component: Diagram,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A node-and-connector diagram for marketing pages: the request path of an architecture, a routing policy, a product in its place on the platform. Pass one `spec` — the nodes, how they are arranged, and the edges between them — and the diagram lays the nodes out with real CSS, then measures them and draws every connector, port and label on top. Below its container breakpoint the layout stacks into an indented tree and the connectors are measured again, so the figure stays legible on a phone.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    spec: {
      control: 'object',
      description: 'The nodes, their layout and the edges between them.',
      table: {
        category: 'props',
        type: { summary: 'DiagramSpec' }
      }
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible description of the whole diagram; when set, the root is announced as one image with this name.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    }
  },
  args: {
    spec: REQUEST_PATH,
    ariaLabel:
      'A user request is routed to the nearest data center and reaches the workload, which serves it from cache on a hit and from the origin on a miss.'
  }
}

export default meta

const Template = (args) => ({
  components: { Diagram },
  setup() {
    return { args }
  },
  template: '<Diagram v-bind="args" />'
})

const DEFAULT_MARKUP = `<Diagram
  :spec="spec"
  aria-label="A user request is routed to the nearest data center and reaches the workload, which serves it from cache on a hit and from the origin on a miss."
/>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The request path of a workload. The workload is the one `lit` node, the path the request takes is `active` on its nodes and edges, and the row is `wide` so the `hit` and `miss` chips have room. Narrow the canvas and the row stacks, the branches indent under the workload, and the connectors follow.'
      },
      source: { code: toSfc([IMPORT, '', specScript(REQUEST_PATH)], DEFAULT_MARKUP) }
    }
  }
}

const NODE_KINDS_TEMPLATE = `<Diagram
  :spec="spec"
  aria-label="An app sends a prompt to the AI Gateway, which routes it to the general model or answers from the response cache."
/>`

export const NodeKinds = {
  render: () => ({
    components: { Diagram },
    setup: () => ({ spec: NODE_KINDS }),
    template: NODE_KINDS_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'One node of each kind: `app`, the quiet window of the consumer application; `pill`, the client; `card`, a platform piece with its eyebrow, icon and status; `item`, a model or provider with a mono line under its title; and `tile`, an icon-only cell whose name shows on hover.'
      },
      source: { code: toSfc([IMPORT, '', specScript(NODE_KINDS)], NODE_KINDS_TEMPLATE) }
    }
  }
}

const GROUPS_TEMPLATE = `<Diagram
  :spec="spec"
  aria-label="A user request enters the Azion platform, where functions, cache, firewall and storage run, and reaches your backend on a cache miss."
/>`

export const Groups = {
  render: () => ({
    components: { Diagram },
    setup: () => ({ spec: GROUPS }),
    template: GROUPS_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Groups frame part of the layout under a small label, and edges can reach a group as a whole. The platform group holds a `grid` of tiles; the backend group is `dashed` and tinted with the secondary mask to mark it as outside the platform.'
      },
      source: { code: toSfc([IMPORT, '', specScript(GROUPS)], GROUPS_TEMPLATE) }
    }
  }
}

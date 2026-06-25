import Flow from '@aziontech/webkit/flow'
import FlowAnchor from '@aziontech/webkit/flow-anchor'
import FlowList from '@aziontech/webkit/flow-list'
import FlowNode from '@aziontech/webkit/flow-node'
import FlowParallel from '@aziontech/webkit/flow-parallel'

const sfc = (imports, markup) =>
  ['<script setup>', ...imports, '</script>', '', '<template>', markup, '</template>'].join('\n')

const SEQUENTIAL_IMPORTS = [
  "import Flow from '@aziontech/webkit/flow'",
  "import FlowList from '@aziontech/webkit/flow-list'",
  "import FlowNode from '@aziontech/webkit/flow-node'"
]

const DEFAULT_SOURCE = sfc(
  SEQUENTIAL_IMPORTS,
  [
    '  <Flow align="center">',
    '    <FlowList>',
    '      <FlowNode>Source</FlowNode>',
    '      <FlowNode>Transform</FlowNode>',
    '      <FlowNode>Deliver</FlowNode>',
    '    </FlowList>',
    '  </Flow>'
  ].join('\n')
)

const PARALLEL_SOURCE = sfc(
  [...SEQUENTIAL_IMPORTS, "import FlowParallel from '@aziontech/webkit/flow-parallel'"],
  [
    '  <Flow align="center">',
    '    <FlowList>',
    '      <FlowNode>Start</FlowNode>',
    '      <FlowParallel>',
    '        <FlowNode>Validate</FlowNode>',
    '        <FlowNode>Transform</FlowNode>',
    '        <FlowNode>Cache</FlowNode>',
    '        <FlowNode>Index</FlowNode>',
    '      </FlowParallel>',
    '      <FlowNode>End</FlowNode>',
    '    </FlowList>',
    '  </Flow>'
  ].join('\n')
)

const DISABLED_SOURCE = sfc(
  SEQUENTIAL_IMPORTS,
  [
    '  <Flow align="center">',
    '    <FlowList>',
    '      <FlowNode>Source</FlowNode>',
    '      <FlowNode disabled>Archive</FlowNode>',
    '      <FlowNode>Deliver</FlowNode>',
    '    </FlowList>',
    '  </Flow>'
  ].join('\n')
)

/** @type {import('@storybook/vue3').Meta<typeof Flow>} */
const meta = {
  title: 'Components/Data/Flow',
  component: Flow,
  subcomponents: { FlowList, FlowNode, FlowParallel, FlowAnchor },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Flow renders a directed flow diagram: a vertical sequence of steps (`flow-node`) joined by decorative connectors, with optional parallel branches (`flow-parallel`) and custom attachment points (`flow-anchor`).'
      },
      canvas: {
        sourceState: 'shown'
      }
    }
  },
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['start', 'center'],
      description: 'Vertical alignment of nodes within the diagram.',
      table: {
        category: 'props',
        type: { summary: "'start' | 'center'" },
        defaultValue: { summary: "'start'" }
      }
    },
    default: {
      control: false,
      description: 'Diagram content: flow-list, flow-node, flow-parallel.',
      table: { category: 'slots', type: { summary: 'VNode[]' } }
    }
  },
  args: {
    align: 'center'
  }
}

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof Flow>} */
export const Default = {
  render: (args) => ({
    components: { Flow, FlowList, FlowNode },
    setup() {
      return { args }
    },
    template: `
      <Flow v-bind="args">
        <FlowList>
          <FlowNode>Source</FlowNode>
          <FlowNode>Transform</FlowNode>
          <FlowNode>Deliver</FlowNode>
        </FlowList>
      </Flow>
    `
  }),
  parameters: {
    docs: {
      source: { code: DEFAULT_SOURCE },
      description: { story: 'A sequential flow of nodes joined by connectors.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Flow>} */
export const Parallel = {
  render: (args) => ({
    components: { Flow, FlowList, FlowNode, FlowParallel },
    setup() {
      return { args }
    },
    template: `
      <Flow v-bind="args">
        <FlowList>
          <FlowNode>Start</FlowNode>
          <FlowParallel>
            <FlowNode>Validate</FlowNode>
            <FlowNode>Transform</FlowNode>
            <FlowNode>Cache</FlowNode>
            <FlowNode>Index</FlowNode>
          </FlowParallel>
          <FlowNode>End</FlowNode>
        </FlowList>
      </Flow>
    `
  }),
  parameters: {
    docs: {
      source: { code: PARALLEL_SOURCE },
      description: { story: 'Parallel branches with junction connectors.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Flow>} */
export const Disabled = {
  render: (args) => ({
    components: { Flow, FlowList, FlowNode },
    setup() {
      return { args }
    },
    template: `
      <Flow v-bind="args">
        <FlowList>
          <FlowNode>Source</FlowNode>
          <FlowNode disabled>Archive</FlowNode>
          <FlowNode>Deliver</FlowNode>
        </FlowList>
      </Flow>
    `
  }),
  parameters: {
    docs: {
      source: { code: DISABLED_SOURCE },
      description: { story: 'A disabled node with reduced-opacity connectors.' }
    }
  }
}

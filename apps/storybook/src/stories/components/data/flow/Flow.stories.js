import Flow, { FlowAnchor, FlowNode, FlowParallel } from '@aziontech/webkit/flow'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Flow from '@aziontech/webkit/flow'"

// Storybook's vue3-vite docgen does not run on the cross-package webkit SFCs, so the
// autodocs subcomponent tabs have no props table. Attach the docgen info explicitly
// (vue-docgen-api shape) so FlowNode / FlowParallel / FlowAnchor document their API.
FlowNode.__docgenInfo = {
  displayName: 'FlowNode',
  props: [
    {
      name: 'disabled',
      description: 'Marks the step as disabled; adjacent connectors render at reduced opacity.',
      type: { name: 'boolean' },
      defaultValue: { value: 'false' },
      required: false
    },
    {
      name: 'unstyled',
      description: "Drops the default node box so the slot content defines the node's appearance.",
      type: { name: 'boolean' },
      defaultValue: { value: 'false' },
      required: false
    }
  ],
  slots: [{ name: 'default', description: 'Node content.' }]
}

FlowParallel.__docgenInfo = {
  displayName: 'FlowParallel',
  props: [
    {
      name: 'align',
      description: 'Horizontal alignment of the parallel branches.',
      type: { name: "'start' | 'end'" },
      defaultValue: { value: "'start'" },
      required: false
    }
  ],
  slots: [{ name: 'default', description: 'Parallel branch nodes (one per branch).' }]
}

FlowAnchor.__docgenInfo = {
  displayName: 'FlowAnchor',
  props: [
    {
      name: 'type',
      description:
        'Which connector attaches here: end is the incoming endpoint, start the outgoing origin; omitted marks both.',
      type: { name: "'start' | 'end'" },
      required: false
    }
  ],
  slots: [{ name: 'default', description: 'The content the connector attaches to.' }]
}

const components = {
  Flow,
  // Compound sub-components registered under their dot-notation names so they
  // resolve in Storybook's runtime-compiled string templates: Vue compiles
  // `<Flow.Node>` to `resolveComponent("Flow.Node")`, an exact-name lookup (a
  // bare `Flow` registration does not satisfy it). In a real SFC the dotted tag
  // resolves off the imported `Flow` binding, so consumer code needs only
  // `import Flow` — these extra registrations are a Storybook-runtime concern.
  'Flow.Node': FlowNode,
  'Flow.Parallel': FlowParallel,
  'Flow.Anchor': FlowAnchor
}

/** @type {import('@storybook/vue3').Meta<typeof Flow>} */
const meta = {
  title: 'Components/Data/Flow',
  component: Flow,
  subcomponents: { FlowNode, FlowParallel, FlowAnchor },
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
          'Flow renders a directed flow diagram: a horizontal sequence of steps (`Flow.Node`) joined by decorative connectors, with optional parallel branches (`Flow.Parallel`) and custom connector-attachment points (`Flow.Anchor`). Steps are direct children of `Flow`; mark a node `unstyled` to let its slot content define the node entirely. Import only `Flow` and reach the parts via dot-notation.'
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
      description: 'Diagram content: Flow.Node and Flow.Parallel, in flow order.',
      table: { category: 'slots', type: { summary: 'VNode[]' } }
    }
  },
  args: {
    align: 'center'
  }
}

export default meta

const Template = (args) => ({
  components,
  setup() {
    return { args }
  },
  template: `
    <Flow v-bind="args">
      <Flow.Node>Source</Flow.Node>
      <Flow.Node>Transform</Flow.Node>
      <Flow.Node>Deliver</Flow.Node>
    </Flow>
  `
})

const DEFAULT_MARKUP = `<Flow align="center">
  <Flow.Node>Source</Flow.Node>
  <Flow.Node>Transform</Flow.Node>
  <Flow.Node>Deliver</Flow.Node>
</Flow>`

/** @type {import('@storybook/vue3').StoryObj<typeof Flow>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'A sequential flow of nodes joined by connectors.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const PARALLEL_TEMPLATE = `<Flow align="center">
  <Flow.Node>Start</Flow.Node>
  <Flow.Parallel>
    <Flow.Node>Branch A</Flow.Node>
    <Flow.Node>Branch B</Flow.Node>
    <Flow.Node>Branch C</Flow.Node>
  </Flow.Parallel>
  <Flow.Node>End</Flow.Node>
</Flow>`

/** @type {import('@storybook/vue3').StoryObj<typeof Flow>} */
export const Parallel = {
  render: () => ({ components, template: PARALLEL_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'A parallel group fans out from the previous node and back into the next.'
      },
      source: { code: toSfc(IMPORT, PARALLEL_TEMPLATE) }
    }
  }
}

const BRANCHES_TEMPLATE = `<Flow align="center">
  <Flow.Parallel>
    <Flow.Node>HTTP Trigger</Flow.Node>
    <Flow.Node>Cron Trigger</Flow.Node>
  </Flow.Parallel>
  <Flow.Node>Process Request</Flow.Node>
  <Flow.Parallel>
    <Flow.Node>Log Analytics</Flow.Node>
    <Flow.Node>Update Cache</Flow.Node>
    <Flow.Node>Send Notification</Flow.Node>
  </Flow.Parallel>
  <Flow.Node>Complete</Flow.Node>
</Flow>`

/** @type {import('@storybook/vue3').StoryObj<typeof Flow>} */
export const Branches = {
  render: () => ({ components, template: BRANCHES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A leading parallel fans in and a trailing parallel fans out — connectors route correctly at the edges of the sequence.'
      },
      source: { code: toSfc(IMPORT, BRANCHES_TEMPLATE) }
    }
  }
}

const CUSTOM_NODES_TEMPLATE = `<Flow align="center">
  <Flow.Node unstyled class="size-4 rounded-full bg-[var(--border-default)]" />
  <Flow.Node>my-worker</Flow.Node>
  <Flow.Node
    unstyled
    class="rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-[var(--spacing-sm)] py-[var(--spacing-xl)] text-label-md text-[var(--text-default)]"
  >
    Taller node
  </Flow.Node>
</Flow>`

/** @type {import('@storybook/vue3').StoryObj<typeof Flow>} */
export const CustomNodes = {
  render: () => ({ components, template: CUSTOM_NODES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Unstyled nodes whose slot content defines the appearance: a start dot, the default box, and a taller custom node.'
      },
      source: { code: toSfc(IMPORT, CUSTOM_NODES_TEMPLATE) }
    }
  }
}

const ANCHORED_TEMPLATE = `<Flow align="center">
  <Flow.Node>Load balancer</Flow.Node>
  <Flow.Node unstyled>
    <div class="rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface-overlay)]">
      <Flow.Anchor type="end">
        <div class="flex h-10 items-center px-[var(--spacing-sm)] text-label-md text-[var(--text-muted)]">
          my-worker
        </div>
      </Flow.Anchor>
      <Flow.Anchor type="start">
        <div class="m-[var(--spacing-xxs)] mt-0 flex items-center gap-[var(--spacing-sm)] rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-label-md text-[var(--text-default)]">
          Bindings <span class="text-[var(--text-muted)]">2</span>
        </div>
      </Flow.Anchor>
    </div>
  </Flow.Node>
  <Flow.Parallel>
    <Flow.Node>DATABASE</Flow.Node>
    <Flow.Node>OTHER_SERVICE</Flow.Node>
  </Flow.Parallel>
</Flow>`

/** @type {import('@storybook/vue3').StoryObj<typeof Flow>} */
export const AnchoredNode = {
  render: () => ({ components, template: ANCHORED_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A multi-row card: the incoming connector attaches at the `end` anchor (my-worker) and the outgoing connectors leave from the `start` anchor (Bindings).'
      },
      source: { code: toSfc(IMPORT, ANCHORED_TEMPLATE) }
    }
  }
}

const DISABLED_TEMPLATE = `<Flow align="center">
  <Flow.Node>Source</Flow.Node>
  <Flow.Node disabled>Archive</Flow.Node>
  <Flow.Node>Deliver</Flow.Node>
</Flow>`

/** @type {import('@storybook/vue3').StoryObj<typeof Flow>} */
export const Disabled = {
  render: () => ({ components, template: DISABLED_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'A disabled node with reduced-opacity connectors.' },
      source: { code: toSfc(IMPORT, DISABLED_TEMPLATE) }
    }
  }
}

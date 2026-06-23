import Message from '@aziontech/webkit/message'

/** @type {import('@storybook/vue3').Meta<typeof Message>} */
const meta = {
 title: 'Components/Feedback/Message',
  component: Message,
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
        component: [
          'Inline feedback banner that communicates status, alerts, or progress. Presents a severity-colored surface with icon, title, optional description, and an optional text action aligned to Figma Message (478:892).',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import Message from '@aziontech/webkit/message'",
          '</script>',
          '',
          '<template>',
          '  <Message',
          '    severity="info"',
          '    title="Info message"',
          '    description="A brief description of the message."',
          '    action-label="Label"',
          '    closable',
          '    :life="5000"',
          '    @close="handleClose"',
          '  />',
          '</template>',
          '```'
        ].join('\n')
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true
      },
      canvas: {
        sourceState: 'shown'
      }
    }
  },
  argTypes: {
    severity: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger', 'error'],
      description: 'Visual severity variant (maps Error to danger).',
      table: {
        category: 'props',
        type: { summary: "'info' | 'success' | 'warning' | 'danger' | 'error'" },
        defaultValue: { summary: "'info'" }
      }
    },
    title: {
      control: 'text',
      description: 'Primary message heading.',
      table: { category: 'props', type: { summary: 'string', required: true } }
    },
    description: {
      control: 'text',
      description: 'Supporting body copy below the title.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class override for the leading icon.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    actionLabel: {
      control: 'text',
      description: 'Label for the built-in text action button; hidden when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    closable: {
      control: 'boolean',
      description: 'When true, shows a close control that dismisses the message.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    life: {
      control: 'number',
      description: 'Duration in milliseconds before auto-dismiss; `0` disables auto-dismiss.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    onAction: {
      action: 'action',
      description: 'Emitted when the built-in action button is clicked.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    },
    onClose: {
      action: 'close',
      description: 'Emitted when the message is dismissed manually or after `life` expires.',
      table: { category: 'events', type: { summary: 'void' } }
    }
  },
  args: {
    severity: 'info',
    title: 'Info message',
    description: 'A brief description of the message.',
    actionLabel: 'Label',
    icon: '',
    closable: false,
    life: 0
  }
}

export default meta

const messageRemountKey = (args) =>
  JSON.stringify({
    severity: args.severity,
    title: args.title,
    description: args.description,
    icon: args.icon,
    actionLabel: args.actionLabel,
    closable: args.closable,
    life: args.life
  })

const Template = (args) => ({
  components: { Message },
  setup() {
    const { onAction, onClose, ...props } = args

    return { props, onAction, onClose, remountKey: messageRemountKey(args) }
  },
  template: '<Message :key="remountKey" v-bind="props" @action="onAction" @close="onClose" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Message>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default info message with title, description, and action.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Message>} */
export const Types = {
  render: () => ({
    components: { Message },
    template: `
      <div class="flex w-full flex-col gap-4">
        <Message
          severity="info"
          title="Info message"
          description="A brief description of the message."
          action-label="Label"
        />
        <Message
          severity="success"
          title="Success message"
          description="A brief description of the message."
          action-label="Label"
        />
        <Message
          severity="warning"
          title="Warning message"
          description="A brief description of the message."
          action-label="Label"
        />
        <Message
          severity="danger"
          title="Error message"
          description="A brief description of the message."
          action-label="Label"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All severity variants stacked.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Message>} */
export const Closable = {
  args: {
    closable: true
  },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Closable message with a dismiss control on the trailing edge.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Message>} */
export const AutoDismiss = {
  args: {
    life: 5000,
    actionLabel: ''
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Auto-dismisses after 5 seconds when `life` is greater than zero.'
      }
    }
  }
}

import Message from '@aziontech/webkit/feedback/message'

const severities = ['info', 'success', 'warning', 'danger']

export default {
  title: 'Webkit/Feedback/Message',
  component: Message,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    }
  },
  argTypes: {
    severity: {
      control: 'select',
      options: severities,
      description: 'Visual severity variant (Figma: Info, Success, Warning, Error)'
    },
    title: {
      control: 'text',
      description: 'Message title'
    },
    description: {
      control: 'text',
      description: 'Supporting description text'
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class override'
    },
    actionLabel: {
      control: 'text',
      description: 'Action button label (hidden when empty)'
    }
  }
}

export const Default = {
  args: {
    severity: 'info',
    title: 'Info message',
    description: 'A brief description of the message.',
    actionLabel: 'Label'
  },
  render: (args) => ({
    components: { Message },
    setup() {
      return { args }
    },
    template: `
      <Message v-bind="args" />
    `
  })
}

export const Severities = {
  render: () => ({
    components: { Message },
    template: `
      <div class="flex max-w-[31rem] flex-col gap-4">
        <Message
          v-for="severity in ['info', 'success', 'warning', 'danger']"
          :key="severity"
          :severity="severity"
          :title="{
            info: 'Info message',
            success: 'Success message',
            warning: 'Warning message',
            danger: 'Error message'
          }[severity]"
          description="A brief description of the message."
          action-label="Label"
        />
      </div>
    `
  })
}

export const WithoutAction = {
  args: {
    severity: 'info',
    title: 'Info message',
    description: 'A brief description of the message.',
    actionLabel: ''
  },
  render: (args) => ({
    components: { Message },
    setup() {
      return { args }
    },
    template: `
      <Message v-bind="args" />
    `
  })
}

export const CustomAction = {
  render: () => ({
    components: { Message },
    template: `
      <Message
        severity="info"
        title="Info message"
        description="A brief description of the message."
      >
        <template #action>
          <button
            type="button"
            class="rounded-[var(--shape-button)] bg-[var(--bg-mask)] px-[var(--spacing-2)] py-1 text-[length:var(--text-button-md-font-size,0.75rem)] font-medium text-[var(--text-default)]"
            data-testid="feedback-message__action"
          >
            Custom action
          </button>
        </template>
      </Message>
    `
  })
}

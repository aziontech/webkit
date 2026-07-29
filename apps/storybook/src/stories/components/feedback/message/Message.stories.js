import Message from '@aziontech/webkit/message'
import { computed } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Message from '@aziontech/webkit/message'"

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
        component:
          'Inline feedback banner that communicates status, alerts, or progress. Presents a severity-colored surface with a leading icon and a single line of message copy that may carry inline links, plus an optional text action.'
      },
      canvas: { sourceState: 'shown' }
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
    size: {
      control: 'inline-radio',
      options: ['small', 'medium'],
      description: 'Size token. Drives the banner height, inline padding, and copy scale.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    label: {
      control: 'text',
      description: 'Fallback message copy when the default slot is empty.',
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
    },
    default: {
      control: false,
      description:
        'Message copy. Accepts inline content — plain text plus anchors, which the message region styles with the `.text-link` token. Falls back to `label` when empty.',
      table: { category: 'slots' }
    },
    action: {
      control: false,
      description: 'Custom action control; replaces the built-in text action button when provided.',
      table: { category: 'slots' }
    }
  },
  args: {
    severity: 'info',
    size: 'medium',
    label: 'Your workload finished deploying in 42 seconds.',
    actionLabel: 'Label',
    icon: '',
    closable: false,
    life: 0
  }
}

export default meta

const Template = (args) => ({
  components: { Message },
  setup() {
    // Dismissal (close control / `life` expiry) unmounts the message; remount
    // whenever a control changes so the canvas recovers without a page reload.
    const remountKey = computed(() =>
      JSON.stringify({
        severity: args.severity,
        size: args.size,
        label: args.label,
        icon: args.icon,
        actionLabel: args.actionLabel,
        closable: args.closable,
        life: args.life
      })
    )
    return { args, remountKey }
  },
  template: '<Message :key="remountKey" v-bind="args" />'
})

const DEFAULT_MARKUP = `<Message
  severity="info"
  label="Your workload finished deploying in 42 seconds."
  action-label="Label"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof Message>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default info message: leading icon, one line of copy, and an action.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex w-full flex-col gap-4">
  <Message
    severity="info"
    label="Your workload finished deploying in 42 seconds."
    action-label="Label"
  />
  <Message
    severity="success"
    label="The certificate was issued and is now serving traffic."
    action-label="Label"
  />
  <Message
    severity="warning"
    label="This edge function is close to its execution time limit."
    action-label="Label"
  />
  <Message
    severity="danger"
    label="The last deploy failed before reaching the edge."
    action-label="Label"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Message>} */
export const Types = {
  render: () => ({ components: { Message }, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All severity variants stacked.' },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex w-full flex-col gap-4">
  <Message
    severity="info"
    size="small"
    label="A small note."
  />
  <Message
    severity="info"
    size="medium"
    label="A medium note."
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Message>} */
export const Sizes = {
  render: () => ({ components: { Message }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Both size tokens. `small` is a 32px banner with 8px inline padding and `.text-body-xs` copy; `medium` (the default) is 36px with 12px inline padding and `.text-body-sm`. Block padding stays 6px in both. A trailing action or close control tightens the end edge to 8px and lets the banner grow past the floor.'
      },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const WITH_LINKS_TEMPLATE = `<div class="flex w-full flex-col gap-4">
  <Message severity="info">
    Requests are now served from 4 new edge locations.
    <a href="/docs/edge-locations">See the full list</a>.
  </Message>
  <Message severity="warning">
    This workload is close to its request limit. Review the
    <a href="/billing/usage">usage report</a>
    or
    <a href="/billing/plans">upgrade the plan</a>
    to avoid throttling.
  </Message>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Message>} */
export const WithLinks = {
  render: () => ({ components: { Message }, template: WITH_LINKS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Copy passed through the default slot may carry inline anchors. The message region styles every descendant `a` with the `.text-link` token — underlined, token-colored, and focusable — so a plain `<a href>` needs no wrapper component.'
      },
      source: { code: toSfc(IMPORT, WITH_LINKS_TEMPLATE) }
    }
  }
}

const CLOSABLE_MARKUP = `<Message
  severity="info"
  label="Your workload finished deploying in 42 seconds."
  action-label="Label"
  closable
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof Message>} */
export const Closable = {
  args: { closable: true },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Closable message with a dismiss control on the trailing edge.' },
      source: { code: toSfc(IMPORT, CLOSABLE_MARKUP) }
    }
  }
}

const AUTO_DISMISS_MARKUP = `<Message
  severity="info"
  label="Your workload finished deploying in 42 seconds."
  :life="5000"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof Message>} */
export const AutoDismiss = {
  args: { life: 5000, actionLabel: '' },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Auto-dismisses after 5 seconds when `life` is greater than zero.' },
      source: { code: toSfc(IMPORT, AUTO_DISMISS_MARKUP) }
    }
  }
}

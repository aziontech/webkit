import CopyButton from '@aziontech/webkit/copy-button'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import CopyButton from '@aziontech/webkit/copy-button'"

/** @type {import('@storybook/vue3').Meta<typeof CopyButton>} */
const meta = {
  title: 'Components/Actions/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
          'Icon-only control that copies a string to the clipboard and briefly confirms success. Composes IconButton for visuals and interaction tokens.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Text copied to the clipboard on activation.',
      table: { category: 'props', type: { summary: 'string', required: true } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name while idle.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'Copy'" } }
    },
    copiedLabel: {
      control: 'text',
      description: 'Accessible name while the copied state is shown.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Copied'" }
      }
    },
    kind: {
      control: 'select',
      options: ['primary', 'secondary', 'outlined', 'transparent', 'danger'],
      description: 'Visual variant forwarded to IconButton.',
      table: {
        category: 'props',
        type: { summary: "'primary' | 'secondary' | 'outlined' | 'transparent' | 'danger'" },
        defaultValue: { summary: "'transparent'" }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size token forwarded to IconButton.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'small'" }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    onCopy: {
      action: 'copy',
      description: 'Emitted after a successful clipboard write with the copied value.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    value: 'https://example.com/deploy/abc123',
    ariaLabel: 'Copy',
    copiedLabel: 'Copied',
    kind: 'transparent',
    size: 'small',
    disabled: false
  }
}

export default meta

const Template = (args) => ({
  components: { CopyButton },
  setup() {
    return { args }
  },
  template: '<CopyButton v-bind="args" />'
})

const DEFAULT_MARKUP =
  '<CopyButton value="https://example.com/deploy/abc123" ariaLabel="Copy URL" />'

/** @type {import('@storybook/vue3').StoryObj<typeof CopyButton>} */
export const Default = {
  args: { ariaLabel: 'Copy URL' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Idle copy button. Activating it writes the value to the clipboard and briefly confirms success.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const DISABLED_MARKUP =
  '<CopyButton value="https://example.com/deploy/abc123" ariaLabel="Copy URL" disabled />'

/** @type {import('@storybook/vue3').StoryObj<typeof CopyButton>} */
export const Disabled = {
  args: { ariaLabel: 'Copy URL', disabled: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Disabled state — interaction is blocked and disabled tokens are applied.'
      },
      source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
    }
  }
}

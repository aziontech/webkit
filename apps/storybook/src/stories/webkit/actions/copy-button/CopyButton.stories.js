import CopyButton from '@aziontech/webkit/copy-button'

/** @type {import('@storybook/vue3').Meta<typeof CopyButton>} */
const meta = {
  title: 'Webkit/Actions/Copy Button',
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
        component: `\`\`\`vue
<script setup>
import CopyButton from '@aziontech/webkit/copy-button'
</script>

<template>
  <CopyButton value="https://example.com/deploy/abc123" ariaLabel="Copy URL" />
</template>
\`\`\``
      }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Text copied to the clipboard on activation.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name while idle.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'Copy'" } }
    },
    copiedLabel: {
      control: 'text',
      description: 'Accessible name while the copied state is shown.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'Copied'" } }
    },
    kind: {
      control: 'select',
      options: ['primary', 'secondary', 'outlined', 'transparent', 'danger'],
      description: 'Visual variant forwarded to `IconButton`.',
      table: {
        category: 'props',
        type: { summary: "'primary' | 'secondary' | 'outlined' | 'transparent' | 'danger'" },
        defaultValue: { summary: "'outlined'" }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size token forwarded to `IconButton`.',
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
    ariaLabel: 'Copy URL',
    copiedLabel: 'Copied',
    kind: 'outlined',
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
  template: '<CopyButton v-bind="args" @copy="args.onCopy" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof CopyButton>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Outlined copy button with hover/focus tooltip at small size.' } }
  }
}

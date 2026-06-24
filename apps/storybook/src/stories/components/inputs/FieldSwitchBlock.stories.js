import { ref } from 'vue'

import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'

/** @type {import('@storybook/vue3').Meta<typeof FieldSwitchBlock>} */
const meta = {
 title: 'Components/Inputs/Field Switch Block',
  component: FieldSwitchBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
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
          'Card-style boolean toggle with switch, label, description, and optional disabled helper badge inside a bordered block.'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Selected value for v-model.',
      table: { type: { summary: 'boolean' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    label: {
      control: 'text',
      description: 'Primary label text.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    description: {
      control: 'text',
      description: 'Secondary description.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    helperText: {
      control: 'text',
      description: 'Helper badge text shown when disabled.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { type: { summary: 'boolean' }, category: 'events' }
    }
  },
  args: {
    label: 'Switch label',
    description: 'Switch description'
  }
}

export default meta

export const Default = {
  render: () => ({
    components: { FieldSwitchBlock },
    setup() {
      const off = ref(false)
      const on = ref(true)
      return { off, on }
    },
    template: `
      <div class="flex max-w-sm flex-col gap-[var(--spacing-3)]">
        <FieldSwitchBlock
          v-model="off"
          label="Switch label"
          description="Switch description"
        />
        <FieldSwitchBlock
          v-model="on"
          label="Switch label"
          description="Switch description"
        />
      </div>
    `
  })
}

export const Disabled = {
  render: () => ({
    components: { FieldSwitchBlock },
    setup() {
      const value = ref(true)
      return { value }
    },
    template: `
      <FieldSwitchBlock
        v-model="value"
        label="Switch label"
        description="Switch description"
        helper-text="Helper Text"
        disabled
      />
    `
  })
}

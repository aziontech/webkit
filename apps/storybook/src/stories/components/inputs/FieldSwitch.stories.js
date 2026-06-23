import { ref } from 'vue'

import FieldSwitch from '@aziontech/webkit/inputs/field-switch'

/** @type {import('@storybook/vue3').Meta<typeof FieldSwitch>} */
const meta = {
 title: 'Components/Inputs/Field Switch',
  component: FieldSwitch,
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
          'Inline boolean toggle with switch on the leading edge, label, optional description, and optional disabled helper badge.'
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
    components: { FieldSwitch },
    setup() {
      const off = ref(false)
      const on = ref(true)
      return { off, on }
    },
    template: `
      <div class="flex max-w-xs flex-col gap-[var(--spacing-3)]">
        <FieldSwitch
          v-model="off"
          label="Switch label"
          description="Switch description"
          input-id="webkit-field-switch-off"
        />
        <FieldSwitch
          v-model="on"
          label="Switch label"
          description="Switch description"
          input-id="webkit-field-switch-on"
        />
      </div>
    `
  })
}

export const Disabled = {
  render: () => ({
    components: { FieldSwitch },
    setup() {
      const value = ref(true)
      return { value }
    },
    template: `
      <FieldSwitch
        v-model="value"
        label="Switch label"
        description="Switch description"
        helper-text="Helper Text"
        disabled
        input-id="webkit-field-switch-disabled"
      />
    `
  })
}

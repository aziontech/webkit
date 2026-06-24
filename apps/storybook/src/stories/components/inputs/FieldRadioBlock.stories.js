import { ref } from 'vue'

import FieldRadioBlock from '@aziontech/webkit/field-radio-block'

/** @type {import('@storybook/vue3').Meta<typeof FieldRadioBlock>} */
const meta = {
 title: 'Components/Inputs/Field Radio Block',
  component: FieldRadioBlock,
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
          'Card-style option with selected border and background. Use for plan selection or choices that need visual weight.'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Selected value for v-model.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    value: {
      control: 'text',
      description: 'Option value for this radio instance.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    name: {
      control: 'text',
      description: 'HTML name shared across a mutually exclusive group.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    inputId: {
      control: 'text',
      description: 'id for the native input; links label to control.',
      table: { type: { summary: 'string' }, category: 'props' }
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
      table: { type: { summary: 'string' }, category: 'events' }
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
    components: { FieldRadioBlock },
    setup() {
      const value = ref('plan-a')
      return { value }
    },
    template: `
      <div class="flex max-w-xs flex-col gap-[var(--spacing-3)]">
        <FieldRadioBlock
          v-model="value"
          name="webkit-field-radio-block"
          value="plan-a"
          label="Switch label"
          description="Switch description"
          input-id="webkit-field-radio-block-a"
        />
        <FieldRadioBlock
          v-model="value"
          name="webkit-field-radio-block"
          value="plan-b"
          label="Switch label"
          description="Switch description"
          input-id="webkit-field-radio-block-b"
        />
      </div>
    `
  })
}

export const Disabled = {
  render: () => ({
    components: { FieldRadioBlock },
    setup() {
      const value = ref('plan-c')
      return { value }
    },
    template: `
      <div class="flex max-w-xs flex-col gap-[var(--spacing-3)]">
        <FieldRadioBlock
          v-model="value"
          name="webkit-field-radio-block-disabled"
          value="plan-c"
          label="Switch label"
          description="Switch description"
          helper-text="Helper Text"
          disabled
          input-id="webkit-field-radio-block-disabled"
        />
      </div>
    `
  })
}

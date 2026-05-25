import { ref } from 'vue'

import InputSwitch from '@aziontech/webkit/inputs/input-switch'

/** @type {import('@storybook/vue3').Meta<typeof InputSwitch>} */
const meta = {
  title: 'Webkit/Inputs/Input Switch',
  component: InputSwitch,
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
          'Control only — the pill toggle with no label or description. Use FieldSwitch or FieldSwitchBlock for built-in text.'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Selected value for v-model.',
      table: { type: { summary: 'boolean' }, category: 'props' }
    },
    trueValue: {
      control: 'boolean',
      description: 'Value emitted when toggled on.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'props' }
    },
    falseValue: {
      control: 'boolean',
      description: 'Value emitted when toggled off.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    inputId: {
      control: 'text',
      description: 'id for the switch button; associate an external label via htmlFor.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { type: { summary: 'boolean' }, category: 'events' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components: { InputSwitch },
    setup() {
      const value = ref(false)
      return { value }
    },
    template: `
      <InputSwitch
        v-model="value"
        input-id="webkit-switch-default"
        aria-label="Toggle setting"
      />
    `
  })
}

export const Disabled = {
  render: () => ({
    components: { InputSwitch },
    setup() {
      const on = ref(true)
      const off = ref(false)
      return { on, off }
    },
    template: `
      <div class="flex items-center gap-[var(--spacing-4)]">
        <InputSwitch
          v-model="on"
          disabled
          input-id="webkit-switch-disabled-on"
          aria-label="Disabled on"
        />
        <InputSwitch
          v-model="off"
          disabled
          input-id="webkit-switch-disabled-off"
          aria-label="Disabled off"
        />
      </div>
    `
  })
}

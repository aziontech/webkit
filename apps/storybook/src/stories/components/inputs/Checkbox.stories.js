import { ref } from 'vue'

import Checkbox from '@aziontech/webkit/checkbox'

/** @type {import('@storybook/vue3').Meta<typeof Checkbox>} */
const meta = {
 title: 'Components/Inputs/Checkbox',
  component: Checkbox,
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
          'Control only — the square checkbox input with no label or description. Pair with an external label or use FieldCheckbox / FieldCheckboxBlock for built-in text.'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'model Value.',
      table: { type: { summary: 'unknown' }, category: 'props' }
    },
    value: {
      control: false,
      description: 'value.',
      table: { type: { summary: 'unknown' }, category: 'props' }
    },
    binary: {
      control: 'boolean',
      description: 'binary.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    readonly: {
      control: 'boolean',
      description: 'readonly.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    inputId: {
      control: 'text',
      description: 'input Id.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    name: {
      control: 'text',
      description: 'HTML name for form submission.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    tabindex: {
      control: 'number',
      description: 'tabindex.',
      table: { type: { summary: 'number' }, category: 'props' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the value changes.',
      table: { type: { summary: 'unknown' }, category: 'events' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components: { Checkbox },
    setup() {
      const value = ref(false)
      return { value }
    },
    template: `
      <Checkbox
        v-model="value"
        binary
        input-id="webkit-checkbox-default"
        aria-label="Toggle option"
      />
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Binary control only — associate copy via an external label or FieldCheckbox.'
      }
    }
  }
}

export const Disabled = {
  render: () => ({
    components: { Checkbox },
    setup() {
      const checked = ref(true)
      const unchecked = ref(false)
      return { checked, unchecked }
    },
    template: `
      <div class="flex items-center gap-[var(--spacing-4)]">
        <Checkbox
          v-model="checked"
          binary
          disabled
          input-id="webkit-checkbox-disabled-on"
          aria-label="Disabled checked"
        />
        <Checkbox
          v-model="unchecked"
          binary
          disabled
          input-id="webkit-checkbox-disabled-off"
          aria-label="Disabled unchecked"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Disabled checked and unchecked controls without label chrome.'
      }
    }
  }
}

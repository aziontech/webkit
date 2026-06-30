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
      description: 'Two-way bound value.',
      table: { type: { summary: 'unknown' }, category: 'props' }
    },
    value: {
      control: false,
      description: 'Identifier for this checkbox in non-binary mode.',
      table: { type: { summary: 'unknown' }, category: 'props' }
    },
    binary: {
      control: 'boolean',
      description: 'When true, the checkbox toggles modelValue as a boolean.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    indeterminate: {
      control: 'boolean',
      description: 'Renders the indeterminate visual (horizontal bar). Does not affect modelValue.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    readonly: {
      control: 'boolean',
      description: 'Marks the field read-only.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    inputId: {
      control: 'text',
      description: 'Forwarded to the inner input id for label association.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    name: {
      control: 'text',
      description: 'HTML name for form submission.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    tabindex: {
      control: 'number',
      description: 'Forwarded to the inner input tabindex.',
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
  args: {
    binary: true,
    indeterminate: false,
    disabled: false,
    readonly: false
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const value = ref(false)
      return { args, value }
    },
    template: `
      <Checkbox
        v-bind="args"
        v-model="value"
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

export const Indeterminate = {
  args: {
    binary: true,
    indeterminate: true,
    disabled: false,
    readonly: false
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const value = ref(false)
      return { args, value }
    },
    template: `
      <Checkbox
        v-bind="args"
        v-model="value"
        input-id="webkit-checkbox-indeterminate"
        aria-label="Some options selected"
      />
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Tri-state visual. The parent owns the indeterminate logic (typical pattern: "select all" header when some rows are selected). Sets `aria-checked="mixed"` and the native input.indeterminate DOM property.'
      }
    }
  }
}

export const Disabled = {
  args: {
    binary: true,
    indeterminate: false,
    disabled: true,
    readonly: false
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(true)
      const unchecked = ref(false)
      return { args, checked, unchecked }
    },
    template: `
      <div class="flex items-center gap-[var(--spacing-4)]">
        <Checkbox
          v-bind="args"
          v-model="checked"
          input-id="webkit-checkbox-disabled-on"
          aria-label="Disabled checked"
        />
        <Checkbox
          v-bind="args"
          v-model="unchecked"
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

import { ref } from 'vue'

import FieldCheckbox from '@aziontech/webkit/field-checkbox'

/** @type {import('@storybook/vue3').Meta<typeof FieldCheckbox>} */
const meta = {
 title: 'Components/Inputs/Field Checkbox',
  component: FieldCheckbox,
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
          'Inline checkbox field with leading control, label, optional description, and optional disabled helper badge.'
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
    required: {
      control: 'boolean',
      description:
        'Adds the Required tag to the Label and sets native required + aria-required on the input.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
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
    components: { FieldCheckbox },
    setup() {
      const off = ref(false)
      const on = ref(true)
      return { off, on }
    },
    template: `
      <div class="flex max-w-xs flex-col gap-[var(--spacing-3)]">
        <FieldCheckbox
          v-model="off"
          label="Switch label"
          description="Switch description"
          input-id="webkit-field-checkbox-off"
        />
        <FieldCheckbox
          v-model="on"
          label="Switch label"
          description="Switch description"
          input-id="webkit-field-checkbox-on"
        />
      </div>
    `
  })
}

export const Disabled = {
  render: () => ({
    components: { FieldCheckbox },
    setup() {
      const value = ref(true)
      return { value }
    },
    template: `
      <FieldCheckbox
        v-model="value"
        label="Switch label"
        description="Switch description"
        helper-text="Helper Text"
        disabled
        input-id="webkit-field-checkbox-disabled"
      />
    `
  })
}

export const Required = {
  render: () => ({
    components: { FieldCheckbox },
    setup() {
      const value = ref(false)
      return { value }
    },
    template: `
      <FieldCheckbox
        v-model="value"
        label="I agree to the terms"
        description="Required to continue."
        required
        input-id="webkit-field-checkbox-required"
      />
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'When \`required\` is \`true\`, the Label shows the \`*(Required)\` indicator and the native input receives \`required\` + \`aria-required="true"\`.'
      }
    }
  }
}

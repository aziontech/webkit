import { ref } from 'vue'

import RadioButton from '@aziontech/webkit/inputs/radio-button'

/** @type {import('@storybook/vue3').Meta<typeof RadioButton>} */
const meta = {
 title: 'Components/Inputs/Radio Button',
  component: RadioButton,
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
          'Control only — the circular radio input with no label or description. Pair with an external label or use FieldRadio / FieldRadioBlock for built-in text.'
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
      description: 'id for the native input; associate a label via htmlFor on a separate element.',
      table: { type: { summary: 'string' }, category: 'props' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { type: { summary: 'string' }, category: 'events' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components: { RadioButton },
    setup() {
      const value = ref('a')
      return { value }
    },
    template: `
      <fieldset class="flex items-center gap-[var(--spacing-4)] border-0 p-0 m-0">
        <RadioButton
          v-model="value"
          name="webkit-radio-default"
          value="a"
          input-id="webkit-radio-a"
          aria-label="Option A"
        />
        <RadioButton
          v-model="value"
          name="webkit-radio-default"
          value="b"
          input-id="webkit-radio-b"
          aria-label="Option B"
        />
        <RadioButton
          v-model="value"
          name="webkit-radio-default"
          value="c"
          input-id="webkit-radio-c"
          aria-label="Option C"
        />
      </fieldset>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Mutually exclusive controls only — labels are supplied by the consumer (aria-label here for demo).'
      }
    }
  }
}

export const Disabled = {
  render: () => ({
    components: { RadioButton },
    setup() {
      const value = ref('a')
      return { value }
    },
    template: `
      <fieldset class="flex items-center gap-[var(--spacing-4)] border-0 p-0 m-0">
        <RadioButton
          v-model="value"
          name="webkit-radio-disabled"
          value="a"
          disabled
          input-id="webkit-radio-disabled-a"
          aria-label="Option A"
        />
        <RadioButton
          v-model="value"
          name="webkit-radio-disabled"
          value="b"
          disabled
          input-id="webkit-radio-disabled-b"
          aria-label="Option B"
        />
      </fieldset>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Disabled selected and unselected controls without label chrome.'
      }
    }
  }
}

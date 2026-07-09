import { ref, watch } from 'vue'

import FieldRadioBlock from '@aziontech/webkit/field-radio-block'

import { toSfc } from '../../../_shared/story-source'

/** @type {import('@storybook/vue3').Meta<typeof FieldRadioBlock>} */
const meta = {
  title: 'Components/Inputs/FieldRadioBlock',
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
          'Card-style radio option with a selected border and background. Use for plan selection or choices that need visual weight.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Selected value for v-model.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    value: {
      control: 'text',
      description: 'Option value for this radio instance.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    name: {
      control: 'text',
      description: 'HTML name shared across a mutually exclusive group.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    inputId: {
      control: 'text',
      description: 'id for the native input; links label to control.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
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
    modelValue: 'plan-a',
    value: 'plan-a',
    name: 'plan',
    disabled: false,
    label: 'Standard plan',
    description: 'Up to 5 projects and 10 GB storage.',
    helperText: ''
  }
}

export default meta

const Template = (args) => ({
  components: { FieldRadioBlock },
  setup() {
    const selected = ref(args.modelValue)
    watch(
      () => args.modelValue,
      (next) => {
        selected.value = next
      }
    )
    const onUpdate = (next) => {
      selected.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, selected, onUpdate }
  },
  template:
    '<FieldRadioBlock v-bind="args" :model-value="selected" @update:model-value="onUpdate" />'
})

const DEFAULT_SCRIPT = [
  "import { ref } from 'vue'",
  "import FieldRadioBlock from '@aziontech/webkit/field-radio-block'",
  '',
  "const selected = ref('plan-a')"
]

const DEFAULT_MARKUP = `<FieldRadioBlock
  v-model="selected"
  name="plan"
  value="plan-a"
  label="Standard plan"
  description="Up to 5 projects and 10 GB storage."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldRadioBlock>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive radio block shown in its selected state. Share one `v-model` and `name` across sibling blocks to build a mutually exclusive group.'
      },
      source: { code: toSfc(DEFAULT_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const DISABLED_SCRIPT = [
  "import { ref } from 'vue'",
  "import FieldRadioBlock from '@aziontech/webkit/field-radio-block'",
  '',
  "const selected = ref('plan-a')"
]

const DISABLED_MARKUP = `<FieldRadioBlock
  v-model="selected"
  name="plan"
  value="plan-a"
  label="Standard plan"
  description="Up to 5 projects and 10 GB storage."
  helper-text="Helper Text"
  disabled
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldRadioBlock>} */
export const Disabled = {
  args: { disabled: true, helperText: 'Helper Text' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state with a lock helper badge that surfaces why the option cannot be changed.'
      },
      source: { code: toSfc(DISABLED_SCRIPT, DISABLED_MARKUP) }
    }
  }
}

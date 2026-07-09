import { ref, watch } from 'vue'

import FieldCheckboxBlock from '@aziontech/webkit/field-checkbox-block'

import { toSfc } from '../../../_shared/story-source'

/** @type {import('@storybook/vue3').Meta<typeof FieldCheckboxBlock>} */
const meta = {
  title: 'Components/Inputs/FieldCheckboxBlock',
  component: FieldCheckboxBlock,
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
          'Card-style checkbox option with leading control, label, description, and optional disabled helper badge inside a bordered block.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Selected value for v-model.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    trueValue: {
      control: 'boolean',
      description: 'Value emitted when checked.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'props' }
    },
    falseValue: {
      control: 'boolean',
      description: 'Value emitted when unchecked.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    name: {
      control: 'text',
      description: 'HTML name for form and vee-validate integration.',
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
      table: { type: { summary: 'boolean' }, category: 'events' }
    }
  },
  args: {
    modelValue: false,
    trueValue: true,
    falseValue: false,
    disabled: false,
    label: 'Enable feature',
    description: 'Turns this feature on for your project.',
    helperText: ''
  }
}

export default meta

const Template = (args) => ({
  components: { FieldCheckboxBlock },
  setup() {
    const value = ref(args.modelValue ?? false)
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? false
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template:
    '<FieldCheckboxBlock v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

const DEFAULT_SCRIPT = [
  "import { ref } from 'vue'",
  "import FieldCheckboxBlock from '@aziontech/webkit/field-checkbox-block'",
  '',
  'const checked = ref(false)'
]

const DEFAULT_MARKUP = `<FieldCheckboxBlock
  v-model="checked"
  label="Enable feature"
  description="Turns this feature on for your project."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldCheckboxBlock>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive checkbox block seeded unchecked. Toggle the control to see the highlighted checked state.'
      },
      source: { code: toSfc(DEFAULT_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const DISABLED_SCRIPT = [
  "import { ref } from 'vue'",
  "import FieldCheckboxBlock from '@aziontech/webkit/field-checkbox-block'",
  '',
  'const checked = ref(true)'
]

const DISABLED_MARKUP = `<FieldCheckboxBlock
  v-model="checked"
  label="Enable feature"
  description="Turns this feature on for your project."
  helper-text="Helper Text"
  disabled
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldCheckboxBlock>} */
export const Disabled = {
  args: { modelValue: true, disabled: true, helperText: 'Helper Text' },
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

import FieldRadio from '@aziontech/webkit/field-radio'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FieldRadio from '@aziontech/webkit/field-radio'"

/** @type {import('@storybook/vue3').Meta<typeof FieldRadio>} */
const meta = {
  title: 'Components/Inputs/FieldRadio',
  component: FieldRadio,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
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
          'Inline radio field with a label, optional description, an optional disabled helper badge, and a trailing RadioButton control. Build a mutually exclusive group by sharing the same `name` and a single `v-model` across instances.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Selected value for v-model.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    value: {
      control: 'text',
      description: 'Option value for this radio instance.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    name: {
      control: 'text',
      description: 'HTML name shared across a mutually exclusive group.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    inputId: {
      control: 'text',
      description: 'id for the native input; links label to control.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    label: {
      control: 'text',
      description: 'Primary label text.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Secondary description.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    helperText: {
      control: 'text',
      description: 'Helper badge text shown when disabled.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    modelValue: '',
    value: 'option1',
    name: 'field-radio',
    disabled: false,
    label: 'Switch label',
    description: 'Switch description',
    helperText: ''
  }
}

export default meta

const Template = (args) => ({
  components: { FieldRadio },
  setup() {
    const selected = ref(args.modelValue ?? '')
    watch(
      () => args.modelValue,
      (next) => {
        selected.value = next ?? ''
      }
    )
    const onUpdate = (next) => {
      selected.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, selected, onUpdate }
  },
  template: '<FieldRadio v-bind="args" :model-value="selected" @update:model-value="onUpdate" />'
})

const DEFAULT_IMPORTS = [IMPORT, "import { ref } from 'vue'", '', "const selected = ref('')"]

const DEFAULT_MARKUP = `<FieldRadio
  v-model="selected"
  name="field-radio"
  value="option1"
  label="Switch label"
  description="Switch description"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldRadio>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Default field with a radio control, label, and description; select it to emit its `value`.'
      },
      source: { code: toSfc(DEFAULT_IMPORTS, DEFAULT_MARKUP) }
    }
  }
}

const DISABLED_IMPORTS = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  "const selected = ref('option1')"
]

const DISABLED_MARKUP = `<FieldRadio
  v-model="selected"
  name="field-radio-disabled"
  value="option1"
  label="Switch label"
  description="Switch description"
  helper-text="Helper Text"
  disabled
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldRadio>} */
export const Disabled = {
  args: {
    modelValue: 'option1',
    name: 'field-radio-disabled',
    disabled: true,
    helperText: 'Helper Text'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Disabled state — interaction is blocked and, when `helperText` is set, a lock helper badge appears below the description.'
      },
      source: { code: toSfc(DISABLED_IMPORTS, DISABLED_MARKUP) }
    }
  }
}

import FieldCheckbox from '@aziontech/webkit/field-checkbox'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FieldCheckbox from '@aziontech/webkit/field-checkbox'"

/** @type {import('@storybook/vue3').Meta<typeof FieldCheckbox>} */
const meta = {
  title: 'Components/Inputs/FieldCheckbox',
  component: FieldCheckbox,
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
          'Inline checkbox field with a leading control, label, optional description, optional required indicator, and an optional disabled helper badge. Use it for standalone consent checkboxes, agreement fields, or any isolated boolean choice within a form.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Selected value for v-model.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' }
      }
    },
    trueValue: {
      control: 'boolean',
      description: 'Value emitted when checked.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    falseValue: {
      control: 'boolean',
      description: 'Value emitted when unchecked.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    name: {
      control: 'text',
      description: 'HTML name for form and vee-validate integration.',
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
    required: {
      control: 'boolean',
      description:
        'Adds the Required tag to the Label and sets native required + aria-required on the input.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { category: 'events', type: { summary: 'boolean' } }
    }
  },
  args: {
    modelValue: false,
    trueValue: true,
    falseValue: false,
    disabled: false,
    label: 'Switch label',
    description: 'Switch description',
    helperText: '',
    required: false
  }
}

export default meta

const Template = (args) => ({
  components: { FieldCheckbox },
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
  template: '<FieldCheckbox v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

const DEFAULT_IMPORTS = [IMPORT, "import { ref } from 'vue'", '', 'const checked = ref(false)']

const DEFAULT_MARKUP = `<FieldCheckbox
  v-model="checked"
  label="Switch label"
  description="Switch description"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldCheckbox>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default field with a checkbox control, label, and description.' },
      source: { code: toSfc(DEFAULT_IMPORTS, DEFAULT_MARKUP) }
    }
  }
}

const DISABLED_IMPORTS = [IMPORT, "import { ref } from 'vue'", '', 'const checked = ref(true)']

const DISABLED_MARKUP = `<FieldCheckbox
  v-model="checked"
  label="Switch label"
  description="Switch description"
  helper-text="Helper Text"
  disabled
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldCheckbox>} */
export const Disabled = {
  args: { modelValue: true, disabled: true, helperText: 'Helper Text' },
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

const REQUIRED_IMPORTS = [IMPORT, "import { ref } from 'vue'", '', 'const checked = ref(false)']

const REQUIRED_MARKUP = `<FieldCheckbox
  v-model="checked"
  label="I agree to the terms"
  description="Required to continue."
  required
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FieldCheckbox>} */
export const Required = {
  args: {
    modelValue: false,
    required: true,
    label: 'I agree to the terms',
    description: 'Required to continue.'
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'When `required` is `true`, the Label shows the `*(Required)` indicator and the native input receives `required` + `aria-required="true"`.'
      },
      source: { code: toSfc(REQUIRED_IMPORTS, REQUIRED_MARKUP) }
    }
  }
}

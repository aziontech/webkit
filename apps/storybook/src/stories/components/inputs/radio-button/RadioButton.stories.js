import { ref, watch } from 'vue'

import RadioButton from '@aziontech/webkit/radio-button'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import RadioButton from '@aziontech/webkit/radio-button'"

/** @type {import('@storybook/vue3').Meta<typeof RadioButton>} */
const meta = {
  title: 'Components/Inputs/RadioButton',
  component: RadioButton,
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
          'Control only — the circular radio input with no label or description. Pair with an external label or use FieldRadio / FieldRadioBlock for built-in text.'
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
      description: 'id for the native input; associate an external label via htmlFor.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    modelValue: '',
    value: 'a',
    name: 'webkit-radio',
    disabled: false,
    inputId: 'webkit-radio-a'
  }
}

export default meta

const Template = (args) => ({
  components: { RadioButton },
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
    }
    return { args, selected, onUpdate }
  },
  template:
    '<RadioButton v-bind="args" :model-value="selected" @update:model-value="onUpdate" aria-label="Option A" />'
})

const DEFAULT_SCRIPT = [IMPORT, "import { ref } from 'vue'", '', "const selected = ref('')"]
const DEFAULT_MARKUP = `<RadioButton
  v-model="selected"
  name="webkit-radio"
  value="a"
  input-id="webkit-radio-a"
  aria-label="Option A"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof RadioButton>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Single control only — labels are supplied by the consumer (aria-label here for demo). Selecting it emits its `value`; share a `name` and one `v-model` across instances for a mutually exclusive group.'
      },
      source: { code: toSfc(DEFAULT_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const DISABLED_SCRIPT = [IMPORT, "import { ref } from 'vue'", '', "const selected = ref('a')"]
const DISABLED_TEMPLATE = `<fieldset class="flex items-center gap-[var(--spacing-4)] border-0 p-0 m-0">
  <RadioButton
    v-model="selected"
    name="webkit-radio-disabled"
    value="a"
    disabled
    input-id="webkit-radio-disabled-a"
    aria-label="Disabled selected"
  />
  <RadioButton
    v-model="selected"
    name="webkit-radio-disabled"
    value="b"
    disabled
    input-id="webkit-radio-disabled-b"
    aria-label="Disabled unselected"
  />
</fieldset>`

/** @type {import('@storybook/vue3').StoryObj<typeof RadioButton>} */
export const Disabled = {
  render: () => ({
    components: { RadioButton },
    setup() {
      const selected = ref('a')
      return { selected }
    },
    template: DISABLED_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Disabled selected and unselected controls sharing one group name, without label chrome.'
      },
      source: { code: toSfc(DISABLED_SCRIPT, DISABLED_TEMPLATE) }
    }
  }
}

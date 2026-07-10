import SegmentedButton from '@aziontech/webkit/segmented-button'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import SegmentedButton from '@aziontech/webkit/segmented-button'"

const defaultOptions = [
  { label: 'Label', value: 'option-1' },
  { label: 'Label', value: 'option-2' },
  { label: 'Label', value: 'option-3' },
  { label: 'Label', value: 'option-4' },
  { label: 'Label', value: 'option-5' }
]

const disabledOptions = [
  { label: 'Label', value: 'option-1' },
  { label: 'Label', value: 'option-2', disabled: true },
  { label: 'Label', value: 'option-3' },
  { label: 'Label', value: 'option-4' }
]

/** @type {import('@storybook/vue3').Meta<typeof SegmentedButton>} */
const meta = {
  title: 'Components/Actions/SegmentedButton',
  component: SegmentedButton,
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
          'Mutually exclusive segmented control for switching between related options. Supports keyboard navigation, disabled segments with a lock affordance, and an animated selection indicator.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Currently selected option value (`v-model`).',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    options: {
      control: 'object',
      description: 'Segment choices with `{ label, value, disabled? }`.',
      table: {
        category: 'props',
        type: { summary: 'SegmentedButtonOption[]' },
        defaultValue: { summary: '[]' }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name when no visible group label is associated.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    defaultValue: {
      control: 'text',
      description: 'Initial selection when `v-model` is not set.',
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
    },
    onChange: {
      action: 'change',
      description: 'Emitted after the selected value changes.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    modelValue: 'option-1',
    options: defaultOptions,
    ariaLabel: 'Segmented options'
  }
}

export default meta

const Template = (args) => ({
  components: { SegmentedButton },
  setup() {
    const value = ref(args.modelValue ?? '')

    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? ''
      }
    )

    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }

    return { args, value, onUpdate }
  },
  template: '<SegmentedButton v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

const DEFAULT_SNIPPET_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  'const options = [',
  "  { label: 'Label', value: 'option-1' },",
  "  { label: 'Label', value: 'option-2' },",
  "  { label: 'Label', value: 'option-3' },",
  "  { label: 'Label', value: 'option-4' },",
  "  { label: 'Label', value: 'option-5' }",
  ']',
  '',
  "const selected = ref('option-1')"
]

const DEFAULT_MARKUP =
  '<SegmentedButton v-model="selected" :options="options" aria-label="Segmented options" />'

/** @type {import('@storybook/vue3').StoryObj<typeof SegmentedButton>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Five generic options with the first selected.' },
      source: { code: toSfc(DEFAULT_SNIPPET_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const DISABLED_SNIPPET_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  'const options = [',
  "  { label: 'Label', value: 'option-1' },",
  "  { label: 'Label', value: 'option-2', disabled: true },",
  "  { label: 'Label', value: 'option-3' },",
  "  { label: 'Label', value: 'option-4' }",
  ']',
  '',
  "const selected = ref('option-1')"
]

/** @type {import('@storybook/vue3').StoryObj<typeof SegmentedButton>} */
export const WithDisabledOption = {
  args: {
    modelValue: 'option-1',
    options: disabledOptions
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Four options with one disabled segment showing the lock affordance.'
      },
      source: { code: toSfc(DISABLED_SNIPPET_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

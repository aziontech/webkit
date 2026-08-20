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
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description: "Size token, on the same 28 / 32 / 40 rhythm every other control uses.",
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'large'" }
      }
    },
    fluid: {
      control: 'boolean',
      description: 'Stretches the group to its container and lets the options share that width.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the selected value changes.',
      table: { category: 'events', type: { summary: 'string' } }
    }
  },
  args: {
    modelValue: 'option-1',
    options: defaultOptions,
    ariaLabel: 'Segmented options',
    size: 'large',
    fluid: false
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

const SIZES_TEMPLATE = `<div class="flex flex-col items-start gap-4">
  <SegmentedButton :options="options" default-value="option-1" size="small" aria-label="Small" />
  <SegmentedButton :options="options" default-value="option-1" size="medium" aria-label="Medium" />
  <SegmentedButton :options="options" default-value="option-1" size="large" aria-label="Large" />
</div>`

const SIZES_SNIPPET_SCRIPT = [
  IMPORT,
  '',
  'const options = [',
  "  { label: 'Label', value: 'option-1' },",
  "  { label: 'Label', value: 'option-2' },",
  "  { label: 'Label', value: 'option-3' }",
  ']'
]

/** @type {import('@storybook/vue3').StoryObj<typeof SegmentedButton>} */
export const Sizes = {
  render: () => ({
    components: { SegmentedButton },
    setup: () => ({
      options: [
        { label: 'Label', value: 'option-1' },
        { label: 'Label', value: 'option-2' },
        { label: 'Label', value: 'option-3' }
      ]
    }),
    template: SIZES_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The three steps: 28px, 32px and 40px tall. Pick the one the row it sits in already uses \u2014 a group 6px off its neighbour reads as a rendering mistake.'
      },
      source: { code: toSfc(SIZES_SNIPPET_SCRIPT, SIZES_TEMPLATE) }
    }
  }
}

const FLUID_TEMPLATE = `<div class="flex w-[34rem] flex-col gap-4">
  <SegmentedButton :options="options" default-value="new" aria-label="Hug its labels" />
  <SegmentedButton :options="options" default-value="new" aria-label="Fill the row" fluid />
</div>`

const FLUID_SNIPPET_SCRIPT = [
  IMPORT,
  '',
  'const options = [',
  "  { label: 'Create a new repository', value: 'new' },",
  "  { label: 'Use an existing repository', value: 'existing' }",
  ']'
]

/** @type {import('@storybook/vue3').StoryObj<typeof SegmentedButton>} */
export const Fluid = {
  render: () => ({
    components: { SegmentedButton },
    setup: () => ({
      options: [
        { label: 'Create a new repository', value: 'new' },
        { label: 'Use an existing repository', value: 'existing' }
      ]
    }),
    template: FLUID_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'By default the group hugs its labels (top). `fluid` gives it the container width and lets the options divide that row between them (bottom) \u2014 which is what a two-answer question at the head of a form card wants, instead of two pills bunched at the left with dead space beside them.'
      },
      source: { code: toSfc(FLUID_SNIPPET_SCRIPT, FLUID_TEMPLATE) }
    }
  }
}

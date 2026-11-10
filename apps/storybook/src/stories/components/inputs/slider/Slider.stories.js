import Slider from '@aziontech/webkit/slider'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Slider from '@aziontech/webkit/slider'"

/** @type {import('@storybook/vue3').Meta<typeof Slider>} */
const meta = {
  title: 'Components/Primitives/Inputs/Slider',
  component: Slider,
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
          'Bare range control: one thumb on a horizontal track that picks a single number between `min` and `max` in `step` increments, with the portion up to the value filled. Built on a native range input, it adds optional tick marks and labelled reference values under the track and renders no label or helper text of its own — compose it with `Label` and `HelperText` in a field.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'number',
      description: 'Current value (v-model).',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    min: {
      control: 'number',
      description: 'Lowest selectable value; the left end of the track.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    max: {
      control: 'number',
      description: 'Highest selectable value; the right end of the track.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '100' } }
    },
    step: {
      control: 'number',
      description: 'Increment between selectable values, used by dragging and the arrow keys.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '1' } }
    },
    disabled: {
      control: 'boolean',
      description:
        'Disables interaction, removes the control from the tab order and applies the disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    readonly: {
      control: 'boolean',
      description: 'Keeps the control focusable but prevents the value from changing.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    invalid: {
      control: 'boolean',
      description: 'Applies the danger tokens and sets aria-invalid.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name when no visible label is associated with the slider.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    ticks: {
      control: 'boolean',
      description: 'Shows a tick mark at every step when the range has at most 21 positions.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    referenceValues: {
      control: 'object',
      description:
        'Values marked and labelled under the track; entries outside min and max are ignored.',
      table: { category: 'props', type: { summary: 'number[]' }, defaultValue: { summary: '[]' } }
    },
    unit: {
      control: 'text',
      description: 'Text appended verbatim to the reference labels and to the announced value.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted on every movement (drag frame or key press) with the new value.',
      table: { category: 'events', type: { summary: 'number' } }
    },
    onChange: {
      action: 'change',
      description:
        'Emitted once per interaction (pointer release or keyboard step) with the committed value.',
      table: { category: 'events', type: { summary: 'number' } }
    }
  },
  args: {
    modelValue: 40,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    readonly: false,
    invalid: false,
    ariaLabel: 'Alert threshold',
    ticks: false,
    referenceValues: [],
    unit: ''
  }
}

export default meta

const Template = (args) => ({
  components: { Slider },
  setup() {
    const value = ref(args.modelValue ?? 0)
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next ?? 0
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template: `
    <div class="w-(--container-xs)">
      <Slider v-bind="args" :model-value="value" @update:model-value="onUpdate" />
    </div>
  `
})

const SCRIPT = [IMPORT, "import { ref } from 'vue'", '', 'const value = ref(40)']

const DEFAULT_MARKUP = `<div class="w-(--container-xs)">
  <Slider v-model="value" :min="0" :max="100" :step="1" aria-label="Alert threshold" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Slider>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Single thumb over 0–100 in steps of 1, bound with `v-model` and named with `aria-label`.'
      },
      source: { code: toSfc(SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const TICKS_MARKUP = `<div class="w-(--container-xs)">
  <Slider v-model="value" :min="0" :max="100" :step="10" ticks aria-label="Alert threshold" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Slider>} */
export const Ticks = {
  args: { step: 10, ticks: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A tick mark under every step. Ticks render only when the range has at most 21 positions.'
      },
      source: { code: toSfc(SCRIPT, TICKS_MARKUP) }
    }
  }
}

const REFERENCE_VALUES_MARKUP = `<div class="w-(--container-xs)">
  <Slider
    v-model="value"
    :min="0"
    :max="100"
    :step="1"
    :reference-values="[0, 25, 50, 75, 100]"
    unit="%"
    aria-label="Alert threshold"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Slider>} */
export const ReferenceValues = {
  args: { referenceValues: [0, 25, 50, 75, 100], unit: '%' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Labelled landmarks under the track. `unit` is appended to each label and to the announced value.'
      },
      source: { code: toSfc(SCRIPT, REFERENCE_VALUES_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = `<div class="w-(--container-xs)">
  <Slider v-model="value" :min="0" :max="100" :step="1" disabled aria-label="Alert threshold" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Slider>} */
export const Disabled = {
  args: { disabled: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Disabled: skipped by Tab, ignores pointer and keys, and uses the disabled tokens.'
      },
      source: { code: toSfc(SCRIPT, DISABLED_MARKUP) }
    }
  }
}

const INVALID_MARKUP = `<div class="w-(--container-xs)">
  <Slider v-model="value" :min="0" :max="100" :step="1" invalid aria-label="Alert threshold" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Slider>} */
export const Invalid = {
  args: { invalid: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Invalid: the fill and thumb border switch to the danger tokens and aria-invalid is set.'
      },
      source: { code: toSfc(SCRIPT, INVALID_MARKUP) }
    }
  }
}

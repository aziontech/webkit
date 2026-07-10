import Button from '@aziontech/webkit/button'
import IconButton from '@aziontech/webkit/icon-button'
import ProgressBar from '@aziontech/webkit/progress-bar'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import ProgressBar from '@aziontech/webkit/progress-bar'"

/** @type {import('@storybook/vue3').Meta<typeof ProgressBar>} */
const meta = {
  title: 'Components/Feedback/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
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
          'Communicates the progress of an ongoing task as a horizontal bar. Use it for a determinate value within a range (`value` / `max`) or, when progress cannot be measured, as an indeterminate loading indicator. Unlike `skeleton` (placeholder geometry) or `status-indicator` (discrete state), it expresses a continuous quantity.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Current progress, relative to `max`.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '0' }
      }
    },
    max: {
      control: 'number',
      description: 'Upper bound; percentage = `value / max * 100`.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '100' }
      }
    },
    shape: {
      control: 'select',
      options: ['rounded', 'flat'],
      description: 'Track and fill corner-radius variant.',
      table: {
        category: 'props',
        type: { summary: "'rounded' | 'flat'" },
        defaultValue: { summary: "'flat'" }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Bar height token.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'small'" }
      }
    },
    indeterminate: {
      control: 'boolean',
      description: 'Loading state; animates a sliding segment and ignores `value`.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  },
  args: {
    value: 60,
    max: 100,
    shape: 'flat',
    size: 'small',
    indeterminate: false
  }
}

export default meta

const Template = (args) => ({
  components: { ProgressBar },
  setup() {
    return { args }
  },
  template: '<ProgressBar v-bind="args" />'
})

const DEFAULT_MARKUP = '<ProgressBar :value="60" />'

/** @type {import('@storybook/vue3').StoryObj<typeof ProgressBar>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Determinate bar at 60%.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SHAPES_TEMPLATE = `<div class="flex w-[320px] flex-col gap-4">
  <ProgressBar :value="60" shape="rounded" />
  <ProgressBar :value="60" shape="flat" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ProgressBar>} */
export const Shapes = {
  render: () => ({ components: { ProgressBar }, template: SHAPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Both corner-radius variants stacked: `rounded` and `flat`.' },
      source: { code: toSfc(IMPORT, SHAPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex w-[320px] flex-col gap-4">
  <ProgressBar :value="60" size="small" />
  <ProgressBar :value="60" size="medium" />
  <ProgressBar :value="60" size="large" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ProgressBar>} */
export const Sizes = {
  render: () => ({ components: { ProgressBar }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All height tokens stacked: `small`, `medium`, `large`.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const INDETERMINATE_MARKUP = '<ProgressBar indeterminate />'

/** @type {import('@storybook/vue3').StoryObj<typeof ProgressBar>} */
export const Indeterminate = {
  args: { indeterminate: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Loading state when progress cannot be measured; animates a sliding segment.'
      },
      source: { code: toSfc(IMPORT, INDETERMINATE_MARKUP) }
    }
  }
}

const SIMULATION_TEMPLATE = `<div class="flex w-[320px] flex-col gap-4">
  <ProgressBar :value="value" />
  <div class="flex items-center gap-2">
    <Button label="Next" kind="primary" size="small" @click="advance" />
    <IconButton icon="pi pi-refresh" aria-label="Reset" size="small" kind="outlined" @click="reset" />
    <span class="ml-auto">{{ value }}%</span>
  </div>
</div>`

const SIMULATION_SCRIPT = [
  IMPORT,
  "import Button from '@aziontech/webkit/button'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import { ref } from 'vue'",
  '',
  'const value = ref(0)',
  '',
  'const advance = () => {',
  '  value.value = Math.min(100, value.value + 20)',
  '}',
  '',
  'const reset = () => {',
  '  value.value = 0',
  '}'
]

/** @type {import('@storybook/vue3').StoryObj<typeof ProgressBar>} */
export const Simulation = {
  render: () => ({
    components: { ProgressBar, Button, IconButton },
    setup() {
      const value = ref(0)
      const advance = () => {
        value.value = Math.min(100, value.value + 20)
      }
      const reset = () => {
        value.value = 0
      }
      return { value, advance, reset }
    },
    template: SIMULATION_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Interactive: click **Next** to raise `value` by 20% each step; the reset icon button returns it to 0%. The determinate fill updates immediately on each change (determinate progress is not animated — motion is reserved for the indeterminate loading state).'
      },
      source: { code: toSfc(SIMULATION_SCRIPT, SIMULATION_TEMPLATE) }
    }
  }
}

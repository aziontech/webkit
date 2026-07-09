import Divider from '@aziontech/webkit/divider'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Divider from '@aziontech/webkit/divider'"

/** @type {import('@storybook/vue3').Meta<typeof Divider>} */
const meta = {
  title: 'Components/Layout/Divider',
  component: Divider,
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
          'Thin separator line that visually splits content into groups. Renders as a full-width hairline (`horizontal`) or full-height hairline (`vertical`), and can carry centered content (an "Or"-style label) when the default slot or `label` prop is set.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Layout axis of the separator line.',
      table: {
        category: 'props',
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" }
      }
    },
    label: {
      control: 'text',
      description: 'Fallback centered text shown when the default slot is empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    default: {
      control: false,
      description: 'Centered content; overrides `label` when provided.',
      table: { category: 'slots', type: { summary: 'VNode | string' } }
    }
  },
  args: {
    orientation: 'horizontal',
    label: ''
  }
}

export default meta

// One reactive render for every arg-driven story. The wrapper gives the divider
// a definite width AND height, so a horizontal line fills the width and a
// vertical line fills the height — both the `orientation` and `label` controls
// update the canvas live (return { args } + v-bind="args").
const Template = (args) => ({
  components: { Divider },
  setup() {
    return { args }
  },
  template: `
    <div class="flex items-center justify-center w-[360px] h-[80px]">
      <Divider v-bind="args" />
    </div>
  `
})

const DEFAULT_MARKUP = '<Divider orientation="horizontal" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Divider>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Default horizontal hairline. Switch `orientation` and type a `label` to see it update live.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const WITH_LABEL_MARKUP = '<Divider orientation="horizontal" label="OR" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Divider>} */
export const WithLabel = {
  args: { orientation: 'horizontal', label: 'OR' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Divider carrying a centered label ("OR"); the hairline splits around the text. Provide the label via the `label` prop or the default slot.'
      },
      source: { code: toSfc(IMPORT, WITH_LABEL_MARKUP) }
    }
  }
}

const ORIENTATIONS_TEMPLATE = `<div class="flex items-center gap-8">
  <div class="w-[160px]">
    <Divider orientation="horizontal" />
  </div>
  <div class="flex items-center justify-center h-[80px]">
    <Divider orientation="vertical" />
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Divider>} */
export const Orientations = {
  render: () => ({ components: { Divider }, template: ORIENTATIONS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Both orientations side by side: a horizontal hairline spanning its container width and a vertical hairline spanning its container height.'
      },
      source: { code: toSfc(IMPORT, ORIENTATIONS_TEMPLATE) }
    }
  }
}

import Hint from '@aziontech/webkit/hint'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Hint from '@aziontech/webkit/hint'"

/** @type {import('@storybook/vue3').Meta<typeof Hint>} */
const meta = {
  title: 'Components/Inputs/Hint',
  component: Hint,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Small info affordance — a muted info glyph on a focusable button — that reveals one short explanation on hover or focus. It is what the Label `hint` prop renders, and the standard way to attach a "why does this matter?" note to a field name without spending a line of vertical space on it.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    text: {
      control: 'text',
      description: "Guidance text revealed on hover or focus; also the trigger's accessible name.",
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left', 'auto'],
      description: 'Anchor side of the tooltip relative to the glyph.',
      table: {
        category: 'props',
        type: { summary: "'top' | 'right' | 'bottom' | 'left' | 'auto'" },
        defaultValue: { summary: "'top'" }
      }
    }
  },
  args: {
    text: 'Values are encrypted at rest and never displayed again after saving.',
    placement: 'top'
  }
}

export default meta

const Template = (args) => ({
  components: { Hint },
  setup() {
    return { args }
  },
  template: '<Hint v-bind="args" />'
})

const DEFAULT_MARKUP =
  '<Hint text="Values are encrypted at rest and never displayed again after saving." />'

/** @type {import('@storybook/vue3').StoryObj<typeof Hint>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Hover or focus the glyph to reveal the hint.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const PLACEMENTS_TEMPLATE = `<div class="flex items-center gap-(--spacing-lg)">
  <Hint text="Anchored above the glyph." placement="top" />
  <Hint text="Anchored to the right of the glyph." placement="right" />
  <Hint text="Anchored below the glyph." placement="bottom" />
  <Hint text="Anchored to the left of the glyph." placement="left" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Hint>} */
export const Placements = {
  render: () => ({ components: { Hint }, template: PLACEMENTS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The four anchors. Hover each glyph to see where its tooltip opens.'
      },
      source: { code: toSfc(IMPORT, PLACEMENTS_TEMPLATE) }
    }
  }
}

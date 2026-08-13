import FrameBox from '@aziontech/webkit/frame-box'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import FrameBox from '@aziontech/webkit/frame-box'"

/** @type {import('@storybook/vue3').Meta<typeof FrameBox>} */
const meta = {
  title: 'Components/Layout/FrameBox',
  component: FrameBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'The registration frame: a hairline box with a small square set inside each corner and an optional vertical hatch texture behind its content. It is the container every framed page section is built from — a section title, the gap between two sections, a cell of a divider grid — so a page’s rules and corner marks come from one component instead of from per-screen borders.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    borders: {
      control: 'select',
      options: ['all', 'x', 'y', 'top', 'right', 'bottom', 'left', 'none'],
      description:
        'Which of the frame’s own rules to draw. Takes a keyword (`all`, `none`, `x`, `y`), one side, or a list of sides such as `[\'top\', \'left\']`.',
      table: {
        category: 'props',
        type: { summary: "'all' | 'none' | 'x' | 'y' | Side | Side[]" },
        defaultValue: { summary: "'all'" }
      }
    },
    marks: {
      control: 'select',
      options: [
        'all',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'none'
      ],
      description:
        'Which corner registration squares to draw. Takes a keyword (`all`, `none`, `top`, `bottom`, `left`, `right`), one corner, or a list of corners.',
      table: {
        category: 'props',
        type: { summary: "'all' | 'none' | Edge | Corner | Corner[]" },
        defaultValue: { summary: "'all'" }
      }
    },
    hatch: {
      control: 'boolean',
      description: 'Show the diagonal hatch texture behind the content, faded toward the edges.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    flush: {
      control: 'select',
      options: ['none', 'top', 'right', 'bottom', 'left'],
      description:
        'Which sides a neighbouring frame already draws, so this one does not draw them again. `true` is shorthand for `top` (a vertical stack); use `left` for a horizontal row, or a list for a grid cell.',
      table: {
        category: 'props',
        type: { summary: 'boolean | Side | Side[]' },
        defaultValue: { summary: 'false' }
      }
    },
    default: {
      control: false,
      description: 'Frame content; rendered above the hatch texture.',
      table: { category: 'slots', type: { summary: 'VNode | string' } }
    }
  },
  args: {
    borders: 'all',
    marks: 'all',
    hatch: false,
    flush: 'none'
  }
}

export default meta

// One reactive render for the arg-driven story: every control (borders, marks,
// hatch, flush) updates the canvas live.
const Template = (args) => ({
  components: { FrameBox },
  setup() {
    return { args }
  },
  template: `
    <FrameBox v-bind="args">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Framed content</div>
    </FrameBox>
  `
})

const DEFAULT_MARKUP = `<FrameBox>
  <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Framed content</div>
</FrameBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof FrameBox>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'All four rules plus the corner registration squares. Toggle `hatch`, `marks` and `borders` to see the frame change.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const BORDERS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <FrameBox borders="all">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="all"</div>
  </FrameBox>
  <FrameBox borders="x">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="x" — left and right</div>
  </FrameBox>
  <FrameBox borders="y">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="y" — top and bottom</div>
  </FrameBox>
  <FrameBox borders="top">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="top" — one side</div>
  </FrameBox>
  <FrameBox :borders="['top', 'left']">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">:borders="['top', 'left']" — an explicit list</div>
  </FrameBox>
  <FrameBox borders="none">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="none"</div>
  </FrameBox>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FrameBox>} */
export const Borders = {
  render: () => ({ components: { FrameBox }, template: BORDERS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Every `borders` value side by side. `y` is the full-bleed band that keeps only the two dividing rules; `none` hands every edge over to a surrounding grid and contributes just the corner marks.'
      },
      source: { code: toSfc(IMPORT, BORDERS_TEMPLATE) }
    }
  }
}

const MARKS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <FrameBox marks="all">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="all"</div>
  </FrameBox>
  <FrameBox marks="top">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="top" — both top corners</div>
  </FrameBox>
  <FrameBox marks="left">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="left" — both left corners</div>
  </FrameBox>
  <FrameBox marks="top-right">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="top-right" — one corner</div>
  </FrameBox>
  <FrameBox :marks="['top-left', 'bottom-right']">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">:marks="['top-left', 'bottom-right']" — an explicit list</div>
  </FrameBox>
  <FrameBox marks="none">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="none"</div>
  </FrameBox>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FrameBox>} */
export const Marks = {
  render: () => ({ components: { FrameBox }, template: MARKS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Each pair of corner ticks is drawn independently. `top` and `bottom` are what a stack needs: the frame above keeps its `bottom` pair and the frame below asks for `bottom` only, so a shared junction carries one mark per corner instead of two a few pixels apart.'
      },
      source: { code: toSfc(IMPORT, MARKS_TEMPLATE) }
    }
  }
}

const HATCH_TEMPLATE = `<FrameBox hatch>
  <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Hatched frame</div>
</FrameBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof FrameBox>} */
export const Hatch = {
  render: () => ({ components: { FrameBox }, template: HATCH_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The vertical hatch-line texture, faded toward the edges and rendered behind the content.'
      },
      source: { code: toSfc(IMPORT, HATCH_TEMPLATE) }
    }
  }
}

const FLUSH_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <div>
    <FrameBox>
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">Stacked — first frame</div>
    </FrameBox>
    <FrameBox flush marks="bottom">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">flush — shares the rule above</div>
    </FrameBox>
  </div>

  <div class="flex">
    <FrameBox class="flex-1">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">Row — first frame</div>
    </FrameBox>
    <FrameBox flush="left" marks="right" class="flex-1">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">flush="left" — shares the rule beside</div>
    </FrameBox>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FrameBox>} */
export const Flush = {
  render: () => ({ components: { FrameBox }, template: FLUSH_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          '`flush` names the sides a neighbour already draws, so it works on both axes. Vertically, the lower frame is `flush` (shorthand for `top`) with `marks="bottom"`; horizontally, the right-hand frame is `flush="left"` with `marks="right"`. Either way the shared edge reads as one hairline with one mark per corner, instead of two rules and four ticks. It is a subtraction from the frame\'s own side set, not an offset, so nothing overlaps.'
      },
      source: { code: toSfc(IMPORT, FLUSH_TEMPLATE) }
    }
  }
}

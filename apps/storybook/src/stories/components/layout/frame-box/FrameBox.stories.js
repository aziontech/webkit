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
      control: 'inline-radio',
      options: ['all', 'x', 'y', 'none'],
      description:
        'Which of the frame’s own rules to draw. Use `y` for a full-bleed band and `none` when a surrounding grid already draws every edge.',
      table: {
        category: 'props',
        type: { summary: "'all' | 'x' | 'y' | 'none'" },
        defaultValue: { summary: "'all'" }
      }
    },
    marks: {
      control: 'boolean',
      description: 'Show the four corner registration squares, inset from both rules.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    hatch: {
      control: 'boolean',
      description:
        'Show the faint vertical hatch-line texture behind the content, faded toward the edges.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    flush: {
      control: 'boolean',
      description:
        'Pull the frame up by its border width so its top rule lands on the bottom rule of the block above.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    default: {
      control: false,
      description: 'Frame content; rendered above the hatch texture.',
      table: { category: 'slots', type: { summary: 'VNode | string' } }
    }
  },
  args: {
    borders: 'all',
    marks: true,
    hatch: false,
    flush: false
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
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="x"</div>
  </FrameBox>
  <FrameBox borders="y">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="y"</div>
  </FrameBox>
  <FrameBox borders="none">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="none"</div>
  </FrameBox>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FrameBox>} */
export const Borders = {
  render: () => ({ components: { FrameBox }, template: BORDERS_TEMPLATE }),
  parameters: {
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

const HATCH_TEMPLATE = `<FrameBox hatch>
  <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Hatched frame</div>
</FrameBox>`

/** @type {import('@storybook/vue3').StoryObj<typeof FrameBox>} */
export const Hatch = {
  render: () => ({ components: { FrameBox }, template: HATCH_TEMPLATE }),
  parameters: {
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

const FLUSH_TEMPLATE = `<div>
  <FrameBox>
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">First frame</div>
  </FrameBox>
  <FrameBox flush>
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">Second frame, flush</div>
  </FrameBox>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FrameBox>} */
export const Flush = {
  render: () => ({ components: { FrameBox }, template: FLUSH_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Two stacked frames. The lower one is `flush`, so its top rule lands on the bottom rule of the frame above and the junction reads as one hairline instead of two.'
      },
      source: { code: toSfc(IMPORT, FLUSH_TEMPLATE) }
    }
  }
}

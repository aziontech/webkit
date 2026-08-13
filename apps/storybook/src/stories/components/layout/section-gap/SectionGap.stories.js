import FrameBox from '@aziontech/webkit/frame-box'
import SectionGap from '@aziontech/webkit/section-gap'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import SectionGap from '@aziontech/webkit/section-gap'",
  "import FrameBox from '@aziontech/webkit/frame-box'"
]

/** @type {import('@storybook/vue3').Meta<typeof SectionGap>} */
const meta = {
  title: 'Components/Layout/SectionGap',
  component: SectionGap,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
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
          'The empty registration frame that divides two page sections. On a page with no margins between sections, this frame *is* the gap: it holds the vertical air, and its own two rules are what separate the sections it sits between — which is why it is a frame and not a spacer `div`. `size` picks how much air, as one, two or three times `--spacing-xxl`, the largest step of the theme’s own spacing scale. That token is itself responsive, so every step scales with the viewport.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description:
        'How much vertical air the gap holds, as a multiple of `--spacing-xxl`: `small` is 1× (keeps two related bands close), `medium` 2× (the ordinary break), `large` 3× (opens a new part of the page).',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    hatch: {
      control: 'boolean',
      description:
        'Draw the frame’s diagonal hatch texture in the gap. The gap is the band with no content of its own, so the texture reads as the page’s own material rather than competing with copy.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    }
  },
  args: {
    size: 'medium',
    hatch: false
  }
}

export default meta

// One reactive render for the arg-driven story: the `size` control resizes the gap
// live, between two stub sections so the shared rules stay visible.
const Template = (args) => ({
  components: { SectionGap, FrameBox },
  setup() {
    return { args }
  },
  template: `
    <div>
      <FrameBox borders="y">
        <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section above</div>
      </FrameBox>
      <SectionGap v-bind="args" />
      <FrameBox flush marks="bottom" borders="y">
        <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section below</div>
      </FrameBox>
    </div>
  `
})

const DEFAULT_MARKUP = `<div>
  <FrameBox borders="y">
    <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section above</div>
  </FrameBox>
  <SectionGap size="medium" />
  <FrameBox flush marks="bottom" borders="y">
    <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section below</div>
  </FrameBox>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionGap>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'One gap between two stub sections. The gap renders `flush`, so the rule it shares with the section above is drawn once — every junction on the page stays a single hairline. Switch `size` to see the three steps.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const HATCH_TEMPLATE = `<div>
  <FrameBox borders="y">
    <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section above</div>
  </FrameBox>
  <SectionGap hatch size="large" />
  <FrameBox flush marks="bottom" borders="y">
    <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section below</div>
  </FrameBox>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionGap>} */
export const Hatch = {
  render: () => ({ components: { SectionGap, FrameBox }, template: HATCH_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The diagonal hatch drawn in the gap itself. This is the texture’s home on a framed page: the gap holds no copy, so the hatch gives the break its own identity without sitting behind a headline.'
      },
      source: { code: toSfc(IMPORT, HATCH_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div>
  <FrameBox borders="y">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">size="small" — one --spacing-xxl below</div>
  </FrameBox>
  <SectionGap size="small" />
  <FrameBox flush marks="bottom" borders="y">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">size="medium" — two below</div>
  </FrameBox>
  <SectionGap size="medium" />
  <FrameBox flush marks="bottom" borders="y">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">size="large" — three below</div>
  </FrameBox>
  <SectionGap size="large" />
  <FrameBox flush marks="bottom" borders="y">
    <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">End</div>
  </FrameBox>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionGap>} */
export const Sizes = {
  render: () => ({ components: { SectionGap, FrameBox }, template: SIZES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Every `size` value in one stack, each gap labelled by the band above it: `small` keeps two related bands close, `medium` is the ordinary break between sections, `large` opens a new part of the page. The 1 : 2 : 3 ratio is what keeps the three weights unmistakable at every viewport width.'
      },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

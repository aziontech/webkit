import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import SectionContainer from '@aziontech/webkit/section-container'",
  "import FrameBox from '@aziontech/webkit/frame-box'"
]

const IMPORT_MODULES = [
  "import SectionContainer from '@aziontech/webkit/section-container'",
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionGap from '@aziontech/webkit/section-gap'"
]

/** @type {import('@storybook/vue3').Meta<typeof SectionContainer>} */
const meta = {
  title: 'Components/Marketing/SectionContainer',
  component: SectionContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'The framed content column: a centered, width-capped block carrying only its two vertical rules, which every section below a hero stacks inside. It is the middle layer of the page language — the hero above it owns the page’s top rule, the footer below it owns the bottom, and this column owns the sides — so a page’s frame is drawn once, by three components, instead of by every band that happens to need an edge.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    maxWidth: {
      control: 'inline-radio',
      options: ['3xl', '4xl', '5xl', '6xl', '7xl', 'site'],
      description:
        'Width the column is capped at. `site` is the marketing measure every band of that page frame shares.',
      table: {
        category: 'props',
        type: { summary: "'3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'site'" },
        defaultValue: { summary: "'7xl'" }
      }
    },
    bordered: {
      control: 'boolean',
      description: 'Draw the column’s two vertical rules.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    padded: {
      control: 'boolean',
      description:
        'Pad the column itself. Leave off for a stack of modules that already own their padding.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    }
  },
  args: { maxWidth: '7xl', bordered: true, padded: false }
}

export default meta

const Template = (args) => ({
  components: { SectionContainer, FrameBox },
  setup() {
    return { args }
  },
  template: `
    <SectionContainer v-bind="args">
      <FrameBox borders="y">
        <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">First band</div>
      </FrameBox>
      <FrameBox flush borders="y" marks="bottom">
        <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Second band</div>
      </FrameBox>
    </SectionContainer>
  `
})

const DEFAULT_MARKUP = `<SectionContainer max-width="7xl">
  <FrameBox borders="y">
    <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">First band</div>
  </FrameBox>
  <FrameBox flush borders="y" marks="bottom">
    <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Second band</div>
  </FrameBox>
</SectionContainer>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionContainer>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Two bands stacked inside the column. The column draws the vertical rules; each band draws only its own horizontal ones, so no line is doubled.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const WIDTHS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <SectionContainer max-width="4xl">
    <FrameBox borders="y"><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">4xl</div></FrameBox>
  </SectionContainer>
  <SectionContainer max-width="6xl">
    <FrameBox borders="y"><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">6xl</div></FrameBox>
  </SectionContainer>
  <SectionContainer max-width="site">
    <FrameBox borders="y"><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">site</div></FrameBox>
  </SectionContainer>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionContainer>} */
export const Widths = {
  render: () => ({ components: { SectionContainer, FrameBox }, template: WIDTHS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Three caps in one view — a width only reads against another.' },
      source: { code: toSfc(IMPORT, WIDTHS_TEMPLATE) }
    }
  }
}

const BORDERED_TEMPLATE = `<SectionContainer :bordered="false">
  <FrameBox borders="y">
    <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">A column inside another frame draws no sides</div>
  </FrameBox>
</SectionContainer>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionContainer>} */
export const Bordered = {
  render: () => ({ components: { SectionContainer, FrameBox }, template: BORDERED_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'With `bordered` off the column hands its sides to whatever frame encloses it.'
      },
      source: { code: toSfc(IMPORT, BORDERED_TEMPLATE) }
    }
  }
}

const PADDED_TEMPLATE = `<SectionContainer padded>
  <p class="m-0 text-body-md text-(--text-muted)">A plain prose column, padded on its own inset.</p>
</SectionContainer>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionContainer>} */
export const Padded = {
  render: () => ({ components: { SectionContainer }, template: PADDED_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'For a prose column with no modules, `padded` gives the column its own inset.'
      },
      source: {
        code: toSfc(
          "import SectionContainer from '@aziontech/webkit/section-container'",
          PADDED_TEMPLATE
        )
      }
    }
  }
}

const MODULES_TEMPLATE = `<SectionContainer max-width="site">
  <SectionModule
    :divided="false"
    eyebrow="Platform"
    title="The first module opens on the rule above it"
    description="Its top edge is already drawn — by the hero's border-b, or by whatever frame the column sits in — so it passes :divided=&quot;false&quot; and draws none of its own."
  >
    <p class="m-0 text-body-md text-(--text-muted)">Module body, padded by the module.</p>
  </SectionModule>

  <SectionModule
    title="Every module after it divides itself"
    description="One rule per seam, drawn by the lower of the two bands."
  >
    <p class="m-0 text-body-md text-(--text-muted)">Module body.</p>
  </SectionModule>

  <SectionGap hatch />

  <SectionModule
    :padded="false"
    title="A module with an edge-to-edge body"
    description="With :padded=&quot;false&quot; the body runs to the column's own rules, for a grid that pads its own cells."
  >
    <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">
      Body owning its inset.
    </div>
  </SectionModule>
</SectionContainer>`

/** @type {import('@storybook/vue3').StoryObj<typeof SectionContainer>} */
export const WithModules = {
  render: () => ({
    components: { SectionContainer, SectionModule, SectionGap },
    template: MODULES_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'What the column is actually for: a stack of `SectionModule` bands, with `SectionGap` for the deliberate pauses between them. The column stays `:padded="false"` — the default — because each module already owns its inset; turning both on doubles the padding. Note the division rule: the first module draws no top edge, every later one draws the seam above it, so a page never shows two hairlines on the same pixel.'
      },
      source: { code: toSfc(IMPORT_MODULES, MODULES_TEMPLATE) }
    }
  }
}

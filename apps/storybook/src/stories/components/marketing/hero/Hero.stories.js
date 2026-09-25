import Hero from '@aziontech/webkit/hero'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionModule from '@aziontech/webkit/section-module'
import TextureMaterial from '@aziontech/webkit/texture-material'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = ["import Hero from '@aziontech/webkit/hero'"]

const IMPORT_WITH_PATTERN = [
  ...IMPORT,
  "import TextureMaterial from '@aziontech/webkit/texture-material'"
]

const IMPORT_PAGE = [
  ...IMPORT,
  "import SectionContainer from '@aziontech/webkit/section-container'",
  "import SectionModule from '@aziontech/webkit/section-module'"
]

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string template: Vue compiles
// `<Hero.Title>` to `resolveComponent("Hero.Title")`, an exact-name lookup
// (a bare `Hero` registration does not satisfy it). In a real SFC the dotted
// tag resolves off the imported `Hero` binding, so consumer code needs only
// `import Hero` — these extra registrations are a Storybook-runtime concern.
const components = {
  Hero,
  'Hero.Title': Hero.Title,
  SectionContainer,
  SectionModule,
  TextureMaterial
}

/** @type {import('@storybook/vue3').Meta<typeof Hero>} */
const meta = {
  title: 'Components/Marketing/Hero',
  component: Hero,
  subcomponents: { 'Hero.Title': Hero.Title },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'The opening band of a page: a full-bleed section spanning the whole viewport width whose copy is centered in a capped column, optionally filling one screen and optionally carrying a decorative backdrop behind it. It is the top layer of the page language and the owner of the page’s first rule — the bottom hairline every column below it hangs from. `Hero.Title` is the copy block it centers.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['band', 'screen'],
      description: 'Height of the band; `screen` fills one viewport minus `--banner-offset`.',
      table: {
        category: 'props',
        type: { summary: "'band' | 'screen'" },
        defaultValue: { summary: "'band'" }
      }
    },
    maxWidth: {
      control: 'inline-radio',
      options: ['3xl', '4xl', '5xl', '6xl', '7xl', 'site', 'full'],
      description:
        'Width the inner column is capped at. `site` is the marketing measure, `full` keeps only the inset.',
      table: {
        category: 'props',
        type: { summary: "'3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'site' | 'full'" },
        defaultValue: { summary: "'7xl'" }
      }
    },
    bordered: {
      control: 'boolean',
      description: 'Draw the band’s bottom rule, which is the top edge of whatever follows it.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    padded: {
      control: 'boolean',
      description: 'Apply the band’s own vertical rhythm. The inline inset is always applied.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    texture: {
      control: 'inline-radio',
      options: ['none', 'dots', 'grid', 'dither', 'pixelate'],
      description:
        'Paint this texture behind the band’s content; `none` leaves the backdrop to the `background` slot.',
      table: {
        category: 'props',
        type: { summary: "'dots' | 'grid' | 'dither' | 'pixelate' | 'none'" },
        defaultValue: { summary: "'none'" }
      }
    },
    textureFade: {
      control: 'inline-radio',
      options: ['none', 'top', 'bottom', 'edges', 'vignette'],
      description: 'Fade applied to the layer the `texture` prop paints.',
      table: {
        category: 'props',
        type: { summary: "'none' | 'top' | 'bottom' | 'edges' | 'vignette'" },
        defaultValue: { summary: "'none'" }
      }
    },
    floorTexture: {
      control: 'select',
      options: ['none', 'dots', 'grid', 'dither', 'pixelate'],
      description:
        "Paint this texture standing on the band's floor, filling the `bottom` window under the brand strip.",
      table: {
        category: 'props',
        type: { summary: "'dots' | 'grid' | 'dither' | 'pixelate' | 'none'" },
        defaultValue: { summary: "'none'" }
      }
    },
    align: {
      control: 'inline-radio',
      options: ['top', 'center', 'bottom'],
      description: 'Where the content column sits vertically when the band fills a screen.',
      table: {
        category: 'props',
        type: { summary: "'top' | 'center' | 'bottom'" },
        defaultValue: { summary: "'center'" }
      }
    },
    carousel: {
      control: 'boolean',
      description: "Stand the brand strip on the band's floor, under the `bottom` window.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    carouselMarks: {
      control: 'object',
      description: 'Registry names of the marks the strip shows, in order.',
      table: {
        category: 'props',
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' }
      }
    },
    carouselLabel: {
      control: 'text',
      description: 'Overline above the brand strip, stating the claim the marks make.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    }
  },
  args: {
    kind: 'band',
    maxWidth: '7xl',
    bordered: true,
    padded: true,
    texture: 'none',
    textureFade: 'none',
    floorTexture: 'none',
    align: 'center',
    carousel: false,
    carouselMarks: [],
    carouselLabel: ''
  }
}

export default meta

const Template = (args) => ({
  components,
  setup() {
    return { args }
  },
  template: `
    <Hero v-bind="args">
      <Hero.Title
        centered
        eyebrow="Infrastructure"
        title="A global network built for fast applications"
        description="Run closer to users with low-latency delivery and stable routing."
      />
    </Hero>
  `
})

const DEFAULT_MARKUP = `<Hero max-width="7xl">
  <Hero.Title
    centered
    eyebrow="Infrastructure"
    title="A global network built for fast applications"
    description="Run closer to users with low-latency delivery and stable routing."
  />
</Hero>`

/** @type {import('@storybook/vue3').StoryObj<typeof Hero>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'The band spans the window; its copy stays on the page’s measure.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const WIDTHS_TEMPLATE = `<div>
  <Hero max-width="4xl">
    <p class="m-0 text-center text-body-md text-(--text-muted)">4xl</p>
  </Hero>
  <Hero max-width="7xl">
    <p class="m-0 text-center text-body-md text-(--text-muted)">7xl</p>
  </Hero>
  <Hero max-width="full">
    <p class="m-0 text-center text-body-md text-(--text-muted)">full</p>
  </Hero>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Hero>} */
export const Widths = {
  render: () => ({ components, template: WIDTHS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Three caps in one view — a width only reads against another.' },
      source: { code: toSfc(IMPORT, WIDTHS_TEMPLATE) }
    }
  }
}

const SCREEN_TEMPLATE = `<Hero kind="screen" max-width="site">
  <Hero.Title
    centered
    eyebrow="Infrastructure"
    title="A global network built for fast applications"
  />
</Hero>`

/** @type {import('@storybook/vue3').StoryObj<typeof Hero>} */
export const Screen = {
  render: () => ({ components, template: SCREEN_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'With `kind="screen"` the band measures one viewport, minus whatever `--banner-offset` a sticky bar above it declares.'
      },
      source: { code: toSfc(IMPORT, SCREEN_TEMPLATE) }
    }
  }
}

const MEDIA_TEMPLATE = `<Hero max-width="site">
  <Hero.Title
    eyebrow="Infrastructure"
    title="A global network built for fast applications"
    description="Run closer to users with low-latency delivery and stable routing."
  />

  <template #media>
    <div class="flex aspect-video w-full items-center justify-center border border-(--border-default) bg-(--bg-surface) text-body-sm text-(--text-muted)">
      Any asset — a screenshot, a diagram, a signup form
    </div>
  </template>
</Hero>`

/** @type {import('@storybook/vue3').StoryObj<typeof Hero>} */
export const Media = {
  render: () => ({ components, template: MEDIA_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Filling the `media` slot splits the content column in two from `md` up, with the copy keeping the leading one. Below `md` the media stacks under the copy, so the statement is always read first. Leave the slot out for a single-column band.'
      },
      source: { code: toSfc(IMPORT, MEDIA_TEMPLATE) }
    }
  }
}

const BACKGROUND_TEMPLATE = `<Hero max-width="site">
  <template #background>
    <TextureMaterial kind="dots" size="medium" />
  </template>

  <Hero.Title
    centered
    eyebrow="Infrastructure"
    title="A global network built for fast applications"
  />
</Hero>`

/** @type {import('@storybook/vue3').StoryObj<typeof Hero>} */
export const Background = {
  render: () => ({ components, template: BACKGROUND_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The `background` slot takes any backdrop the `texture` prop cannot name — page artwork, a map, a composed scene. It renders full-bleed beneath the copy and is marked decorative, so nothing in it reaches the accessibility tree. Passing both is allowed: the texture paints first and the slot stacks on top.'
      },
      source: { code: toSfc(IMPORT_WITH_PATTERN, BACKGROUND_TEMPLATE) }
    }
  }
}

const BACKDROPS_TEMPLATE = `<div>
  <Hero max-width="site" texture="dots">
    <p class="m-0 text-center text-body-md text-(--text-muted)">dots — the site's own lattice</p>
  </Hero>
  <Hero max-width="site" texture="grid">
    <p class="m-0 text-center text-body-md text-(--text-muted)">grid</p>
  </Hero>
  <Hero max-width="site" texture="dither">
    <p class="m-0 text-center text-body-md text-(--text-muted)">dither — density ramps along an axis</p>
  </Hero>
  <Hero max-width="site" texture="pixelate">
    <p class="m-0 text-center text-body-md text-(--text-muted)">pixelate — lit from underneath</p>
  </Hero>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Hero>} */
export const Backdrops = {
  render: () => ({ components, template: BACKDROPS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Every texture the system ships, named on the band itself. `texture` is the short path for the common case — the band builds the decorative layer for you, so there is nothing to wire. Reach for the `background` slot instead when the backdrop is artwork rather than a texture. Quiet one with `--texture-ink` rather than with `opacity`, so the ground keeps showing through at full strength.'
      },
      source: { code: toSfc(IMPORT, BACKDROPS_TEMPLATE) }
    }
  }
}

const ASSET_WINDOWS_TEMPLATE = `<Hero
  kind="screen"
  align="center"
  max-width="site"
  class="[--banner-top-height:42%] [--banner-bottom-height:22%]"
>
  <template #background>
    <TextureMaterial kind="dots" size="small" fade="bottom" />
  </template>

  <template #top>
    <div class="flex h-full items-start justify-center pt-(--spacing-xl)">
      <div class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-lg) py-(--spacing-md) text-body-sm text-(--text-muted)">
        Any asset — an SVG, a diagram, a video — framed by the top window
      </div>
    </div>
  </template>

  <Hero.Title
    centered
    eyebrow="Infrastructure"
    title="A global network built for fast applications"
    description="Run closer to users with low-latency delivery and stable routing."
  />

  <template #bottom>
    <div class="flex h-full items-end justify-center pb-(--spacing-xl)">
      <p class="m-0 text-body-sm text-(--text-muted)">The bottom window keeps its content reachable.</p>
    </div>
  </template>
</Hero>`

/** @type {import('@storybook/vue3').StoryObj<typeof Hero>} */
export const AssetWindows = {
  render: () => ({ components, template: ASSET_WINDOWS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'The `top` and `bottom` slots are asset windows anchored to the band’s edges. Each one clips its child, so an asset larger than the band shows only the part the window frames — `--banner-top-height` sizes the window and `--banner-top-x` / `-y` move the asset inside it. The band is an `isolate` stacking context whose layer order is set by `--banner-z-background`, `--banner-z-top`, `--banner-z-bottom` and `--banner-z-content`.'
      },
      source: { code: toSfc(IMPORT_WITH_PATTERN, ASSET_WINDOWS_TEMPLATE) }
    }
  }
}

const ALIGN_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-md) lg:grid-cols-3">
  <Hero kind="screen" align="top" max-width="full" class="[--banner-offset:75dvh]">
    <Hero.Title centered eyebrow="Top" title="Content at the top" />
  </Hero>
  <Hero kind="screen" align="center" max-width="full" class="[--banner-offset:75dvh]">
    <Hero.Title centered eyebrow="Center" title="Content centered" />
  </Hero>
  <Hero kind="screen" align="bottom" max-width="full" class="[--banner-offset:75dvh]">
    <Hero.Title centered eyebrow="Bottom" title="Content at the bottom" />
  </Hero>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Hero>} */
export const Alignment = {
  render: () => ({ components, template: ALIGN_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'In a `screen` band the copy is placed by `align`, so a page never computes the band’s height itself. `center` is the default and puts the headline on the page’s own centre line, minus `--banner-offset`.'
      },
      source: { code: toSfc(IMPORT, ALIGN_TEMPLATE) }
    }
  }
}

const PAGE_TEMPLATE = `<div>
  <Hero kind="screen" max-width="site" texture="dots">
    <Hero.Title
      centered
      eyebrow="Infrastructure"
      title="A global network built for fast applications"
      description="Run closer to users with low-latency delivery and stable routing."
    />
  </Hero>

  <SectionContainer max-width="site">
    <SectionModule
      :divided="false"
      title="What you get"
      description="The first module opens on the band's own rule, so it draws no top edge of its own."
    >
      <p class="m-0 text-body-md text-(--text-muted)">Module body.</p>
    </SectionModule>

    <SectionModule
      title="How it works"
      description="Every module after the first draws the rule that divides it from the one above."
    >
      <p class="m-0 text-body-md text-(--text-muted)">Module body.</p>
    </SectionModule>
  </SectionContainer>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Hero>} */
export const PageLanguage = {
  render: () => ({ components, template: PAGE_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The whole page frame, drawn once by three components. The band is full-bleed and owns the page’s **top** rule (its `border-b`); the column below owns the **sides** (`border-x`); the footer owns the bottom. Because the band already drew the line they meet on, the first module passes `:divided="false"` — that is the one rule of the handoff, and the reason no edge in a page is ever doubled.'
      },
      source: { code: toSfc(IMPORT_PAGE, PAGE_TEMPLATE) }
    }
  }
}

const CAROUSEL_TEMPLATE = `<Hero
  kind="screen"
  align="center"
  max-width="site"
  floor-texture="pixelate"
  carousel
  carousel-label="Trusted by teams running in production"
  :carousel-marks="['herospark', 'itau', 'nzn', 'netshoes', 'caixa', 'agibank', 'gpa']"
  class="[--banner-floor-bg:var(--bg-surface)] [--texture-pool-a:95%_64%] [--texture-pool-b:-2%_38%]"
>
  <Hero.Title
    title="Build and deploy AI agents and applications in seconds"
    description="Run AI models close to users on highly distributed infrastructure for scalable, low-latency, and cost-effective inference while preserving data locality."
  />
</Hero>`

/** @type {import('@storybook/vue3').StoryObj<typeof Hero>} */
export const Carousel = {
  render: () => ({ components, template: CAROUSEL_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'The band’s floor holds the `bottom` window and the brand strip in one block, so a single ground covers both — `--banner-floor-bg` plinths the floor a shade off the band’s own canvas. `floorTexture` fills that window without wiring a slot: the cell is fixed, so the band already carries the ink (`--banner-floor-ink`) and the horizontal falloff fitted to it, and `--texture-pool-a` / `-b` place the light inside it. `carousel` loads the strip on demand, so a band without one pulls in neither the strip nor its mark registry, and `carousel-label` names what the marks are evidence of.'
      },
      source: { code: toSfc(IMPORT, CAROUSEL_TEMPLATE) }
    }
  }
}

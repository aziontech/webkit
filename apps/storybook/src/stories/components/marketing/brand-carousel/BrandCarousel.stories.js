import BrandCarousel from '@aziontech/webkit/brand-carousel'
import TextureMaterial from '@aziontech/webkit/texture-material'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import BrandCarousel from '@aziontech/webkit/brand-carousel'"

const CLIENTS = [
  'global-fashion-group',
  'herospark',
  'itau',
  'nzn',
  'netshoes',
  'caixa',
  'agibank',
  'prime-video',
  'america-movil',
  'gpa',
  'fourbank'
]

const FRAMEWORKS = [
  'nextjs',
  'astro',
  'react',
  'vue',
  'angular',
  'nuxt',
  'gatsby',
  'hugo',
  'preact',
  'remix',
  'qwik',
  'vite',
  'aws',
  'gcp',
  'azure',
  'terraform',
  'github',
  'openai',
  'anthropic',
  'sqlite'
]

const MARK_NAMES = [
  'agibank',
  'america-movil',
  'angular',
  'anthropic',
  'astro',
  'aws',
  'azure',
  'caixa',
  'coca-cola',
  'dafiti',
  'docusaurus',
  'drizzle',
  'elastic',
  'eleventy',
  'equinix',
  'exame',
  'fourbank',
  'gatsby',
  'gcp',
  'github',
  'global-fashion-group',
  'gpa',
  'grafana',
  'graphql',
  'groq',
  'herospark',
  'hexo',
  'hono',
  'hugo',
  'itau',
  'jekyll',
  'kafka',
  'madeiramadeira',
  'magalu',
  'netshoes',
  'nextjs',
  'nodejs',
  'nuxt',
  'nzn',
  'openai',
  'preact',
  'prime-video',
  'qwik',
  'radware',
  'react',
  'remix',
  'renner',
  'sqlite',
  'terraform',
  'vite',
  'vitepress',
  'vue',
  'workers-cloudflare'
]

const CLIENT_LABEL = 'Trusted by mission-critical workloads'
const CLIENT_ARIA = 'Companies running on Azion'

// The snippet has to be paste-and-run, so a list is spelled out rather than mapped.
const list = (names, indent = '    ') => names.map((name) => `${indent}'${name}'`).join(',\n')

/** @type {import('@storybook/vue3').Meta<typeof BrandCarousel>} */
const meta = {
  title: 'Components/Marketing/BrandCarousel',
  component: BrandCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "An endlessly looping row of brand marks — the trust strip that names the companies running on the platform, and the stack strip that names the frameworks and clouds a workload already uses. The marks come from the package's own registry and are drawn in one ink, so a strip reads as a list rather than as a dozen competing palettes."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    marks: {
      control: 'object',
      options: MARK_NAMES,
      description:
        'Registry names of the marks rendered in the row, in order; an unregistered name renders as its own typographic wordmark so the row stays complete.',
      table: {
        category: 'props',
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' }
      }
    },
    label: {
      control: 'text',
      description: 'Overline above the row, stating the claim the marks make.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    kind: {
      control: 'inline-radio',
      options: ['plain', 'band'],
      description:
        'Whether the strip paints its own ground; band fills it with the page canvas so a textured hero cannot show through the marks, and the floor still reads continuous with the band above it.',
      table: {
        category: 'props',
        type: { summary: "'plain' | 'band'" },
        defaultValue: { summary: "'plain'" }
      }
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium'],
      description:
        'Mark scale; medium is the marketing band and climbs 32/40/48 px by device class, small is a flat 24 px for a column.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    duration: {
      control: { type: 'number', min: 0, step: 1 },
      description:
        'Seconds for one full pass; left at 0 it is derived from the number of marks so every strip moves at one speed.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '0' }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the row of marks, announced instead of an unnamed list.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    }
  },
  args: {
    kind: 'plain',
    marks: CLIENTS,
    label: CLIENT_LABEL,
    size: 'medium',
    duration: 0,
    ariaLabel: CLIENT_ARIA
  }
}

export default meta

const Template = (args) => ({
  components: { BrandCarousel },
  setup() {
    return { args }
  },
  template: '<BrandCarousel v-bind="args" />'
})

const DEFAULT_MARKUP = `<BrandCarousel
  label="${CLIENT_LABEL}"
  aria-label="${CLIENT_ARIA}"
  :marks="[
${list(CLIENTS)}
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof BrandCarousel>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Eleven client marks looping under an overline. Every mark is an inline SVG drawn in `currentColor`, so the row takes one ink from the surface it sits on and follows the theme without a second asset or a filter — flip the toolbar between light and dark and the marks come with it. The track holds the row twice and travels exactly -50%, which is why the seam never shows; the second copy is `aria-hidden`, so a screen reader hears each company once. Hover anywhere on the strip to pause it. Leave `duration` at 0 and the pass is derived from the mark count, so this strip and a thirty-mark one advance at the same speed rather than in the same time.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-col gap-12">
  <BrandCarousel
    size="medium"
    label="Medium — the marketing band"
    :marks="[
${list(CLIENTS, '      ')}
    ]"
  />
  <BrandCarousel
    size="small"
    label="Small — a column's floor"
    :marks="[
${list(CLIENTS, '      ')}
    ]"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof BrandCarousel>} */
export const Sizes = {
  render: () => ({
    components: { BrandCarousel },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The two scales, one above the other. `medium` is a responsive ladder rather than one height — 32 px on a phone, 40 px from `md`, 48 px from `lg` — because the same 48 px mark that reads as a row on a desktop is one logo drifting past on a 375 px viewport. `small` is a flat 24 px for a column that is asking for a form field, where the strip is proof rather than a feature. The cell width moves with the height (150/200/240, and 120 for small), so every mark advances on one constant pitch instead of on its own artwork width.'
      },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const FRAMEWORKS_MARKUP = `<BrandCarousel
  label="Your Stack, Your Way"
  aria-label="Frameworks and clouds Azion runs"
  :marks="[
${list(FRAMEWORKS)}
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof BrandCarousel>} */
export const Frameworks = {
  render: Template,
  args: {
    marks: FRAMEWORKS,
    label: 'Your Stack, Your Way',
    ariaLabel: 'Frameworks and clouds Azion runs'
  },
  parameters: {
    docs: {
      description: {
        story:
          'The same component making a different claim: frameworks, clouds and tooling rather than customers. The registry holds both populations, so a framework mark resolves exactly as a client mark does and the two strips on one page are one component with two lists. Twenty marks derive a longer pass than eleven do, which is the point of deriving it — the row advances at the same rate either way. Marks load on demand, so a page carries only the ones it names.'
      },
      source: { code: toSfc(IMPORT, FRAMEWORKS_MARKUP) }
    }
  }
}

const FALLBACK_MARKS = ['magalu', 'renner', 'iFood', 'dafiti', 'Zoop', 'netshoes']

const FALLBACK_MARKUP = `<BrandCarousel
  label="Artwork optional"
  aria-label="Companies with and without a registered mark"
  :marks="[
${list(FALLBACK_MARKS)}
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof BrandCarousel>} */
export const Fallback = {
  render: Template,
  args: {
    marks: FALLBACK_MARKS,
    label: 'Artwork optional',
    ariaLabel: 'Companies with and without a registered mark'
  },
  parameters: {
    docs: {
      description: {
        story:
          'Two of these six have no entry in the registry, and they render as their own name set in the heading scale rather than as a gap. That is what lets a page state the list it means to state before every asset has landed — a company is named either way, and the row keeps its pitch because the cell is a fixed width regardless of what sits in it. An unregistered name is never an error; adding the artwork later changes nothing at the call site.'
      },
      source: { code: toSfc(IMPORT, FALLBACK_MARKUP) }
    }
  }
}

const BAND_TEMPLATE = `<div class="relative overflow-hidden bg-(--bg-canvas) pt-(--spacing-xxl)">
  <TextureMaterial kind="dots" size="small" fade="bottom" />
  <div class="relative flex min-h-80 flex-col justify-end">
    <BrandCarousel
      kind="band"
      label="Trusted by mission-critical workloads"
      :marks="['itau', 'netshoes', 'nzn']"
    />
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof BrandCarousel>} */
export const Band = {
  render: () => ({
    components: { BrandCarousel, TextureMaterial },
    template: BAND_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'On the floor of a textured band the strip needs a ground of its own, or the marks read through the lattice behind them. `kind="band"` gives it its own fill and vertical rhythm so it lands as a band, which is how a page composes it into `Hero`’s `bottom` slot.'
      },
      source: {
        code: toSfc(
          [IMPORT, "import TextureMaterial from '@aziontech/webkit/texture-material'"],
          BAND_TEMPLATE
        )
      }
    }
  }
}

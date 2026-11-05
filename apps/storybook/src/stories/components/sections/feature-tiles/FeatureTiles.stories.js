import FeatureTiles from '@aziontech/webkit/sections/feature-tiles'

import { withStoryAssets } from '../../../_shared/site-assets'
import { toSfc } from '../../../_shared/story-source'
import { ARTWORK_SECTION } from '../../../templates/marketing/_sections/feature-tiles'

const IMPORT = "import FeatureTiles from '@aziontech/webkit/sections/feature-tiles'"

/** @type {import('@storybook/vue3').Meta<typeof FeatureTiles>} */
const meta = {
  title: 'Components/Sections/FeatureTiles',
  component: FeatureTiles,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "The reasons band of a marketing page: an optional centered section title over a frame grid of media tiles, each an image or an illustration above a short heading and a sentence. It is a page section — the site places it from a `{ _id: 'feature-tiles', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `card-grid`, `media-tile` and `illustration`. `kind` picks the layout only: `artwork` is four columns with marks on every corner, `illustrated` is three columns with marks on the bottom rule; the tiles keep the same shape in both."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['artwork', 'illustrated'],
      description:
        'Layout of the grid: `artwork` is four columns with marks on every corner, `illustrated` three columns with marks on the bottom rule.',
      table: {
        category: 'props',
        type: { summary: 'FeatureTilesKind' },
        defaultValue: { summary: "'artwork'" }
      }
    },
    anchor: {
      control: 'text',
      description: 'In-page id set on the band so a `#hash` link can scroll to it.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    eyebrow: {
      control: 'text',
      description: 'Overline above the section title.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the centered section title as its `h2`; the band renders no header when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    description: {
      control: 'text',
      description: 'Supporting sentence under the headline.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    tiles: {
      control: 'object',
      description:
        'The tiles rendered as frame cells, in order; each is `{ title, description, image?, illustration?, scale? }` where `image` is a picture URL, `illustration` a registry name drawn fluid, and `scale` its media scale.',
      table: {
        category: 'props',
        type: { summary: 'FeatureTilesTile[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: withStoryAssets(ARTWORK_SECTION.props)
}

export default meta

const Template = (args) => ({
  components: { FeatureTiles },
  setup() {
    return { args }
  },
  template: '<FeatureTiles v-bind="args" />'
})

const DEFAULT_MARKUP = `<FeatureTiles
  kind="artwork"
  eyebrow="Why Azion"
  title="From commit to live traffic, on one platform"
  description="Build, ship, and run an application on the same platform that serves it — one place to deploy from, one place to watch it from."
  :tiles="[
    {
      image: '/marketing-components/illustrations/branches.svg',
      title: 'Build at AI speed.',
      description: 'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
    },
    {
      image: '/marketing-components/illustrations/personal-tokens.svg',
      title: 'Secure by default.',
      description: 'Every workload runs in its own isolated environment, with WAF, rate limits, and leading compliance practices. No configuration required.'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof FeatureTiles>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the home page places it: the `artwork` layout with the overline, headline and lead over two picture tiles in the four-column frame. Edit the props in the Controls panel — a band with no tiles renders nothing at all, and one with no title drops its header.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <FeatureTiles
    kind="artwork"
    eyebrow="Why Azion"
    title="From commit to live traffic, on one platform"
    description="Build, ship, and run an application on the same platform that serves it — one place to deploy from, one place to watch it from."
    :tiles="[
      {
        image: '/marketing-components/illustrations/branches.svg',
        title: 'Build at AI speed.',
        description: 'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
      },
      {
        image: '/marketing-components/illustrations/personal-tokens.svg',
        title: 'Secure by default.',
        description: 'Every workload runs in its own isolated environment, with WAF, rate limits, and leading compliance practices. No configuration required.'
      }
    ]"
  />
  <FeatureTiles
    kind="illustrated"
    anchor="why-pricing"
    :tiles="[
      {
        illustration: 'no-idle-no-waste',
        scale: 0.7,
        title: 'No idle. No waste',
        description: 'Azion bills for actual consumption. You pay for what your applications use, not for infrastructure sitting idle waiting for demand.'
      },
      {
        illustration: 'stay-in-control',
        scale: 1,
        title: 'Stay in control',
        description: 'Scale without losing control of your bill. Track consumption, set spending limits, and keep costs predictable as your applications grow.'
      },
      {
        illustration: 'white-gloves-when-it-matters',
        scale: 0.8,
        title: 'White-glove when it matters',
        description: 'Self-service when you want it, experts when you need them. Azion specialists and partners help you build, migrate, optimize, and scale.'
      }
    ]"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof FeatureTiles>} */
export const Types = {
  render: () => ({ components: { FeatureTiles }, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Both layouts stacked: the `artwork` band with its header and picture tiles in the four-column frame with marks on every corner, then the `illustrated` band with no header, an `anchor`, and three illustration tiles in the three-column frame with marks on the bottom rule.'
      },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

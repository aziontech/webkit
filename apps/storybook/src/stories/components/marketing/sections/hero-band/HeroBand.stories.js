import HeroBand from '@aziontech/webkit/hero-band'

import { toSfc } from '../../../../_shared/story-source'
import { TITLE_BAND_SECTION } from '../../../../templates/marketing/_sections/hero-band'

const IMPORT = "import HeroBand from '@aziontech/webkit/hero-band'"

const ACTION_SUMMARY = "{ label: string; href: string; trailing?: boolean; target?: '_blank' | '_self' }"

/** @type {import('@storybook/vue3').Meta<typeof HeroBand>} */
const meta = {
  title: 'Components/Marketing/Sections/HeroBand',
  component: HeroBand,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "The opening band of a marketing page: the page `h1` with its overline, accent phrase, sentence and up to two actions, full width above the page column, with an optional client strip on the floor. It is a page section — the site places it from a `{ _id: 'hero-band', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `button` and `illustration`. `kind` picks the layout only: `centered` fills a screen over a dot field with the copy centered, `title-band` is a padded band with the copy centered, `pixel-floor` sets the copy at the start over an animated pixel floor, and `copy-beside-art` sets an illustration beside the copy; every layout takes the same copy, actions and client strip."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['centered', 'title-band', 'pixel-floor', 'copy-beside-art'],
      description:
        'Layout of the band: `centered` fills a screen over a dot field, `title-band` is a padded band, `pixel-floor` sets the copy over an animated pixel floor, `copy-beside-art` sets an illustration beside the copy.',
      table: {
        category: 'props',
        type: { summary: 'HeroBandKind' },
        defaultValue: { summary: "'title-band'" }
      }
    },
    size: {
      control: 'inline-radio',
      options: ['medium', 'large'],
      description: 'Vertical rhythm of the band; `large` is the opening a product page leads with.',
      table: {
        category: 'props',
        type: { summary: 'HeroBandSize' },
        defaultValue: { summary: "'medium'" }
      }
    },
    eyebrow: {
      control: 'text',
      description: 'Short overline above the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    highlight: {
      control: 'text',
      description:
        'Opening words of the headline, painted in the brand accent; reads as one sentence with `title`.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    title: {
      control: 'text',
      description: 'Page headline, rendered as the page `h1`; the band renders nothing when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Sentence under the headline.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    primaryAction: {
      control: 'object',
      description:
        'First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link.',
      table: {
        category: 'props',
        type: { summary: 'HeroBandAction', detail: ACTION_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    },
    secondaryAction: {
      control: 'object',
      description:
        'Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link.',
      table: {
        category: 'props',
        type: { summary: 'HeroBandAction', detail: ACTION_SUMMARY },
        defaultValue: { summary: 'undefined' }
      }
    },
    carouselLabel: {
      control: 'text',
      description: 'Overline above the client strip.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    carouselMarks: {
      control: 'object',
      description:
        'Registry names of the client marks on the band floor, in order; the strip renders only when it has marks.',
      table: { category: 'props', type: { summary: 'string[]' }, defaultValue: { summary: '[]' } }
    },
    illustration: {
      control: 'text',
      description:
        'Registry name of the illustration set beside the copy in the `copy-beside-art` layout.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    illustrationAriaLabel: {
      control: 'text',
      description: 'Accessible description of the illustration.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    headerOffset: {
      control: 'text',
      description:
        'Height of the site header above the band, taken out of a band that fills a screen; any CSS length.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    }
  },
  args: TITLE_BAND_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { HeroBand },
  setup() {
    return { args }
  },
  template: '<HeroBand v-bind="args" />'
})

const DEFAULT_MARKUP = `<HeroBand
  kind="title-band"
  size="large"
  eyebrow="Cache"
  title="Deliver content fast, worldwide"
  description="Serve cached content close to users. Cut origin load and keep applications fast during traffic spikes."
  :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup/' }"
  :secondary-action="{ label: 'Docs', href: 'https://www.azion.com/en/documentation/', trailing: true }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof HeroBand>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as a product page opens with it: the large `title-band` with the overline, headline, sentence and both actions centered. Edit the props in the Controls panel — a band with no title renders nothing, and one with no marks has no client strip.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-col">
  <HeroBand
    kind="centered"
    highlight="Build and run applications"
    title="globally, with no ops"
    description="Run code, AI, data, and security on 100+ data centers worldwide."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
    carousel-label="Trusted by teams running critical workloads"
    :carousel-marks="['global-fashion-group', 'herospark', 'itau', 'nzn', 'netshoes']"
  />
  <HeroBand
    kind="title-band"
    size="large"
    eyebrow="Cache"
    title="Deliver content fast, worldwide"
    description="Serve cached content close to users."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
  />
  <HeroBand
    kind="pixel-floor"
    eyebrow="AI Inference"
    title="Build and deploy AI agents and applications in seconds"
    description="Run AI inference close to users on Azion’s distributed infrastructure."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Talk to a specialist', href: '/contact' }"
    carousel-label="Trusted by teams running critical workloads"
    :carousel-marks="['global-fashion-group', 'herospark', 'itau', 'nzn', 'netshoes']"
  />
  <HeroBand
    kind="copy-beside-art"
    eyebrow="AWS Alternative Comparison"
    title="AWS sells services. Your team becomes the integrator."
    description="Azion delivers one platform, distributed by default."
    :primary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
    illustration="global-network"
    illustration-aria-label="A global network of Azion data centers"
    carousel-label="Trusted by teams running critical workloads"
    :carousel-marks="['agibank', 'radware', 'america-movil', 'gpa', 'fourbank']"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof HeroBand>} */
export const Types = {
  render: () => ({ components: { HeroBand }, template: TYPES_TEMPLATE }),
  parameters: {
    visual: false,
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Every layout stacked: `centered` over the dot field with the client strip, the large `title-band`, `pixel-floor` with its copy at the start over the animated floor, and `copy-beside-art` with the illustration beside the copy.'
      },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

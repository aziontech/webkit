import TemplateGallery from '@aziontech/webkit/template-gallery'

import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/template-gallery'

const IMPORT = "import TemplateGallery from '@aziontech/webkit/template-gallery'"

const actionType = {
  control: 'object',
  table: {
    category: 'props',
    type: { summary: 'TemplateGalleryAction' },
    defaultValue: { summary: 'undefined' }
  }
}

const text = (description) => ({
  control: 'text',
  description,
  table: {
    category: 'props',
    type: { summary: 'string' },
    defaultValue: { summary: "''" }
  }
})

/** @type {import('@storybook/vue3').Meta<typeof TemplateGallery>} */
const meta = {
  title: 'Components/Marketing/Sections/TemplateGallery',
  component: TemplateGallery,
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
          "The templates band of a solution page: a framed media split whose copy side invites the reader to start from a template and whose media side is a scrolling two-column wall of deployable template cards, closed by a ticker of the frameworks and clouds it works with. It is a page section — the site places it from a `{ _id: 'template-gallery', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `media-split`, `scroll-area`, `card-grid`, `button`, `frame-box` and `ticker` rather than owning any anatomy of its own."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    eyebrow: text('Overline above the headline.'),
    title: text(
      'Headline of the band, rendered by the media split as its `h2` and naming its region.'
    ),
    description: text('Paragraph under the headline.'),
    primaryAction: {
      ...actionType,
      description:
        'First button under the copy, drawn as the large secondary button; `{ label, href, trailing?, target? }`. Omitted when absent.'
    },
    secondaryAction: {
      ...actionType,
      description:
        'Second button under the copy, drawn as the large outlined button; `{ label, href, trailing?, target? }`. Omitted when absent.'
    },
    templates: {
      control: 'object',
      description:
        'The template cards of the scrolling wall, in order; each is `{ title, description?, icon?, invertInDark?, href? }`. Templates without a title are skipped.',
      table: {
        category: 'props',
        type: { summary: 'TemplateGalleryTemplate[]' },
        defaultValue: { summary: '[]' }
      }
    },
    deployLabel: text(
      'Label of the deploy button on each card; a card renders its button only when both this and its `href` are set.'
    ),
    templatesAriaLabel: text('Accessible name of the scrolling wall of templates.'),
    tickerLabel: text('Overline above the row of marks.'),
    tickerMarks: {
      control: 'object',
      description:
        'Registry names of the frameworks and clouds in the row of marks, in order; the ticker is omitted when empty.',
      table: {
        category: 'props',
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { TemplateGallery },
  setup() {
    return { args }
  },
  template: '<TemplateGallery v-bind="args" />'
})

const DEFAULT_MARKUP = `<TemplateGallery
  eyebrow="Your Stack, Your Way"
  title="Quick Start with Templates"
  description="Launch storefronts faster with pre-built templates and starter kits. Deploy complete projects in seconds with popular frameworks."
  :primary-action="{ label: 'Start for free', href: '/signup' }"
  :secondary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
  :templates="[
    {
      title: 'AI Inference Starter Kit',
      description: 'Create an application that runs AI models close to users.',
      icon: 'ai ai-edge-functions',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Next.js Commerce',
      description: 'Ecommerce template built with Next.js and Shopify.',
      icon: 'ai-cor ai-next',
      invertInDark: true,
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'Astro Odyssey',
      description: 'A modern business marketing website theme/starter built with Astro.',
      icon: 'ai-cor ai-astro',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    },
    {
      title: 'SvelteKit Commerce',
      description: 'Ecommerce template built with SvelteKit and Shopify.',
      icon: 'ai-cor ai-svelte',
      href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates'
    }
  ]"
  deploy-label="Deploy now"
  templates-aria-label="Templates you can deploy"
  ticker-label="Compatible with Your Stack"
  :ticker-marks="['nextjs', 'astro', 'react', 'vue', 'angular', 'nuxt']"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof TemplateGallery>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "The Retail page's band: the storefront pitch beside a scrolling wall of eight deploy templates, closed by a ticker of compatible frameworks and clouds. Marks flagged `invertInDark` invert under the dark theme. Edit the props in the Controls panel — a band with no templates renders nothing at all."
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

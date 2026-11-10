import UseCases from '@aziontech/webkit/sections/use-cases'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/use-cases'

const IMPORT = "import UseCases from '@aziontech/webkit/sections/use-cases'"

/** @type {import('@storybook/vue3').Meta<typeof UseCases>} */
const meta = {
  title: 'Components/Sections/UseCases',
  component: UseCases,
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
          "The \"what teams use it for\" band of a product page: a three-column frame whose first cell carries the band's overline, headline, lead and one call to action, followed by one cell per use case. It is a page section — the site places it from a `{ _id: 'use-cases', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `card-grid`, `frame-box`, `overline`, `topic` and `button` rather than owning any anatomy of its own."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    eyebrow: {
      control: 'text',
      description: 'Overline above the headline in the title cell, closed by the blinking cursor.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    title: {
      control: 'text',
      description: 'Headline of the band, rendered as its `h2` in the title cell.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    description: {
      control: 'text',
      description: 'One-line lead under the headline.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    primaryAction: {
      control: 'object',
      description:
        'Button pinned to the foot of the title cell; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'UseCasesAction' },
        defaultValue: { summary: 'undefined' }
      }
    },
    items: {
      control: 'object',
      description:
        'The use cases rendered as frame cells, in order; each item is `{ icon, title, description }`.',
      table: {
        category: 'props',
        type: { summary: 'UseCasesItem[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { UseCases },
  setup() {
    return { args }
  },
  template: '<UseCases v-bind="args" />'
})

const DEFAULT_MARKUP = `<UseCases
  eyebrow="SQL Database"
  title="What teams use SQL Database for"
  description="Teams use it to:"
  :primary-action="{ label: 'Docs', href: '/site/docs', trailing: true }"
  :items="[
    {
      icon: 'pi pi-comments',
      title: 'RAG Applications',
      description: 'Build topic-specific chatbots with the topic data stored in SQL Database.'
    },
    {
      icon: 'pi pi-search',
      title: 'Search Applications',
      description: 'Power search with vector similarity queries on stored embeddings.'
    },
    {
      icon: 'pi pi-sync',
      title: 'AI Context Injection',
      description: 'Give AI applications relevant context from vector embeddings.'
    },
    {
      icon: 'pi pi-globe',
      title: 'AI Workflows',
      description: 'Pair stored embeddings with AI Inference to run RAG applications on Azion.'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof UseCases>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the SQL Database page places it: the product name as overline, the headline and lead in the title cell with a link out to the documentation, and four icon-led use cases filling the rest of the three-column frame. Edit the props in the Controls panel — a band with no items renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

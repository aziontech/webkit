import ArticleIndexResourceHub from '@aziontech/webkit/article-index-resource-hub'

import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/article-index-resource-hub'

const IMPORT =
  "import ArticleIndexResourceHub from '@aziontech/webkit/article-index-resource-hub'"

const text = (summary) => ({
  category: 'props',
  type: { summary },
  defaultValue: { summary: "''" }
})

/** @type {import('@storybook/vue3').Meta<typeof ArticleIndexResourceHub>} */
const meta = {
  title: 'Components/Marketing/Sections/ArticleIndexResourceHub',
  component: ArticleIndexResourceHub,
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
          "Every resource of a hub as one ruled list, with a headline and one searchable dropdown per facet on one row. Each resource is a row — its cover, overline, headline and two-line deck centred in the row — that is one link named by its headline, with a read cue that rises in on hover or focus from `lg` up. The facets combine; a load-more button closes the list. It is a page section — the site places it from a `{ _id: 'article-index-resource-hub', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `select`, `input-text` and `button`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: {
      control: 'text',
      description: 'In-page id set on the band so a `#hash` link can scroll to it.',
      table: text('string')
    },
    title: {
      control: 'text',
      description: "Headline beside the dropdowns, rendered as the band's `h2`.",
      table: text('string')
    },
    items: {
      control: 'object',
      description:
        'The resources, in order; each is `{ key, href, image, meta, title, description, facets? }`.',
      table: {
        category: 'props',
        type: { summary: 'ArticleIndexResourceHubItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    facets: {
      control: 'object',
      description: 'The facet dropdowns, in order; each is `{ key, label, allLabel, options }`.',
      table: {
        category: 'props',
        type: { summary: 'ArticleIndexResourceHubFacet[]' },
        defaultValue: { summary: '[]' }
      }
    },
    rowLabel: {
      control: 'text',
      description: 'Read cue revealed at the end of a row under hover or focus.',
      table: text('string')
    },
    moreLabel: {
      control: 'text',
      description:
        'Label of the load-more button under the list; the button is omitted when empty.',
      table: text('string')
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the list of resources.',
      table: text('string')
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ArticleIndexResourceHub },
  setup() {
    return { args }
  },
  template: '<ArticleIndexResourceHub v-bind="args" />'
})

const DEFAULT_MARKUP = `<ArticleIndexResourceHub
  anchor="resources"
  title="Explore all resources"
  row-label="Read article"
  more-label="Load more"
  aria-label="Resources"
  :facets="[
    { key: 'contentType', label: 'Content type', allLabel: 'All content types', options: ['E-books', 'Blog', 'Comparisons'] },
    { key: 'industry', label: 'Industry', allLabel: 'All industries', options: ['Financial', 'Retail', 'Tech'] }
  ]"
  :items="[
    {
      key: 'security-applications-apis-ai-agents',
      href: 'https://www.azion.com/en/lp/security-applications-apis-ai-agents/',
      image: 'https://www.azion.com/assets/content/blog/uploads/Rich%20contentsdark.png',
      meta: 'E-books • OCT 15, 2026',
      title: 'Security for applications, APIs, and AI agents',
      description: 'Learn how to bring security policies into deployment, automate protection, and monitor traffic.',
      facets: { contentType: ['E-books'] }
    },
    {
      key: 'azion-mcp-servers-generally-available',
      href: 'https://www.azion.com/en/blog/azion-mcp-servers-generally-available/',
      image: 'https://www.azion.com/assets/content/blog/uploads/mcp-ga/Azion-MCP.svg',
      meta: 'Blog • OCT 14, 2026',
      title: 'Azion MCP servers: Connect Your Coding Agent to Azion',
      description: 'Azion MCP servers connect coding agents to the Azion documentation and API.',
      facets: { contentType: ['Blog'] }
    },
    {
      key: 'cloudflare-to-azion-alternative-guide',
      href: 'https://www.azion.com/en/lp/cloudflare-to-azion-alternative-guide/',
      image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-cf-to-azion.png',
      meta: 'Comparisons • OCT 3, 2026',
      title: 'Cloudflare Alternative Comparison: Azion vs Cloudflare',
      description: 'Azion vs Cloudflare: the same platform on every plan.',
      facets: { contentType: ['Comparisons'] }
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ArticleIndexResourceHub>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Resource Hub list at rest. Pick a value in a dropdown to narrow it; the dropdowns combine, and when nothing matches the list and its button are left out.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

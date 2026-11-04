import UseCaseLinks from '@aziontech/webkit/sections/use-case-links'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/use-case-links'

const IMPORT = "import UseCaseLinks from '@aziontech/webkit/sections/use-case-links'"

/** @type {import('@storybook/vue3').Meta<typeof UseCaseLinks>} */
const meta = {
  title: 'Components/Sections/UseCaseLinks',
  component: UseCaseLinks,
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
          "The use-case directory band of a solution page: a left-aligned section title over a divider grid of linked topics, one per use case, each an icon, a heading and a sentence that link to the page that explains it. It is a page section — the site places it from a `{ _id: 'use-case-links', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `section-title`, `frame-box`, `card-grid` and `topic` rather than owning anatomy of its own."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
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
        'Headline of the band, rendered by the left-aligned section title as its `h2`; the band renders no header when empty.',
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
    items: {
      control: 'object',
      description:
        'The use cases rendered as linked topics in a three-column divider grid, in order; each item is `{ icon, title, description, href }`.',
      table: {
        category: 'props',
        type: { summary: 'UseCaseLinksItem[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { UseCaseLinks },
  setup() {
    return { args }
  },
  template: '<UseCaseLinks v-bind="args" />'
})

const DEFAULT_MARKUP = `<UseCaseLinks
  eyebrow="Use Cases"
  title="What teams use Application Accelerator for"
  description="Cache what standard CDN caching cannot, with the methods, query strings and cookies you choose."
  :items="[
    {
      icon: 'pi pi-code',
      title: 'Accelerate REST and GraphQL APIs',
      description: 'Cache API responses with query string and cookie-based segmentation for faster client applications.',
      href: 'https://www.azion.com/en/solutions/api-gateway/'
    },
    {
      icon: 'pi pi-shopping-cart',
      title: 'Optimize product catalogs',
      description: 'Segment listings by category, region, and user preferences with cache key rules.',
      href: 'https://www.azion.com/en/solutions/application-acceleration/'
    },
    {
      icon: 'ai ai-layers',
      title: 'Personalize multi-tenant apps',
      description: 'Serve tenant-specific content with cookie-based cache variation rules.',
      href: 'https://www.azion.com/en/documentation/'
    },
    {
      icon: 'ai ai-live-ingest',
      title: 'Stream content faster',
      description: 'Cache playlists and user preferences while serving browsing content efficiently.',
      href: 'https://www.azion.com/en/documentation/'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Reduce API latency',
      description: 'Short TTLs for rapidly changing data endpoints and real-time applications.',
      href: 'https://www.azion.com/en/documentation/products/build/applications/application-accelerator/'
    },
    {
      icon: 'pi pi-user',
      title: 'Deliver personalized experiences',
      description: 'Cache user-specific content with session-based cookie variation for tailored delivery.',
      href: 'https://www.azion.com/en/documentation/'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof UseCaseLinks>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the Application Accelerator page places it: the overline, the left-aligned headline and its supporting sentence, then six icon-led use cases in a three-column divider grid, each linking out to the page that explains it. Edit the props in the Controls panel — a band with no items renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

import ArticleIndexBlog from '@aziontech/webkit/sections/article-index-blog'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/article-index-blog'

const IMPORT = "import ArticleIndexBlog from '@aziontech/webkit/sections/article-index-blog'"

const text = (summary) => ({
  category: 'props',
  type: { summary },
  defaultValue: { summary: "''" }
})

/** @type {import('@storybook/vue3').Meta<typeof ArticleIndexBlog>} */
const meta = {
  title: 'Components/Sections/ArticleIndexBlog',
  component: ArticleIndexBlog,
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
          "Every article of the blog as one ruled list, with a category picker and a search field on one row. Each article is a row — its cover, overline, headline, two-line deck and byline — that is one link named by its headline, with a read cue that rises in on hover or focus from `lg` up. The category and the search combine; a load-more button closes the list. It is a page section — the site places it from a `{ _id: 'article-index-blog', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `segmented-button`, `input-text`, `avatar` and `button`."
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
    items: {
      control: 'object',
      description:
        'The articles, newest first; each is `{ key, href, image, meta, title, description, authors?, byline?, categories? }`.',
      table: {
        category: 'props',
        type: { summary: 'ArticleIndexBlogItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    categories: {
      control: 'object',
      description:
        'Segments of the category picker after the show-all segment; the picker is omitted when empty.',
      table: { category: 'props', type: { summary: 'string[]' }, defaultValue: { summary: '[]' } }
    },
    allLabel: {
      control: 'text',
      description: 'Label of the first segment, which shows every category.',
      table: text('string')
    },
    categoryLabel: {
      control: 'text',
      description: 'Accessible name of the category picker.',
      table: text('string')
    },
    search: {
      control: 'object',
      description:
        "The search field's `placeholder` and accessible `label`; the field is omitted when absent.",
      table: {
        category: 'props',
        type: { summary: 'ArticleIndexBlogSearch' },
        defaultValue: { summary: 'undefined' }
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
      description: 'Accessible name of the list of articles.',
      table: text('string')
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ArticleIndexBlog },
  setup() {
    return { args }
  },
  template: '<ArticleIndexBlog v-bind="args" />'
})

const DEFAULT_MARKUP = `<ArticleIndexBlog
  anchor="posts"
  all-label="All articles"
  category-label="Category"
  row-label="Read article"
  more-label="Load more"
  aria-label="Articles"
  :categories="['Developers', 'Security', 'Company news', 'Serverless']"
  :search="{ placeholder: 'Search articles', label: 'Search articles' }"
  :items="[
    {
      key: 'ship-portfolio-two-commands-azion-cli',
      href: '/blog/ship-portfolio-two-commands-azion-cli',
      image: '/media/blog/ship-portfolio-two-commands.png',
      meta: 'Developers • SEP 25, 2026',
      title: 'How I Shipped My Portfolio in Just Two Commands',
      description: 'See how a portfolio site went from template to live URL with just azion init and azion deploy.',
      authors: [{ name: 'Patrick Menoti' }],
      byline: 'Patrick Menoti · 9 min read',
      categories: ['Developers']
    },
    {
      key: 'how-to-reduce-ai-agent-latency',
      href: '/blog/how-to-reduce-ai-agent-latency',
      image: '/media/blog/reduce-ai-agent-latency.png',
      meta: 'Serverless • SEP 23, 2026',
      title: 'How Do You Reduce AI Agent Latency?',
      description: 'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
      authors: [{ name: 'Marilia Bafutto Costa' }],
      byline: 'Marilia Bafutto Costa · 8 min read',
      categories: ['Serverless']
    },
    {
      key: 'cloudflare-alternatives-and-competitors',
      href: '/blog/cloudflare-alternatives-and-competitors',
      image: '/media/blog/best-cloudflare-alternatives.png',
      meta: 'Security • SEP 22, 2026',
      title: 'Best Cloudflare Alternatives and Competitors',
      description: 'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
      authors: [{ name: 'Vitor Eltz' }],
      byline: 'Vitor Eltz · 13 min read',
      categories: ['Security']
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ArticleIndexBlog>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Blog list at rest. Pick a category or type in the search field to narrow it; when nothing matches, the list and its button are left out.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

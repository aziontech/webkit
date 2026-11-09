import ArticleHighlight from '@aziontech/webkit/sections/article-highlight'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/article-highlight'

const IMPORT = "import ArticleHighlight from '@aziontech/webkit/sections/article-highlight'"

/** @type {import('@storybook/vue3').Meta<typeof ArticleHighlight>} */
const meta = {
  title: 'Components/Sections/ArticleHighlight',
  component: ArticleHighlight,
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
          "The band that opens a blog under its hero. One article is shown large — its cover beside its overline, headline, deck, read time and a button into it — over a wall of the highlight articles that acts as its selector. The wall is a tablist and the large article its panel; every article is drawn invisibly under the panel so the band never jumps. It is a page section — the site places it from a `{ _id: 'article-highlight', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `card-grid` and `button`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: {
      control: 'text',
      description: 'In-page id set on the band so a `#hash` link can scroll to it.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    items: {
      control: 'object',
      description:
        'The highlight articles in wall order, the first selected on load; each is `{ key, href, image, highlightImage?, meta, title, description, readTime }`.',
      table: {
        category: 'props',
        type: { summary: 'ArticleHighlightItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    actionLabel: {
      control: 'text',
      description:
        'Label of the button into the selected article; the button is omitted when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the wall of titles.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ArticleHighlight },
  setup() {
    return { args }
  },
  template: '<ArticleHighlight v-bind="args" />'
})

const DEFAULT_MARKUP = `<ArticleHighlight
  anchor="articles"
  action-label="Read article"
  aria-label="Highlight articles"
  :items="[
    {
      key: 'ship-portfolio-two-commands-azion-cli',
      href: '/blog/ship-portfolio-two-commands-azion-cli',
      image: '/media/blog/ship-portfolio-two-commands.png',
      highlightImage: '/media/blog/ship-portfolio-two-commands-highlight.png',
      meta: 'Developers • SEP 25, 2026',
      title: 'How I Shipped My Portfolio in Just Two Commands',
      description: 'See how a portfolio site went from template to live URL with just azion init and azion deploy.',
      readTime: '9 min read'
    },
    {
      key: 'how-to-reduce-ai-agent-latency',
      href: '/blog/how-to-reduce-ai-agent-latency',
      image: '/media/blog/reduce-ai-agent-latency.png',
      highlightImage: '/media/blog/reduce-ai-agent-latency-highlight.png',
      meta: 'Serverless • SEP 23, 2026',
      title: 'How Do You Reduce AI Agent Latency?',
      description: 'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
      readTime: '8 min read'
    },
    {
      key: 'cloudflare-alternatives-and-competitors',
      href: '/blog/cloudflare-alternatives-and-competitors',
      image: '/media/blog/best-cloudflare-alternatives.png',
      highlightImage: '/media/blog/best-cloudflare-alternatives-highlight.png',
      meta: 'Security • SEP 22, 2026',
      title: 'Best Cloudflare Alternatives and Competitors',
      description: 'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
      readTime: '13 min read'
    },
    {
      key: 'which-azion-plan-is-right-for-your-project',
      href: '/blog/which-azion-plan-is-right-for-your-project',
      image: '/media/blog/which-azion-plan.png',
      highlightImage: '/media/blog/which-azion-plan-highlight.png',
      meta: 'Company news • SEP 22, 2026',
      title: 'Which Azion Plan Is Right for Your Project?',
      description: 'Compare Azion’s Hobby, Pro, and Enterprise plans.',
      readTime: '7 min read'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ArticleHighlight>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Blog band with its four newest posts: the first is featured over a four-across wall of titles. Click a title, or move along the wall with the arrow, Home and End keys, to swap the featured article.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

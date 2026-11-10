import ArticleCards from '@aziontech/webkit/sections/article-cards'

import { withStoryAssets } from '../../../_shared/site-assets'
import { toSfc } from '../../../_shared/story-source'
import { ARTICLES_SECTION } from '../../../templates/marketing/_sections/article-cards'

const IMPORT = "import ArticleCards from '@aziontech/webkit/sections/article-cards'"

/** @type {import('@storybook/vue3').Meta<typeof ArticleCards>} */
const meta = {
  title: 'Components/Sections/ArticleCards',
  component: ArticleCards,
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
          "A titled row of three linked article cards on one hairline frame grid with no gutter, stacking to one column on mobile. Each card is a single link: a 16:9 media cell holding the article's cover — or, when it has none, the client's mark in one flat ink — then the headline, the deck and a `meta` overline pinned to the foot. It is a page section — the site places it from a `{ _id: 'article-cards', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box` and `card-grid`. `kind` places the heading only: `left` at the start, `centered` centred over the cards."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['left', 'centered'],
      description:
        'Placement of the heading: `left` sets it at the start, `centered` centres it over the cards.',
      table: {
        category: 'props',
        type: { summary: 'ArticleCardsKind' },
        defaultValue: { summary: "'left'" }
      }
    },
    eyebrow: {
      control: 'text',
      description: 'Overline above the heading.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    title: {
      control: 'text',
      description: 'Headline of the band; the band renders no header when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    items: {
      control: 'object',
      description:
        'The cards, in order; each is `{ key, href, title, description, meta, image?, mark? }`.',
      table: {
        category: 'props',
        type: { summary: 'ArticleCardsItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the card grid.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    }
  },
  args: withStoryAssets(ARTICLES_SECTION.props)
}

export default meta

const Template = (args) => ({
  components: { ArticleCards },
  setup() {
    return { args }
  },
  template: '<ArticleCards v-bind="args" />'
})

const DEFAULT_MARKUP = `<ArticleCards
  kind="left"
  title="Related Articles"
  aria-label="Related Articles"
  :items="[
    {
      key: 'how-to-reduce-ai-agent-latency',
      href: '/blog/how-to-reduce-ai-agent-latency',
      title: 'How Do You Reduce AI Agent Latency?',
      description: 'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
      meta: 'SEP 23, 2026 • 8 min read',
      image: '/media/blog/reduce-ai-agent-latency.png'
    },
    {
      key: 'cloudflare-alternatives-and-competitors',
      href: '/blog/cloudflare-alternatives-and-competitors',
      title: 'Best Cloudflare Alternatives and Competitors',
      description: 'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
      meta: 'SEP 22, 2026 • 13 min read',
      image: '/media/blog/best-cloudflare-alternatives.png'
    },
    {
      key: 'which-azion-plan-is-right-for-your-project',
      href: '/blog/which-azion-plan-is-right-for-your-project',
      title: 'Which Azion Plan Is Right for Your Project?',
      description: 'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
      meta: 'SEP 22, 2026 • 7 min read',
      image: '/media/blog/which-azion-plan.png'
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ArticleCards>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The blog post closing band: the `left` heading over three related posts, each with its cover. Edit the props in the Controls panel — a band with no items renders nothing, and one with no title drops its header.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <ArticleCards
    kind="left"
    title="Related Articles"
    aria-label="Related Articles"
    :items="[
      {
        key: 'how-to-reduce-ai-agent-latency',
        href: '/blog/how-to-reduce-ai-agent-latency',
        title: 'How Do You Reduce AI Agent Latency?',
        description: 'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state.',
        meta: 'SEP 23, 2026 • 8 min read',
        image: '/media/blog/reduce-ai-agent-latency.png'
      },
      {
        key: 'cloudflare-alternatives-and-competitors',
        href: '/blog/cloudflare-alternatives-and-competitors',
        title: 'Best Cloudflare Alternatives and Competitors',
        description: 'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting.',
        meta: 'SEP 22, 2026 • 13 min read',
        image: '/media/blog/best-cloudflare-alternatives.png'
      },
      {
        key: 'which-azion-plan-is-right-for-your-project',
        href: '/blog/which-azion-plan-is-right-for-your-project',
        title: 'Which Azion Plan Is Right for Your Project?',
        description: 'Compare Azion’s Hobby, Pro, and Enterprise plans.',
        meta: 'SEP 22, 2026 • 7 min read',
        image: '/media/blog/which-azion-plan.png'
      }
    ]"
  />
  <ArticleCards
    kind="centered"
    eyebrow="Success cases"
    title="When our customers succeed, we succeed"
    aria-label="When our customers succeed, we succeed"
    :items="[
      {
        key: 'netshoes',
        href: '/success-cases/netshoes',
        title: 'Netshoes Blocks 4M+ Threats in 6 Months with Azion WAF',
        description: 'Netshoes strengthened its e-commerce security and improved the shopping experience.',
        meta: 'FEB 4, 2022 • 4 min read',
        mark: { name: 'Netshoes', logo: '/marketing-components/logos/netshoes-extended-reversed.svg' }
      },
      {
        key: 'renner',
        href: '/success-cases/renner',
        title: 'Lojas Renner Optimizes Online Shopping Journey with Azion',
        description: 'Faster product pages allowed Renner to scale its e-commerce platform.',
        meta: 'AUG 10, 2021 • 4 min read',
        mark: { name: 'Renner', logo: '/marketing-components/logos/renner-extended-color.svg' }
      },
      {
        key: 'gpa',
        href: '/success-cases/gpa',
        title: 'GPA solved a cyberattack and reduced costs by 30%',
        description: 'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack and reduced costs by 30%.',
        meta: 'MAY 6, 2025 • 4 min read',
        mark: { name: 'GPA', logo: '/marketing-components/logos/gpa-extended-reversed.svg' }
      }
    ]"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ArticleCards>} */
export const Types = {
  render: () => ({ components: { ArticleCards }, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Both placements stacked: the `left` heading over three covers, then the `centered` heading under an overline over three cards that draw their client marks.'
      },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

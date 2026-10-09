import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const MARK_IMPORTS = [
  "import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'",
  "import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'",
  "import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'",
  ...IMPORTS
]

const components = {
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const setup = () => ({
  gpaExtendedReversed,
  netshoesExtendedReversed,
  rennerExtendedColor
})

const MONOCHROME = 'brightness-0 [[data-theme=dark]_&]:invert'

const POSTS = [
  {
    href: '/blog/bringing-application-security-into-the-deployment-process',
    title: 'Bringing application security into the deployment process',
    description:
      'Integrate application, API, and AI agent protection into deployment with reusable policies, security reviews, and validation in Real-Time Events.',
    meta: 'OCT 7, 2026 • 8 min read',
    image: '/media/blog/bringing-application-security-into-the-deployment-process.png'
  },
  {
    href: '/blog/coding-agent-suggests-security-policy',
    title: 'The agent that writes your code also suggests your security policy',
    description:
      'See how the open-source Azion MCP Server lets coding agents like Claude Code and Codex query Azion docs and propose security policies (WAF, Firewall, rate limiting) via Terraform, for team review before deploy.',
    meta: 'OCT 5, 2026 • 9 min read',
    image: '/media/blog/coding-agent-suggests-security-policy.png'
  },
  {
    href: '/blog/how-to-reduce-ai-agent-latency',
    title: 'How Do You Reduce AI Agent Latency?',
    description:
      'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
    meta: 'SEP 23, 2026 • 8 min read',
    image: '/media/blog/how-to-reduce-ai-agent-latency.jpg'
  }
]

const STORIES = [
  {
    href: '/success-cases/netshoes',
    title: 'Netshoes Blocks 4M+ Threats in 6 Months with Azion WAF',
    description:
      'Netshoes strengthened its e-commerce security and improved the shopping experience by blocking threats such as SQL Injection and XSS.',
    meta: 'FEB 4, 2022 • 4 min read',
    mark: { name: 'Netshoes', logo: 'netshoesExtendedReversed' }
  },
  {
    href: '/success-cases/renner',
    title: 'Lojas Renner Optimizes Online Shopping Journey with Azion',
    description:
      'Faster product pages and more resilient digital shopping experiences allowed Renner to scale its e-commerce platform using Azion’s distributed infrastructure.',
    meta: 'AUG 10, 2021 • 4 min read',
    mark: { name: 'Renner', logo: 'rennerExtendedColor' }
  },
  {
    href: '/success-cases/gpa',
    title: 'GPA solved a cyberattack and reduced costs by 30%',
    description:
      'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
    meta: 'MAY 6, 2025 • 4 min read',
    mark: { name: 'GPA', logo: 'gpaExtendedReversed' }
  }
]

const cover = (item) => `<img
  src="${item.image}"
  alt=""
  loading="lazy"
  decoding="async"
  class="size-full object-cover transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/post:scale-105 motion-reduce:transition-none"
/>`

const clientMark = (item) => `<img
  :src="${item.mark.logo}"
  alt="${item.mark.name}"
  decoding="async"
  class="h-8 w-auto max-w-40 object-contain transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/post:scale-105 motion-reduce:transition-none ${MONOCHROME}"
/>`

const card = (item) => `<CardGrid.Cell kind="canvas" :padded="false">
  <a
    href="${item.href}"
    class="group/post flex h-full flex-col transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
  >
    <span
      class="flex aspect-video items-center justify-center overflow-hidden border-b border-(--border-default) bg-(--bg-surface)"
    >
${indent(item.image ? cover(item) : clientMark(item), 3)}
    </span>
    <span class="flex flex-1 flex-col gap-(--spacing-sm) p-(--spacing-xl)">
      <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
        ${item.title}
      </h3>
      <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
        ${item.description}
      </p>
      <p class="m-0 mt-auto pt-(--spacing-sm) text-overline-sm text-(--text-muted)">
        ${item.meta}
      </p>
    </span>
  </a>
</CardGrid.Cell>`

const band = (title, items) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle kind="left" title="${title}" />
  </template>

  <FrameBox flush borders="y" marks="all">
    <CardGrid
      flush
      kind="frame"
      :columns="3"
      :mobile-columns="1"
      aria-label="${title}"
    >
${each(items, card, 3)}
    </CardGrid>
  </FrameBox>
</SectionModule>`)

const ARTICLES_TEMPLATE = band('Related Articles', POSTS)

const STORIES_TEMPLATE = band('Related Success Cases', STORIES)

const meta = {
  title: 'Templates/Marketing/Content/ArticleCards',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A titled row of three article cards on one hairline grid with no gutter, stacking to one column on mobile. Each card is a single link: a 16:9 media cell, then the headline, the deck and a `date • read time` overline pinned to the foot. The media cell holds the article’s cover, or the client’s mark drawn as one flat ink that follows the theme when the article has no cover. On hover the card lifts to the raised surface and the media scales up slightly. It closes every blog post (/blog/:slug) with its related articles and every success story (/success-cases/:slug) with its related stories. Built from `SectionModule`, `SectionTitle`, `FrameBox` and `CardGrid` (`CardGrid.Cell`).'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const RelatedArticles = {
  render: () => ({ components, template: ARTICLES_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story: 'The blog post’s closing band: three related posts, each with its cover image.'
      },
      source: { code: toSfc(IMPORTS, ARTICLES_TEMPLATE) }
    }
  }
}

export const RelatedSuccessCases = {
  render: () => ({ components, setup, template: STORIES_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Magalu story’s closing band: the next three Retail stories in the library’s order, Netshoes, Renner and GPA. A story has no cover, so each card draws its client’s mark.'
      },
      source: { code: toSfc(MARK_IMPORTS, STORIES_TEMPLATE) }
    }
  }
}

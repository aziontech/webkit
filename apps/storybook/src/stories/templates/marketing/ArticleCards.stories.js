import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
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
    href: '/blog/how-to-reduce-ai-agent-latency',
    title: 'How Do You Reduce AI Agent Latency?',
    description:
      'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
    meta: 'SEP 23, 2026 • 8 min read',
    image: '/media/blog/reduce-ai-agent-latency.png'
  },
  {
    href: '/blog/cloudflare-alternatives-and-competitors',
    title: 'Best Cloudflare Alternatives and Competitors',
    description:
      'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
    meta: 'SEP 22, 2026 • 13 min read',
    image: '/media/blog/best-cloudflare-alternatives.png'
  },
  {
    href: '/blog/which-azion-plan-is-right-for-your-project',
    title: 'Which Azion Plan Is Right for Your Project?',
    description:
      'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
    meta: 'SEP 22, 2026 • 7 min read',
    image: '/media/blog/which-azion-plan.png'
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

const band = (title, items, kind = 'left', eyebrow = '') =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle${kind === 'centered' ? '' : ' kind="left"'}${eyebrow ? ` eyebrow="${eyebrow}"` : ''} title="${title}" />
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

const CENTERED_TEMPLATE = band(
  'When our customers succeed, we succeed',
  STORIES,
  'centered',
  'Success cases'
)

const slugOf = (href) => href.split('/').filter(Boolean).pop()

const MARK_FILES = {
  gpaExtendedReversed: 'gpa-extended-reversed.svg',
  netshoesExtendedReversed: 'netshoes-extended-reversed.svg',
  rennerExtendedColor: 'renner-extended-color.svg'
}

const cardOf = (item) => ({
  key: slugOf(item.href),
  href: item.href,
  title: item.title,
  description: item.description,
  meta: item.meta,
  ...(item.image
    ? { image: item.image }
    : {
        mark: {
          name: item.mark.name,
          logo: `/marketing-components/logos/${MARK_FILES[item.mark.logo]}`
        }
      })
})

export const SITE_SECTION_ARTICLES = {
  _id: 'article-cards-articles',
  props: {
    title: 'Related Articles',
    items: POSTS.map(cardOf),
    ariaLabel: 'Related Articles'
  }
}

export const SITE_SECTION_SUCCESS_CASES = {
  _id: 'article-cards-success-cases',
  props: {
    title: 'Related Success Cases',
    items: STORIES.map(cardOf),
    ariaLabel: 'Related Success Cases'
  }
}

export const SITE_SECTION_CENTERED = {
  _id: 'article-cards-centered',
  props: {
    kind: 'centered',
    eyebrow: 'Success cases',
    title: 'When our customers succeed, we succeed',
    items: STORIES.map(cardOf),
    ariaLabel: 'When our customers succeed, we succeed'
  }
}

const meta = {
  title: 'Templates/Marketing/Articles/ArticleCards',
  excludeStories: ['SITE_SECTION_ARTICLES', 'SITE_SECTION_SUCCESS_CASES', 'SITE_SECTION_CENTERED'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const RelatedArticles = {
  ...editable(() => ({ components, template: ARTICLES_TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, ARTICLES_TEMPLATE) }
    }
  }
}

export const RelatedArticlesJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_ARTICLES)
}

export const RelatedSuccessCases = {
  ...editable(() => ({ components, setup, template: STORIES_TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(MARK_IMPORTS, STORIES_TEMPLATE) }
    }
  }
}

export const RelatedSuccessCasesJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_SUCCESS_CASES)
}

export const Centered = {
  ...editable(() => ({ components, setup, template: CENTERED_TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(MARK_IMPORTS, CENTERED_TEMPLATE) }
    }
  }
}

export const CenteredJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_CENTERED)
}

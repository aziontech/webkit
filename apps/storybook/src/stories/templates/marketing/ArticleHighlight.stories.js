import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const components = {
  Button,
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule
}

const ARTICLES = [
  {
    href: '/blog/ship-portfolio-two-commands-azion-cli',
    image: '/media/blog/ship-portfolio-two-commands.png',
    highlightImage: '/media/blog/ship-portfolio-two-commands-highlight.png',
    meta: 'Developers • SEP 25, 2026',
    title: 'How I Shipped My Portfolio in Just Two Commands',
    description:
      "See how a portfolio site went from template to live URL with just azion init and azion deploy, running free on Azion's Hobby plan.",
    readTime: '9 min read'
  },
  {
    href: '/blog/how-to-reduce-ai-agent-latency',
    image: '/media/blog/reduce-ai-agent-latency.png',
    highlightImage: '/media/blog/reduce-ai-agent-latency-highlight.png',
    meta: 'Serverless • SEP 23, 2026',
    title: 'How Do You Reduce AI Agent Latency?',
    description:
      'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
    readTime: '8 min read'
  },
  {
    href: '/blog/cloudflare-alternatives-and-competitors',
    image: '/media/blog/best-cloudflare-alternatives.png',
    highlightImage: '/media/blog/best-cloudflare-alternatives-highlight.png',
    meta: 'Security • SEP 22, 2026',
    title: 'Best Cloudflare Alternatives and Competitors',
    description:
      'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
    readTime: '13 min read'
  },
  {
    href: '/blog/which-azion-plan-is-right-for-your-project',
    image: '/media/blog/which-azion-plan.png',
    highlightImage: '/media/blog/which-azion-plan-highlight.png',
    meta: 'Company news • SEP 22, 2026',
    title: 'Which Azion Plan Is Right for Your Project?',
    description:
      'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
    readTime: '7 min read'
  }
]

const [CURRENT] = ARTICLES

const sizer = (article) => `<div class="grid lg:grid-cols-2">
  <span class="block aspect-video lg:aspect-4/3" />
  <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-xl) lg:p-(--spacing-xxl)">
    <span class="text-overline-sm">${article.meta}</span>
    <span class="text-heading-lg">${article.title}</span>
    <span class="line-clamp-3 text-body-md">${article.description}</span>
    <span class="text-body-sm">${article.readTime}</span>
    <span class="h-10" />
  </div>
</div>`

const PANEL = `<FrameBox
  id="articles-panel"
  borders="bottom"
  marks="all"
  role="tabpanel"
  aria-labelledby="articles-tab-0"
  class="group/panel relative bg-(--bg-canvas)"
>
  <div class="grid *:col-start-1 *:row-start-1">
    <div
      aria-hidden="true"
      inert
      class="pointer-events-none grid opacity-0 *:col-start-1 *:row-start-1"
    >
${each(ARTICLES, sizer, 3)}
    </div>

    <article class="group/article relative grid min-w-0 lg:grid-cols-2">
      <div
        class="relative block aspect-video overflow-hidden border-b border-(--border-default) bg-(--bg-canvas) lg:aspect-4/3 lg:border-r lg:border-b-0"
      >
        <img
          src="${CURRENT.highlightImage || CURRENT.image}"
          alt=""
          decoding="async"
          class="absolute inset-0 size-full object-cover transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/article:scale-105 motion-reduce:transition-none"
        />
      </div>
      <div
        class="flex min-w-0 flex-col justify-center gap-(--spacing-sm) p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance group-hover/article:bg-(--bg-surface-raised) motion-reduce:transition-none lg:p-(--spacing-xxl)"
      >
        <span class="text-overline-sm text-(--text-muted)">${CURRENT.meta}</span>
        <h2 class="m-0 text-balance text-heading-lg text-(--text-default)">
          <a
            href="${CURRENT.href}"
            class="text-inherit no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
          >
            ${CURRENT.title}
          </a>
        </h2>
        <p class="m-0 line-clamp-3 text-pretty text-body-md text-(--text-muted)">
          ${CURRENT.description}
        </p>
        <span class="text-body-sm text-(--text-muted)">${CURRENT.readTime}</span>
        <Button
          label="Read article"
          kind="secondary"
          size="large"
          href="${CURRENT.href}"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
          class="relative mt-(--spacing-sm) self-start"
        />
      </div>
    </article>
  </div>
</FrameBox>`

const tab = (article, index) => `<CardGrid.Cell kind="canvas" :padded="false" role="presentation">
  <button
    id="articles-tab-${index}"
    type="button"
    role="tab"
    aria-selected="${index === 0 ? 'true' : 'false'}"
    aria-controls="articles-panel"
    tabindex="${index === 0 ? 0 : -1}"
    ${index === 0 ? 'data-active\n    ' : ''}class="relative isolate flex h-full w-full cursor-pointer flex-col items-start gap-(--spacing-xs) p-(--spacing-lg) text-left transition-colors duration-moderate-01 ease-out before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-fast-02 before:ease-productive-entrance before:content-[''] hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) data-[active]:bg-(--bg-selected) data-[active]:before:hidden motion-reduce:transition-none motion-reduce:before:transition-none"
  >
    <span class="text-overline-sm text-(--text-muted)">${article.meta}</span>
    <span class="line-clamp-3 text-balance text-heading-xxs text-(--text-default)">
      ${article.title}
    </span>
  </button>
</CardGrid.Cell>`

const WALL = `<CardGrid
  kind="frame"
  flush
  :columns="${ARTICLES.length >= 4 ? 4 : 3}"
  :mobile-columns="1"
  role="tablist"
  aria-label="Highlight articles"
>
${each(ARTICLES, tab, 1)}
</CardGrid>`

const TEMPLATE = inColumn(`<SectionModule
  id="articles"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
  <FrameBox flush borders="y" marks="all">
    <div class="flex flex-col">
${indent(PANEL, 3)}

${indent(WALL, 3)}
    </div>
  </FrameBox>
</SectionModule>`)

const slugOf = (href) => href.split('/').filter(Boolean).pop()

export const SITE_SECTION = {
  _id: 'article-highlight',
  props: {
    items: ARTICLES.map((article) => ({ key: slugOf(article.href), ...article })),
    actionLabel: 'Read article',
    ariaLabel: 'Highlight articles'
  }
}

const meta = {
  title: 'Templates/Marketing/Articles/ArticleHighlight',
  excludeStories: ['SITE_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Featured = {
  ...editable(() => ({ components, template: TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

export const FeaturedJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

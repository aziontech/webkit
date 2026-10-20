import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
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
    href: '/blog/azion-leader-g2-fall-reports-2026',
    image: '/media/blog/azion-leader-g2-fall-reports-2026.png',
    meta: 'AUG 28, 2026',
    title: 'Azion Named Leader in Four Categories — G2 Fall 2026 Reports',
    description:
      'Azion earned Leader status in CDN, Web Security, DDoS Protection, and Bot Detection and Mitigation (Enterprise) in the G2 Fall 2026 Reports, plus High Performer recognition in five more categories.',
    readTime: '5 min read'
  },
  {
    href: '/blog/bringing-application-security-into-the-deployment-process',
    image: '/media/blog/bringing-application-security-into-the-deployment-process.png',
    meta: 'Security • OCT 7, 2026',
    title: 'Bringing application security into the deployment process',
    description:
      'Integrate application, API, and AI agent protection into deployment with reusable policies, security reviews, and validation in Real-Time Events.',
    readTime: '8 min read'
  },
  {
    href: '/blog/coding-agent-suggests-security-policy',
    image: '/media/blog/coding-agent-suggests-security-policy.png',
    meta: 'Developers • OCT 5, 2026',
    title: 'The agent that writes your code also suggests your security policy',
    description:
      'See how the open-source Azion MCP Server lets coding agents like Claude Code and Codex query Azion docs and propose security policies (WAF, Firewall, rate limiting) via Terraform, for team review before deploy.',
    readTime: '9 min read'
  },
  {
    href: '/blog/ship-portfolio-two-commands-azion-cli',
    image: '/media/blog/ship-portfolio-two-commands-azion-cli.png',
    meta: 'Developers • SEP 25, 2026',
    title: 'How I Shipped My Portfolio in Just Two Commands',
    description:
      "See how a portfolio site went from template to live URL with just azion init and azion deploy, running free on Azion's Hobby plan.",
    readTime: '9 min read'
  },
  {
    href: '/blog/how-to-reduce-ai-agent-latency',
    image: '/media/blog/how-to-reduce-ai-agent-latency.jpg',
    meta: 'Serverless • SEP 23, 2026',
    title: 'How Do You Reduce AI Agent Latency?',
    description:
      'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
    readTime: '8 min read'
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
        class="block aspect-video overflow-hidden border-b border-(--border-default) bg-(--bg-surface) lg:aspect-4/3 lg:border-r lg:border-b-0"
      >
        <img
          src="${CURRENT.image}"
          alt=""
          decoding="async"
          class="size-full object-cover transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/article:scale-105 motion-reduce:transition-none"
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
  :columns="3"
  :mobile-columns="1"
  role="tablist"
  aria-label="Highlight articles"
  class="sm:grid-cols-2! lg:grid-cols-5!"
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

const meta = {
  title: 'Templates/Marketing/Content/ArticleHighlight',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The band that opens a blog under its hero: one article large, its cover beside its category and date, headline, deck, read time and a button into it, over a wall of the highlight articles that is the selector itself. The wall is a tablist and the large article its panel; on the page the band advances on its own, pausing under the pointer or keyboard focus, and the arrow, Home and End keys move along the wall. Every article is drawn once, invisibly, under the panel, so the band keeps the height of its tallest article and never jumps when the selection changes. The Blog page (/blog) uses it for its featured post and the four newest. Built from `SectionModule`, `FrameBox`, `CardGrid` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Featured = {
  render: () => ({ components, template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Blog page’s highlight at rest: the G2 Fall 2026 Reports post selected, then the four newest posts on the wall, five across from `lg`.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

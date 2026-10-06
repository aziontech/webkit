import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import MediaSplit from '@aziontech/webkit/media-split'
import ScrollArea from '@aziontech/webkit/scroll-area'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import Ticker from '@aziontech/webkit/ticker'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import MediaSplit from '@aziontech/webkit/media-split'",
  "import ScrollArea from '@aziontech/webkit/scroll-area'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import Ticker from '@aziontech/webkit/ticker'"
]

const components = {
  Button,
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  FrameBox,
  MediaSplit,
  ScrollArea,
  SectionContainer,
  SectionGap,
  SectionModule,
  Ticker
}

const DARK_INK = '[[data-theme=dark]_&]:invert'

const TEMPLATES = [
  {
    title: 'AI Inference Starter Kit',
    description: 'Create an application running AI models at the edge.',
    icon: 'ai ai-edge-functions',
    markClass: ''
  },
  {
    title: 'Next.js Commerce',
    description: 'Ecommerce template built with Next.js and Shopify.',
    icon: 'ai-cor ai-next',
    markClass: DARK_INK
  },
  {
    title: 'Astro Odyssey',
    description: 'A modern business marketing website theme/starter built with Astro.',
    icon: 'ai-cor ai-astro',
    markClass: ''
  },
  {
    title: 'Next.js AI Chatbot',
    description: 'A high-performance, server-rendered Next.js App Router AI Chatbot.',
    icon: 'ai-cor ai-next',
    markClass: DARK_INK
  },
  {
    title: 'SvelteKit Commerce',
    description: 'Ecommerce template built with SvelteKit and Shopify.',
    icon: 'ai-cor ai-svelte',
    markClass: ''
  },
  {
    title: 'Next.js Multi-tenant Starter',
    description: 'A minimalistic multi-tenant Next.js starter template.',
    icon: 'ai-cor ai-next',
    markClass: DARK_INK
  },
  {
    title: 'Functions Starter Kit',
    description: 'Launch a “Hello World” originless application powered by functions.',
    icon: 'ai ai-edge-functions',
    markClass: ''
  },
  {
    title: 'Cosmic Agency Website',
    description: "A custom template built using Cosmic's React components, Blocks.",
    icon: 'ai-cor ai-react',
    markClass: ''
  }
]

const RETAIL_DESCRIPTION =
  'Launch storefronts faster with pre-built templates and starter kits for headless commerce, marketing pages, and product catalogs. Deploy complete projects in seconds with popular frameworks.'

const STACK_LABEL = 'Compatible with Your Stack'

const PRODUCT_STACK = [
  'nextjs',
  'astro',
  'react',
  'vue',
  'angular',
  'nuxt',
  'gatsby',
  'hugo',
  'preact',
  'remix',
  'qwik',
  'vite',
  'vitepress',
  'docusaurus',
  'eleventy',
  'hexo',
  'jekyll',
  'hono',
  'nodejs',
  'aws',
  'gcp',
  'azure',
  'workers-cloudflare',
  'terraform',
  'github',
  'openai',
  'anthropic',
  'groq',
  'sqlite',
  'drizzle'
]

const markClasses = (template) => [template.icon, template.markClass].filter(Boolean).join(' ')

const templateCard = (template) => `<CardGrid.Cell
  kind="none"
  :padded="false"
>
  <div
    class="group/template flex h-full min-w-0 cursor-pointer flex-col gap-(--spacing-md) bg-(--bg-surface) p-(--spacing-xl)"
  >
    <span
      class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
    >
      <i
        aria-hidden="true"
        class="${markClasses(template)} text-[1.25rem] leading-none text-(--text-default)"
      />
    </span>
    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
      <span class="text-body-md text-(--text-default)">${template.title}</span>
      <span class="text-pretty text-body-sm text-(--text-muted)">
        ${template.description}
      </span>
    </div>
    <Button
      label="Deploy now"
      kind="outlined"
      size="medium"
      icon="pi pi-chevron-right"
      icon-position="trailing"
      animated
      href="#"
      class="mt-auto self-start group-hover/template:before:opacity-100 group-active/template:after:opacity-100 group-hover/template:[&_[data-animated]]:translate-x-0.5"
    >
      <template #prefix>
        <i
          class="ai ai-azion text-(--primary)"
          aria-hidden="true"
        />
      </template>
    </Button>
  </div>
</CardGrid.Cell>`

const templateGallery = ({ description, templates, label, marks }) =>
  inColumn(`<SectionModule
  :divided="false"
  :padded="false"
>
  <MediaSplit
    framed
    :heading-level="2"
    align="center"
    eyebrow="Your Stack, Your Way"
    size="large"
    texture="none"
    title="Quick Start with Templates"
    description="${description}"
  >
    <template #media>
      <div class="relative min-h-[36rem] w-full self-stretch lg:min-h-[44rem]">
        <ScrollArea
          aria-label="Templates you can deploy"
          class="absolute inset-0 mask-t-from-[calc(100%_-_2rem)] mask-b-from-[calc(100%_-_6rem)]"
        >
          <CardGrid
            flush
            kind="frame"
            :columns="2"
          >
${each(templates, templateCard, 6)}
          </CardGrid>
          <div
            aria-hidden="true"
            class="h-16"
          />
        </ScrollArea>
      </div>
    </template>
    <template #actions>
      <Button
        label="Deploy now"
        kind="secondary"
        size="large"
        href="https://www.azion.com/en/documentation/products/guides/#azion-templates"
        target="_blank"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
  </MediaSplit>

  <FrameBox
    flush
    borders="y"
    marks="all"
  >
    <SectionModule :divided="false">
      <Ticker
        size="small"
        label="${label}"
        :marks="[
${each(marks, (mark, index) => `'${mark}'${index < marks.length - 1 ? ',' : ''}`, 5)}
        ]"
      />
    </SectionModule>
  </FrameBox>
</SectionModule>`)

const RETAIL_TEMPLATE = templateGallery({
  description: RETAIL_DESCRIPTION,
  templates: TEMPLATES,
  label: STACK_LABEL,
  marks: PRODUCT_STACK
})

const meta = {
  title: 'Templates/Marketing/Media/TemplateGallery',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The templates band of a solution page: a framed split whose copy invites the reader to start from a template, beside a scrolling two-column wall of deployable templates that fades out at its top and bottom edges, closed by a ticker of the frameworks and clouds a workload is already built with. Each template card is a mark, a title, one line and a `Deploy now` action. Retail, Web Apps, AI Workloads, Security, Performance and Streaming render it. Built from `SectionModule`, `MediaSplit`, `ScrollArea`, `CardGrid`, `Button`, `FrameBox` and `Ticker`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, template: RETAIL_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Retail page’s band, with its storefront-specific description and the first eight of the published deploy templates; the other pages keep the default description. The marks that ship in dark ink carry an invert under the dark theme. The ticker runs the thirty-name product stack azion.com shows under every product page.'
      },
      source: { code: toSfc(IMPORTS, RETAIL_TEMPLATE) }
    }
  }
}

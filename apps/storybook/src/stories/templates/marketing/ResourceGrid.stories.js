import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import MediaSplit from '@aziontech/webkit/media-split'
import ScrollArea from '@aziontech/webkit/scroll-area'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import Topic from '@aziontech/webkit/topic'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import MediaSplit from '@aziontech/webkit/media-split'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import Topic from '@aziontech/webkit/topic'"
]

const VISIBLE_ITEMS = 4

const SCROLLING_IMPORTS = [...IMPORTS, "import ScrollArea from '@aziontech/webkit/scroll-area'"]

const components = {
  Button,
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  MediaSplit,
  ScrollArea,
  SectionContainer,
  SectionGap,
  SectionModule,
  Topic
}

const FINANCIAL = {
  eyebrow: 'Go Deeper',
  title: 'Guides and Resources',
  description:
    'Documentation, articles, and customer stories on building secure, compliant financial applications on a distributed architecture.',
  items: [
    {
      title: 'New to Azion? Start here',
      description: 'A guide to your first steps with Azion.',
      href: '/docs'
    },
    {
      title: 'Learning Center',
      description: 'Practical knowledge to speed up, secure, and scale applications.',
      href: '/learning'
    },
    {
      title: 'How Technology Can Help You Comply with Regulations for Fintech',
      description:
        'Distributed infrastructure brings security, compliance, and monitoring together for reliable, scalable operations.',
      href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
    },
    {
      title: 'How Justa is evolving its technology to meet modern digital demands',
      description:
        'See how Justa uses the Azion Web Platform to improve security and performance in PIX and QR Code transactions.',
      href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
    }
  ]
}

const TECHNOLOGY = {
  eyebrow: 'Go Deeper',
  title: 'Guides and Resources',
  description:
    'Documentation and articles on building, securing, and scaling modern applications on a distributed architecture.',
  items: [
    ...FINANCIAL.items.slice(0, 2),
    {
      title: 'Build modern applications with Functions',
      description: 'Create serverless functions that run close to users.',
      href: 'https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/'
    },
    {
      title: 'SQL Database for modern applications',
      description:
        'Build data-driven applications with SQL Database on a distributed architecture.',
      href: 'https://www.azion.com/en/documentation/products/store/edge-sql/'
    },
    ...FINANCIAL.items.slice(2)
  ]
}

const isExternal = (href) => /^https?:/.test(href)

const resourceCard = (card) =>
  [
    '<CardGrid.Cell kind="surface">',
    '  <Topic',
    '    :heading-level="3"',
    `    title="${card.title}"`,
    `    description="${card.description}"`,
    `    href="${card.href}"`,
    ...(isExternal(card.href) ? ['    target="_blank"', '    rel="noopener noreferrer"'] : []),
    '  />',
    '</CardGrid.Cell>'
  ].join('\n')

const cardGrid = (resources, classes) => `<CardGrid
  flush
  kind="frame"
  :columns="2"${classes ? `\n  class="${classes}"` : ''}
>
${each(resources.items, resourceCard, 1)}
</CardGrid>`

const resourceMedia = (resources) =>
  resources.items.length > VISIBLE_ITEMS
    ? `<div class="relative -mb-px flex w-full flex-col self-stretch">
  <div class="flex min-h-0 flex-1 flex-col lg:absolute lg:inset-0">
    <ScrollArea
      aria-label="${resources.title}"
      fade
    >
      <div class="pb-px">
${indent(cardGrid(resources), 4)}
      </div>
    </ScrollArea>
  </div>
</div>`
    : cardGrid(resources, 'w-full self-stretch sm:auto-rows-fr')

const resourceGrid = (resources) =>
  inColumn(`<SectionModule
  :divided="false"
  :padded="false"
>
  <MediaSplit
    framed
    :heading-level="2"
    align="center"
    size="large"
    texture="none"
    eyebrow="${resources.eyebrow}"
    title="${resources.title}"
    description="${resources.description}"
  >
    <template #media>
${indent(resourceMedia(resources), 3)}
    </template>
    <template #actions>
      <Button
        label="See all guides"
        kind="secondary"
        size="large"
        href="https://www.azion.com/en/documentation/products/guides/"
        target="_blank"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
  </MediaSplit>
</SectionModule>`)

const FINANCIAL_TEMPLATE = resourceGrid(FINANCIAL)
const SCROLLING_TEMPLATE = resourceGrid(TECHNOLOGY)

const meta = {
  title: 'Templates/Marketing/Content/ResourceGrid',
  excludeStories: ['SITE_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, template: FINANCIAL_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, FINANCIAL_TEMPLATE) }
    }
  }
}

export const Scrollable = {
  render: () => ({ components, template: SCROLLING_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(SCROLLING_IMPORTS, SCROLLING_TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'resource-grid',
  props: {
    title: 'Guides and Resources',
    items: [
      {
        title: 'New to Azion? Start here',
        description: 'A guide to your first steps with Azion.',
        href: 'https://www.azion.com/en/documentation/products/azion-platform-overview/'
      },
      {
        title: 'How Technology Can Help You Comply with Regulations for Fintech',
        description:
          'Distributed infrastructure brings security, compliance, and monitoring together for reliable, scalable operations.',
        href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
      },
      {
        title: 'How Justa is evolving its technology to meet modern digital demands',
        description:
          'See how Justa uses the Azion Web Platform to improve security and performance in PIX and QR Code transactions.',
        href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
      }
    ]
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

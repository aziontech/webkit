import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import MediaSplit from '@aziontech/webkit/media-split'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import Topic from '@aziontech/webkit/topic'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
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

const components = {
  Button,
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  MediaSplit,
  SectionContainer,
  SectionGap,
  SectionModule,
  Topic
}

const FINANCIAL = {
  eyebrow: 'Go Deeper',
  title: 'Guides and Resources',
  description:
    'Documentation, articles, and customer stories on building secure, compliant financial applications on distributed infrastructure.',
  items: [
    {
      title: 'New at Azion? Start your Azion journey seamlessly',
      description: 'This documentation will guide you through your first steps with Azion.',
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
        'Distributed infrastructure provides robust security, regulatory compliance, and intelligent monitoring for reliable, scalable operations.',
      href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
    },
    {
      title: 'How Justa is evolving its technology to meet modern digital demands',
      description:
        'Discover how Justa uses the Azion Web Platform to optimize security and performance in PIX and QR Code transactions.',
      href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
    }
  ]
}

const isExternal = (href) => /^https?:/.test(href)

const resourceCard = (card) =>
  [
    '<CardGrid.Cell',
    '  kind="surface"',
    '  :padded="false"',
    '>',
    '  <Topic',
    '    :heading-level="3"',
    `    title="${card.title}"`,
    `    description="${card.description}"`,
    `    href="${card.href}"`,
    ...(isExternal(card.href) ? ['    target="_blank"', '    rel="noopener noreferrer"'] : []),
    '    class="h-full p-(--spacing-xl)"',
    '  />',
    '</CardGrid.Cell>'
  ].join('\n')

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
      <CardGrid
        flush
        kind="frame"
        :columns="2"
        class="w-full self-stretch"
      >
${each(resources.items, resourceCard, 4)}
      </CardGrid>
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

export const SITE_SECTION = {
  _id: 'resource-grid',
  props: {
    title: 'Guides and Resources',
    items: [
      {
        title: 'New at Azion? Start your Azion journey seamlessly',
        description: 'This documentation will guide you through your first steps with Azion.',
        href: 'https://www.azion.com/en/documentation/products/azion-platform-overview/'
      },
      {
        title: 'How Technology Can Help You Comply with Regulations for Fintech',
        description:
          'Distributed infrastructure provides robust security, regulatory compliance, and intelligent monitoring for reliable, scalable operations.',
        href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
      },
      {
        title: 'How Justa is evolving its technology to meet modern digital demands',
        description:
          'Discover how Justa uses the Azion Web Platform to optimize security and performance in PIX and QR Code transactions.',
        href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
      }
    ]
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

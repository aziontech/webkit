import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import Overline from '@aziontech/webkit/overline'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import Topic from '@aziontech/webkit/topic'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const components = {
  Button,
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  Overline,
  Topic
}

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import Overline from '@aziontech/webkit/overline'",
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import Topic from '@aziontech/webkit/topic'"
]

const SQL_DATABASE = {
  tag: 'SQL Database',
  title: 'What teams use SQL Database for',
  lead: 'Teams use it to:',
  href: '/site/docs',
  cases: [
    {
      icon: 'pi pi-comments',
      title: 'RAG Applications',
      description: 'Build topic-specific chatbots with the topic data stored in SQL Database.'
    },
    {
      icon: 'pi pi-search',
      title: 'Search Applications',
      description: 'Power search with vector similarity queries on stored embeddings.'
    },
    {
      icon: 'pi pi-sync',
      title: 'AI Context Injection',
      description: 'Give AI applications relevant context from vector embeddings.'
    },
    {
      icon: 'pi pi-globe',
      title: 'AI Workflows',
      description: 'Pair stored embeddings with AI Inference to run RAG applications on Azion.'
    }
  ]
}

const useCases = ({ tag, title, lead, href, cases }) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <CardGrid flush kind="frame" :columns="3">
      <CardGrid.Cell kind="canvas" class="lg:row-span-2">
        <div class="flex h-full flex-col items-start gap-(--spacing-md)">
          <Overline prefix="//" show-cursor>${tag}</Overline>
          <h2 class="m-0 text-balance text-heading-lg text-(--text-default)">${title}</h2>
          <p class="m-0 mb-(--spacing-xl) text-body-md text-(--text-muted)">${lead}</p>
          <Button
            label="Docs"
            kind="secondary"
            size="large"
            href="${href}"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
            class="mt-auto"
          />
        </div>
      </CardGrid.Cell>
${each(
  cases,
  (item) => `<CardGrid.Cell kind="canvas">
  <Topic
    :heading-level="3"
    icon="${item.icon}"
    title="${item.title}"
    description="${item.description}"
  />
</CardGrid.Cell>`,
  3
)}
    </CardGrid>
  </FrameBox>
</SectionModule>`)

const SQL_DATABASE_TEMPLATE = useCases(SQL_DATABASE)

const meta = {
  title: 'Templates/Marketing/Use Cases/UseCases',
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

export const Default = {
  ...editable(() => ({ components, template: SQL_DATABASE_TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, SQL_DATABASE_TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'use-cases',
  props: {
    eyebrow: SQL_DATABASE.tag,
    title: SQL_DATABASE.title,
    description: SQL_DATABASE.lead,
    action: { label: 'Docs', href: SQL_DATABASE.href, trailing: true },
    items: SQL_DATABASE.cases
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

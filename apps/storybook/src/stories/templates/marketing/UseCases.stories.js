import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import Overline from '@aziontech/webkit/overline'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import Topic from '@aziontech/webkit/topic'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
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

const VECTORIZE = {
  tag: 'Vectorize',
  title: 'Perfect for AI Applications',
  lead: 'You can use Vectorize to:',
  href: '/docs/vectorize',
  cases: [
    {
      icon: 'pi pi-comments',
      title: 'RAG Applications',
      description: 'Build topic-specific chatbots where the topical data lives in Vectorize.'
    },
    {
      icon: 'pi pi-search',
      title: 'Search Applications',
      description: 'Power search apps with vector similarity search capabilities.'
    },
    {
      icon: 'pi pi-sync',
      title: 'AI Context Injection',
      description: 'Enhance AI applications by injecting relevant context from vector embeddings.'
    },
    {
      icon: 'pi pi-globe',
      title: 'Edge AI Workflows',
      description: 'Combine vector storage with Workers AI for complete edge-based AI solutions.'
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
            label="View docs"
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

const VECTORIZE_TEMPLATE = useCases(VECTORIZE)

const meta = {
  title: 'Templates/Marketing/Content/UseCases',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The band a product page closes its argument with: one framed cell that names the product and links to its docs, beside the handful of things you would use it for. The title cell is the simplest variant of the media-and-title split, an overline, a headline, a one-line lead and a single "View docs" button pinned to the foot of the cell, and the use cases sit in `CardGrid` frame cells that draw their own rules and corner marks, each a short title over one sentence. Built from `SectionModule`, `FrameBox`, `CardGrid`, `Topic`, `Overline` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, template: VECTORIZE_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Four use cases of equal weight in a two-by-two set, each a short title over one sentence.'
      },
      source: { code: toSfc(IMPORTS, VECTORIZE_TEMPLATE) }
    }
  }
}

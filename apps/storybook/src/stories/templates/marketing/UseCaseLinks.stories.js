import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import Topic from '@aziontech/webkit/topic'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const TOPICS_IMPORTS = [
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import Topic from '@aziontech/webkit/topic'"
]

const components = {
  CardGrid,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  Topic
}

const USE_CASES = [
  {
    icon: 'ai ai-azion-api',
    title: 'Accelerate REST and GraphQL APIs',
    description:
      'Cache API responses with query string and cookie-based segmentation for faster client applications.',
    href: '/'
  },
  {
    icon: 'pi pi-shopping-cart',
    title: 'Optimize product catalogs',
    description: 'Segment listings by category, region, and user preferences with cache key rules.',
    href: '/'
  },
  {
    icon: 'ai ai-layers',
    title: 'Personalize multi-tenant apps',
    description: 'Serve tenant-specific content with cookie-based cache variation rules.',
    href: '/docs'
  },
  {
    icon: 'ai ai-live-ingest',
    title: 'Stream content faster',
    description: 'Cache playlists and user preferences while serving browsing content efficiently.',
    href: '/docs'
  },
  {
    icon: 'pi pi-bolt',
    title: 'Reduce API latency',
    description: 'Short TTLs for rapidly changing data endpoints and real-time applications.',
    href: '/docs'
  },
  {
    icon: 'pi pi-user',
    title: 'Deliver personalized experiences',
    description:
      'Cache user-specific content with session-based cookie variation for tailored delivery.',
    href: '/docs'
  }
]

const TOPICS_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      kind="left"
      title="See how to use"
    />
  </template>

  <FrameBox flush borders="y" marks="bottom">
    <CardGrid kind="divider" :columns="3">
${each(
  USE_CASES,
  (useCase) => `<div class="flex bg-(--bg-canvas)">
  <Topic
    icon="${useCase.icon}"
    title="${useCase.title}"
    description="${useCase.description}"
    href="${useCase.href}"
    :heading-level="3"
    class="w-full p-(--spacing-xl)"
  />
</div>`,
  3
)}
    </CardGrid>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Content/UseCaseLinks',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A titled grid of use cases where each cell is itself the link, so the band needs no buttons. A product page uses it to point at the ways the product is applied (Application Accelerator). Built from `SectionModule`, `SectionTitle` and `CardGrid kind="divider"`, with a `Topic` per cell.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Topics = {
  render: () => ({ components, template: TOPICS_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Six linked `Topic` cells under a start-aligned `SectionTitle`, from the Application Accelerator page. `Topic` draws the arrow on the headline because the cell has an `href`.'
      },
      source: { code: toSfc(TOPICS_IMPORTS, TOPICS_TEMPLATE) }
    }
  }
}

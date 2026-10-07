import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import Illustration from '@aziontech/webkit/illustration'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const LINKED_IMPORTS = [
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import Illustration from '@aziontech/webkit/illustration'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const GROUPED_IMPORTS = [
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import Illustration from '@aziontech/webkit/illustration'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const components = {
  CardGrid,
  FrameBox,
  Illustration,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const NEEDS = {
  anchor: 'needs',
  eyebrow: 'By need',
  title: 'What you are building',
  description: 'The argument is the workload — the same one whatever sector runs it.',
  items: [
    {
      illustration: 'modern-frontends',
      title: 'Web Apps',
      description:
        'Deploy serverless web applications, APIs and AI workloads straight from a git repository.',
      href: '/site/solutions/web-apps'
    },
    {
      illustration: 'ai-applications',
      title: 'AI',
      description: 'Run inference and agents next to the data they answer from.',
      href: '/site/solutions/ai'
    },
    {
      illustration: 'implement-api-gateway-security',
      title: 'Application Security',
      description: 'Filter, rate-limit and authenticate at the edge, before the origin sees it.',
      href: '/site/solutions/security'
    }
  ]
}

const INDUSTRIES = {
  anchor: 'industries',
  eyebrow: 'By industries',
  title: 'Where you build it',
  description: 'Same platform, stated in the terms the sector is audited on.',
  items: [
    {
      illustration: 'protect-financial-applications',
      title: 'Financial Services',
      description:
        'High availability, low latency and continuous compliance for financial applications and APIs.',
      href: '/site/solutions/financial-services'
    },
    {
      illustration: 'saas-platforms',
      title: 'Technology',
      description:
        'High-performance APIs and microservices for the team building the digital product.',
      href: '/site/solutions/technology'
    },
    {
      illustration: 'retail-application-modernization',
      title: 'Retail',
      description:
        'Storefronts that hold up through a peak event, with fraud stopped before checkout.',
      href: '/site/solutions/retail'
    }
  ]
}

const GROUPS = [
  {
    anchor: 'build',
    title: 'Build',
    description: 'Code, media, and inference running at the edge, close to whoever asks.',
    items: [
      {
        illustration: 'build-applications',
        title: 'Functions',
        description: 'Run code at the edge, with no server to maintain.'
      },
      {
        illustration: 'ai-applications',
        title: 'AI Inference',
        description: 'Inference and agents right next to your data.'
      },
      {
        illustration: 'fastest-path-to-live-website',
        title: 'Image Processor',
        description: 'One origin, every format negotiated at delivery.'
      }
    ]
  },
  {
    anchor: 'store',
    title: 'Store',
    description: 'Data persisted where the request lands, not in a distant region.',
    items: [
      {
        illustration: 'distributed-apis',
        title: 'SQL Database',
        description: 'A distributed relational database, queried at the edge.'
      },
      {
        illustration: 'saas-platforms',
        title: 'Object Storage',
        description: 'Objects served from the point closest to the user.'
      },
      {
        illustration: 'implement-api-gateway-security',
        title: 'Credentials',
        description: 'Per-environment keys, rotated with zero downtime.'
      }
    ]
  },
  {
    anchor: 'protect',
    title: 'Protect',
    description: 'Traffic inspected before it ever reaches your origin.',
    items: [
      {
        illustration: 'programmable-security',
        title: 'WAF',
        description: 'Rules applied at the edge, ahead of your backend.'
      },
      {
        illustration: 'automate-threat-mitigation',
        title: 'Bot Manager',
        description: 'Bots identified and stopped on the way in.'
      },
      {
        illustration: 'dns-protection',
        title: 'Network Shield',
        description: 'The entire network as your defense perimeter.'
      }
    ]
  },
  {
    anchor: 'observe',
    title: 'Observe',
    description: 'Every request recorded, every decision traceable.',
    items: [
      {
        illustration: 'live-debugging',
        title: 'Real-Time Metrics',
        description: 'Latency and volume in real time, with no sampling.'
      },
      {
        illustration: 'runtime',
        title: 'Edge Pulse',
        description: 'Perceived quality measured in the real browser.'
      },
      {
        illustration: 'infrastructure-as-code',
        title: 'Deploy Path',
        description: 'From branch to production, with a preview at every step.'
      }
    ]
  }
]

const cardBody = (item) => `<Illustration
  name="${item.illustration}"
  aria-label="${item.title}: ${item.description}"
/>
<div class="flex flex-col gap-(--spacing-xxs)">
  <h3 class="m-0 text-heading-xxs text-(--text-default)">${item.title}</h3>
  <p class="m-0 text-pretty text-body-sm text-(--text-muted)">${item.description}</p>
</div>`

const indentBy = (markup, spaces) =>
  markup
    .split('\n')
    .map((line) => (line ? `${' '.repeat(spaces)}${line}` : line))
    .join('\n')

const linkedCard = (item) => `<a
  href="${item.href}"
  class="group flex min-w-0 flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-lg) no-underline transition-colors duration-150 ease-out hover:bg-(--bg-surface) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
>
${indentBy(cardBody(item), 2)}
</a>`

const groupedCard = (item, index, items) => {
  const span = index === items.length - 1 && items.length % 2 === 1
  return `<FrameBox
  borders="none"
  marks="none"
  class="min-w-0 bg-(--bg-canvas)${span ? ' sm:col-span-2 lg:col-span-1' : ''}"
>
  <div class="flex flex-col gap-(--spacing-md) p-(--spacing-lg)">
${indentBy(cardBody(item), 4)}
  </div>
</FrameBox>`
}

const linkedBand = (band) => `<SectionModule
  id="${band.anchor}"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
  <template #header>
    <SectionTitle
      eyebrow="${band.eyebrow}"
      title="${band.title}"
      description="${band.description}"
    />
  </template>

  <CardGrid kind="divider" :columns="3">
${each(band.items, linkedCard, 2)}
  </CardGrid>
</SectionModule>`

const groupedBand = (group, index) => `<SectionModule
  id="${group.anchor}"
  :divided="${index > 0}"
  :padded="false"
  title="${group.title}"
  description="${group.description}"
  class="scroll-mt-(--spacing-xxl)"
>
  <CardGrid kind="divider" :columns="3">
${each(group.items, (item, itemIndex) => groupedCard(item, itemIndex, group.items), 2)}
  </CardGrid>
</SectionModule>`

const LINKED_TEMPLATE = inColumn(
  `${linkedBand(NEEDS)}\n\n<SectionGap hatch />\n\n${linkedBand(INDUSTRIES)}`
)

const GROUPED_TEMPLATE = inColumn(GROUPS.map(groupedBand).join('\n\n'))

const meta = {
  title: 'Templates/Marketing/Content/IllustratedCards',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A titled group of illustrated cards on a hairline grid: each card a registered illustration over a heading and one sentence, with the group’s anchor on the band so a mega-menu heading can land on it. Solutions lists its needs and industries with it, each card the link to that solution; Products lists its catalogue with it, one band per product group. Built from `SectionModule`, `SectionTitle`, `CardGrid kind="divider"`, `FrameBox` and `Illustration`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Linked = {
  render: () => ({ components, template: LINKED_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Solutions page’s two groups, By need and By industries. An eyebrowed `SectionTitle` opens each band, and every card is itself the link to its solution, filling the surface on hover.'
      },
      source: { code: toSfc(LINKED_IMPORTS, LINKED_TEMPLATE) }
    }
  }
}

export const Grouped = {
  render: () => ({ components, template: GROUPED_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Products page’s catalogue: Build, Store, Protect and Observe stacked, each band headed by the module’s own title and description and divided from the one above. The cards are unlinked, and the last of an odd row spans the two-up band so no cell is left bare.'
      },
      source: { code: toSfc(GROUPED_IMPORTS, GROUPED_TEMPLATE) }
    }
  }
}

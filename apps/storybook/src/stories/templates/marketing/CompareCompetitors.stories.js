import cloudflareExtendedColor from '@aziontech/webkit/assets/cloudflare-extended-color.svg'
import cloudflareExtendedReversed from '@aziontech/webkit/assets/cloudflare-extended-reversed.svg'
import vercelExtendedMono from '@aziontech/webkit/assets/vercel-extended-mono.svg'
import vercelExtendedReversed from '@aziontech/webkit/assets/vercel-extended-reversed.svg'
import Brand from '@aziontech/webkit/brand'
import FrameBox from '@aziontech/webkit/frame-box'
import IconButton from '@aziontech/webkit/icon-button'
import Popover from '@aziontech/webkit/popover'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import Tooltip from '@aziontech/webkit/tooltip'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const SHARED_IMPORTS = [
  "import Brand from '@aziontech/webkit/brand'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Popover from '@aziontech/webkit/popover'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import Tooltip from '@aziontech/webkit/tooltip'"
]

const CLOUDFLARE_IMPORTS = [
  "import cloudflareExtendedColor from '@aziontech/webkit/assets/cloudflare-extended-color.svg'",
  "import cloudflareExtendedReversed from '@aziontech/webkit/assets/cloudflare-extended-reversed.svg'",
  ...SHARED_IMPORTS
]

const VERCEL_IMPORTS = [
  "import vercelExtendedMono from '@aziontech/webkit/assets/vercel-extended-mono.svg'",
  "import vercelExtendedReversed from '@aziontech/webkit/assets/vercel-extended-reversed.svg'",
  ...SHARED_IMPORTS
]

const components = {
  Brand,
  FrameBox,
  IconButton,
  Popover,
  ...Object.fromEntries(
    ['Trigger', 'Content', 'Title', 'Description'].map((part) => [`Popover.${part}`, Popover[part]])
  ),
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  Tooltip
}

const CLOUDFLARE_GROUPS = [
  {
    title: 'Architecture and resilience',
    rows: [
      {
        capability: 'Unified platform',
        definition:
          'Delivery, compute, storage, and security run on one platform with one configuration model.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Global network',
        definition: 'How many locations serve traffic close to end users.',
        azion: 'partial',
        competitor: 'full'
      },
      {
        capability: 'Same routing on every plan',
        definition:
          'Whether lower-tier traffic is moved to other locations first when a data center runs short of capacity.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Load balancing and failover',
        definition:
          'Steering traffic away from unhealthy origins or locations, included on every plan.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Instant cache purge',
        definition: 'Removing cached content from every location within seconds.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Support and services',
    rows: [
      {
        capability: 'Enterprise response time',
        definition: 'How fast a support engineer answers a critical, production-down ticket.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: '24×7 critical support',
        definition: 'Round-the-clock coverage for business-critical outages.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Professional services',
        definition: 'Specialists who plan and run migrations and architecture changes.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Security',
    rows: [
      {
        capability: 'Web application firewall',
        definition: 'Managed rules that block attacks on applications and APIs.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'DDoS protection',
        definition:
          'Absorbing volumetric and application-layer attacks before they reach the origin.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Bot management',
        definition:
          'Detecting and blocking automated traffic, available without an Enterprise contract.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Zero Trust (SASE)',
        definition: 'Verifying every user and device before granting access to internal apps.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Compute',
    rows: [
      {
        capability: 'Serverless functions',
        definition: 'Running application code at the edge on web standards.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'AI inference',
        definition: 'Running AI models on the provider’s network, close to users.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Observability',
    rows: [
      {
        capability: 'Real-time metrics',
        definition: 'Live traffic, performance, and security dashboards.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Log streaming',
        definition: 'Sending logs in real time to your SIEM or data lake, on every plan.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Ingest, catalog & query',
        definition:
          'Streaming events into storage, organizing them as tables, and querying them with SQL.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Object storage',
        definition: 'S3-compatible storage for files and objects.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'SQL database',
        definition: 'A relational database replicated close to users.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Commercial',
    rows: [
      {
        capability: 'Predictable pricing',
        definition: 'Knowing in advance what a month of traffic and compute will cost.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Committed-use discounts',
        definition: 'Lower rates in exchange for a reserved volume or term.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Every feature on every plan',
        definition: 'No product or feature locked behind an Enterprise contract.',
        azion: 'full',
        competitor: 'partial'
      }
    ]
  }
]

const VERCEL_GROUPS = [
  {
    title: 'Platform',
    rows: [
      {
        capability: 'Delivery, compute, storage, and security on one platform',
        definition:
          'Delivery, compute, storage, and security run on one platform with one configuration model.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Git-connected builds and preview deployments',
        definition: 'Building from a Git push, with a preview URL for each branch before release.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Delivery rules changed without redeploying the application',
        definition: 'Changing cache, routing, and header rules without shipping a new build.',
        azion: 'full',
        competitor: 'partial'
      }
    ]
  },
  {
    title: 'Compute',
    rows: [
      {
        capability: 'JavaScript and WebAssembly runtime',
        definition: 'Running application code close to users on web-standard APIs.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Cold-start-free function execution',
        definition: 'Functions that answer the first request without a startup delay.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'AI inference on the platform',
        definition: 'Running AI models on the provider’s network, close to users.',
        azion: 'full',
        competitor: 'partial'
      }
    ]
  },
  {
    title: 'Storage',
    rows: [
      {
        capability: 'Distributed key-value store',
        definition:
          'Low-latency reads for configuration, flags, and sessions replicated close to users.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'S3-compatible object storage',
        definition: 'S3-compatible storage for files and objects.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Distributed SQL database with vector search',
        definition:
          'A relational database replicated close to users, with similarity search for AI applications.',
        azion: 'full',
        competitor: 'none'
      }
    ]
  },
  {
    title: 'Security',
    rows: [
      {
        capability: 'Managed WAF for applications and APIs',
        definition: 'Managed rules that block attacks on applications and APIs.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'API discovery and protection',
        definition: 'Finding the APIs you expose and applying security rules to each one.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Bot management',
        definition: 'Detecting and blocking automated traffic before it reaches the application.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'DDoS protection included with delivery',
        definition:
          'Absorbing volumetric and application-layer attacks without buying a separate product.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Network-layer firewall',
        definition: 'Filtering traffic by IP, network, and location below the application layer.',
        azion: 'full',
        competitor: 'none'
      }
    ]
  },
  {
    title: 'Delivery and networking',
    rows: [
      {
        capability: 'Tiered caching and origin offload',
        definition: 'Intermediate cache layers that cut the requests reaching your origin.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Image and video optimization',
        definition:
          'Resizing, compressing, and converting media on delivery instead of at the origin.',
        azion: 'full',
        competitor: 'partial'
      },
      {
        capability: 'Authoritative DNS',
        definition: 'Hosting and answering the DNS records of your domains.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Load balancing across multi-cloud origins',
        definition: 'Spreading traffic across origins on different cloud providers or on premises.',
        azion: 'full',
        competitor: 'none'
      },
      {
        capability: 'Accelerate and protect origins hosted elsewhere',
        definition:
          'Putting delivery, caching, and security in front of an application that runs on another provider.',
        azion: 'full',
        competitor: 'none'
      }
    ]
  },
  {
    title: 'Observability',
    rows: [
      {
        capability: 'Real-time metrics and event search',
        definition:
          'Live traffic, performance, and security dashboards, with a query over the events of each request.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Log streaming to third-party tools',
        definition: 'Sending logs in real time to your SIEM or data lake.',
        azion: 'full',
        competitor: 'full'
      },
      {
        capability: 'Real-user monitoring',
        definition: 'Measuring the performance users experience in the browser.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  },
  {
    title: 'Commercial',
    rows: [
      {
        capability: 'Published pay-as-you-go pricing',
        definition: 'Per-unit prices published up front, so you know what a month will cost.',
        azion: 'full',
        competitor: 'full'
      }
    ]
  }
]

const SUPPORT = {
  full: { icon: 'pi pi-check-circle', label: 'Full support' },
  partial: { icon: 'ai ai-circle-half', label: 'Partial support' },
  none: { icon: 'ai ai-circle-minus', label: 'Not available' }
}

const SUPPORT_ICON_CLASS =
  'text-body-md data-[support=full]:text-(--success-contrast) data-[support=none]:text-(--text-muted) data-[support=partial]:text-(--warning-contrast)'

const CELL_CLASS =
  'border-b border-l border-(--border-default) px-(--spacing-xs) py-(--spacing-md) text-center align-middle group-data-[last]/row:border-b-0 sm:px-(--spacing-md)'

const ROW_HEADER_CLASS =
  'border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-md) text-left align-middle text-label-md font-normal text-(--text-default) group-data-[last]/row:border-b-0'

const CATEGORY_CLASS =
  'sticky top-[calc(3.5rem+var(--compare-head))] z-10 border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-xl) py-(--spacing-sm) text-left font-normal'

const TABLE_CLASS =
  'w-full table-fixed border-separate border-spacing-0 text-left [--compare-head:3.5rem] sm:[--compare-head:5rem]'

const LABEL_HEAD_CLASS =
  'sticky top-14 z-20 border-b border-(--border-default) bg-(--bg-canvas) px-(--spacing-xl) py-0 align-middle font-normal h-(--compare-head)'

const AZION_HEAD_CLASS =
  'sticky top-14 z-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-0 text-center align-middle font-normal h-(--compare-head) sm:px-(--spacing-lg)'

const COMPETITOR_HEAD_CLASS =
  'sticky top-14 z-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-0 align-middle font-normal h-(--compare-head) sm:px-(--spacing-lg)'

const LOGO_CLASS = 'mx-auto h-3 w-auto max-w-full object-contain sm:h-4 md:h-6'

const supportCell = (level) => `<td
  class="${CELL_CLASS}"
>
  <Tooltip text="${SUPPORT[level].label}">
    <i
      data-support="${level}"
      class="${SUPPORT[level].icon} ${SUPPORT_ICON_CLASS}"
      aria-hidden="true"
    />
  </Tooltip>
  <span class="sr-only">${SUPPORT[level].label}</span>
</td>`

const definitionPopover = (entry) => `<span class="-my-(--spacing-xxs) inline-flex shrink-0">
  <Popover placement="auto">
    <Popover.Trigger>
      <IconButton kind="transparent" size="small" icon="pi pi-info-circle" aria-label="About ${entry.capability}" />
    </Popover.Trigger>
    <Popover.Content>
      <div class="flex flex-col gap-(--spacing-xxs) p-(--spacing-sm)">
        <Popover.Title>${entry.capability}</Popover.Title>
        <Popover.Description>${entry.definition}</Popover.Description>
      </div>
    </Popover.Content>
  </Popover>
</span>`

const row = (entry, last) => `<tr${last ? ' data-last' : ''} class="group/row">
  <th
    scope="row"
    class="${ROW_HEADER_CLASS}"
  >
    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
      <span class="min-w-0 max-sm:truncate">${entry.capability}</span>${entry.definition ? `\n${indent(definitionPopover(entry), 3)}` : ''}
    </span>
  </th>
${indent(supportCell(entry.azion ?? 'none'))}
${indent(supportCell(entry.competitor ?? 'none'))}
</tr>`

const group = (entry, groupIndex, groups) => `<tbody>
  <tr>
    <th
      scope="colgroup"
      colspan="3"
      class="${CATEGORY_CLASS}"
    >
      <span class="text-overline-md text-(--primary)">${entry.title}</span>
    </th>
  </tr>
${each(
  entry.rows,
  (item, rowIndex) =>
    row(item, groupIndex === groups.length - 1 && rowIndex === entry.rows.length - 1),
  1
)}
</tbody>`

const competitorLogo = (name, dark, light) => `<img
  :src="${dark}"
  alt="${name}"
  decoding="async"
  class="${LOGO_CLASS} hidden [[data-theme=dark]_&]:block"
/>
<img
  :src="${light}"
  alt="${name}"
  decoding="async"
  class="${LOGO_CLASS} block [[data-theme=dark]_&]:hidden"
/>`

const comparison = ({ competitor, logo, groups }) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle kind="left" eyebrow="Comparison" title="How Azion compares with ${competitor}" />
  </template>

  <FrameBox flush borders="y" marks="all">
    <table class="${TABLE_CLASS}">
      <caption class="sr-only">
        How Azion compares with ${competitor}
      </caption>
      <colgroup>
        <col class="w-[56%] md:w-[44%] lg:w-[40%]" />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" class="${LABEL_HEAD_CLASS}">
            <span class="text-overline-md text-(--text-muted)">Capability</span>
          </th>
          <th scope="col" aria-label="Azion" class="${AZION_HEAD_CLASS}">
            <Brand kind="default" size="small" class="[&>svg]:h-3! sm:[&>svg]:h-4! md:[&>svg]:h-6!" />
            <span class="sr-only">Azion</span>
          </th>
          <th scope="col" aria-label="${competitor}" class="${COMPETITOR_HEAD_CLASS}">
${indent(logo, 6)}
            <span class="sr-only">${competitor}</span>
          </th>
        </tr>
      </thead>
${each(groups, (entry, index) => group(entry, index, groups), 3)}
    </table>
  </FrameBox>
</SectionModule>`)

const CLOUDFLARE_TEMPLATE = comparison({
  competitor: 'Cloudflare',
  logo: competitorLogo('Cloudflare', 'cloudflareExtendedReversed', 'cloudflareExtendedColor'),
  groups: CLOUDFLARE_GROUPS
})

const VERCEL_TEMPLATE = comparison({
  competitor: 'Vercel',
  logo: competitorLogo('Vercel', 'vercelExtendedReversed', 'vercelExtendedMono'),
  groups: VERCEL_GROUPS
})

const DYNAMIC_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle kind="left" :eyebrow="props.eyebrow" :title="props.title" />
  </template>

  <FrameBox flush borders="y" marks="all">
    <table class="${TABLE_CLASS}">
      <caption v-if="props.caption" class="sr-only">{{ props.caption }}</caption>
      <colgroup>
        <col class="w-[56%] md:w-[44%] lg:w-[40%]" />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" class="${LABEL_HEAD_CLASS}">
            <span class="text-overline-md text-(--text-muted)">{{ props.columnLabel }}</span>
          </th>
          <th scope="col" aria-label="Azion" class="${AZION_HEAD_CLASS}">
            <Brand kind="default" size="small" class="[&>svg]:h-3! sm:[&>svg]:h-4! md:[&>svg]:h-6!" />
            <span class="sr-only">Azion</span>
          </th>
          <th scope="col" :aria-label="props.competitor.name" class="${COMPETITOR_HEAD_CLASS}">
            <template v-if="props.competitor.logo && props.competitor.logoLight">
              <img :src="props.competitor.logo" :alt="props.competitor.name" decoding="async" class="${LOGO_CLASS} hidden [[data-theme=dark]_&]:block" />
              <img :src="props.competitor.logoLight" :alt="props.competitor.name" decoding="async" class="${LOGO_CLASS} block [[data-theme=dark]_&]:hidden" />
            </template>
            <img v-else-if="props.competitor.logo" :src="props.competitor.logo" :alt="props.competitor.name" decoding="async" class="${LOGO_CLASS}" />
            <span v-else class="block text-center text-heading-xxs whitespace-nowrap">{{ props.competitor.name }}</span>
            <span class="sr-only">{{ props.competitor.name }}</span>
          </th>
        </tr>
      </thead>
      <tbody v-for="(group, groupIndex) in props.groups" :key="group.title">
        <tr>
          <th scope="colgroup" colspan="3" class="${CATEGORY_CLASS}">
            <span class="text-overline-md text-(--primary)">{{ group.title }}</span>
          </th>
        </tr>
        <tr
          v-for="(item, rowIndex) in group.rows"
          :key="item.capability"
          :data-last="(groupIndex === props.groups.length - 1 && rowIndex === group.rows.length - 1) || null"
          class="group/row"
        >
          <th scope="row" class="${ROW_HEADER_CLASS}">
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="min-w-0 max-sm:truncate">{{ item.capability }}</span>
              <span v-if="item.definition" class="-my-(--spacing-xxs) inline-flex shrink-0">
                <Popover placement="auto">
                  <Popover.Trigger>
                    <IconButton kind="transparent" size="small" icon="pi pi-info-circle" :aria-label="'About ' + item.capability" />
                  </Popover.Trigger>
                  <Popover.Content>
                    <div class="flex flex-col gap-(--spacing-xxs) p-(--spacing-sm)">
                      <Popover.Title>{{ item.capability }}</Popover.Title>
                      <Popover.Description>{{ item.definition }}</Popover.Description>
                    </div>
                  </Popover.Content>
                </Popover>
              </span>
            </span>
          </th>
          <td v-for="platform in ['azion', 'competitor']" :key="platform" class="${CELL_CLASS}">
            <Tooltip :text="labelOf(item[platform])">
              <i
                :data-support="item[platform] || 'none'"
                :class="iconOf(item[platform])"
                class="${SUPPORT_ICON_CLASS}"
                aria-hidden="true"
              />
            </Tooltip>
            <span class="sr-only">{{ labelOf(item[platform]) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Comparison/CompareCompetitors',
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

export const AzionVsCloudflare = {
  ...editable(() => ({
    components,
    setup: () => ({ cloudflareExtendedColor, cloudflareExtendedReversed }),
    template: CLOUDFLARE_TEMPLATE
  })),
  parameters: {
    docs: {
      source: { code: toSfc(CLOUDFLARE_IMPORTS, CLOUDFLARE_TEMPLATE) }
    }
  }
}

export const AzionVsVercel = {
  ...editable(() => ({
    components,
    setup: () => ({ vercelExtendedMono, vercelExtendedReversed }),
    template: VERCEL_TEMPLATE
  })),
  parameters: {
    docs: {
      source: { code: toSfc(VERCEL_IMPORTS, VERCEL_TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'comparison-table',
  props: {
    eyebrow: 'Comparison',
    title: 'How Azion compares with Cloudflare',
    caption: 'How Azion compares with Cloudflare',
    columnLabel: 'Capability',
    fullLabel: 'Full support',
    partialLabel: 'Partial support',
    noneLabel: 'Not available',
    competitor: {
      name: 'Cloudflare',
      logo: '/marketing-components/competitors/cloudflare-extended-reversed.svg',
      logoLight: '/marketing-components/competitors/cloudflare-extended-color.svg'
    },
    groups: CLOUDFLARE_GROUPS
  }
}

export const Dynamic = {
  args: {
    ...SITE_SECTION.props,
    competitor: {
      name: 'Cloudflare',
      logo: cloudflareExtendedReversed,
      logoLight: cloudflareExtendedColor
    }
  },
  argTypes: {
    eyebrow: { control: 'text', description: 'Overline above the title.' },
    title: { control: 'text', description: 'Band title.' },
    caption: { control: 'text', description: 'Screen-reader caption of the table.' },
    columnLabel: { control: 'text', description: 'Heading of the capability column.' },
    fullLabel: {
      control: 'text',
      description: 'Tooltip and screen-reader text of a full-support cell.'
    },
    partialLabel: {
      control: 'text',
      description: 'Tooltip and screen-reader text of a partial-support cell.'
    },
    noneLabel: {
      control: 'text',
      description: 'Tooltip and screen-reader text of an unsupported cell.'
    },
    competitor: {
      control: 'object',
      description:
        'The alternative: name, logo for the dark theme, and logoLight for the light theme.'
    },
    groups: {
      control: 'object',
      description:
        'Categories in display order. Each has a title and rows; a row has capability, an optional definition, and azion and competitor levels: full, partial or none.'
    }
  },
  render: (args) => ({
    components,
    setup: () => ({
      props: args,
      iconOf: (level) => SUPPORT[level ?? 'none'].icon,
      labelOf: (level) =>
        ({ full: args.fullLabel, partial: args.partialLabel, none: args.noneLabel })[
          level ?? 'none'
        ]
    }),
    template: DYNAMIC_TEMPLATE
  }),
  parameters: {
    docs: {
      source: { code: toSfc(CLOUDFLARE_IMPORTS, CLOUDFLARE_TEMPLATE) }
    }
  }
}

export const AzionVsCloudflareJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

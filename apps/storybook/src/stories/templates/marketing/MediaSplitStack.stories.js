import BandStack from '@aziontech/webkit/band-stack'
import Button from '@aziontech/webkit/button'
import Illustration from '@aziontech/webkit/illustration'
import MediaSplit from '@aziontech/webkit/media-split'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const components = {
  BandStack,
  Button,
  Illustration,
  MediaSplit,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const SOLUTIONS = [
  {
    illustration: 'quick-start-with-templates',
    title: 'Modern applications',
    description: 'Build static sites, run serverless applications, or modernize legacy systems.',
    href: '/solutions/web-apps'
  },
  {
    illustration: 'improve-application-performance-and-reliability',
    title: 'Optimized workloads',
    description:
      'Speed up applications, deliver content through the CDN, and process images on demand.',
    href: '/solutions/performance'
  },
  {
    illustration: 'ai-applications',
    title: 'AI applications',
    description:
      'Build and deploy AI agents and AI-powered applications on a distributed platform, with inference close to users.',
    href: '/solutions/ai'
  },
  {
    illustration: 'automate-threat-mitigation',
    title: 'Protected applications and APIs',
    description:
      'Protect web applications and APIs (WAAP), manage bots, and enforce programmable security policies at scale.',
    href: '/solutions/security'
  },
  {
    illustration: 'low-latency',
    title: 'Media and streaming content',
    description:
      'Stream video and deliver large files at low latency to audiences of any size, with media processed close to viewers.',
    href: '/solutions/streaming'
  }
]

const SOLUTIONS_IMPORTS = [
  "import BandStack from '@aziontech/webkit/band-stack'",
  "import Button from '@aziontech/webkit/button'",
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaSplit from '@aziontech/webkit/media-split'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const ALTERNATING_IMPORTS = [
  "import BandStack from '@aziontech/webkit/band-stack'",
  "import Button from '@aziontech/webkit/button'",
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaSplit from '@aziontech/webkit/media-split'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const stack = (bands) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <BandStack sticky flush>
${bands}
  </BandStack>
</SectionModule>`)

const solutionMedia = (solution) => `<Illustration name="${solution.illustration}" />`

const solutionBand = (solution) => `<MediaSplit
  kind="media-end"
  :divided="true"
  :heading-level="2"
  align="center"
  size="large"
  media-fill="canvas"
  texture="pixelate"
  texture-size="small"
  texture-fade="top"
  title="${solution.title}"
  description="${solution.description}"
  media-href="${solution.href}"
>
  <template #media>
${indent(solutionMedia(solution), 2)}
  </template>
  <template #actions>
    <Button
      label="Learn more"
      kind="outlined"
      size="medium"
      icon="pi pi-chevron-right"
      icon-position="trailing"
      animated
      href="${solution.href}"
    />
  </template>
</MediaSplit>`

const SOLUTIONS_TEMPLATE = stack(each(SOLUTIONS, solutionBand, 2))

const NETWORK_BANDS = [
  {
    kind: 'media-start',
    title: 'Run closer to users',
    description:
      'Handle requests close to users instead of sending everything back to a few central regions. That cuts latency, absorbs spikes automatically, and reduces backhaul.',
    illustration: 'fastest-path-to-live-website',
    ariaLabel: 'Requests served from the data center nearest the user',
    href: '/products/application-accelerator'
  },
  {
    kind: 'media-end',
    title: 'Keep delivery, logic, and data in one place',
    description:
      'Run delivery, execution, and data on one platform. APIs and dynamic applications get real-time request handling, origin protection, and state kept next to the code with KV Store.',
    illustration: 'runtime',
    ariaLabel: 'Delivery, execution and data served from one platform',
    href: '/products/kv-store'
  },
  {
    kind: 'media-start',
    title: 'Get better routes and more stable delivery',
    description:
      'Traffic enters inside ISP last-mile networks and connects through IXPs, peering, and Tier 1 transit. Fewer hops mean better routes and stable delivery during traffic spikes, upstream issues, and regional incidents.',
    illustration: 'distributed-apis',
    ariaLabel: 'Entry points inside ISP networks, connected through IXPs and transit',
    href: '/products/load-balancer'
  },
  {
    kind: 'media-end',
    title: 'Stop attack traffic earlier',
    description:
      'Block attack traffic in the delivery path, before it reaches your origin. Deploy code and policies and let the platform handle scaling, execution, and traffic steering. Your team manages fewer regions, less capacity, and fewer scaling rules.',
    illustration: 'automate-threat-mitigation',
    ariaLabel: 'Attack traffic stopped in the delivery path, before the origin',
    href: '/products/ddos-protection'
  }
]

const ALTERNATING_TEMPLATE = inColumn(`<SectionTitle
  kind="centered"
  size="large"
  eyebrow="Managed Infrastructure"
  title="Stop managing regions and capacity by hand"
/>

<SectionModule :divided="false" :padded="false">
  <BandStack sticky flush>
${each(
  NETWORK_BANDS,
  (band) => `<MediaSplit
  kind="${band.kind}"
  :divided="true"
  align="center"
  size="large"
  media-fill="canvas"
  texture="pixelate"
  texture-size="small"
  texture-fade="top"
  title="${band.title}"
  description="${band.description}"
  media-href="${band.href}"
>
  <template #media>
    <Illustration
      name="${band.illustration}"
      aria-label="${band.ariaLabel}"
    />
  </template>
  <template #actions>
    <Button
      label="Learn more"
      kind="outlined"
      size="medium"
      icon="pi pi-chevron-right"
      icon-position="trailing"
      animated
      href="${band.href}"
    />
  </template>
</MediaSplit>`,
  2
)}
  </BandStack>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Solutions/MediaSplitStack',
  excludeStories: ['SITE_SECTION_SOLUTIONS', 'SITE_SECTION_ALTERNATING'],
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

export const Solutions = {
  render: () => ({
    components,
    template: SOLUTIONS_TEMPLATE
  }),
  parameters: {
    docs: {
      source: { code: toSfc(SOLUTIONS_IMPORTS, SOLUTIONS_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_SOLUTIONS = {
  _id: 'media-split-stack-solutions',
  props: {
    actionLabel: 'Learn more',
    bands: [
      {
        illustration: 'quick-start-with-templates',
        title: 'Modern applications',
        description:
          'Build static sites, run serverless applications, or modernize legacy systems.',
        href: '/en/solutions/web-apps/'
      },
      {
        illustration: 'improve-application-performance-and-reliability',
        title: 'Optimized workloads',
        description:
          'Speed up applications, deliver content through the CDN, and process images on demand.',
        href: '/en/solutions/performance/'
      },
      {
        illustration: 'ai-applications',
        title: 'AI applications',
        description:
          'Build and deploy AI agents and AI-powered applications on a distributed platform, with inference close to users.',
        href: '/en/solutions/ai/'
      }
    ]
  }
}

export const SolutionsJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_SOLUTIONS)
}

export const Alternating = {
  render: () => ({ components, template: ALTERNATING_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(ALTERNATING_IMPORTS, ALTERNATING_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_ALTERNATING = {
  _id: 'media-split-stack-alternating',
  props: {
    eyebrow: 'Managed Infrastructure',
    title: 'Stop managing regions and capacity by hand',
    actionLabel: 'Learn more',
    bands: NETWORK_BANDS.slice(0, 2).map((band) => ({
      title: band.title,
      description: band.description,
      href: `/en${band.href}/`,
      illustration: band.illustration,
      illustrationLabel: band.ariaLabel
    }))
  }
}

export const AlternatingJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_ALTERNATING)
}

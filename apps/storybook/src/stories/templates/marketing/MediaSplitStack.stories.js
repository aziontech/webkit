import quickStartWithTemplates from '@aziontech/webkit/assets/quick-start-with-templates.svg'
import BandStack from '@aziontech/webkit/band-stack'
import Button from '@aziontech/webkit/button'
import Illustration from '@aziontech/webkit/illustration'
import MediaSplit from '@aziontech/webkit/media-split'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
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
    art: 'quickStartWithTemplates',
    title: 'Build and Run Applications',
    description:
      'Deploy applications and static sites straight from Git, and run them on a distributed network with no servers to manage.',
    href: '/solutions/web-apps'
  },
  {
    illustration: 'improve-application-performance-and-reliability',
    title: 'Improve Application Performance and Reliability',
    description:
      'Cache, route and optimize every request close to your users, so applications stay fast and available under any load.',
    href: '/solutions/performance'
  },
  {
    illustration: 'ai-applications',
    title: 'Build and Run AI Workloads',
    description:
      'Run inference, vector search and AI agents on distributed infrastructure, close to the data and the users that need them.',
    href: '/solutions/ai'
  },
  {
    illustration: 'automate-threat-mitigation',
    title: 'Secure Applications and Networks',
    description:
      'Stop DDoS attacks, bots and exploits before they reach your origin, with WAF and network rules managed from one console.',
    href: '/solutions/security'
  },
  {
    illustration: 'low-latency',
    title: 'Deliver Media and Streaming Content',
    description:
      'Stream video and deliver large files at low latency to audiences of any size, with media processed at the edge.',
    href: '/solutions/streaming'
  }
]

const SOLUTIONS_IMPORTS = [
  "import quickStartWithTemplates from '@aziontech/webkit/assets/quick-start-with-templates.svg'",
  "import BandStack from '@aziontech/webkit/band-stack'",
  "import Button from '@aziontech/webkit/button'",
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaSplit from '@aziontech/webkit/media-split'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const ALTERNATING_IMPORTS = [
  "import BandStack from '@aziontech/webkit/band-stack'",
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

const solutionMedia = (solution) =>
  solution.art
    ? `<div class="flex aspect-592/300 w-full items-center justify-center">
  <img
    :src="${solution.art}"
    alt=""
    width="360"
    height="165"
    decoding="async"
    class="block h-auto w-[60.81%]"
  />
</div>`
    : `<Illustration name="${solution.illustration}" />`

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
      'Handle requests closer to users instead of sending everything back to a few central regions. That helps cut latency, absorb spikes automatically, and reduce backhaul overhead.',
    illustration: 'fastest-path-to-live-website',
    ariaLabel: 'Requests served from the location nearest the user'
  },
  {
    kind: 'media-end',
    title: 'Keep delivery, logic, and data in one place',
    description:
      'Use one platform for delivery, distributed execution, and data workflows. Support APIs and dynamic applications with real-time request handling, origin protection, and state kept close to execution with services like KV Store.',
    illustration: 'runtime',
    ariaLabel: 'Delivery, execution and data served from one platform'
  },
  {
    kind: 'media-start',
    title: 'Get better routes and more stable delivery',
    description:
      'Place traffic entry points inside ISP last-mile networks and connect through IXPs, peering, and Tier 1 transit. Reduce hops, improve route quality, and keep delivery stable during traffic spikes, upstream issues, and regional incidents.',
    illustration: 'distributed-apis',
    ariaLabel: 'Entry points inside ISP networks, connected through IXPs and transit'
  },
  {
    kind: 'media-end',
    title: 'Stop attack traffic earlier',
    description:
      'Block attack traffic in the delivery path before it reaches your origin. Deploy code and policies while the platform handles scaling, execution, and traffic steering, so your team spends less time managing regions, capacity, scaling rules, and extra layers.',
    illustration: 'automate-threat-mitigation',
    ariaLabel: 'Attack traffic stopped in the delivery path, before the origin'
  }
]

const ALTERNATING_TEMPLATE = inColumn(`<SectionTitle
  kind="centered"
  eyebrow="Managed Infrastructure"
  title="Stop managing regions and capacity by hand"
/>

<SectionModule :divided="false" :padded="false">
  <BandStack sticky flush>
${each(
  NETWORK_BANDS,
  (band) => `<MediaSplit
  kind="${band.kind}"
  texture="pixelate"
  texture-size="small"
  texture-fade="top"
  title="${band.title}"
  description="${band.description}"
>
  <template #media>
    <Illustration
      name="${band.illustration}"
      aria-label="${band.ariaLabel}"
    />
  </template>
</MediaSplit>`,
  2
)}
  </BandStack>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Media/MediaSplitStack',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The core of a product page: a run of copy-beside-art bands that pin under the site header from `lg` up and pile on each other as the page scrolls. Each band states one claim with its own media and actions, and with `media-href` set the whole band is a link. Every band grounds its media on the same texture: an animated `pixelate` field at the small size, fading out toward the top. Used by Home (inside Why Azion), Application Accelerator, Functions and Our Network. Built from `BandStack` and `MediaSplit`, with `Illustration` scenes and `Button` actions. A band whose media is code is the CodeSplit template.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Solutions = {
  render: () => ({
    components,
    setup: () => ({ quickStartWithTemplates }),
    template: SOLUTIONS_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The five solution areas the Home page stacks inside Why Azion, each a large, centered band with an outlined "Learn more" button. The first band shows the `quick-start-with-templates` art file as an image; the other four use `Illustration` scenes. Each band titles itself with an `h2`, the level MediaSplit accepts under a page’s `h1`; the Home page passes `1`, which gives it five `h1`s.'
      },
      source: { code: toSfc(SOLUTIONS_IMPORTS, SOLUTIONS_TEMPLATE) }
    }
  }
}

export const Alternating = {
  render: () => ({ components, template: ALTERNATING_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'From the Our Network page: a centered `SectionTitle` set directly in the column, then four bands alternating media start and end, with no actions. The page itself grounds these bands on no texture; the template gives them the stack’s shared pixelate field.'
      },
      source: { code: toSfc(ALTERNATING_IMPORTS, ALTERNATING_TEMPLATE) }
    }
  }
}

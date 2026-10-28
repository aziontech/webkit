import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'
import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'
import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import NetworkMap from '@aziontech/webkit/network-map'
import Quote from '@aziontech/webkit/quote'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import Topic from '@aziontech/webkit/topic'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const BAND_IMPORTS = [
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import NetworkMap from '@aziontech/webkit/network-map'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const QUOTES_IMPORTS = [
  "import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'",
  "import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'",
  "import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'",
  "import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import Quote from '@aziontech/webkit/quote'",
  ...BAND_IMPORTS
]

const BENEFITS_IMPORTS = [
  "import CardGrid from '@aziontech/webkit/card-grid'",
  ...BAND_IMPORTS,
  "import Topic from '@aziontech/webkit/topic'"
]

const components = {
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  FrameBox,
  NetworkMap,
  Quote,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  Topic
}

const setup = () => ({
  dafitiExtendedMono,
  fourbankExtendedReversed,
  madeiramadeiraExtendedReversed,
  rennerExtendedColor
})

const NETWORK_BAND = {
  eyebrow: 'Region: Earth.',
  title:
    'One distributed infrastructure without the complexity of managing, securing and scaling it',
  lead: 'Built around your users. Distributed around your data.'
}

const NETWORK_CLAIMS = [
  '100+ data centers',
  '100+ Tbps network capacity',
  '30 ms median latency',
  '100% availability'
]

const BENEFITS = [
  {
    icon: 'pi pi-globe',
    title: 'Global resilience beyond anycast',
    description:
      "Azion's software-defined global router steers traffic around failures and network degradation faster than BGP can reconverge. Always-on DDoS protection across 100+ data centers worldwide."
  },
  {
    icon: 'pi pi-stopwatch',
    title: 'Low latency everywhere',
    description:
      'Compute, AI, databases, and security run in every data center, close to your users. Median global latency stays under 30 ms, with a built-in CDN and tiered caching for every app.'
  },
  {
    icon: 'pi pi-arrows-v',
    title: 'Zero-ops autoscaling and failover',
    description:
      'Absorbs any traffic spike with no cold starts, instantly scaling from zero to millions. No capacity planning, no provisioning. Scale-to-zero with no idle costs: you pay only for what you run.'
  }
]

const MONOCHROME = 'brightness-0 [[data-theme=dark]_&]:invert'

const OUTCOMES = [
  {
    src: 'dafitiExtendedMono',
    name: 'Dafiti',
    filter: MONOCHROME,
    text: '86% faster load times, with a 45% cost reduction in data transfer.',
    highlights: ['86% faster load times', '45% cost reduction']
  },
  {
    src: 'madeiramadeiraExtendedReversed',
    name: 'MadeiraMadeira',
    filter: '',
    text: '90% lower cloud costs and faster applications at scale.',
    highlights: ['90% lower cloud costs']
  },
  {
    src: 'rennerExtendedColor',
    name: 'Renner',
    filter: '',
    text: '67% saved on data transfer, even during massive traffic spikes.',
    highlights: ['67% saved']
  },
  {
    src: 'fourbankExtendedReversed',
    name: 'Fourbank',
    filter: MONOCHROME,
    text: 'DDoS mitigated on applications and APIs, with a programmable security layer.',
    highlights: ['DDoS mitigated']
  }
]

const DESKTOP_MAP = `<NetworkMap
  region="world"
  position="top-right"
  animated
  fade="left"
  :opacity="0.3"
  density="medium"
  :scale="1.3"
  :offset-x="0.5"
  :offset-y="-0.22"
  class="max-md:hidden md:max-lg:[--network-map-fade-start:70%] md:max-lg:[--network-map-fade-end:100%]"
/>`

const MOBILE_MAP = `<div
  class="relative -mx-(--spacing-xxl) min-h-48 flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_75%,transparent)] md:hidden"
>
  <NetworkMap
    region="world"
    position="center"
    animated
    :opacity="0.3"
    density="medium"
    :scale="1.8"
    :offset-x="0.24"
    :offset-y="0.03"
  />
</div>`

const mapBand = (floor) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="all" class="relative overflow-hidden">
${indent(DESKTOP_MAP, 2)}

    <div class="relative flex h-full flex-col">
      <div
        class="relative flex min-h-[38rem] flex-col justify-between gap-(--spacing-xl) p-(--spacing-xxl) md:min-h-[clamp(36rem,60vh,40rem)] lg:min-h-[clamp(340px,52vh,620px)]"
      >
        <SectionTitle
          :framed="false"
          kind="left"
          size="small"
          eyebrow="${NETWORK_BAND.eyebrow}"
          title="${NETWORK_BAND.title}"
          class="relative [&_h2]:max-w-(--container-lg)"
        />

${indent(MOBILE_MAP, 4)}

        <div class="relative flex flex-col gap-(--spacing-md)">
          <p class="m-0 text-overline-sm text-(--text-muted)">
            ${NETWORK_BAND.lead}
          </p>

          <ul class="m-0 flex max-w-(--container-sm) list-none flex-wrap gap-(--spacing-xs) p-0">
${each(
  NETWORK_CLAIMS,
  (claim) => `<li
  class="inline-flex h-6 items-center rounded-(--shape-elements) border border-(--primary) bg-[color-mix(in_srgb,var(--primary)_10%,var(--bg-canvas))] px-(--spacing-xs) text-label-sm text-(--text-default)"
>
  ${claim}
</li>`,
  6
)}
          </ul>
        </div>
      </div>

${indent(floor, 3)}
    </div>
  </FrameBox>
</SectionModule>`)

const OUTCOME_FLOOR = `<CardGrid flush kind="frame" :columns="4" class="border-t border-(--border-default)">
${each(
  OUTCOMES,
  (outcome) => `<CardGrid.Cell kind="canvas">
  <Quote
    text="${outcome.text}"
    :highlights="[${outcome.highlights.map((highlight) => `'${highlight}'`).join(', ')}]"
    class="h-full"
  >
    <template #mark>
      <img
        :src="${outcome.src}"
        alt="${outcome.name}"
        decoding="async"
        class="h-full w-auto max-w-32 object-contain${outcome.filter ? ` ${outcome.filter}` : ''}"
      />
    </template>
  </Quote>
</CardGrid.Cell>`,
  1
)}
</CardGrid>`

const BENEFIT_FLOOR = `<CardGrid flush kind="frame" :columns="3" class="border-t border-(--border-default)">
${each(
  BENEFITS,
  (benefit) => `<CardGrid.Cell kind="canvas">
  <Topic
    :heading-level="3"
    icon="${benefit.icon}"
    title="${benefit.title}"
    description="${benefit.description}"
  />
</CardGrid.Cell>`,
  1
)}
</CardGrid>`

const QUOTES_TEMPLATE = mapBand(OUTCOME_FLOOR)
const BENEFITS_TEMPLATE = mapBand(BENEFIT_FLOOR)

const meta = {
  title: 'Templates/Marketing/Network/NetworkSection',
  excludeStories: ['SITE_SECTION', 'BENEFITS_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const ClientQuotes = {
  ...editable(() => ({ components, setup, template: QUOTES_TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(QUOTES_IMPORTS, QUOTES_TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'network-section',
  props: {
    eyebrow: 'Region: Earth.',
    title:
      'One distributed infrastructure without the complexity of managing, securing and scaling it',
    lead: 'Built around your users. Distributed around your data.',
    claims: [
      '100+ data centers',
      '100+ Tbps network capacity',
      '30 ms median latency',
      '100% availability'
    ],
    outcomes: [
      {
        logo: '/marketing-components/logos/dafiti-extended-mono.svg',
        logoAlt: 'Dafiti',
        logoTreatment: 'monochrome',
        text: '86% faster load times, with a 45% cost reduction in data transfer.',
        highlights: ['86% faster load times', '45% cost reduction']
      },
      {
        logo: '/marketing-components/clients/madeiramadeira.svg',
        logoAlt: 'MadeiraMadeira',
        logoTreatment: 'as-is',
        text: '90% lower cloud costs and faster applications at scale.',
        highlights: ['90% lower cloud costs']
      },
      {
        logo: '/marketing-components/clients/renner-color.svg',
        logoAlt: 'Renner',
        logoTreatment: 'as-is',
        text: '67% saved on data transfer, even during massive traffic spikes.',
        highlights: ['67% saved']
      },
      {
        logo: '/marketing-components/clients/fourbank.svg',
        logoAlt: 'Fourbank',
        logoTreatment: 'monochrome',
        text: 'DDoS mitigated on applications and APIs, with a programmable security layer.',
        highlights: ['DDoS mitigated']
      }
    ]
  }
}

export const ClientQuotesJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

export const Benefits = {
  ...editable(() => ({ components, template: BENEFITS_TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(BENEFITS_IMPORTS, BENEFITS_TEMPLATE) }
    }
  }
}

export const BENEFITS_SECTION = {
  _id: 'network-section',
  props: {
    kind: 'benefits',
    eyebrow: SITE_SECTION.props.eyebrow,
    title: SITE_SECTION.props.title,
    lead: SITE_SECTION.props.lead,
    claims: SITE_SECTION.props.claims,
    benefits: BENEFITS
  }
}

export const BenefitsJson = {
  tags: ['!dev'],
  ...siteJsonStory(BENEFITS_SECTION)
}

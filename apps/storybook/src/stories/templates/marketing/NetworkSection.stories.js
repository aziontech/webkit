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

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'",
  "import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'",
  "import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'",
  "import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import NetworkMap from '@aziontech/webkit/network-map'",
  "import Quote from '@aziontech/webkit/quote'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
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
  SectionTitle
}

const setup = () => ({
  dafitiExtendedMono,
  fourbankExtendedReversed,
  madeiramadeiraExtendedReversed,
  rennerExtendedColor
})

const NETWORK_BAND = {
  eyebrow: 'Region: Earth.',
  title: 'One distributed infrastructure to build, secure and scale workloads anywhere.',
  lead: 'Built around your users. Distributed around your data.'
}

const NETWORK_CLAIMS = [
  '100+ data centers',
  '100+ Tbps network capacity',
  '30 ms median latency',
  '100% availability'
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
    text: '90% lower cloud costs, and faster product delivery at scale.',
    highlights: ['90% lower cloud costs']
  },
  {
    src: 'rennerExtendedColor',
    name: 'Renner',
    filter: '',
    text: '67% saved on data transfer costs, through massive traffic spikes.',
    highlights: ['67% saved']
  },
  {
    src: 'fourbankExtendedReversed',
    name: 'Fourbank',
    filter: MONOCHROME,
    text: 'DDoS mitigated on applications and APIs, behind a programmable security layer.',
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
  :offset-x="0.4"
  :offset-y="-0.2"
  class="max-md:hidden"
/>`

const MOBILE_MAP = `<div
  class="relative -mx-(--spacing-xxl) min-h-48 flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] md:hidden"
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
          class="relative [&_h2]:max-w-[16em]"
        />

${indent(MOBILE_MAP, 4)}

        <div class="relative flex flex-col gap-(--spacing-md)">
          <p class="m-0 text-overline-sm text-(--text-muted)">
            ${NETWORK_BAND.lead}
          </p>

          <ul class="m-0 flex list-none flex-wrap gap-(--spacing-xs) p-0">
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

const TEMPLATE = mapBand(OUTCOME_FLOOR)

const meta = {
  title: 'Templates/Marketing/Network/NetworkSection',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The network argument as one framed section, exactly as the Home page draws it: an animated world map behind the claim (“Region: Earth.”), a lead line and four infrastructure claims as pills, then a floor of four client outcomes that backs the claim up. The title is set at the small size and held to 16em, so it wraps in three lines and leaves the map clear. At every width the title holds the top of the band and the lead line, a muted overline, sits with the claims at the bottom; on tablets and phones the band is held taller than on desktop, so the map shows in the space between them. On phones the map is not a backdrop: it gets its own box between the title and the claims, bled to the frame’s edges and faded out at its top and bottom, so no line of copy ever sits on it. It is zoomed in and shifted right to frame the Atlantic: the Americas on the left, western Europe on the right, and only the edge of Africa. The map is two `NetworkMap`s, one behind the band from `md` up and one in its own box on phones. Built from `SectionModule`, `FrameBox`, `NetworkMap`, `SectionTitle` and, on the floor, `CardGrid` with a `Quote` per client.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup, template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Four client outcomes as quotes with the figure highlighted, each signed by the client’s logo. Dafiti and Fourbank are drawn as one flat ink that follows the theme; MadeiraMadeira and Renner keep their brand colours.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

import forresterExtendedColor from '@aziontech/webkit/assets/forrester-extended-color.svg'
import forresterExtendedReversed from '@aziontech/webkit/assets/forrester-extended-reversed.svg'
import frostAndSullivanExtendedColor from '@aziontech/webkit/assets/frost-and-sullivan-extended-color.svg'
import frostAndSullivanExtendedReversed from '@aziontech/webkit/assets/frost-and-sullivan-extended-reversed.svg'
import g2SymbolColor from '@aziontech/webkit/assets/g2-symbol-color.svg'
import gartnerExtendedColor from '@aziontech/webkit/assets/gartner-extended-color.svg'
import gartnerExtendedReversed from '@aziontech/webkit/assets/gartner-extended-reversed.svg'
import gigaomExtendedColor from '@aziontech/webkit/assets/gigaom-extended-color.svg'
import gigaomExtendedReversed from '@aziontech/webkit/assets/gigaom-extended-reversed.svg'
import FrameBox from '@aziontech/webkit/frame-box'
import Quote from '@aziontech/webkit/quote'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import forresterExtendedColor from '@aziontech/webkit/assets/forrester-extended-color.svg'",
  "import forresterExtendedReversed from '@aziontech/webkit/assets/forrester-extended-reversed.svg'",
  "import frostAndSullivanExtendedColor from '@aziontech/webkit/assets/frost-and-sullivan-extended-color.svg'",
  "import frostAndSullivanExtendedReversed from '@aziontech/webkit/assets/frost-and-sullivan-extended-reversed.svg'",
  "import g2SymbolColor from '@aziontech/webkit/assets/g2-symbol-color.svg'",
  "import gartnerExtendedColor from '@aziontech/webkit/assets/gartner-extended-color.svg'",
  "import gartnerExtendedReversed from '@aziontech/webkit/assets/gartner-extended-reversed.svg'",
  "import gigaomExtendedColor from '@aziontech/webkit/assets/gigaom-extended-color.svg'",
  "import gigaomExtendedReversed from '@aziontech/webkit/assets/gigaom-extended-reversed.svg'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import Quote from '@aziontech/webkit/quote'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const components = {
  FrameBox,
  Quote,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const setup = () => ({
  forresterExtendedColor,
  forresterExtendedReversed,
  frostAndSullivanExtendedColor,
  frostAndSullivanExtendedReversed,
  g2SymbolColor,
  gartnerExtendedColor,
  gartnerExtendedReversed,
  gigaomExtendedColor,
  gigaomExtendedReversed
})

const FIRMS = {
  gigaom: { name: 'GigaOm', logo: 'gigaomExtendedReversed', logoLight: 'gigaomExtendedColor' },
  forrester: {
    name: 'Forrester',
    logo: 'forresterExtendedReversed',
    logoLight: 'forresterExtendedColor'
  },
  gartner: { name: 'Gartner', logo: 'gartnerExtendedReversed', logoLight: 'gartnerExtendedColor' },
  frost: {
    name: 'Frost & Sullivan',
    logo: 'frostAndSullivanExtendedReversed',
    logoLight: 'frostAndSullivanExtendedColor'
  },
  g2: { name: 'G2', logo: 'g2SymbolColor' }
}

const RECOGNITIONS = [
  {
    text: 'Named a Leader and Fast Mover, and the only vendor whose platform meets every key criterion the report sets for a full-stack edge deployment.',
    name: 'GigaOm Radar for Full-Stack Edge Deployments v3',
    jobTitle: 'May 2026',
    firm: FIRMS.gigaom
  },
  {
    text: 'Evaluated as a Strong Performer among the edge development platforms that matter most.',
    name: 'The Forrester Wave™: Edge Development Platforms',
    jobTitle: 'March 2026',
    firm: FIRMS.forrester
  },
  {
    text: 'Covered as a vendor in the market guide that defines the edge distribution platform category, in two consecutive editions.',
    name: 'Gartner Market Guide for Edge Distribution Platforms',
    jobTitle: 'November 2025',
    firm: FIRMS.gartner
  },
  {
    text: 'Recognized as Latin America Company of the Year in the edge distribution platform industry, after being profiled among the Companies to Action on the Frost Radar™.',
    name: 'Frost & Sullivan Latin America Company of the Year',
    jobTitle: 'June 2026',
    firm: FIRMS.frost
  },
  {
    text: 'Positioned as a Challenger and Fast Mover, with the application and API security stack evaluated as one platform rather than a set of bolt-ons.',
    name: 'GigaOm Radar for Application and API Security v5',
    jobTitle: 'March 2026',
    firm: FIRMS.gigaom
  },
  {
    text: 'Recognized as a Leader in CDN, Web Security, and DDoS Protection, and a High Performer in Cloud Security, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and API Security Tools.',
    name: 'G2 Reports',
    jobTitle: 'March 2026',
    firm: FIRMS.g2
  },
  {
    text: 'Recognized as a Leader in CDN and a High Performer in Web Security, DDoS Protection, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and DNS Security Solution.',
    name: 'G2 Reports',
    jobTitle: 'December 2025',
    firm: FIRMS.g2
  }
]

const MARK = 'h-8 w-auto max-w-40 object-contain'

const firmMark = (firm) =>
  firm.logoLight
    ? `<img
  :src="${firm.logo}"
  alt="${firm.name}"
  decoding="async"
  class="${MARK} hidden [[data-theme=dark]_&]:block"
/>
<img
  :src="${firm.logoLight}"
  alt="${firm.name}"
  decoding="async"
  class="${MARK} block [[data-theme=dark]_&]:hidden"
/>`
    : `<img :src="${firm.logo}" alt="${firm.name}" decoding="async" class="${MARK}" />`

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle title="Recognized as a Market Leader" />
  </template>

  <FrameBox flush borders="y" marks="all">
    <div
      role="region"
      aria-label="Analyst recognitions"
      tabindex="0"
      class="group/loop overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset motion-reduce:overflow-x-auto"
    >
      <div
        style="animation-duration: ${RECOGNITIONS.length * 12}s"
        class="flex w-max animate-brand-marquee group-focus-within/loop:[animation-play-state:paused] group-hover/loop:[animation-play-state:paused] motion-reduce:animate-none"
      >
        <ul
          v-for="copy in 2"
          :key="copy"
          :data-duplicate="copy === 2 || null"
          :aria-hidden="copy === 2 ? 'true' : undefined"
          class="m-0 flex w-max shrink-0 list-none p-0 motion-reduce:data-[duplicate]:hidden"
        >
${each(
  RECOGNITIONS,
  (recognition) => `<li class="flex w-[85vw] max-w-(--container-md) shrink-0 sm:w-(--container-md)">
  <FrameBox borders="right" marks="all" class="w-full bg-(--bg-surface)">
    <Quote
      kind="signed"
      text="${recognition.text}"
      name="${recognition.name}"
      job-title="${recognition.jobTitle}"
      class="p-(--spacing-xl)"
    >
      <template #mark>
${indent(firmMark(recognition.firm), 4)}
      </template>
    </Quote>
  </FrameBox>
</li>`,
  5
)}
        </ul>
      </div>
    </div>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Social Proof/RecognitionMarquee',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The analyst-recognition band: a section title over a marquee of signed quotes, one per report, each signed by the firm’s logo with the report’s name and date. The row runs twice so the loop has no seam; the second copy is hidden from assistive tech, the loop pauses on hover and keyboard focus, and under reduced motion it stops and the row scrolls by hand instead. Home carries it after “Why Azion”. Built from `SectionModule`, `SectionTitle`, `FrameBox` and `Quote`, with the `animate-brand-marquee` utility.'
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
          'The seven recognitions Home runs, at twelve seconds per card (84s per pass). Each firm’s logo is a pair of files, reversed on dark and in colour on light, and the theme shows one of the two; G2 ships one colour file, used on both themes.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

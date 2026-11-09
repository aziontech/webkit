import monasheesExtendedMono from '@aziontech/webkit/assets/monashees-extended-mono.svg'
import monasheesExtendedReversed from '@aziontech/webkit/assets/monashees-extended-reversed.svg'
import qualcommExtendedMono from '@aziontech/webkit/assets/qualcomm-extended-mono.svg'
import qualcommExtendedReversed from '@aziontech/webkit/assets/qualcomm-extended-reversed.svg'
import BentoGrid from '@aziontech/webkit/bento-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import monasheesExtendedMono from '@aziontech/webkit/assets/monashees-extended-mono.svg'",
  "import monasheesExtendedReversed from '@aziontech/webkit/assets/monashees-extended-reversed.svg'",
  "import qualcommExtendedMono from '@aziontech/webkit/assets/qualcomm-extended-mono.svg'",
  "import qualcommExtendedReversed from '@aziontech/webkit/assets/qualcomm-extended-reversed.svg'",
  "import BentoGrid from '@aziontech/webkit/bento-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const components = {
  BentoGrid,
  'BentoGrid.Cell': BentoGrid.Cell,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const setup = () => ({
  monasheesExtendedMono,
  monasheesExtendedReversed,
  qualcommExtendedMono,
  qualcommExtendedReversed
})

const EYEBROW = 'Investors'

const TITLE = 'Backed by visionary investors'

const LINK_LABEL = 'Visit website'

const INVESTORS = [
  {
    name: 'monashees+',
    logo: 'monasheesExtendedReversed',
    logoLight: 'monasheesExtendedMono',
    href: 'https://www.monashees.com'
  },
  {
    name: 'Qualcomm Ventures',
    logo: 'qualcommExtendedReversed',
    logoLight: 'qualcommExtendedMono',
    href: 'https://www.qualcommventures.com'
  }
]

const MARK = 'h-8 w-auto max-w-48 object-contain'

const investorMark = (investor) => `<img
  :src="${investor.logo}"
  alt="${investor.name}"
  decoding="async"
  class="${MARK} hidden [[data-theme=dark]_&]:block"
/>
<img
  :src="${investor.logoLight}"
  alt="${investor.name}"
  decoding="async"
  class="${MARK} block [[data-theme=dark]_&]:hidden"
/>`

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle kind="centered" eyebrow="${EYEBROW}" title="${TITLE}" />
  </template>

  <FrameBox flush borders="y" marks="bottom">
    <BentoGrid flush :columns="2" aria-label="${TITLE}">
${each(
  INVESTORS,
  (investor) => `<BentoGrid.Cell :padded="false">
  <a
    href="${investor.href}"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="${LINK_LABEL}, ${investor.name} (opens in a new tab)"
    class="group/investor relative isolate flex h-48 w-full items-center justify-center p-(--spacing-xl) before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset focus-visible:before:opacity-100 motion-reduce:before:transition-none"
  >
    <span
      class="flex items-center justify-center transition-[translate] duration-moderate-01 ease-productive-entrance group-hover/investor:-translate-y-(--spacing-sm) group-focus-visible/investor:-translate-y-(--spacing-sm) motion-reduce:transition-none"
    >
${indent(investorMark(investor), 3)}
    </span>
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-1/2 mt-(--spacing-md) flex translate-y-1 items-center justify-center gap-(--spacing-xxs) whitespace-nowrap text-overline-md uppercase text-(--text-default) opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-hover/investor:translate-y-0 group-hover/investor:opacity-100 group-focus-visible/investor:translate-y-0 group-focus-visible/investor:opacity-100 motion-reduce:transition-none"
    >
      ${LINK_LABEL}
      <i class="pi pi-arrow-up-right leading-none" />
    </span>
  </a>
</BentoGrid.Cell>`,
  3
)}
    </BentoGrid>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Social Proof/InvestorMarks',
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
  ...editable(() => ({ components, setup, template: TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'investor-marks',
  props: {
    eyebrow: EYEBROW,
    title: TITLE,
    linkLabel: LINK_LABEL,
    items: [
      {
        name: 'monashees+',
        logo: '/marketing-components/logos/monashees-extended-reversed.svg',
        logoLight: '/marketing-components/logos/monashees-extended-mono.svg',
        href: 'https://www.monashees.com'
      },
      {
        name: 'Qualcomm Ventures',
        logo: '/marketing-components/logos/qualcomm-extended-reversed.svg',
        logoLight: '/marketing-components/logos/qualcomm-extended-mono.svg',
        href: 'https://www.qualcommventures.com'
      }
    ]
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

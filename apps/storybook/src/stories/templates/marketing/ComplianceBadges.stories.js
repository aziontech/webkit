import ccpaSymbolColor from '@aziontech/webkit/assets/ccpa-symbol-color.svg'
import gdprSymbolColor from '@aziontech/webkit/assets/gdpr-symbol-color.svg'
import lgpdSymbolColor from '@aziontech/webkit/assets/lgpd-symbol-color.svg'
import pciDssSymbolColor from '@aziontech/webkit/assets/pci-dss-symbol-color.svg'
import socSymbolColor from '@aziontech/webkit/assets/soc-symbol-color.svg'
import CardGrid from '@aziontech/webkit/card-grid'
import MediaSplit from '@aziontech/webkit/media-split'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import ccpaSymbolColor from '@aziontech/webkit/assets/ccpa-symbol-color.svg'",
  "import gdprSymbolColor from '@aziontech/webkit/assets/gdpr-symbol-color.svg'",
  "import lgpdSymbolColor from '@aziontech/webkit/assets/lgpd-symbol-color.svg'",
  "import pciDssSymbolColor from '@aziontech/webkit/assets/pci-dss-symbol-color.svg'",
  "import socSymbolColor from '@aziontech/webkit/assets/soc-symbol-color.svg'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import MediaSplit from '@aziontech/webkit/media-split'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const components = {
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  MediaSplit,
  SectionContainer,
  SectionGap,
  SectionModule
}

const setup = () => ({
  ccpaSymbolColor,
  gdprSymbolColor,
  lgpdSymbolColor,
  pciDssSymbolColor,
  socSymbolColor
})

const CERTIFICATIONS = [
  { label: 'SOC 2 & 3', badge: 'socSymbolColor', alt: 'AICPA SOC 2 Type 2 and SOC 3 badge' },
  { label: 'PCI DSS', badge: 'pciDssSymbolColor', alt: 'PCI DSS badge' },
  { label: 'LGPD', badge: 'lgpdSymbolColor', alt: 'LGPD badge' },
  { label: 'GDPR', badge: 'gdprSymbolColor', alt: 'GDPR badge' },
  { label: 'CCPA', badge: 'ccpaSymbolColor', alt: 'CCPA badge' }
]

const badgeCell = (certification) => `<CardGrid.Cell
  kind="surface"
  :padded="false"
  role="listitem"
>
  <div
    class="flex h-full flex-col items-center justify-center gap-(--spacing-lg) px-(--spacing-sm) py-(--spacing-xl)"
  >
    <img
      :src="${certification.badge}"
      alt="${certification.alt}"
      loading="lazy"
      decoding="async"
      class="h-16 w-24 object-contain"
    />
    <span
      class="inline-flex h-7 items-center gap-(--spacing-xs) whitespace-nowrap rounded-full border border-(--border-muted) bg-(--bg-surface-raised) pr-(--spacing-sm) pl-(--spacing-xxs) text-overline-sm text-(--text-default)"
    >
      <span
        aria-hidden="true"
        class="flex size-5 shrink-0 items-center justify-center rounded-full bg-(--success-contrast) text-tag-sm text-(--success)"
      >
        <i class="pi pi-check text-[length:inherit] leading-none" />
      </span>
      ${certification.label}
    </span>
  </div>
</CardGrid.Cell>`

const SEE_MORE_CELL = `<CardGrid.Cell
  kind="surface"
  :padded="false"
  role="listitem"
>
  <a
    href="/compliance"
    class="group/more flex h-full items-center justify-center gap-(--spacing-xs) px-(--spacing-sm) py-(--spacing-xl) text-overline-md uppercase text-(--text-muted) transition-colors duration-moderate-02 ease-expressive-entrance hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:bg-(--bg-hover) focus-visible:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset focus-visible:outline-none motion-reduce:transition-none"
  >
    See more
    <i
      aria-hidden="true"
      class="pi pi-chevron-right shrink-0 text-[length:inherit] leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/more:translate-x-0.5 motion-reduce:transition-none"
    />
  </a>
</CardGrid.Cell>`

const complianceBadges = (certifications) =>
  inColumn(`<SectionModule
  :divided="false"
  :padded="false"
>
  <MediaSplit
    framed
    align="center"
    texture="none"
    size="large"
    eyebrow="Compliance"
    title="Meet Your Compliance Requirements"
    description="Azion's certifications help customers and global partners meet a wide range of compliance requirements."
  >
    <template #media>
      <CardGrid
        flush
        kind="frame"
        :columns="3"
        :mobile-columns="2"
        role="list"
        aria-label="Compliance certifications"
        class="w-full self-stretch"
      >
${each(certifications, badgeCell, 4)}

${indent(SEE_MORE_CELL, 4)}
      </CardGrid>
    </template>
  </MediaSplit>
</SectionModule>`)

const CERTIFICATIONS_TEMPLATE = complianceBadges(CERTIFICATIONS)

const meta = {
  title: 'Templates/Marketing/Social Proof/ComplianceBadges',
  excludeStories: ['SITE_SECTION'],
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

export const Default = {
  render: () => ({ components, setup, template: CERTIFICATIONS_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, CERTIFICATIONS_TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'compliance-badges',
  props: {
    eyebrow: 'Compliance',
    title: 'Meet Your Compliance Requirements',
    description: '',
    ariaLabel: 'Compliance certifications',
    certifications: [
      {
        label: 'SOC 2 Type 2 & 3',
        badge: '/assets/logos/clients/SOC-logo.svg',
        alt: 'AICPA SOC 2 Type 2 badge'
      },
      {
        label: 'PCI DSS',
        badge: '/assets/logos/clients/PCI-logo.svg',
        alt: 'PCI DSS badge'
      },
      {
        label: 'GDPR',
        badge: '/assets/logos/clients/GDPR-logo.svg',
        alt: 'GDPR'
      },
      {
        label: 'LGPD',
        badge: '/assets/logos/clients/LGPD-logo.png',
        alt: 'LGPD badge'
      }
    ],
    moreLink: {
      label: 'See more',
      href: '/en/compliance/'
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

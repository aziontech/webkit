<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import ComplianceBadges from '@aziontech/webkit/compliance-badges'
  import ccpaSymbolColor from '@aziontech/webkit/assets/ccpa-symbol-color.svg'
  import gdprSymbolColor from '@aziontech/webkit/assets/gdpr-symbol-color.svg'
  import lgpdSymbolColor from '@aziontech/webkit/assets/lgpd-symbol-color.svg'
  import pciDssSymbolColor from '@aziontech/webkit/assets/pci-dss-symbol-color.svg'
  import socSymbolColor from '@aziontech/webkit/assets/soc-symbol-color.svg'

  const certifications = [
    {
      label: 'SOC 2 & 3',
      badge: socSymbolColor,
      alt: 'AICPA SOC 2 Type 2 and SOC 3 badge'
    },
    {
      label: 'PCI DSS',
      badge: pciDssSymbolColor,
      alt: 'PCI DSS badge'
    },
    {
      label: 'LGPD',
      badge: lgpdSymbolColor,
      alt: 'LGPD badge'
    },
    {
      label: 'GDPR',
      badge: gdprSymbolColor,
      alt: 'GDPR badge'
    },
    {
      label: 'CCPA',
      badge: ccpaSymbolColor,
      alt: 'CCPA badge'
    }
  ]

  const primaryAction = {
    label: 'See more',
    href: '/compliance'
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ComplianceBadges
      eyebrow="Compliance"
      title="Meet your compliance requirements"
      description="Azion's certifications help customers and global partners meet a wide range of compliance requirements."
      aria-label="Compliance certifications"
      :certifications="certifications"
      :primary-action="primaryAction"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>

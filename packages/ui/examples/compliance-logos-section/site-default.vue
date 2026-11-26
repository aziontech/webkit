<script setup>
  import ccpaSymbolColor from '@aziontech/ui/assets/ccpa-symbol-color.svg'
  import gdprSymbolColor from '@aziontech/ui/assets/gdpr-symbol-color.svg'
  import lgpdSymbolColor from '@aziontech/ui/assets/lgpd-symbol-color.svg'
  import pciDssSymbolColor from '@aziontech/ui/assets/pci-dss-symbol-color.svg'
  import socSymbolColor from '@aziontech/ui/assets/soc-symbol-color.svg'
  import ComplianceLogosSection from '@aziontech/ui/compliance-logos-section'
  import Container from '@aziontech/ui/container'
  import Spacer from '@aziontech/ui/spacer'

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
  <Container max-width="site">
    <Spacer hatch />

    <ComplianceLogosSection
      eyebrow="Compliance"
      title="Meet your compliance requirements"
      description="Azion's certifications help customers and global partners meet a wide range of compliance requirements."
      aria-label="Compliance certifications"
      :certifications="certifications"
      :primary-action="primaryAction"
    />

    <Spacer hatch />
  </Container>
</template>

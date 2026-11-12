<script setup>
  import ccpaSymbolColor from '@aziontech/webkit/assets/ccpa-symbol-color.svg'
  import gdprSymbolColor from '@aziontech/webkit/assets/gdpr-symbol-color.svg'
  import lgpdSymbolColor from '@aziontech/webkit/assets/lgpd-symbol-color.svg'
  import pciDssSymbolColor from '@aziontech/webkit/assets/pci-dss-symbol-color.svg'
  import socSymbolColor from '@aziontech/webkit/assets/soc-symbol-color.svg'
  import ComplianceBadges from '@aziontech/webkit/compliance-badges'
</script>

<template>
  <ComplianceBadges
    eyebrow="Compliance"
    title="Meet your compliance requirements"
    description="Azion's certifications help customers and global partners meet a wide range of compliance requirements."
    aria-label="Compliance certifications"
    :certifications="[
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
    ]"
    :primary-action="{ label: 'See more', href: '/compliance' }"
  />
</template>

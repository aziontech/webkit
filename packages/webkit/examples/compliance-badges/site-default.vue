<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import ComplianceBadges from '@aziontech/webkit/compliance-badges'

  const certifications = [
    {
      label: 'SOC 2 & 3',
      badge: '/marketing-components/badges/soc.svg',
      alt: 'AICPA SOC 2 Type 2 and SOC 3 badge'
    },
    {
      label: 'PCI DSS',
      badge: '/marketing-components/badges/pci-dss.svg',
      alt: 'PCI DSS badge'
    },
    {
      label: 'LGPD',
      badge: '/marketing-components/badges/lgpd.svg',
      alt: 'LGPD badge'
    },
    {
      label: 'GDPR',
      badge: '/marketing-components/badges/gdpr.svg',
      alt: 'GDPR badge'
    },
    {
      label: 'CCPA',
      badge: '/marketing-components/badges/ccpa.svg',
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

<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import InvestorMarks from '@aziontech/webkit/investor-marks'

  const items = [
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
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <InvestorMarks
      eyebrow="Investors"
      title="Backed by visionary investors"
      link-label="Visit website"
      :items="items"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>

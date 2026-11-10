<script setup>
  import InvestorMarks from '@aziontech/webkit/investor-marks'
</script>

<template>
  <InvestorMarks
    eyebrow="Investors"
    title="Backed by visionary investors"
    link-label="Visit website"
    :items="[
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
    ]"
  />
</template>

<script setup>
  import InvestorMarks from '@aziontech/webkit/investor-marks'
  import monasheesExtendedMono from '@aziontech/webkit/assets/monashees-extended-mono.svg'
  import monasheesExtendedReversed from '@aziontech/webkit/assets/monashees-extended-reversed.svg'
  import qualcommExtendedMono from '@aziontech/webkit/assets/qualcomm-extended-mono.svg'
  import qualcommExtendedReversed from '@aziontech/webkit/assets/qualcomm-extended-reversed.svg'
</script>

<template>
  <InvestorMarks
    eyebrow="Investors"
    title="Backed by visionary investors"
    link-label="Visit website"
    :items="[
      {
        name: 'monashees+',
        logo: monasheesExtendedReversed,
        logoLight: monasheesExtendedMono,
        href: 'https://www.monashees.com'
      },
      {
        name: 'Qualcomm Ventures',
        logo: qualcommExtendedReversed,
        logoLight: qualcommExtendedMono,
        href: 'https://www.qualcommventures.com'
      }
    ]"
  />
</template>

<script setup>
  import monasheesExtendedMono from '@aziontech/ui/assets/monashees-extended-mono.svg'
  import monasheesExtendedReversed from '@aziontech/ui/assets/monashees-extended-reversed.svg'
  import qualcommExtendedMono from '@aziontech/ui/assets/qualcomm-extended-mono.svg'
  import qualcommExtendedReversed from '@aziontech/ui/assets/qualcomm-extended-reversed.svg'
  import InvestorMarksSection from '@aziontech/ui/investor-marks-section'
</script>

<template>
  <InvestorMarksSection
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

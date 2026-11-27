<script setup>
  import monasheesExtendedMono from '@aziontech/ui/assets/monashees-extended-mono.svg'
  import monasheesExtendedReversed from '@aziontech/ui/assets/monashees-extended-reversed.svg'
  import qualcommExtendedMono from '@aziontech/ui/assets/qualcomm-extended-mono.svg'
  import qualcommExtendedReversed from '@aziontech/ui/assets/qualcomm-extended-reversed.svg'
  import Container from '@aziontech/ui/container'
  import InvestorMarksSection from '@aziontech/ui/investor-marks-section'
  import Spacer from '@aziontech/ui/spacer'

  const items = [
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
  ]
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <InvestorMarksSection
      eyebrow="Investors"
      title="Backed by visionary investors"
      link-label="Visit website"
      :items="items"
    />

    <Spacer hatch />
  </Container>
</template>

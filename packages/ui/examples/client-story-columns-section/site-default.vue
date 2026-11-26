<script setup>
  import dafitiExtendedReversed from '@aziontech/ui/assets/dafiti-extended-reversed.svg'
  import madeiramadeiraExtendedReversed from '@aziontech/ui/assets/madeiramadeira-extended-reversed.svg'
  import magaluExtendedColor from '@aziontech/ui/assets/magalu-extended-color.svg'
  import ClientStoryColumnsSection from '@aziontech/ui/client-story-columns-section'
  import Container from '@aziontech/ui/container'
  import Spacer from '@aziontech/ui/spacer'

  const cells = [
    {
      name: 'Magalu',
      logo: magaluExtendedColor,
      href: 'https://www.azion.com/en/success-case/magalu/',
      story:
        "Explore how Magalu enhances cybersecurity with Azion's Firewall and WAF, improving threat intelligence and bot management in retail.",
      logoTreatment: 'monochrome'
    },
    {
      name: 'Dafiti',
      logo: dafitiExtendedReversed,
      href: 'https://www.azion.com/en/success-case/dafiti/',
      story:
        'Dafiti modernized its digital architecture to deliver faster, scalable, and resilient experiences for millions of consumers across Latin America.',
      logoTreatment: 'knockout'
    },
    {
      name: 'MadeiraMadeira',
      logo: madeiramadeiraExtendedReversed,
      href: 'https://www.azion.com/en/success-case/madeiramadeira/',
      story:
        'Faster product delivery and scalable infrastructure allowed MadeiraMadeira to support massive traffic growth during major e-commerce campaigns.',
      logoTreatment: 'monochrome'
    }
  ]
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <ClientStoryColumnsSection
      aria-label="Featured success stories"
      link-label="Read story"
      :cells="cells"
    />

    <Spacer hatch />
  </Container>
</template>

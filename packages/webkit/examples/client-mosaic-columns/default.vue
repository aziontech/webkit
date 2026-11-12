<script setup>
  import dafitiExtendedReversed from '@aziontech/webkit/assets/dafiti-extended-reversed.svg'
  import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'
  import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import ClientMosaicColumns from '@aziontech/webkit/client-mosaic-columns'
</script>

<template>
  <ClientMosaicColumns
    aria-label="Featured success stories"
    link-label="Read story"
    :cells="[
      {
        name: 'Magalu',
        logo: magaluExtendedColor,
        href: 'https://www.azion.com/en/success-case/magalu/',
        story:
          'Explore how Magalu enhances cybersecurity with Azion\'s Firewall and WAF, improving threat intelligence and bot management in retail.',
        logoTreatment: 'monochrome'
      },
      {
        name: 'Dafiti',
        logo: dafitiExtendedReversed,
        href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/',
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
    ]"
  />
</template>

<script setup>
  import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
  import americanasExtendedReversed from '@aziontech/webkit/assets/americanas-extended-reversed.svg'
  import arezzoExtendedReversed from '@aziontech/webkit/assets/arezzo-extended-reversed.svg'
  import ClientMosaicColumns from '@aziontech/webkit/client-mosaic-columns'

  const cells = [
    {
      name: 'Agibank',
      logo: agibankExtendedReversed,
      href: '/customers/agibank',
      story: 'Agibank moved its digital bank to a platform that scales with every campaign.'
    },
    {
      name: 'Americanas',
      logo: americanasExtendedReversed,
      href: '/customers/americanas',
      story: 'Americanas serves Black Friday traffic with no capacity planning.'
    },
    {
      name: 'Arezzo',
      logo: arezzoExtendedReversed,
      href: '/customers/arezzo',
      story: 'Arezzo cut image weight by half across its storefronts.'
    }
  ]
</script>

<template>
  <ClientMosaicColumns
    reveal="hover"
    :cells="cells"
  />
</template>

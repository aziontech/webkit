<script setup>
  import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
  import americanasExtendedReversed from '@aziontech/webkit/assets/americanas-extended-reversed.svg'
  import arezzoExtendedReversed from '@aziontech/webkit/assets/arezzo-extended-reversed.svg'
  import CustomerSpotlight from '@aziontech/webkit/customer-spotlight'

  const cards = [
    {
      name: 'Agibank',
      logo: agibankExtendedReversed,
      href: '/customers/agibank',
      description: 'Agibank moved its digital bank to a platform that scales with every campaign.'
    },
    {
      name: 'Americanas',
      logo: americanasExtendedReversed,
      href: '/customers/americanas',
      description: 'Americanas serves Black Friday traffic with no capacity planning.'
    },
    {
      name: 'Arezzo',
      logo: arezzoExtendedReversed,
      href: '/customers/arezzo',
      description: 'Arezzo cut image weight by half across its storefronts.'
    }
  ]
</script>

<template>
  <CustomerSpotlight :cards="cards" />
</template>

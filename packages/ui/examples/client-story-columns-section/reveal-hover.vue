<script setup>
  import agibankExtendedReversed from '@aziontech/ui/assets/agibank-extended-reversed.svg'
  import americanasExtendedReversed from '@aziontech/ui/assets/americanas-extended-reversed.svg'
  import arezzoExtendedReversed from '@aziontech/ui/assets/arezzo-extended-reversed.svg'
  import ClientStoryColumnsSection from '@aziontech/ui/client-story-columns-section'

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
  <ClientStoryColumnsSection
    reveal="hover"
    :cells="cells"
  />
</template>

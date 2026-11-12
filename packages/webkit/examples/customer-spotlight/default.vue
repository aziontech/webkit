<script setup>
  import CustomerSpotlight from '@aziontech/webkit/customer-spotlight'

  const cards = [
    {
      name: 'Agibank',
      logo: '/marketing-components/logos/agibank-extended-reversed.svg',
      href: '/customers/agibank',
      description: 'Agibank moved its digital bank to a platform that scales with every campaign.',
      brand: { base: '#0e89ff', glow: '#0e89ff' }
    },
    {
      name: 'Americanas',
      logo: '/marketing-components/logos/americanas-extended-reversed.svg',
      href: '/customers/americanas',
      description: 'Americanas serves Black Friday traffic with no capacity planning.',
      brand: { base: '#e60014', glow: '#ff4d5e' }
    },
    {
      name: 'Arezzo',
      logo: '/marketing-components/logos/arezzo-extended-reversed.svg',
      href: '/customers/arezzo',
      description: 'Arezzo cut image weight by half across its storefronts.',
      brand: { base: '#2b2b2b', glow: '#6b6b6b' }
    }
  ]
</script>

<template>
  <CustomerSpotlight :cards="cards" />
</template>

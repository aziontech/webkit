<script setup>
  import CapabilityGridSection from '@aziontech/ui/capability-grid-section'

  const items = [
    {
      icon: 'az az-check',
      title: 'Grow with Azion',
      description: 'Offer a platform your customers already trust, with pricing built for resale.'
    },
    {
      icon: 'az az-check',
      title: 'Get certified',
      description: 'Train your team on the platform and earn the certifications your projects need.'
    },
    {
      icon: 'az az-check',
      title: 'Sell together',
      description:
        'Work joint accounts with our sales engineers, from the first call to production.'
    }
  ]
</script>

<template>
  <CapabilityGridSection
    title-align="start"
    title="Why you should be a partner"
    description="Build, sell and deliver modern applications with the Azion team beside you."
    :items="items"
  />
</template>

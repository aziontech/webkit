<script setup>
  import CapabilityGrid from '@aziontech/webkit/capability-grid'

  const items = [
    {
      icon: 'ai ai-check',
      title: 'Grow with Azion',
      description: 'Offer a platform your customers already trust, with pricing built for resale.'
    },
    {
      icon: 'ai ai-check',
      title: 'Get certified',
      description: 'Train your team on the platform and earn the certifications your projects need.'
    },
    {
      icon: 'ai ai-check',
      title: 'Sell together',
      description:
        'Work joint accounts with our sales engineers, from the first call to production.'
    }
  ]
</script>

<template>
  <CapabilityGrid
    title-variant="start"
    title="Why you should be a partner"
    description="Build, sell and deliver modern applications with the Azion team beside you."
    :items="items"
  />
</template>

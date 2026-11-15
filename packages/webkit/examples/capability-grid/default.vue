<script setup>
  import CapabilityGrid from '@aziontech/webkit/capability-grid'

  const items = [
    {
      icon: 'ai ai-bolt',
      title: 'Functions',
      description: 'Run JavaScript and WebAssembly close to every user.'
    },
    {
      icon: 'ai ai-database',
      title: 'Object Storage',
      description: 'Keep files where they are read, with no egress to plan for.'
    },
    {
      icon: 'ai ai-shield',
      title: 'Firewall',
      description: 'Stop bots and attacks before they reach your origin.'
    }
  ]
</script>

<template>
  <CapabilityGrid
    eyebrow="Platform"
    title="Everything an application needs, in one place"
    description="Compute, storage and security that deploy together."
    :items="items"
    :primary-action="{ label: 'Explore the platform', href: '/platform', trailing: true }"
  />
</template>

<script setup>
  import CapabilityGridSection from '@aziontech/ui/capability-grid-section'

  const items = [
    {
      icon: 'az az-bolt',
      title: 'Functions',
      description: 'Run JavaScript and WebAssembly close to every user.'
    },
    {
      icon: 'az az-database',
      title: 'Object Storage',
      description: 'Keep files where they are read, with no egress to plan for.'
    },
    {
      icon: 'az az-shield',
      title: 'Firewall',
      description: 'Stop bots and attacks before they reach your origin.'
    }
  ]
</script>

<template>
  <CapabilityGridSection
    eyebrow="Platform"
    title="Everything an application needs, in one place"
    description="Compute, storage and security that deploy together."
    :items="items"
    :primary-action="{ label: 'Explore the platform', href: '/platform', trailing: true }"
  />
</template>

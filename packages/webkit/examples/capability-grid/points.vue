<script setup>
  import CapabilityGrid from '@aziontech/webkit/capability-grid'

  const items = [
    {
      icon: 'ai ai-globe',
      title: 'Global network',
      description: 'Traffic lands on the nearest location.',
      points: ['Anycast routing', 'Automatic failover']
    },
    {
      icon: 'ai ai-lock',
      title: 'Certificates',
      description: 'TLS for every domain, renewed for you.',
      points: ['Managed certificates', 'Bring your own']
    },
    {
      icon: 'ai ai-chart-line',
      title: 'Observability',
      description: 'Metrics and logs in seconds.',
      points: ['Real-time metrics', 'Log streaming']
    },
    {
      icon: 'ai ai-sitemap',
      title: 'Load balancing',
      description: 'Spread requests across origins.',
      points: ['Health checks', 'Weighted pools']
    }
  ]
</script>

<template>
  <CapabilityGrid
    title="Built for production"
    :items="items"
    :columns="4"
  />
</template>

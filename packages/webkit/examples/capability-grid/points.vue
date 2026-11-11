<script setup>
  import CapabilityGrid from '@aziontech/webkit/capability-grid'

  const items = [
    {
      icon: 'pi pi-globe',
      title: 'Global network',
      description: 'Traffic lands on the nearest location.',
      points: ['Anycast routing', 'Automatic failover']
    },
    {
      icon: 'pi pi-lock',
      title: 'Certificates',
      description: 'TLS for every domain, renewed for you.',
      points: ['Managed certificates', 'Bring your own']
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Observability',
      description: 'Metrics and logs in seconds.',
      points: ['Real-time metrics', 'Log streaming']
    },
    {
      icon: 'pi pi-sitemap',
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

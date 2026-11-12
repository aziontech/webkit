<script setup>
  import CardCarousel from '@aziontech/webkit/card-carousel'

  const items = [
    {
      title: 'E-commerce and retail platforms',
      description:
        'Handle peak shopping events and flash sales without downtime. Distribute traffic across multiple origins to keep checkout fast.'
    },
    {
      title: 'Media streaming and content delivery',
      description:
        'Deliver video and audio with low latency and high availability, balancing traffic across CDN origins and streaming servers.'
    },
    {
      title: 'Financial services and banking',
      description:
        'Keep transaction processing reliable with automated failover, distributing API traffic across multiple data centers.'
    },
    {
      title: 'SaaS and API platforms',
      description:
        'Spread tenant traffic across regions and origins, and route around an unhealthy origin before customers notice.'
    },
    {
      title: 'Gaming and interactive applications',
      description:
        'Hold sessions on the same origin with persistence, while the rest of the traffic scales out across healthy servers.'
    }
  ]
</script>

<template>
  <CardCarousel
    eyebrow="Industries"
    title="Optimize traffic distribution across industries"
    :items="items"
  />
</template>

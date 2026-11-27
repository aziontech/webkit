<script setup>
  import FlowDiagram from '@aziontech/ui/flow-diagram-root'
  import { ref } from 'vue'

  const nodes = [
    {
      id: 'client',
      eyebrow: 'Client',
      icon: 'az az-user',
      title: 'Browsers',
      description: 'United States',
      metrics: [{ label: 'Requests', value: '1.2k/s' }]
    },
    {
      id: 'edge',
      eyebrow: 'Application',
      icon: 'az az-globe',
      title: 'shop.example.com',
      href: '#application',
      description: 'San Francisco, US',
      status: 'Healthy',
      severity: 'success',
      metrics: [
        { label: 'p95', value: '38 ms' },
        { label: 'Hit ratio', value: '91%' }
      ],
      fields: [
        { label: 'ID', value: '1482736015', copyable: true },
        { label: 'Domain', value: 'shop.example.com', href: 'https://shop.example.com' }
      ]
    },
    {
      id: 'function',
      eyebrow: 'Function',
      icon: 'az az-functions',
      title: 'checkout-router',
      status: 'Running',
      severity: 'success',
      metrics: [
        { label: 'p95', value: '12 ms' },
        { label: 'Errors', value: '0.1%' }
      ]
    },
    {
      id: 'cache',
      eyebrow: 'Cache',
      icon: 'az az-cache',
      title: 'static-assets',
      status: 'Warming',
      severity: 'warning',
      metrics: [{ label: 'Hit ratio', value: '64%' }],
      message: 'The cache refills after the deploy of 10:42 UTC.'
    },
    {
      id: 'origin',
      eyebrow: 'Origin',
      icon: 'az az-server',
      title: 'api.example.com',
      description: 'Ashburn, US',
      status: 'Degraded',
      severity: 'danger',
      metrics: [
        { label: 'p95', value: '840 ms' },
        { label: '5xx', value: '4.2%' }
      ]
    }
  ]

  const edges = [
    { from: 'client', to: 'edge', label: '6 ms' },
    { from: 'edge', to: 'function', label: '2 ms' },
    { from: 'edge', to: 'cache', label: '1 ms' },
    { from: 'function', to: 'origin', label: '840 ms', severity: 'danger' },
    { from: 'cache', to: 'origin', label: '96 ms' }
  ]

  const openKeys = ref([])
</script>

<template>
  <FlowDiagram
    v-model:open-keys="openKeys"
    :nodes="nodes"
    :edges="edges"
    aria-label="Request path of shop.example.com"
  />
</template>

<script setup>
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'

  const levels = [
    {
      id: 'domain',
      nodes: [
        {
          id: 'domain',
          type: 'Domain',
          icon: 'az az-globe',
          name: 'shop.example.com',
          status: 'Active',
          severity: 'success',
          message: 'Visitors reach the store at this address.'
        }
      ]
    },
    {
      id: 'firewall',
      nodes: [
        {
          id: 'firewall',
          type: 'Firewall',
          icon: 'az az-shield',
          name: 'store-firewall',
          status: 'Active',
          severity: 'success',
          message: 'Inspects every request before it reaches the application.'
        }
      ]
    },
    {
      id: 'application',
      nodes: [
        {
          id: 'application',
          type: 'Application',
          icon: 'az az-applications',
          name: 'acme-store',
          status: 'Degraded',
          severity: 'warning',
          message: 'One in ten requests answers slower than usual.',
          terminal: true
        }
      ]
    }
  ]
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-lg)">
    <TopologyDiagram
      :levels="levels"
      aria-label="Request path, side by side"
    />
    <div class="w-full max-w-(--container-xs)">
      <TopologyDiagram
        :levels="levels"
        orientation="vertical"
        aria-label="Request path, stacked"
      />
    </div>
  </div>
</template>

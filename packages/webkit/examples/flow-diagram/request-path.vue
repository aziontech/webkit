<script setup>
  import FlowDiagram from '@aziontech/webkit/flow-diagram-root'

  const nodes = [
    {
      id: 'you',
      title: 'You',
      description: 'Browser',
      status: 'Working',
      severity: 'success'
    },
    {
      id: 'edge',
      title: 'Azion edge',
      description: 'San Francisco, US',
      status: 'Working',
      severity: 'success'
    },
    {
      id: 'origin',
      title: 'Origin',
      description: 'api.example.com',
      status: 'Error',
      severity: 'danger'
    }
  ]

  const edges = [
    { from: 'you', to: 'edge', label: '18 ms' },
    { from: 'edge', to: 'origin', label: '502', severity: 'danger' }
  ]
</script>

<template>
  <FlowDiagram
    :nodes="nodes"
    :edges="edges"
    uniform
    aria-label="Request path"
  />
</template>

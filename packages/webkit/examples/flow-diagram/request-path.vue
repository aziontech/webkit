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
      id: 'azion',
      title: 'Azion',
      description: 'San Francisco, US',
      status: 'Working',
      severity: 'success'
    },
    {
      id: 'application',
      title: 'Application',
      description: 'api.example.com',
      status: 'Error',
      severity: 'danger'
    }
  ]

  const edges = [
    { from: 'you', to: 'azion', label: '18 ms' },
    { from: 'azion', to: 'application', label: '502', severity: 'danger' }
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

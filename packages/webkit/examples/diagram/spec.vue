<script setup>
  import Diagram from '@aziontech/webkit/diagram'

  const spec = {
    nodes: [
      {
        key: 'user',
        type: 'pill',
        title: 'User',
        icon: 'ai ai-user',
        active: true
      },
      {
        key: 'routing',
        type: 'card',
        eyebrow: 'Routing',
        title: 'Nearest data center',
        icon: 'ai ai-directions',
        active: true
      },
      {
        key: 'workload',
        type: 'card',
        eyebrow: 'Workload',
        title: 'shop.example.com',
        icon: 'ai ai-workloads',
        status: {
          label: 'Live',
          severity: 'success'
        },
        active: true,
        lit: true
      },
      {
        key: 'cache',
        type: 'item',
        eyebrow: 'Cache',
        title: 'Served from cache',
        icon: 'ai ai-tiered-cache',
        active: true
      },
      {
        key: 'origin',
        type: 'item',
        eyebrow: 'Origin',
        title: 'origin.example.com',
        icon: 'ai ai-database'
      }
    ],
    layout: {
      gap: 'wide',
      row: [
        {
          node: 'user'
        },
        {
          node: 'routing'
        },
        {
          node: 'workload'
        },
        {
          branches: [
            {
              node: 'cache'
            },
            {
              node: 'origin'
            }
          ]
        }
      ]
    },
    edges: [
      {
        from: 'user',
        to: 'routing',
        active: true
      },
      {
        from: 'routing',
        to: 'workload',
        active: true
      },
      {
        from: 'workload',
        to: 'cache',
        label: 'hit',
        active: true
      },
      {
        from: 'workload',
        to: 'origin',
        label: 'miss'
      }
    ]
  }
</script>

<template>
  <Diagram
    :spec="spec"
    aria-label="A user request is routed to the nearest data center and reaches the workload, which serves it from cache on a hit and from the origin on a miss."
  />
</template>

<script setup>
  import Diagram from '@aziontech/webkit/diagram'

  const spec = {
    nodes: [
      {
        key: 'app',
        kind: 'app',
        title: 'App'
      },
      {
        key: 'user',
        kind: 'pill',
        title: 'User',
        icon: 'pi pi-user',
        active: true
      },
      {
        key: 'gateway',
        kind: 'card',
        eyebrow: 'AI Gateway',
        title: 'Route by cost',
        icon: 'ai ai-gateway',
        status: {
          label: 'On',
          severity: 'success'
        },
        active: true,
        lit: true
      },
      {
        key: 'model',
        kind: 'item',
        eyebrow: 'provider · general',
        title: 'General model',
        icon: 'pi pi-sparkles',
        status: {
          label: 'Primary',
          severity: 'info'
        },
        active: true
      },
      {
        key: 'cache',
        kind: 'tile',
        title: 'Response cache',
        icon: 'ai ai-tiered-cache'
      }
    ],
    layout: {
      gap: 'wide',
      row: [
        {
          node: 'app'
        },
        {
          node: 'user'
        },
        {
          node: 'gateway'
        },
        {
          branches: [
            {
              node: 'model'
            },
            {
              node: 'cache'
            }
          ]
        }
      ]
    },
    edges: [
      {
        from: 'user',
        to: 'gateway',
        label: 'prompt',
        active: true
      },
      {
        from: 'gateway',
        to: 'model',
        label: 'route',
        active: true
      },
      {
        from: 'gateway',
        to: 'cache',
        label: 'hit'
      }
    ]
  }
</script>

<template>
  <Diagram
    :spec="spec"
    aria-label="An app sends a prompt to the AI Gateway, which routes it to the general model or answers from the response cache."
  />
</template>

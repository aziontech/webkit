<script setup>
  import Diagram from '@aziontech/webkit/diagram'

  const spec = {
    nodes: [
      {
        key: 'app',
        type: 'app',
        title: 'App'
      },
      {
        key: 'user',
        type: 'pill',
        title: 'User',
        icon: 'az az-user',
        active: true
      },
      {
        key: 'gateway',
        type: 'card',
        eyebrow: 'AI Gateway',
        title: 'Route by cost',
        icon: 'az az-ai-gateway',
        status: {
          label: 'On',
          severity: 'success'
        },
        active: true,
        lit: true
      },
      {
        key: 'model',
        type: 'item',
        eyebrow: 'provider · general',
        title: 'General model',
        icon: 'az az-sparkles',
        status: {
          label: 'Primary',
          severity: 'info'
        },
        active: true
      },
      {
        key: 'cache',
        type: 'tile',
        title: 'Response cache',
        icon: 'az az-tiered-cache'
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

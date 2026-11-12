<script setup>
  import Diagram from '@aziontech/webkit/diagram'

  const spec = {
    nodes: [
      {
        key: 'user',
        kind: 'pill',
        title: 'User',
        icon: 'pi pi-user',
        active: true
      },
      {
        key: 'functions',
        kind: 'tile',
        title: 'Functions',
        icon: 'ai ai-edge-functions',
        lit: true
      },
      {
        key: 'cache',
        kind: 'tile',
        title: 'Cache',
        icon: 'ai ai-tiered-cache'
      },
      {
        key: 'firewall',
        kind: 'tile',
        title: 'Firewall',
        icon: 'ai ai-edge-firewall'
      },
      {
        key: 'storage',
        kind: 'tile',
        title: 'Object Storage',
        icon: 'ai ai-edge-storage'
      },
      {
        key: 'origin',
        kind: 'item',
        eyebrow: 'Origin',
        title: 'origin.example.com',
        icon: 'pi pi-database'
      }
    ],
    layout: {
      gap: 'wide',
      row: [
        {
          node: 'user'
        },
        {
          group: 'platform',
          label: 'Azion',
          content: {
            grid: [
              {
                node: 'functions'
              },
              {
                node: 'cache'
              },
              {
                node: 'firewall'
              },
              {
                node: 'storage'
              }
            ]
          }
        },
        {
          group: 'backend',
          label: 'Your backend',
          kind: 'dashed',
          fill: 'secondary',
          content: {
            node: 'origin'
          }
        }
      ]
    },
    edges: [
      {
        from: 'user',
        to: 'platform',
        active: true
      },
      {
        from: 'platform',
        to: 'backend',
        label: 'miss'
      }
    ]
  }
</script>

<template>
  <Diagram
    :spec="spec"
    aria-label="A user request enters the Azion platform, where functions, cache, firewall and storage run, and reaches your backend on a cache miss."
  />
</template>

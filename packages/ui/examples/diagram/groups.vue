<script setup>
  import Diagram from '@aziontech/webkit/diagram'

  const spec = {
    nodes: [
      {
        key: 'user',
        type: 'pill',
        title: 'User',
        icon: 'az az-user',
        active: true
      },
      {
        key: 'functions',
        type: 'tile',
        title: 'Functions',
        icon: 'az az-functions',
        lit: true
      },
      {
        key: 'cache',
        type: 'tile',
        title: 'Cache',
        icon: 'az az-cache'
      },
      {
        key: 'firewall',
        type: 'tile',
        title: 'Firewall',
        icon: 'az az-firewall'
      },
      {
        key: 'storage',
        type: 'tile',
        title: 'Object Storage',
        icon: 'az az-object-storage'
      },
      {
        key: 'origin',
        type: 'item',
        eyebrow: 'Origin',
        title: 'origin.example.com',
        icon: 'az az-database'
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
          variant: 'dashed',
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

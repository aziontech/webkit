<script setup>
  import Trace from '@aziontech/webkit/trace'
  import { ref } from 'vue'

  const spans = [
    { id: 'root', name: 'GET /checkout', service: 'Function', start: 0, duration: 520 },
    {
      id: 'auth',
      parentId: 'root',
      name: 'verify-session',
      service: 'Auth',
      start: 8,
      duration: 52
    },
    {
      id: 'recommendations',
      parentId: 'root',
      name: 'fetch-recommendations',
      service: 'Network',
      start: 20,
      duration: 380
    },
    {
      id: 'cart',
      parentId: 'root',
      name: 'fetch-cart',
      service: 'Network',
      start: 64,
      duration: 236
    },
    {
      id: 'cart-query',
      parentId: 'cart',
      name: 'sql carts',
      service: 'SQL Database',
      start: 70,
      duration: 210
    },
    {
      id: 'prices',
      parentId: 'root',
      name: 'fetch-prices',
      service: 'Network',
      start: 64,
      duration: 356
    },
    {
      id: 'prices-cache',
      parentId: 'prices',
      name: 'cache-lookup',
      service: 'Cache',
      start: 66,
      duration: 14,
      attributes: { 'cache.status': 'MISS' }
    },
    {
      id: 'prices-origin',
      parentId: 'prices',
      name: 'origin prices-api',
      service: 'Network',
      start: 82,
      duration: 328,
      attributes: { 'http.method': 'GET', 'http.status_code': 200 }
    },
    { id: 'render', parentId: 'root', name: 'render', service: 'Compute', start: 425, duration: 85 }
  ]

  const selected = ref('prices')
  const view = ref('timeline')
</script>

<template>
  <Trace
    v-model:selected-key="selected"
    v-model:view="view"
    :spans="spans"
    highlight-critical-path
    aria-label="Trace of GET /checkout"
  />
</template>

<script setup>
  import Trace from '@aziontech/webkit/trace'
  import { ref } from 'vue'

  const spans = [
    { id: 'root', name: 'checkout-handler', service: 'Function', start: 0, duration: 268 },
    {
      id: 'session',
      parentId: 'root',
      name: 'read-session',
      service: 'Storage',
      start: 6,
      duration: 22,
      attributes: { 'kv.namespace': 'sessions', 'kv.hit': 'true' }
    },
    {
      id: 'price',
      parentId: 'root',
      name: 'price-cart',
      service: 'Compute',
      start: 30,
      duration: 64
    },
    {
      id: 'payments',
      parentId: 'root',
      name: 'call-payments',
      service: 'Network',
      start: 96,
      duration: 158,
      attributes: {
        'http.method': 'POST',
        'http.url': 'https://payments.example.com/v2/charges',
        'http.status_code': 201,
        'net.peer.region': 'sa-east'
      }
    }
  ]

  const selected = ref('payments')
</script>

<template>
  <Trace
    v-model:selected="selected"
    :spans="spans"
    aria-label="Trace of the checkout run"
  />
</template>

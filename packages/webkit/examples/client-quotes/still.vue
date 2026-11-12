<script setup>
  import ClientQuotes from '@aziontech/webkit/client-quotes'
  import { ref } from 'vue'

  const selected = ref(1)

  const items = [
    {
      mark: 'dafiti',
      clientName: 'Dafiti',
      text: "One of the best CDN and WAF solutions I've ever used. Easy to implement and integrate, with speed and low latency that make a real difference for our customers.",
      name: 'Julian H',
      jobTitle: 'IT OPS, SRE & SEC Manager at Dafiti Group'
    },
    {
      mark: 'axur',
      text: 'With Azion, we scale proprietary AI models without managing infrastructure—inspecting millions of websites daily and automating the market’s fastest threat takedown.',
      name: 'Fabio Ramos',
      jobTitle: 'CEO at Axur'
    },
    {
      mark: 'contabilizei',
      text: 'With Azion, Contabilizei improved request delivery at the Edge, reduced infrastructure costs, and gained fast access to support whenever needed.',
      name: 'Fabrício Santos',
      jobTitle: 'DevSecOps Manager at Contabilizei'
    }
  ]
</script>

<template>
  <ClientQuotes
    v-model="selected"
    aria-label="Client stories"
    :items="items"
    :autoplay="false"
    :primary-action="{ label: 'See customer stories', href: '#', trailing: true }"
  />
</template>

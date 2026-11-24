<script setup>
  import Faq from '@aziontech/webkit/faq'
  import Link from '@aziontech/webkit/link'

  const items = [
    {
      value: 'limits',
      question: 'What are the request limits?',
      answer: 'Each plan has its own limits.'
    },
    {
      value: 'status',
      question: 'Where can I see the platform status?',
      answer: 'On the status page.'
    }
  ]

  const links = {
    limits: { label: 'Read the limits for every plan', href: 'https://example.com/docs/limits' },
    status: { label: 'Open the status page', href: 'https://status.example.com' }
  }
</script>

<template>
  <Faq
    title="Frequently asked questions"
    :items="items"
  >
    <template #answer="{ item }">
      {{ item.answer }}
      <Link
        inline
        :href="links[item.value].href"
        >{{ links[item.value].label }}</Link
      >
    </template>
  </Faq>
</template>

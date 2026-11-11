<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  import CardIndex from '../components/CardIndex.vue'
  import { FOUNDATIONS } from '../lib/foundations'
  import { messages } from '../lib/i18n'

  const t = messages
  useHead({ title: 'Foundations — WebKit' })

  const groups = [
    {
      label: 'WebKit',
      items: FOUNDATIONS.map((page) => ({
        title: page.title,
        to: `/foundations/${page.slug}`,
        text: page.summary
      }))
    }
  ]
</script>

<template>
  <CardIndex
    :title="t.foundations"
    description="Tokens, languages, direction, layout and accessibility: what every component is built on."
    :groups="groups"
  />
</template>

<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'

  import CardIndex from '../components/CardIndex.vue'
  import { index } from '../lib/data'
  import { messages } from '../lib/i18n'
  import { componentGroups } from '../lib/nav'

  const t = messages
  useHead({ title: 'Components — WebKit' })

  const groups = computed(() =>
    componentGroups().map((group) => ({
      label: group.label,
      items: group.items.map((item) => ({
        title: item.label,
        to: item.to,
        text:
          index.components.find((entry) => `/components/${entry.name}` === item.to)?.purpose ?? ''
      }))
    }))
  )
</script>

<template>
  <CardIndex
    :title="t.components"
    :description="`${index.components.length} components, each with its examples, API and guidelines.`"
    :groups="groups"
  />
</template>

<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'

  import CardIndex from '../components/CardIndex.vue'
  import { index } from '../lib/data'
  import { messages } from '../lib/i18n'
  import { blockGroups } from '../lib/nav'

  const t = messages
  useHead({ title: 'Blocks — WebKit' })

  const groups = computed(() =>
    blockGroups().map((group) => ({
      label: group.label,
      items: group.items.map((item) => ({
        title: item.label,
        to: item.to,
        text: index.blocks.find((block) => `/blocks/${block.id}` === item.to)?.summary ?? ''
      }))
    }))
  )
</script>

<template>
  <CardIndex
    :title="t.blocks"
    :description="`${index.blocks.length} screens and fragments, each with its states, code and guidelines. Copy one with npx @aziontech/webkit add <id>.`"
    :groups="groups"
  />
</template>

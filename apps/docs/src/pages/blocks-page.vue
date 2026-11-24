<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'

  import CardIndex from '../components/card-index.vue'
  import { index } from '../lib/data'
  import { messages } from '../lib/i18n'
  import { blockGroups } from '../lib/nav'

  const t = messages
  useHead({ title: 'Blocks — WebKit' })

  const MAX_WORDS = 18

  function cardPurpose(summary: string): string {
    const lead = summary.split(/:\s/)[0] ?? summary
    const text = lead.split(/\s+/).length >= 2 ? lead.replace(/[.:]$/, '') : summary
    const words = text.split(/\s+/)
    return words.length > MAX_WORDS ? `${words.slice(0, MAX_WORDS).join(' ')}…` : text
  }

  const groups = computed(() =>
    blockGroups().map((group) => ({
      label: group.label,
      items: group.items.map((item) => ({
        title: item.label,
        to: item.to,
        preview: item.preview === true,
        text: cardPurpose(
          index.blocks.find((block) => `/blocks/${block.id}` === item.to)?.summary ?? ''
        )
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

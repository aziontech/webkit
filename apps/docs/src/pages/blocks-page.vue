<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'

  import CardIndex from '../components/card-index.vue'
  import { blockThumbnailFile } from '../lib/block-thumbnails'
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

  const thumbnail = (id: string) => ({
    light: `${import.meta.env.BASE_URL}${blockThumbnailFile(id, 'light')}`,
    dark: `${import.meta.env.BASE_URL}${blockThumbnailFile(id, 'dark')}`
  })

  const groups = computed(() =>
    blockGroups().map((group) => ({
      label: group.label,
      items: group.items.map((item) => {
        const block = index.blocks.find((entry) => `/blocks/${entry.id}` === item.to)
        return {
          title: item.label,
          to: item.to,
          preview: item.preview === true,
          text: cardPurpose(block?.summary ?? ''),
          image: block ? thumbnail(block.id) : undefined
        }
      })
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

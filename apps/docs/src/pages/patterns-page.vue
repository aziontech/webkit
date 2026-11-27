<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { computed } from 'vue'

  import CardIndex from '../components/card-index.vue'
  import { messages } from '../lib/i18n'
  import { PATTERN_GROUPS, PATTERNS } from '../lib/patterns'

  const t = messages
  useHead({ title: 'Patterns — Brand' })

  const groups = computed(() =>
    PATTERN_GROUPS.map((group) => ({
      label: t.value.patternGroups[group],
      items: PATTERNS.filter((page) => page.group === group).map((page) => ({
        title: page.title,
        to: `/patterns/${page.slug}`,
        text: page.summary
      }))
    }))
  )
</script>

<template>
  <CardIndex
    :title="t.patterns"
    :description="t.patternsLead"
    :groups="groups"
  />
</template>

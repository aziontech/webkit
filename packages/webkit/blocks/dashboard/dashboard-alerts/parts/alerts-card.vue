<script setup lang="ts">
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'

  export interface AlertsCardProps {
    /** Columns of the 12-column grid the card spans. */
    span: number
    /** The card title. */
    title: string
    /** One sentence on what the card shows. */
    hint: string
    /** The region name the danger alert reads. */
    region: string
    /** Why the period could not load; empty shows the content. */
    error?: string
  }

  withDefaults(defineProps<AlertsCardProps>(), { error: '' })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <ChartCard :span="span">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>{{ title }}</ChartCard.Title>
        <Hint :content="hint" />
      </span>
    </ChartCard.Header>
    <ChartCard.Content>
      <p
        v-if="error"
        class="text-body-sm text-(--text-muted)"
      >
        Not available.
      </p>
      <slot v-else />
    </ChartCard.Content>
  </ChartCard>
</template>

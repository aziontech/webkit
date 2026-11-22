<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
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

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

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
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load ${region}. ${error}`"
        action-label="Retry"
        @action="(event: MouseEvent) => emit('retry', event)"
      />
      <slot v-else />
    </ChartCard.Content>
  </ChartCard>
</template>

<script setup lang="ts">
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import { type ChartColor } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'

  export interface ActorBarCardProps {
    /** The card title. */
    title: string
    /** One sentence on what the bars count. */
    hint: string
    /** The bars, largest first. */
    items: BarListItem[]
    /** Writes a bar value. */
    formatValue: (value: number) => string
    /** Hue of the bars. */
    color?: ChartColor
    /** Title of the empty state. */
    emptyTitle: string
    /** Accessible name of the list. */
    listLabel: string
  }

  withDefaults(defineProps<ActorBarCardProps>(), { color: 1 })
</script>

<template>
  <ChartCard :span="4">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 flex-1 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>{{ title }}</ChartCard.Title>
        <Hint :content="hint" />
      </span>
    </ChartCard.Header>
    <ChartCard.Content>
      <BarList
        :items="items"
        :format-value="formatValue"
        :color="color"
        :empty-title="emptyTitle"
        :aria-label="listLabel"
      />
    </ChartCard.Content>
  </ChartCard>
</template>

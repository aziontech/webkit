<script setup lang="ts">
  import { computed } from 'vue'

  import type { Row } from '../lib/types'
  import RawHtml from './raw-html.vue'

  type Column = { key: string; label: string; code?: boolean; html?: boolean }

  const props = defineProps<{
    columns: Column[]
    rows: Row[]
    caption: string
  }>()

  const nameColumn = computed(() => props.columns[0])
  const detailColumns = computed(() => props.columns.slice(1).filter((column) => !column.html))
  const textColumn = computed(() => props.columns.find((column) => column.html))

  const value = (row: Row, key: string) => row[key] || '—'
</script>

<template>
  <dl
    class="flex min-w-0 flex-col rounded-(--shape-card) border border-(--border-default)"
    :aria-label="caption"
  >
    <div
      v-for="row in rows"
      :key="row[columns[0].key]"
      class="flex min-w-0 flex-col gap-(--spacing-2xs) px-(--spacing-sm) py-(--spacing-xs) not-last:border-b not-last:border-(--border-default) md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:content-start md:gap-x-(--spacing-md)"
    >
      <dt class="min-w-0 md:col-start-1">
        <code class="text-label-code-sm break-words text-(--text-default)">{{
          value(row, nameColumn.key)
        }}</code>
      </dt>
      <dd
        v-for="column in detailColumns"
        :key="column.key"
        class="flex min-w-0 flex-wrap items-baseline gap-x-(--spacing-xs) md:col-start-1"
      >
        <span class="text-body-xs text-(--text-muted)">{{ column.label }}</span>
        <code class="min-w-0 text-label-code-sm break-words text-(--text-muted)">{{
          value(row, column.key)
        }}</code>
      </dd>
      <dd
        v-if="textColumn"
        class="min-w-0 text-body-sm text-(--text-default) md:col-start-2 md:row-span-3 md:row-start-1"
      >
        <RawHtml :html="value(row, textColumn.key)" />
      </dd>
    </div>
  </dl>
</template>

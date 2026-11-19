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
  <div class="min-w-0">
    <div
      class="hidden overflow-x-auto rounded-(--shape-card) border border-(--border-default) md:block"
    >
      <table class="w-full table-auto border-collapse text-start">
        <caption class="sr-only">
          {{
            caption
          }}
        </caption>
        <thead class="bg-(--bg-surface)">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-muted)"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row[columns[0].key]"
            class="align-top not-last:border-b not-last:border-(--border-default)"
          >
            <template
              v-for="(column, at) in columns"
              :key="column.key"
            >
              <th
                v-if="at === 0"
                scope="row"
                class="px-(--spacing-sm) py-(--spacing-xs) text-start font-normal whitespace-nowrap"
              >
                <code class="text-label-code-sm text-(--text-default)">{{
                  value(row, column.key)
                }}</code>
              </th>
              <td
                v-else-if="column.html"
                class="w-full min-w-64 px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
              >
                <RawHtml :html="value(row, column.key)" />
              </td>
              <td
                v-else
                class="max-w-64 px-(--spacing-sm) py-(--spacing-xs)"
              >
                <code
                  v-if="column.code"
                  class="text-label-code-sm break-words text-(--text-muted)"
                  >{{ value(row, column.key) }}</code
                >
                <span
                  v-else
                  class="text-body-sm"
                  >{{ value(row, column.key) }}</span
                >
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <dl
      class="flex flex-col rounded-(--shape-card) border border-(--border-default) md:hidden"
      :aria-label="caption"
    >
      <div
        v-for="row in rows"
        :key="row[columns[0].key]"
        class="flex min-w-0 flex-col gap-(--spacing-2xs) px-(--spacing-sm) py-(--spacing-xs) not-last:border-b not-last:border-(--border-default)"
      >
        <dt class="min-w-0">
          <code class="text-label-code-sm break-words text-(--text-default)">{{
            value(row, nameColumn.key)
          }}</code>
        </dt>
        <dd
          v-for="column in detailColumns"
          :key="column.key"
          class="flex min-w-0 flex-wrap items-baseline gap-x-(--spacing-xs)"
        >
          <span class="text-body-xs text-(--text-muted)">{{ column.label }}</span>
          <code class="min-w-0 text-label-code-sm break-words text-(--text-muted)">{{
            value(row, column.key)
          }}</code>
        </dd>
        <dd
          v-if="textColumn"
          class="min-w-0 text-body-sm text-(--text-default)"
        >
          <RawHtml :html="value(row, textColumn.key)" />
        </dd>
      </div>
    </dl>
  </div>
</template>

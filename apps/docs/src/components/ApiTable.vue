<script setup lang="ts">
  import Table from '@aziontech/webkit/table'

  import type { Row } from '../lib/types'
  import RawHtml from './RawHtml.vue'

  defineProps<{
    columns: { key: string; label: string; code?: boolean; html?: boolean }[]
    rows: Row[]
    caption: string
  }>()
</script>

<template>
  <Table
    bordered
    wrap-lines
    :stackable="false"
  >
    <template #caption>
      <span class="sr-only">{{ caption }}</span>
    </template>
    <Table.Header>
      <Table.Row>
        <Table.HeadCell
          v-for="(column, at) in columns"
          :key="column.key"
          :principal="at === 0"
          >{{ column.label }}</Table.HeadCell
        >
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row
        v-for="row in rows"
        :key="row[columns[0].key]"
      >
        <Table.Cell
          v-for="(column, at) in columns"
          :key="column.key"
          :principal="at === 0"
        >
          <RawHtml
            v-if="column.html"
            :html="row[column.key] === '—' ? '—' : row[column.key] || '—'"
            class="min-w-0 text-body-sm"
          />
          <code
            v-else-if="column.code"
            class="min-w-0 text-label-code-sm break-words"
            >{{ row[column.key] || '—' }}</code
          >
          <span
            v-else
            class="min-w-0 text-body-sm"
            >{{ row[column.key] || '—' }}</span
          >
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
</template>

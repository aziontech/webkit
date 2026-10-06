<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import {
    EVENT_FIELDS,
    eventField,
    eventLevelSeverity,
    formatEventValue
  } from '../../lib/data/real-time-events'

  interface Props {
    event: Record<string, unknown>
  }

  const props = defineProps<Props>()

  const SUMMARY_PRIORITY = [
    'host',
    'requestMethod',
    'requestUri',
    'status',
    'functionName',
    'functionDurationMs',
    'ruleName',
    'requestTimeMs',
    'remoteAddress',
    'country',
    'cacheStatus',
    'workloadId'
  ]

  const SUMMARY_LIMIT = 6

  const has = (id) => {
    const value = props.event[id]
    return value !== undefined && value !== null && value !== ''
  }

  const summaryRows = computed(() =>
    SUMMARY_PRIORITY.filter(has)
      .slice(0, SUMMARY_LIMIT)
      .map((id) => {
        const field = eventField(id)
        return { id, label: field.label, value: formatEventValue(field, props.event[id]) }
      })
  )

  const documentJson = computed(() =>
    JSON.stringify(
      Object.fromEntries(
        EVENT_FIELDS.filter((field) => has(field.id)).map((field) => [
          field.id,
          props.event[field.id]
        ])
      ),
      null,
      2
    )
  )

  const codeTabs = computed(() => [
    { label: 'Document', value: 'document', language: 'json', code: documentJson.value }
  ])
</script>

<template>
  <div class="flex min-w-0 flex-col">
    <div
      class="flex min-w-0 flex-col gap-(--spacing-md) p-(--spacing-md) pb-(--spacing-lg)"
    >
      <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
        <div class="flex flex-wrap items-center gap-(--spacing-xs)">
          <Tag
            :label="event.level"
            :severity="eventLevelSeverity(event.level)"
            size="medium"
          />
          <Tag
            :label="event.sourceLabel"
            severity="secondary"
            size="medium"
          />
        </div>
        <p class="text-body-md text-(--text-default)">{{ event.message }}</p>
        <p class="text-label-code-sm tabular-nums text-(--text-muted)">{{ event.time }}</p>
      </div>

      <dl
        class="grid min-w-0 grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-baseline gap-x-(--spacing-md) gap-y-(--spacing-sm)"
      >
        <template
          v-for="row in summaryRows"
          :key="row.id"
        >
          <dt class="min-w-0 text-label-sm text-(--text-muted)">{{ row.label }}</dt>
          <dd class="m-0 min-w-0 break-words text-label-code-sm text-(--text-default)">
            {{ row.value }}
          </dd>
        </template>
      </dl>
    </div>

    <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
      <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">
        Event document
      </h3>
      <CodeBlock
        :tabs="codeTabs"
        :border="false"
        show-line-numbers
        copy-aria-label="Copy the event document as JSON"
        class="min-w-0 rounded-none border-y border-(--border-default)"
      />
    </div>
  </div>
</template>

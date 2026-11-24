<script setup lang="ts">
  import CodeBlock, { type CodeBlockTab } from '@aziontech/webkit/code-block'
  import Tag from '@aziontech/webkit/tag'
  import Trace, { type TraceView } from '@aziontech/webkit/trace'

  import type { EventsExplorerDocumentRow } from '../composables/use-events-explorer-document'
  import { eventLevelSeverity, type EventRow } from '../lib/event-log'
  import type {
    EventsExplorerDocumentField,
    EventsExplorerEvent
  } from '../view-events-explorer.vue'

  export interface EventDocumentProps {
    /** The open event. */
    event: EventRow
    /** Every field of the event, for the document-fields slot. */
    fields: EventsExplorerDocumentField[]
    /** The summary rows shown when the slot is left out. */
    rows: EventsExplorerDocumentRow[]
    /** The JSON tab of the event. */
    tabs: CodeBlockTab[]
  }

  defineProps<EventDocumentProps>()

  const traceView = defineModel<TraceView>('traceView', { required: true })

  defineSlots<{
    /** Replaces the fields of the event. */
    'document-fields'?(props: {
      event: EventsExplorerEvent
      fields: EventsExplorerDocumentField[]
    }): unknown
  }>()
</script>

<template>
  <div class="flex min-w-0 flex-col">
    <div class="flex min-w-0 flex-col gap-(--spacing-md) p-(--spacing-md) pb-(--spacing-lg)">
      <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
        <div class="flex flex-wrap items-center gap-(--spacing-xs)">
          <Tag
            :label="event.level"
            :severity="eventLevelSeverity(event.level)"
            size="small"
          />
          <Tag
            :label="event.sourceLabel"
            severity="neutral"
            size="small"
          />
        </div>
        <p class="text-body-md text-(--text-default)">{{ event.message }}</p>
        <p class="text-label-code-sm tabular-nums text-(--text-muted)">
          {{ event.time }}
        </p>
      </div>

      <slot
        name="document-fields"
        :event="event"
        :fields="fields"
      >
        <dl
          class="grid min-w-0 grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-baseline gap-x-(--spacing-md) gap-y-(--spacing-sm)"
        >
          <template
            v-for="row in rows"
            :key="row.id"
          >
            <dt class="min-w-0 text-label-sm text-(--text-muted)">{{ row.label }}</dt>
            <dd class="m-0 min-w-0 break-words text-label-code-sm text-(--text-default)">
              {{ row.value }}
            </dd>
          </template>
        </dl>
      </slot>
    </div>

    <div
      v-if="event.spans?.length"
      class="flex min-w-0 flex-col gap-(--spacing-xs) pb-(--spacing-lg)"
    >
      <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">Trace</h3>
      <div class="border-y border-(--border-muted)">
        <Trace
          :key="event.id"
          v-model:view="traceView"
          :spans="event.spans"
          :bordered="false"
          highlight-critical-path
          :aria-label="`Trace of request ${String(event.requestId ?? event.id)}`"
        />
      </div>
    </div>

    <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
      <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">Event document</h3>
      <div class="min-w-0">
        <CodeBlock
          :tabs="tabs"
          :bordered="false"
          show-line-numbers
          copy-aria-label="Copy the event document as JSON"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

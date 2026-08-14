<script setup>
  // ONE EVENT, IN FULL — the body of the document surface, hosted either by the
  // explorer's right panel (wide) or by a Drawer (narrow). Both hosts pass the same
  // event and get the same reading, which is the reason this is a component and not two
  // copies of a definition list.
  //
  // TWO REGISTERS, IN THIS ORDER: the ANSWER, then the PROOF.
  //
  //   THE ANSWER is prose and pairs — the level, the source, the moment, the sentence,
  //     and the handful of fields that say which request this was. It is padded, spaced
  //     at the group step, and reads at a glance. This is what the reader clicked for.
  //   THE PROOF is the whole document as JSON, in a flush `CodeBlock` with line numbers.
  //     A log document IS a JSON object — that is the shape it has in the API, in an
  //     export, and in the ticket the reader is about to paste it into — so showing it
  //     as one is not a developer flourish, it is the artefact itself. It also ends the
  //     question the label/value list could never answer: what ELSE is in here.
  //
  // THE CODE BLOCK IS FLUSH, and that is what the whitespace hangs off. `:border="false"`
  // plus negative inline margins let it span the panel edge to edge, so the padded prose
  // above it reads as a header over a payload rather than as two cards fighting for the
  // same 400px. Its own copy control is the document's copy control — no second button.
  //
  // THE HEADLINE IS NOT A FIELD ROW. Level, source, time and message are what the reader
  // clicked the row FOR, so they open the surface as a block; repeating them as four more
  // `label: value` rows would bury the sentence in its own metadata.
  //
  // THE SUMMARY IS THE FIRST SIX FIELDS THIS SOURCE ANSWERS FOR, in priority order — not
  // a fixed list. A Functions event emits no `requestMethod`, and six em dashes read as a
  // broken document; walking a priority list until six are found means every source gets
  // a full, useful summary and none of them get placeholders.
  import CodeBlock from '@aziontech/webkit/code-block'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import {
    EVENT_FIELDS,
    eventField,
    eventLevelSeverity,
    formatEventValue
  } from '../../lib/real-time-events'

  const props = defineProps({
    // The event document. Every key is an id from the field catalog.
    event: { type: Object, required: true }
  })

  // What a reader looks for first, in the order they look for it: where it landed, what
  // it asked for, how it went, how long it took, who sent it. Function and rule fields
  // sit high because for a Functions or WAF event they ARE the request.
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

  // Serialized from the catalog, so the JSON carries the same fields in the same order
  // the Fields panel lists them — the document a reader copies is the document the page
  // has been describing, not a re-ordered object literal.
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
    <!-- The answer: padded prose, spaced at the group step. -->
    <div
      class="flex min-w-0 flex-col gap-[var(--spacing-md)] p-[var(--spacing-md)] pb-[var(--spacing-lg)]"
    >
      <div class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
        <div class="flex flex-wrap items-center gap-[var(--spacing-xs)]">
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
        <p class="text-body-md text-[var(--text-default)]">{{ event.message }}</p>
        <p class="text-label-code-sm tabular-nums text-[var(--text-muted)]">{{ event.time }}</p>
      </div>

      <!-- The pairs, as a two-column grid so every label starts on one x and every value
           on the next — a `flex` row per field would let each row's value land wherever
           its own label ended. `gap-y` at the group step, because six rows crammed at
           the tight step is the density the log itself already has. -->
      <dl
        class="grid min-w-0 grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-baseline gap-x-[var(--spacing-md)] gap-y-[var(--spacing-sm)]"
      >
        <template
          v-for="row in summaryRows"
          :key="row.id"
        >
          <dt class="min-w-0 text-label-sm text-[var(--text-muted)]">{{ row.label }}</dt>
          <dd class="m-0 min-w-0 break-words text-label-code-sm text-[var(--text-default)]">
            {{ row.value }}
          </dd>
        </template>
      </dl>
    </div>

    <!-- The proof: the whole document, flush to the panel's edges. The heading is padded
         with the prose above it; only the block itself bleeds. -->
    <div class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
      <h3 class="px-[var(--spacing-md)] text-label-sm text-[var(--text-default)]">
        Event document
      </h3>
      <CodeBlock
        :tabs="codeTabs"
        :border="false"
        show-line-numbers
        copy-aria-label="Copy the event document as JSON"
        class="min-w-0 rounded-none border-y border-[var(--border-default)]"
      />
    </div>
  </div>
</template>

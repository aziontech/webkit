<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref, watch } from 'vue'

  import type {
    EventsExplorerDocumentField,
    EventsExplorerFilters
  } from '../view-events-explorer.vue'

  export interface DocumentFieldSearchProps {
    /** Every field of the open event. */
    fields: EventsExplorerDocumentField[]
    /** Id of the open event; a new one clears the search. */
    selectedKey: string
  }

  const props = defineProps<DocumentFieldSearchProps>()

  const filters = defineModel<EventsExplorerFilters>('filters', { required: true })
  const exclusions = defineModel<EventsExplorerFilters>('exclusions', { required: true })

  type AppliedValue = EventsExplorerDocumentField['raw']

  const documentQuery = ref('')

  watch(
    () => props.selectedKey,
    () => {
      documentQuery.value = ''
    }
  )

  const highlightParts = (text: string, term: string) => {
    if (!term) return [{ text, hit: false }]
    const parts: { text: string; hit: boolean }[] = []
    const lower = text.toLowerCase()
    let from = 0
    let at = lower.indexOf(term)
    while (at !== -1) {
      if (at > from) parts.push({ text: text.slice(from, at), hit: false })
      parts.push({ text: text.slice(at, at + term.length), hit: true })
      from = at + term.length
      at = lower.indexOf(term, from)
    }
    if (from < text.length) parts.push({ text: text.slice(from), hit: false })
    return parts
  }

  const shownRows = (fields: EventsExplorerDocumentField[]) => {
    const term = documentQuery.value.trim().toLowerCase()
    return fields
      .map((field) => ({ ...field, parts: highlightParts(field.value, term) }))
      .filter(
        (row) =>
          !term ||
          row.label.toLowerCase().includes(term) ||
          row.id.toLowerCase().includes(term) ||
          row.value.toLowerCase().includes(term)
      )
  }

  const documentStatus = (fields: EventsExplorerDocumentField[]) => {
    if (!documentQuery.value.trim()) return ''
    return `${shownRows(fields).length} of ${fields.length} fields match.`
  }

  const shownFieldsJson = (fields: EventsExplorerDocumentField[]) =>
    JSON.stringify(Object.fromEntries(shownRows(fields).map((row) => [row.id, row.raw])), null, 2)

  const isIncluded = (id: string, value: AppliedValue) => (filters.value[id] ?? []).includes(value)

  const isExcluded = (id: string, value: AppliedValue) =>
    (exclusions.value[id] ?? []).includes(value)

  const without = (list: AppliedValue[] = [], value: AppliedValue) =>
    list.filter((item) => item !== value)

  const includeValue = (id: string, value: AppliedValue) => {
    const current = filters.value[id] ?? []
    filters.value = {
      ...filters.value,
      [id]: current.includes(value) ? without(current, value) : [...current, value]
    }
    exclusions.value = { ...exclusions.value, [id]: without(exclusions.value[id], value) }
  }

  const excludeValue = (id: string, value: AppliedValue) => {
    const current = exclusions.value[id] ?? []
    exclusions.value = {
      ...exclusions.value,
      [id]: current.includes(value) ? without(current, value) : [...current, value]
    }
    filters.value = { ...filters.value, [id]: without(filters.value[id], value) }
  }

  const FIELD_ROW_CLASS =
    'group grid min-w-0 grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-x-(--spacing-sm) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) transition-colors ' +
    'duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none'
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <div class="min-w-0 flex-1">
        <Input
          v-model="documentQuery"
          size="small"
          placeholder="Search in this event"
          aria-label="Search in this event"
          class="w-full"
          data-testid="document-search"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
      <Tooltip content="Copy the fields shown as JSON">
        <CopyButton
          :value="shownFieldsJson(fields)"
          variant="outline"
          size="small"
          aria-label="Copy the fields shown as JSON"
          copied-label="Fields copied as JSON"
          data-testid="document-copy"
        />
      </Tooltip>
    </div>
    <p
      role="status"
      class="sr-only"
    >
      {{ documentStatus(fields) }}
    </p>
    <dl
      v-if="shownRows(fields).length"
      class="flex min-w-0 flex-col"
      data-testid="document-fields"
    >
      <div
        v-for="row in shownRows(fields)"
        :key="row.id"
        :class="FIELD_ROW_CLASS"
      >
        <dt class="min-w-0 truncate text-label-sm text-(--text-muted)">
          {{ row.label }}
        </dt>
        <dd class="m-0 flex min-w-0 items-center gap-(--spacing-xs)">
          <span class="min-w-0 flex-1 break-words text-label-code-sm text-(--text-default)">
            <template
              v-for="(part, index) in row.parts"
              :key="index"
            >
              <mark
                v-if="part.hit"
                class="rounded-(--shape-control) bg-(--bg-selected) text-inherit"
                >{{ part.text }}</mark
              >
              <template v-else>{{ part.text }}</template>
            </template>
          </span>
          <span
            v-if="row.filterable"
            class="flex shrink-0 items-center gap-(--spacing-2xs)"
          >
            <Tooltip :content="`Filter by ${row.label} ${row.value}`">
              <IconButton
                icon="az az-zoom-in"
                variant="ghost"
                size="small"
                :aria-label="`Filter by ${row.label} ${row.value}`"
                :aria-pressed="isIncluded(row.id, row.raw)"
                data-testid="document-include"
                @click="includeValue(row.id, row.raw)"
              />
            </Tooltip>
            <Tooltip :content="`Exclude ${row.label} ${row.value}`">
              <IconButton
                icon="az az-zoom-out"
                variant="ghost"
                size="small"
                :aria-label="`Exclude ${row.label} ${row.value}`"
                :aria-pressed="isExcluded(row.id, row.raw)"
                data-testid="document-exclude"
                @click="excludeValue(row.id, row.raw)"
              />
            </Tooltip>
          </span>
        </dd>
      </div>
    </dl>
    <p
      v-else
      class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
    >
      No field matches “{{ documentQuery }}”.
    </p>
  </div>
</template>

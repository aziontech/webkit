<script setup lang="ts">
  import Checkbox from '@aziontech/webkit/checkbox'
  import Popover from '@aziontech/webkit/popover'

  import { formatEventValue } from '../../lib/data/real-time-events'

  interface Props {
    field: Record<string, unknown>
    count?: number
    shown?: boolean
    locked?: boolean
    filterable?: boolean
    values?: unknown[]
    overflow?: number
    applied?: unknown[]
  }

  const props = withDefaults(defineProps<Props>(), {
    count: 0,
    shown: false,
    locked: false,
    filterable: true,
    values: () => [],
    overflow: 0,
    applied: () => []
  })

  defineEmits<{
    'toggle-column': []
    'toggle-value': [value: unknown]
  }>()

  const inputId = `event-field-${props.field.id}`

  const isApplied = (value) => props.applied.includes(value)
</script>

<template>
  <div
    class="group flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xxs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
  >
    <Checkbox
      binary
      :disabled="locked"
      :model-value="locked || shown"
      :input-id="inputId"
      @update:model-value="$emit('toggle-column')"
    />
    <label
      :for="inputId"
      :data-locked="locked || null"
      class="min-w-0 flex-1 truncate text-label-sm text-(--text-default) data-locked:text-(--text-muted)"
    >
      {{ field.label }}
    </label>

    <Popover
      v-if="filterable && count"
      placement="right-start"
    >
      <Popover.Trigger
        role="button"
        tabindex="0"
        :aria-label="`Filter by ${field.label} — ${count} values`"
        class="shrink-0 cursor-pointer rounded-(--shape-button) px-(--spacing-xxs) text-label-code-sm tabular-nums text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-active) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover:text-(--text-default) motion-reduce:transition-none"
      >
        {{ count }}
      </Popover.Trigger>

      <Popover.Content>
        <div class="flex min-w-0 flex-col p-(--spacing-xxs)">
          <p
            class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
          >
            {{ field.label }} · top values
          </p>

          <button
            v-for="entry in values"
            :key="String(entry.value)"
            type="button"
            role="menuitemcheckbox"
            :aria-checked="isApplied(entry.value)"
            :data-applied="isApplied(entry.value) || null"
            class="flex min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xxs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-applied:bg-(--bg-selected) motion-reduce:transition-none"
            @click="$emit('toggle-value', entry.value)"
          >
            <span class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)">
              {{ formatEventValue(field, entry.value) }}
            </span>
            <span class="shrink-0 text-label-code-sm tabular-nums text-(--text-muted)">
              {{ entry.count }}
            </span>
            <i
              v-if="isApplied(entry.value)"
              class="pi pi-check shrink-0 text-(--primary)"
              aria-hidden="true"
            />
          </button>

          <p
            v-if="overflow"
            class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
          >
            {{ overflow }} more values in this window.
          </p>
        </div>
      </Popover.Content>
    </Popover>

    <span
      v-else
      class="shrink-0 px-(--spacing-xxs) text-label-code-sm tabular-nums text-(--text-muted) data-empty:text-(--text-disabled)"
      :data-empty="count ? null : true"
      :aria-label="`${count} distinct values`"
    >
      {{ count }}
    </span>
  </div>
</template>

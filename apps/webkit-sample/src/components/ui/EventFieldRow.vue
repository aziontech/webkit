<script setup>
  // ONE FIELD, IN THE FIELDS PANEL — a checkbox that promotes it to a column, its name,
  // and the number of values it holds in the current window, which is also the way in to
  // filtering by one of them.
  //
  // It is a component because the panel now lists fields in TWO places — the flat "Shown"
  // group at the top and the collapsed doc categories below it (see RealTimeEvents.vue) —
  // and a row that reads differently in the two would break the one thing this panel has
  // to hold: every row's content starting on the same x, whatever the row is.
  //
  // THE PARENT OWNS THE STATE. The row takes booleans and emits intent (`toggle-column`,
  // `toggle-value`); it never writes to the columns array or the filter object. That keeps
  // the filter model in one place — the page's `{ fieldId: values[] }`, which the chip bar
  // reads — instead of two components racing to mutate it.
  import Checkbox from '@aziontech/webkit/checkbox'
  import Popover from '@aziontech/webkit/popover'

  import { formatEventValue } from '../../lib/real-time-events'

  const props = defineProps({
    // A field from the catalog (`EVENT_FIELDS`).
    field: { type: Object, required: true },
    // Distinct values this field answers with in the current window.
    count: { type: Number, default: 0 },
    // Whether the field is currently a table column.
    shown: { type: Boolean, default: false },
    // The spine: always a column, so the checkbox is checked and disabled.
    locked: { type: Boolean, default: false },
    // Whether the field can be filtered at all (`time` and `sourceLabel` cannot).
    filterable: { type: Boolean, default: true },
    // [{ value, count }] — the field's most frequent values in the window.
    values: { type: Array, default: () => [] },
    // How many values did not fit in `values`.
    overflow: { type: Number, default: 0 },
    // The values currently applied as filters for this field.
    applied: { type: Array, default: () => [] }
  })

  defineEmits(['toggle-column', 'toggle-value'])

  const inputId = `event-field-${props.field.id}`

  const isApplied = (value) => props.applied.includes(value)
</script>

<template>
  <div
    class="group flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] motion-reduce:transition-none"
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
      class="min-w-0 flex-1 truncate text-label-sm text-[var(--text-default)] data-[locked]:text-[var(--text-muted)]"
    >
      {{ field.label }}
    </label>

    <!-- THE COUNT IS THE WAY IN. Opening it lists the field's values, most frequent first,
         and picking one filters the log — the cut the chip bar could not offer, because
         nobody can declare "host = legacy.edgeflow.com" before seeing the window. -->
    <Popover
      v-if="filterable && count"
      placement="right-start"
    >
      <Popover.Trigger
        role="button"
        tabindex="0"
        :aria-label="`Filter by ${field.label} — ${count} values`"
        class="shrink-0 cursor-pointer rounded-[var(--shape-button)] px-[var(--spacing-xxs)] text-label-code-sm tabular-nums text-[var(--text-muted)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-active)] hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] group-hover:text-[var(--text-default)] motion-reduce:transition-none"
      >
        {{ count }}
      </Popover.Trigger>

      <Popover.Content>
        <div class="flex min-w-0 flex-col p-[var(--spacing-xxs)]">
          <p
            class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-label-sm text-[var(--text-muted)]"
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
            class="flex min-w-0 items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] data-[applied]:bg-[var(--bg-selected)] motion-reduce:transition-none"
            @click="$emit('toggle-value', entry.value)"
          >
            <span class="min-w-0 flex-1 truncate text-label-code-sm text-[var(--text-default)]">
              {{ formatEventValue(field, entry.value) }}
            </span>
            <span class="shrink-0 text-label-code-sm tabular-nums text-[var(--text-muted)]">
              {{ entry.count }}
            </span>
            <!-- The check is rendered only when applied: a reserved, empty glyph box would
                 misreport where every row's content ends. -->
            <i
              v-if="isApplied(entry.value)"
              class="pi pi-check shrink-0 text-[var(--primary)]"
              aria-hidden="true"
            />
          </button>

          <p
            v-if="overflow"
            class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-body-sm text-[var(--text-muted)]"
          >
            {{ overflow }} more values in this window.
          </p>
        </div>
      </Popover.Content>
    </Popover>

    <!-- A field nothing in this window answers for is dimmed, not hidden: its absence is
         part of the window's truth, and there is nothing to open. -->
    <span
      v-else
      class="shrink-0 px-[var(--spacing-xxs)] text-label-code-sm tabular-nums text-[var(--text-muted)] data-[empty]:text-[var(--text-disabled)]"
      :data-empty="count ? null : true"
      :aria-label="`${count} distinct values`"
    >
      {{ count }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import type { FilterMenuValue } from '@aziontech/webkit/filter-menu'
  import Item from '@aziontech/webkit/item-root'
  import Popover from '@aziontech/webkit/popover'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import {
    countFieldValues,
    type EventRow,
    fieldValueCounts,
    formatFieldValue
  } from '../lib/event-log'
  import type { EventsExplorerField } from '../view-events-explorer.vue'

  export interface FieldRowProps {
    /** The field; locked fields always show. */
    field: EventsExplorerField & { locked?: boolean }
    /** Its column shows in the log. */
    checked: boolean
    /** Distinct values among the matching events. */
    count: number
    /** The log can be filtered by this field. */
    filterable: boolean
    /** The matching events, the source of its top values. */
    events: EventRow[]
    /** The values of the field applied as filters. */
    applied: FilterMenuValue[]
  }

  const props = defineProps<FieldRowProps>()

  const emit = defineEmits<{
    'toggle-column': []
    'toggle-value': [value: FilterMenuValue]
  }>()

  const { formatNumber } = useLocale()

  const topValues = 6

  const topFieldValues = () => fieldValueCounts(props.events, props.field.id).slice(0, topValues)

  const fieldValueOverflow = () =>
    Math.max(0, countFieldValues(props.events, props.field.id) - topValues)

  const isValueApplied = (value: FilterMenuValue) => props.applied.includes(value)

  const FIELD_ROW_CLASS =
    'group flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-2xs) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:bg-(--bg-hover) motion-reduce:transition-none'

  const FIELD_COUNT_CLASS =
    'shrink-0 cursor-pointer text-label-code-sm tabular-nums text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:text-(--text-default) group-hover:text-(--text-default) motion-reduce:transition-none'
</script>

<template>
  <div :class="FIELD_ROW_CLASS">
    <div class="min-w-0 flex-1">
      <Field
        orientation="horizontal"
        :disabled="field.locked"
      >
        <Checkbox
          :model-value="checked"
          @update:model-value="emit('toggle-column')"
        />
        <Field.Label>
          <span class="truncate">{{ field.label }}</span>
        </Field.Label>
      </Field>
    </div>

    <Popover
      v-if="filterable && count"
      side="end"
      align="start"
    >
      <div :class="FIELD_COUNT_CLASS">
        <Popover.Trigger
          role="button"
          tabindex="0"
          :aria-label="`Filter by ${field.label}, ${count} values`"
        >
          {{ count }}
        </Popover.Trigger>
      </div>

      <Popover.Content>
        <div class="flex min-w-0 flex-col p-(--spacing-2xs)">
          <p class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)">
            {{ field.label }} · top values
          </p>

          <Item
            v-for="entry in topFieldValues()"
            :key="String(entry.value)"
            clickable
            variant="option"
            :aria-pressed="isValueApplied(entry.value)"
            @click="emit('toggle-value', entry.value)"
          >
            <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
              <span class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)">
                {{ formatFieldValue(field, entry.value, formatNumber) }}
              </span>
              <span class="shrink-0 text-label-code-sm tabular-nums text-(--text-muted)">
                {{ entry.count }}
              </span>
              <i
                v-if="isValueApplied(entry.value)"
                class="az az-check shrink-0 text-(--primary)"
                aria-hidden="true"
              />
            </span>
          </Item>

          <p
            v-if="fieldValueOverflow()"
            class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
          >
            {{ fieldValueOverflow() }} more values in this window.
          </p>
        </div>
      </Popover.Content>
    </Popover>

    <span
      v-else
      class="shrink-0 px-(--spacing-2xs) text-label-code-sm tabular-nums text-(--text-muted) data-empty:text-(--text-disabled)"
      :data-empty="count ? null : true"
      :aria-label="`${count} distinct values`"
    >
      {{ count }}
    </span>
  </div>
</template>

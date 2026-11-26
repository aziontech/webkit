<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import Avatar from '../../../content/avatar/avatar.vue'
  import Chip from '../../../input/chip/chip.vue'
  import { toMenuFields, toMenuModel } from '../../table/filter-menu-bridge'
  import { TableInjectionKey } from '../../table/injection-key'
  import { useFilterMenuChannel } from '../composables/use-filter-menu-channel'
  import { useFilterMenuLabels } from '../composables/use-filter-menu-labels'
  import {
    appliedFields,
    clearField,
    type FilterMenuSummary,
    pickedAvatars,
    valuesOf
  } from '../summarize'
  import type { FilterMenuField, FilterMenuModel, FilterMenuOption } from '../types'

  defineOptions({
    name: 'FilterMenuChipGroup',
    inheritAttrs: false
  })

  export interface FilterMenuChipGroupProps {
    /** The fields the linked menu receives; chips reopen the menu that shares this array. Empty inside a DataTable reads the table's filter fields and filters. */
    fields?: FilterMenuField[]
  }

  const props = withDefaults(defineProps<FilterMenuChipGroupProps>(), {
    fields: () => []
  })

  const emit = defineEmits<{
    /** A chip was activated; the linked menu opens at the field. */
    edit: [event: MouseEvent | KeyboardEvent, field: FilterMenuField]
    /** A chip's remove button was pressed; the model loses the field. */
    remove: [event: MouseEvent, field: FilterMenuField]
  }>()

  /** Applied values per field id, shared with the menu. */
  const model = defineModel<FilterMenuModel>({ default: () => ({}) })

  const attrs = useAttrs()
  const labels = useFilterMenuLabels()
  const { t } = labels
  const ctx = inject(TableInjectionKey, null)
  const linked = computed<boolean>(() => props.fields.length === 0 && Boolean(ctx?.table.value))
  const fields = computed<FilterMenuField[]>(() =>
    linked.value ? toMenuFields(ctx?.filterFields.value ?? []) : props.fields
  )
  const value = computed<FilterMenuModel>(() =>
    linked.value ? toMenuModel(ctx?.appliedFilters.value ?? [], fields.value) : model.value
  )
  const filterOf = (field: FilterMenuField) =>
    ctx?.appliedFilters.value.find((filter) => filter.field === field.id)
  const { requestOpen } = useFilterMenuChannel(() => props.fields)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'filter-menu-chip-group'
  )

  const chips = computed<FilterMenuField[]>(() => appliedFields(fields.value, value.value))

  const summaryOf = (field: FilterMenuField): FilterMenuSummary | null =>
    labels.summaryOf(value.value, field)
  const avatarsOf = (field: FilterMenuField): FilterMenuOption[] =>
    pickedAvatars(valuesOf(value.value, field), labels.optionsOf(field))

  const onEdit = (event: MouseEvent | KeyboardEvent, field: FilterMenuField): void => {
    emit('edit', event, field)
    const filter = linked.value ? filterOf(field) : undefined
    if (filter) return ctx?.editFilter(filter)
    requestOpen(field.id, (event.currentTarget as HTMLElement | null) ?? null)
  }

  const onRemove = (event: MouseEvent, field: FilterMenuField): void => {
    emit('remove', event, field)
    const filter = linked.value ? filterOf(field) : undefined
    if (filter) return ctx?.removeFilter(event, filter)
    model.value = clearField(model.value, field)
  }
</script>

<template>
  <TransitionGroup
    v-if="chips.length"
    v-bind="$attrs"
    tag="div"
    role="group"
    :aria-label="t('filterMenu.applied')"
    :data-testid="testId"
    class="relative flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
    move-class="transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="scale-90 opacity-0"
    enter-active-class="transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    leave-to-class="scale-90 opacity-0"
    leave-active-class="pointer-events-none absolute transition-[transform,translate,scale,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
  >
    <span
      v-for="field in chips"
      :key="field.id"
      class="inline-flex w-fit max-w-full"
    >
      <Chip
        :data-testid="`${testId}__chip-${field.id}`"
        :label="field.label"
        variant="filled"
        size="medium"
        clickable
        removable
        @click="(event) => onEdit(event, field)"
        @remove="(event) => onRemove(event, field)"
      >
        <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
          <bdi class="truncate text-(--text-muted)">{{ field.label }}</bdi>
          <span
            v-if="avatarsOf(field).length"
            class="flex shrink-0 items-center"
          >
            <Avatar
              v-for="(option, index) in avatarsOf(field)"
              :key="String(option.value)"
              :src="option.avatar || undefined"
              :alt="option.label"
              :label="option.label"
              size="small"
              variant="circle"
              :data-stacked="index > 0 || null"
              class="size-4 ring-1 ring-(--bg-surface) data-[stacked]:-ms-1"
            />
          </span>
          <bdi class="truncate">{{ summaryOf(field)?.label }}</bdi>
          <span
            v-if="summaryOf(field)?.extra"
            class="shrink-0 text-(--text-muted)"
          >
            {{ t('filterMenu.more', { count: summaryOf(field)?.extra ?? 0 }) }}
          </span>
        </span>
      </Chip>
    </span>
  </TransitionGroup>
</template>

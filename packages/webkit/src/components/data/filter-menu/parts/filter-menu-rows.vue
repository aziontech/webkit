<script setup lang="ts">
  import { computed } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Avatar from '../../../content/avatar/avatar.vue'
  import { ROW_CLASS } from '../lib/row-class'
  import { isApplied, kindOf, valuesOf } from '../summarize'
  import type { FilterMenuField, FilterMenuModel, FilterMenuOption } from '../types'

  defineOptions({ name: 'FilterMenuRows', inheritAttrs: false })

  interface Props {
    /** Fields of the menu. */
    fields: FilterMenuField[]
    /** Field whose values are listed; unset lists the fields. */
    activeField?: FilterMenuField
    /** Search text. */
    query: string
    /** Applied values per field id. */
    applied: FilterMenuModel
    /** Locale the search compares in. */
    locale: string
    /** Values a field offers. */
    optionsOf: (field: FilterMenuField) => FilterMenuOption[]
    /** Summary of a field's applied values. */
    summaryOf: (field: FilterMenuField) => string
    /** Test id of the menu. */
    testId: string
  }

  const props = withDefaults(defineProps<Props>(), { activeField: undefined })

  const emit = defineEmits<{
    enter: [event: MouseEvent, fieldId: string]
    pick: [event: MouseEvent, option: FilterMenuOption]
    custom: [event: MouseEvent]
  }>()

  const { t } = useTranslate({ filterMenu: en.filterMenu })

  const MAX_OPTION_ROWS = 100

  const term = computed<string>(() => props.query.trim().toLocaleLowerCase(props.locale))
  const matches = (label: string): boolean =>
    !term.value || label.toLocaleLowerCase(props.locale).includes(term.value)
  const fieldRows = computed<FilterMenuField[]>(() =>
    props.fields.filter((field) => matches(field.label))
  )
  const matchingOptions = computed<FilterMenuOption[]>(() =>
    props.activeField
      ? props.optionsOf(props.activeField).filter((option) => matches(option.label))
      : []
  )
  const optionRows = computed<FilterMenuOption[]>(() =>
    matchingOptions.value.slice(0, MAX_OPTION_ROWS)
  )
  const hiddenOptions = computed<number>(
    () => matchingOptions.value.length - optionRows.value.length
  )
  const empty = computed<boolean>(() =>
    props.activeField ? optionRows.value.length === 0 : fieldRows.value.length === 0
  )
  const activeKind = computed(() => (props.activeField ? kindOf(props.activeField) : 'multiple'))

  const isPicked = (value: FilterMenuOption['value']): boolean =>
    props.activeField ? valuesOf(props.applied, props.activeField).includes(value) : false
</script>

<template>
  <div
    class="flex max-h-(--container-3xs) flex-col gap-(--spacing-2xs) overflow-y-auto overscroll-contain p-(--spacing-2xs)"
  >
    <template v-if="!activeField">
      <button
        v-for="field in fieldRows"
        :key="field.id"
        type="button"
        data-filter-row
        :data-testid="`${testId}__field-${field.id}`"
        :data-applied="isApplied(applied, field) || null"
        :class="ROW_CLASS"
        @click="emit('enter', $event, field.id)"
      >
        <bdi class="grow truncate">{{ field.label }}</bdi>
        <bdi
          v-if="isApplied(applied, field)"
          class="min-w-0 truncate text-(--text-muted)"
        >
          {{ summaryOf(field) }}
        </bdi>
        <i
          class="az az-chevron-right shrink-0 text-(--text-muted) rtl:-scale-x-100"
          aria-hidden="true"
        />
      </button>
    </template>

    <div
      v-else
      :role="activeKind === 'multiple' ? 'group' : 'radiogroup'"
      :aria-label="activeField.label"
      class="flex flex-col gap-(--spacing-2xs)"
    >
      <button
        v-for="option in optionRows"
        :key="String(option.value)"
        type="button"
        data-filter-row
        :data-testid="`${testId}__option-${option.value}`"
        :role="activeKind === 'multiple' ? 'checkbox' : 'radio'"
        :aria-checked="isPicked(option.value)"
        :class="ROW_CLASS"
        @click="emit('pick', $event, option)"
      >
        <Avatar
          v-if="'avatar' in option"
          :src="option.avatar || undefined"
          :alt="option.label"
          :label="option.label"
          size="small"
          variant="square"
          class="shrink-0"
        />
        <bdi class="grow truncate">{{ option.label }}</bdi>
        <i
          class="az az-check shrink-0 text-(--text-default) data-[selected=false]:invisible"
          :data-selected="isPicked(option.value)"
          aria-hidden="true"
        />
      </button>
    </div>

    <p
      v-if="activeField && hiddenOptions > 0"
      :data-testid="`${testId}__more-values`"
      class="px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)"
    >
      {{ t('filterMenu.moreValues', { count: hiddenOptions }) }}
    </p>

    <p
      v-if="empty"
      class="px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)"
    >
      {{ t('filterMenu.noMatch', { query }) }}
    </p>

    <button
      v-if="activeField && activeKind === 'date'"
      type="button"
      data-filter-row
      :data-testid="`${testId}__custom`"
      :class="ROW_CLASS"
      @click="emit('custom', $event)"
    >
      <span class="grow truncate">{{ t('filterMenu.customRange') }}</span>
      <i
        class="az az-chevron-right shrink-0 text-(--text-muted) rtl:-scale-x-100"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

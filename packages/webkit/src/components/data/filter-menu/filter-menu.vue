<script setup lang="ts">
  import {
    type ComponentPublicInstance,
    computed,
    defineAsyncComponent,
    nextTick,
    ref,
    useAttrs,
    watch
  } from 'vue'

  import { useElementListener } from '../../../composables/use-element-listener'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Badge from '../../content/badge/badge.vue'
  import type { DateRangeValue } from '../../input/date-range-picker/date-range'
  import Input from '../../input/input/input.vue'
  import Popover from '../../overlay/popover/popover.vue'
  import PopoverContent from '../../overlay/popover/popover-content/popover-content.vue'
  import PopoverTitle from '../../overlay/popover/popover-title/popover-title.vue'
  import PopoverTrigger from '../../overlay/popover/popover-trigger/popover-trigger.vue'
  import { useAnimatedHeight } from './composables/use-animated-height'
  import { useFilterMenuChannel } from './composables/use-filter-menu-channel'
  import { useFilterMenuLabels } from './composables/use-filter-menu-labels'
  import { hasFocusIn, levelRows, moveRowFocus, returnFocus } from './lib/panel-focus'
  import { withRange } from './lib/range'
  import { ROW_CLASS } from './lib/row-class'
  import FilterMenuRows from './parts/filter-menu-rows.vue'
  import { appliedFields, clearField, isApplied, kindOf, toggleValue } from './summarize'
  import type { FilterMenuField, FilterMenuModel, FilterMenuOption, FilterMenuSize } from './types'

  defineOptions({ name: 'FilterMenu', inheritAttrs: false })

  export interface FilterMenuProps {
    /** Fields the menu lists, in order, each with its type and values. */
    fields?: FilterMenuField[]
    /** Text of the trigger button. Empty uses the locale catalog (`Filter`). */
    label?: string
    /** Size token of the trigger button. */
    size?: FilterMenuSize
    /** Disables the trigger: the menu does not open. */
    disabled?: boolean
    /** Initial open state when uncontrolled (v-model:open unbound). */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<FilterMenuProps>(), {
    fields: () => [],
    label: '',
    size: 'medium',
    disabled: false,
    defaultOpen: false
  })

  /** Applied values per field id; clearing a field deletes its key. */
  const model = defineModel<FilterMenuModel>({ default: () => ({}) })
  /** Whether the menu is open. Supports v-model:open; omit for uncontrolled, seeded by defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })
  const open = computed<boolean>({
    get: () => openModel.value ?? props.defaultOpen,
    set: (next) => {
      if (next !== open.value) openModel.value = next
    }
  })

  const DateRangePicker = defineAsyncComponent(
    () => import('../../input/date-range-picker/date-range-picker.vue')
  )

  const attrs = useAttrs()
  const { t, dir, locale, optionsOf, summaryText } = useFilterMenuLabels()
  const { request } = useFilterMenuChannel(() => props.fields, { listen: true })
  const { regionEl, height: regionHeight, animateHeight } = useAnimatedHeight()

  const activeId = ref<string | null>(null)
  const customId = ref<string | null>(null)
  const calendarOpen = ref<boolean>(false)
  const customRange = ref<DateRangeValue | null>(null)
  const query = ref<string>('')
  const direction = ref<'forward' | 'back'>('forward')
  const panelEl = ref<HTMLElement | null>(null)
  const returnFocusEl = ref<HTMLElement | null>(null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'filter-menu'
  )
  const triggerLabel = computed<string>(() => props.label || t('filterMenu.label'))
  const count = computed<number>(() => appliedFields(props.fields, model.value).length)
  const triggerName = computed<string>(() =>
    count.value > 0
      ? t('filterMenu.triggerCount', { label: triggerLabel.value, count: count.value })
      : triggerLabel.value
  )

  const summaryOf = (field: FilterMenuField): string => summaryText(model.value, field)

  const activeField = computed<FilterMenuField | undefined>(() =>
    props.fields.find((field) => field.id === (customId.value ?? activeId.value))
  )
  const customField = computed<FilterMenuField | undefined>(() =>
    customId.value ? activeField.value : undefined
  )

  const levelKey = computed<string>(() => {
    if (customId.value) return `custom:${customId.value}`
    return activeId.value ? `values:${activeId.value}` : 'fields'
  })

  const searchPlaceholder = computed<string>(() =>
    activeField.value
      ? t('filterMenu.searchValues', {
          field: activeField.value.label.toLocaleLowerCase(locale.value)
        })
      : t('filterMenu.searchFields')
  )
  const searchLabel = computed<string>(() =>
    activeField.value
      ? t('filterMenu.searchValuesLabel', { field: activeField.value.label })
      : t('filterMenu.searchFieldsLabel')
  )

  const fromEnd = computed<boolean>(() => (direction.value === 'forward') !== (dir.value === 'rtl'))
  const enterFrom = computed<string>(() =>
    fromEnd.value ? 'translate-x-[12%] opacity-0' : '-translate-x-[12%] opacity-0'
  )
  const leaveTo = computed<string>(() =>
    fromEnd.value ? '-translate-x-[12%] opacity-0' : 'translate-x-[12%] opacity-0'
  )

  const toLevel = (next: 'forward' | 'back', mutate: () => void): void => {
    direction.value = next
    void animateHeight(mutate)
  }

  const enter = (fieldId: string): void => {
    if (!open.value) {
      activeId.value = fieldId
      query.value = ''
      open.value = true
      return
    }
    toLevel('forward', () => {
      activeId.value = fieldId
      customId.value = null
      query.value = ''
    })
  }

  const back = (): void => {
    toLevel('back', () => {
      activeId.value = null
      query.value = ''
    })
  }

  const enterCustom = (field: FilterMenuField): void => {
    toLevel('forward', () => {
      customId.value = field.id
    })
    calendarOpen.value = true
  }

  const leaveCustom = (): void => {
    calendarOpen.value = false
    customRange.value = null
    toLevel('back', () => {
      customId.value = null
    })
  }

  const pick = (field: FilterMenuField, option: FilterMenuOption): void => {
    model.value = toggleValue(model.value, field, option.value)
    if (kindOf(field) !== 'multiple') back()
  }

  const commitCustom = (value: unknown): void => {
    const field = customField.value
    if (!field) return
    model.value = withRange(model.value, field, value as DateRangeValue | null)
    open.value = false
  }

  const clear = (field: FilterMenuField): void => {
    model.value = clearField(model.value, field)
  }

  const show = (fieldId?: string, origin?: HTMLElement | null): void => {
    returnFocusEl.value = origin ?? null
    const field = fieldId ? props.fields.find((entry) => entry.id === fieldId) : undefined
    if (field) enter(field.id)
    else open.value = true
  }

  watch(request, (next) => {
    if (next) show(next.fieldId, next.origin)
  })

  const triggerEl = (): HTMLElement | null =>
    globalThis.document?.querySelector<HTMLElement>(`[data-testid="${testId.value}__trigger"]`) ??
    null

  watch(open, (isOpen) => {
    if (isOpen) return
    const hadFocus = hasFocusIn(panelEl.value, triggerEl())
    const origin = returnFocusEl.value
    activeId.value = null
    customId.value = null
    calendarOpen.value = false
    customRange.value = null
    query.value = ''
    direction.value = 'forward'
    returnFocusEl.value = null
    if (hadFocus) void nextTick(() => returnFocus(origin, triggerEl()))
  })

  const setRegion = (el: Element | ComponentPublicInstance | null): void => {
    regionEl.value = el instanceof HTMLElement ? el : null
  }

  useElementListener(panelEl, 'keydown', (event: KeyboardEvent) =>
    moveRowFocus(event, () => levelRows(panelEl.value, levelKey.value))
  )

  watch(levelKey, async () => {
    await nextTick()
    levelRows(panelEl.value, levelKey.value)[0]?.focus()
  })

  defineExpose({
    /** Opens the menu, at a field's values when fieldId names one, returning focus to returnFocus on close. */
    open: show
  })
</script>

<template>
  <Popover
    v-bind="$attrs"
    v-model:open="open"
    :data-testid="testId"
    :disabled="disabled"
    side="bottom"
    align="start"
    :dismissible="!calendarOpen"
    class="shrink-0"
  >
    <PopoverTrigger
      :data-testid="`${testId}__trigger`"
      class="relative"
    >
      <Button
        :label="triggerLabel"
        :aria-label="triggerName"
        variant="outline"
        :size="size"
        :disabled="disabled"
        icon="az az-filter"
      />
      <Transition
        enter-from-class="scale-75 opacity-0"
        enter-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        leave-to-class="scale-75 opacity-0"
        leave-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
      >
        <span
          v-if="count > 0"
          aria-hidden="true"
          class="pointer-events-none absolute -top-2 -end-2 min-w-5"
        >
          <Badge
            :data-testid="`${testId}__count`"
            :label="String(count)"
            variant="primary"
            size="small"
            class="w-full"
          />
        </span>
      </Transition>
    </PopoverTrigger>

    <PopoverContent>
      <PopoverTitle class="sr-only">{{ triggerLabel }}</PopoverTitle>
      <div
        ref="panelEl"
        class="flex flex-col"
      >
        <div
          :ref="setRegion"
          :style="{ height: regionHeight }"
          class="relative overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        >
          <Transition
            :enter-from-class="enterFrom"
            enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
            :leave-to-class="leaveTo"
            leave-active-class="absolute inset-x-0 top-0 transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          >
            <div
              :key="levelKey"
              :data-level="levelKey"
              class="flex flex-col"
            >
              <div
                v-if="activeField"
                class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
              >
                <IconButton
                  :data-testid="`${testId}__previous`"
                  icon="az az-chevron-left"
                  variant="outline"
                  size="small"
                  :aria-label="customField ? t('filterMenu.backToPeriods') : t('filterMenu.back')"
                  @click="customField ? leaveCustom() : back()"
                />
                <bdi class="truncate text-label-sm text-(--text-default)">
                  {{ activeField.label }}
                </bdi>
              </div>

              <div
                v-if="customField"
                class="px-(--spacing-md) py-(--spacing-sm)"
              >
                <DateRangePicker
                  v-model="customRange"
                  v-model:open="calendarOpen"
                  :data-testid="`${testId}__calendar`"
                  range-selector-mode="absolute-only"
                  size="medium"
                  :show-time="false"
                  :show-time-zone="false"
                  :placeholder="t('filterMenu.pickRange')"
                  class="w-full"
                  @update:model-value="commitCustom"
                />
              </div>

              <template v-else>
                <div class="border-b border-(--border-default) p-(--spacing-xs)">
                  <Input
                    v-model="query"
                    :data-testid="`${testId}__search`"
                    size="medium"
                    class="w-full"
                    :placeholder="searchPlaceholder"
                    :aria-label="searchLabel"
                  >
                    <template #leading>
                      <i
                        class="az az-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>

                <FilterMenuRows
                  :fields="fields"
                  :active-field="activeField"
                  :query="query"
                  :applied="model"
                  :locale="locale"
                  :options-of="optionsOf"
                  :summary-of="summaryOf"
                  :test-id="testId"
                  @enter="(_event, fieldId) => enter(fieldId)"
                  @pick="(_event, option) => activeField && pick(activeField, option)"
                  @custom="activeField && enterCustom(activeField)"
                />

                <div
                  v-if="activeField && isApplied(model, activeField)"
                  class="border-t border-(--border-default) p-(--spacing-2xs)"
                >
                  <button
                    type="button"
                    :data-testid="`${testId}__clear`"
                    :class="ROW_CLASS"
                    @click="clear(activeField)"
                  >
                    <i
                      class="az az-filter-off text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <bdi class="truncate">{{
                      t('filterMenu.clear', { field: activeField.label })
                    }}</bdi>
                  </button>
                </div>
              </template>
            </div>
          </Transition>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

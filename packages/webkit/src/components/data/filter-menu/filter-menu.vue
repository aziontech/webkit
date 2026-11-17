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

  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Avatar from '../../content/avatar/avatar.vue'
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
  import { appliedFields, clearField, isApplied, kindOf, toggleValue, valuesOf } from './summarize'
  import type {
    FilterMenuField,
    FilterMenuModel,
    FilterMenuOption,
    FilterMenuRange,
    FilterMenuSize,
    FilterMenuValue
  } from './types'

  defineOptions({
    name: 'FilterMenu',
    inheritAttrs: false
  })

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
  const activeKind = computed(() => (activeField.value ? kindOf(activeField.value) : 'multiple'))

  const levelKey = computed<string>(() => {
    if (customId.value) return `custom:${customId.value}`
    return activeId.value ? `values:${activeId.value}` : 'fields'
  })

  const term = computed<string>(() => query.value.trim().toLocaleLowerCase(locale.value))
  const matches = (label: string): boolean =>
    !term.value || label.toLocaleLowerCase(locale.value).includes(term.value)
  const fieldRows = computed<FilterMenuField[]>(() =>
    props.fields.filter((field) => matches(field.label))
  )
  const MAX_OPTION_ROWS = 100
  const matchingOptions = computed<FilterMenuOption[]>(() =>
    activeField.value ? optionsOf(activeField.value).filter((option) => matches(option.label)) : []
  )
  const optionRows = computed<FilterMenuOption[]>(() =>
    matchingOptions.value.slice(0, MAX_OPTION_ROWS)
  )
  const hiddenOptions = computed<number>(
    () => matchingOptions.value.length - optionRows.value.length
  )
  const empty = computed<boolean>(() =>
    activeField.value ? optionRows.value.length === 0 : fieldRows.value.length === 0
  )

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

  const isPicked = (value: FilterMenuValue): boolean =>
    activeField.value ? valuesOf(model.value, activeField.value).includes(value) : false

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
    const picked = value as DateRangeValue | null
    const range: FilterMenuRange | null =
      picked?.type === 'absolute'
        ? { start: new Date(picked.start), end: new Date(picked.end) }
        : null
    const next = { ...model.value }
    if (range?.start || range?.end) next[field.id] = [{ start: range.start, end: range.end }]
    else delete next[field.id]
    model.value = next
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
    const active = globalThis.document?.activeElement ?? null
    const hadFocus = Boolean(
      active && (panelEl.value?.contains(active) || triggerEl()?.contains(active))
    )
    const origin = returnFocusEl.value
    activeId.value = null
    customId.value = null
    calendarOpen.value = false
    customRange.value = null
    query.value = ''
    direction.value = 'forward'
    returnFocusEl.value = null
    if (!hadFocus) return
    void nextTick(() => {
      const trigger = triggerEl()
      const target = origin?.isConnected
        ? origin
        : (trigger?.querySelector<HTMLElement>('button') ?? trigger)
      target?.focus({ preventScroll: true })
    })
  })

  const setRegion = (el: Element | ComponentPublicInstance | null): void => {
    regionEl.value = el instanceof HTMLElement ? el : null
  }

  const levelRows = (): HTMLElement[] => [
    ...(panelEl.value?.querySelectorAll<HTMLElement>(
      `[data-level="${levelKey.value}"] [data-filter-row]`
    ) ?? [])
  ]

  const move = (event: KeyboardEvent, step: number): void => {
    const items = levelRows()
    if (!items.length) return
    event.preventDefault()
    const index = items.indexOf(event.target as HTMLElement)
    items[(index + step + items.length) % items.length]?.focus()
  }

  watch(levelKey, async () => {
    await nextTick()
    levelRows()[0]?.focus()
  })

  const ROW_CLASS =
    'flex w-full min-h-8 pointer-coarse:min-h-11 items-center gap-(--spacing-sm) rounded-(--shape-control) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'

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
        @keydown.down="move($event, 1)"
        @keydown.up="move($event, -1)"
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
                      :data-applied="isApplied(model, field) || null"
                      :class="ROW_CLASS"
                      @click="enter(field.id)"
                    >
                      <bdi class="grow truncate">{{ field.label }}</bdi>
                      <bdi
                        v-if="isApplied(model, field)"
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
                      @click="pick(activeField, option)"
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
                    @click="enterCustom(activeField)"
                  >
                    <span class="grow truncate">{{ t('filterMenu.customRange') }}</span>
                    <i
                      class="az az-chevron-right shrink-0 text-(--text-muted) rtl:-scale-x-100"
                      aria-hidden="true"
                    />
                  </button>
                </div>

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

<script setup lang="ts" generic="TValue = unknown">
  import { computed, provide, ref, shallowReactive, useAttrs, useId } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import type { ListboxFocusIntent } from '../../../composables/use-listbox-content'
  import { useTranslate } from '../../../composables/use-translate'
  import { FieldInjectionKey } from '../field/injection-key'
  import { FormValue } from '../parts/form-value'
  import {
    type MultiSelectCommitEvent,
    MultiSelectInjectionKey,
    type MultiSelectKind,
    type MultiSelectSize
  } from './injection-key'

  defineOptions({
    name: 'MultiSelect',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Initial open state when uncontrolled. */
      defaultOpen?: boolean
      /** Trigger placeholder shown when no option is selected. */
      placeholder?: string
      /** Size token; affects trigger height. */
      size?: MultiSelectSize
      /** Disables the trigger and prevents opening. */
      disabled?: boolean
      /** Marks the field read-only; selection visible, dropdown locked. */
      readonly?: boolean
      /** Marks the field as required; sets aria-required on the trigger. */
      required?: boolean
      /** Applies invalid border + ring tokens and aria-invalid on the trigger. */
      invalid?: boolean
      /** Custom formatter for the trigger label; receives the current modelValue array. */
      displayValue?: (value: TValue[]) => string
      /** Form field name: renders one hidden input per selected value, so a native form submits them; required then blocks an empty submit. */
      name?: string
      /** How the trigger shows the selection: joined labels, or one removable chip per value. */
      kind?: MultiSelectKind
      /** With kind chips, the most chips shown before a +N more chip; 0 shows every chip. */
      chipLimit?: number
      /** Types in the trigger: the text filters the options, Backspace in an empty field removes the last value. */
      searchable?: boolean
      /** With searchable, hides options whose label does not contain the typed text. Turn off when the server filters on search. */
      filter?: boolean
      /** With searchable, offers typed text that matches no option as an Add row that emits create. */
      allowCustom?: boolean
      /** Shows the loading row in place of the options while they are fetched. */
      loading?: boolean
      /** Message shown in place of the options when they failed to load; empty shows the options. */
      error?: string
      /** Text of the list when no option is visible. Empty uses the locale catalog. */
      emptyTitle?: string
    }>(),
    {
      defaultOpen: false,
      placeholder: '',
      size: 'medium',
      disabled: false,
      readonly: false,
      required: false,
      invalid: false,
      displayValue: undefined,
      name: '',
      kind: 'summary',
      chipLimit: 0,
      searchable: false,
      filter: true,
      allowCustom: false,
      loading: false,
      error: '',
      emptyTitle: ''
    }
  )

  const emit = defineEmits<{
    search: [text: string]
    create: [event: MouseEvent | KeyboardEvent, value: string]
  }>()

  /** Two-way bound selection. Always an array; each item is the value of a selected option, typed as the bound array's items. */
  const model = defineModel<TValue[]>({ default: () => [] })

  /** Controlled open state for the dropdown. Use with v-model:open; while unbound the dropdown is uncontrolled and seeded by defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { locale } = useTranslate()

  const {
    controlId,
    describedBy,
    labelledBy,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled,
    required: () => props.required
  })

  provide(FieldInjectionKey, null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-multi-select'
  )

  const rootAttrs = computed(() => {
    const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
    return rest
  })

  const openState = computed(() => openModel.value ?? props.defaultOpen)

  const query = ref('')

  const setQuery = (text: string) => {
    if (text === query.value) return
    query.value = text
    emit('search', text)
  }

  const setOpen = (value: boolean) => {
    if (isDisabled.value || props.readonly) return
    openModel.value = value
    if (!value) setQuery('')
  }

  const currentArray = (): unknown[] => (Array.isArray(model.value) ? model.value : [])

  const selectedSet = computed(() => new Set(currentArray()))

  const isSelected = (value: unknown): boolean => selectedSet.value.has(value)

  const toggleValue = (value: unknown) => {
    if (isDisabled.value || props.readonly) return
    const next = [...currentArray()]
    const index = next.indexOf(value)
    if (index === -1) next.push(value)
    else next.splice(index, 1)
    model.value = next as TValue[]
  }

  const filled = computed(() => currentArray().length > 0)

  const labels = shallowReactive(new Map<unknown, string>())
  const registerLabel = (value: unknown, label: string) => {
    if (label && labels.get(value) !== label) labels.set(value, label)
  }

  const labelsPending = computed(() => currentArray().some((value) => !labels.has(value)))

  const labelOf = (value: unknown): string => labels.get(value) ?? String(value)

  const fold = (text: string) =>
    text
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLocaleLowerCase(locale.value)

  const needle = computed(() => fold(query.value.trim()))

  const filtering = computed(() => props.searchable && props.filter && needle.value !== '')

  const matches = (label: string): boolean => !filtering.value || fold(label).includes(needle.value)

  const mounted = shallowReactive(new Map<symbol, string>())
  const registerOption = (id: symbol, label: string) => {
    if (mounted.get(id) !== label) mounted.set(id, label)
  }
  const unregisterOption = (id: symbol) => {
    mounted.delete(id)
  }

  const visibleCount = computed(() => {
    if (!filtering.value) return mounted.size
    let count = 0
    for (const label of mounted.values()) if (fold(label).includes(needle.value)) count += 1
    return count
  })

  const showCreate = computed(() => {
    if (!props.searchable || !props.allowCustom || needle.value === '') return false
    for (const label of mounted.values()) if (fold(label) === needle.value) return false
    return true
  })

  const controlEl = ref<globalThis.HTMLElement | null>(null)
  const triggerEl = ref<globalThis.HTMLElement | null>(null)
  const focusControl = () => {
    ;(controlEl.value ?? triggerEl.value)?.focus()
  }

  const create = (event: MultiSelectCommitEvent) => {
    const value = query.value.trim()
    if (!value || !showCreate.value) return
    setQuery('')
    emit('create', event, value)
  }

  const displayValueComputed = computed((): string => {
    const current = currentArray()
    if (props.displayValue) return props.displayValue(current as TValue[])
    if (current.length === 0) return ''
    return current.map(labelOf).join(', ')
  })

  provide(MultiSelectInjectionKey, {
    contentId: `multi-select-${useId()}`,
    triggerEl,
    open: openState,
    setOpen,
    modelValue: model as unknown as import('vue').Ref<unknown[]>,
    toggleValue,
    isSelected,
    size: computed(() => props.size),
    disabled: isDisabled,
    readonly: computed(() => props.readonly),
    invalid: isInvalid,
    required: isRequired,
    controlId,
    describedBy,
    labelledBy,
    pendingFocus: ref<ListboxFocusIntent>(''),
    ariaLabel: computed(() => attrs['aria-label'] as string | undefined),
    ariaLabelledby: computed(() => attrs['aria-labelledby'] as string | undefined),
    placeholder: computed(() => props.placeholder),
    displayValue: displayValueComputed,
    filled,
    registerLabel,
    labelsPending,
    labelOf,
    kind: computed(() => props.kind),
    chipLimit: computed(() => Math.max(0, Math.floor(props.chipLimit))),
    searchable: computed(() => props.searchable),
    allowCustom: computed(() => props.allowCustom),
    loading: computed(() => props.loading),
    error: computed(() => props.error),
    emptyTitle: computed(() => props.emptyTitle),
    query,
    setQuery,
    matches,
    registerOption,
    unregisterOption,
    visibleCount,
    showCreate,
    create,
    controlEl,
    focusControl,
    navigate: ref<((key: string) => void) | null>(null)
  })
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-state="openState ? 'open' : 'closed'"
    :data-size="size"
    :data-disabled="isDisabled || null"
    :data-readonly="readonly || null"
    :data-invalid="isInvalid || null"
    :data-required="isRequired || null"
    :data-filled="filled || null"
    :data-kind="kind"
    :class="attrs.class"
    class="relative inline-block w-full"
  >
    <slot />
    <FormValue
      :name="name"
      :value="model as unknown[]"
      :required="isRequired"
      :disabled="isDisabled"
    />
  </div>
</template>

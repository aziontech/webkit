<script setup lang="ts" generic="TValue extends SelectValue = SelectValue">
  import { computed, provide, type Ref, ref, shallowReactive, useAttrs, useId } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import type { ListboxFocusIntent } from '../../../composables/use-listbox-content'
  import { FieldInjectionKey } from '../field/injection-key'
  import { FormValue } from '../parts/form-value'
  import {
    SelectInjectionKey,
    type SelectKind,
    type SelectSize,
    type SelectValue
  } from './injection-key'

  defineOptions({
    name: 'Select',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Initial open state when uncontrolled. */
      defaultOpen?: boolean
      /** Trigger placeholder shown when no option is selected. */
      placeholder?: string
      /** Size token; affects trigger height. */
      size?: SelectSize
      /** Trigger look: `outlined` is the bordered field; `transparent` has no border or fill until hover, sized to its value, for a switcher inside a line of text such as the environment at the end of a breadcrumb. */
      kind?: SelectKind
      /** Disables the trigger and prevents opening. */
      disabled?: boolean
      /** Marks the field read-only; selection visible, dropdown locked. */
      readonly?: boolean
      /** Marks the field as required; applies the required (warning) border and sets aria-required on the trigger. */
      required?: boolean
      /** Applies invalid border + ring tokens and aria-invalid on the trigger. */
      invalid?: boolean
      /** Custom formatter for the trigger label; receives the current modelValue, typed as the bound model. */
      displayValue?: (value: TValue) => string
      /** Form field name: renders hidden inputs carrying the selection, so a native form submits it; required then blocks an empty submit. */
      name?: string
    }>(),
    {
      defaultOpen: false,
      placeholder: '',
      size: 'medium',
      kind: 'outlined',
      disabled: false,
      readonly: false,
      required: false,
      invalid: false,
      displayValue: undefined,
      name: ''
    }
  )

  /** Two-way bound selection: the one picked value. Its type flows to displayValue and update:modelValue. */
  const model = defineModel<TValue>({ default: undefined as never })

  /** Controlled open state for the dropdown. Use with v-model:open; while unbound the dropdown is uncontrolled and seeded by defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-select')

  const rootAttrs = computed(() => {
    const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
    return rest
  })

  const openState = computed(() => openModel.value ?? props.defaultOpen)

  const setOpen = (value: boolean) => {
    if (isDisabled.value || props.readonly) return
    openModel.value = value
  }

  const isSelected = (value: unknown): boolean => model.value === value

  const toggleValue = (value: unknown) => {
    if (isDisabled.value || props.readonly) return
    model.value = value as TValue
    setOpen(false)
  }

  const filled = computed(() => {
    const current = model.value
    return current !== undefined && current !== '' && current !== null
  })

  const labels = shallowReactive(new Map<unknown, string>())
  const registerLabel = (value: unknown, label: string) => {
    if (label && labels.get(value) !== label) labels.set(value, label)
  }
  const selectedValues = (): unknown[] => {
    const current = model.value
    return current === undefined || current === null || current === '' ? [] : [current]
  }
  const labelsPending = computed(
    () => !props.displayValue && selectedValues().some((value) => !labels.has(value))
  )

  const displayValueComputed = computed((): string => {
    const current = model.value
    if (props.displayValue) return props.displayValue(current as TValue)
    return selectedValues()
      .map((value) => labels.get(value) ?? String(value))
      .join(', ')
  })

  provide(SelectInjectionKey, {
    contentId: `select-${useId()}`,
    triggerRef: ref<globalThis.HTMLElement | null>(null),
    open: openState,
    setOpen,
    modelValue: model as Ref<SelectValue>,
    toggleValue,
    isSelected,
    size: computed(() => props.size),
    kind: computed(() => props.kind),
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
    labelsPending
  })
</script>

<script lang="ts">
  export type { SelectKind, SelectOptionItem, SelectSize, SelectValue } from './injection-key'
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-state="openState ? 'open' : 'closed'"
    :data-size="size"
    :data-kind="kind"
    :data-disabled="isDisabled || null"
    :data-readonly="readonly || null"
    :data-invalid="isInvalid || null"
    :data-required="isRequired || null"
    :data-filled="filled || null"
    :class="attrs.class"
    class="relative inline-block w-full data-[kind=transparent]:w-auto data-[kind=transparent]:max-w-full"
  >
    <slot />
    <FormValue
      :name="name"
      :value="selectedValues()"
      :required="isRequired"
      :disabled="isDisabled"
    />
  </div>
</template>

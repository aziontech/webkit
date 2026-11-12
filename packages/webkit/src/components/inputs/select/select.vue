<script setup lang="ts" generic="TValue extends SelectValue = SelectValue">
  import { computed, provide, type Ref, ref, toRef, useAttrs, useId, watch } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { fieldContextKey } from '../field/injection-key'
  import {
    selectContextKey,
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
      /** Two-way bound selection. Scalar in single mode; array in multi mode. Its type flows to displayValue and update:modelValue. */
      modelValue?: TValue
      /** When true, switches the component to multi-select. */
      multiple?: boolean
      /** Controlled open state for the dropdown. */
      open?: boolean
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
    }>(),
    {
      modelValue: undefined,
      multiple: false,
      open: undefined,
      defaultOpen: false,
      placeholder: undefined,
      size: 'medium',
      kind: 'outlined',
      disabled: false,
      readonly: false,
      required: false,
      invalid: false,
      displayValue: undefined
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: TValue]
    'update:open': [value: boolean]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const {
    controlId,
    describedBy,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled,
    required: () => props.required
  })

  provide(fieldContextKey, null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'select')

  const rootAttrs = computed(() => {
    const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
    return rest
  })

  const uncontrolledOpen = ref(props.defaultOpen)
  const openState = computed(() => (props.open !== undefined ? props.open : uncontrolledOpen.value))

  const setOpen = (value: boolean) => {
    if (isDisabled.value || props.readonly) return
    if (props.open === undefined) {
      uncontrolledOpen.value = value
    }
    emit('update:open', value)
  }

  watch(
    () => props.multiple,
    () => {
      const current = props.modelValue
      if (props.multiple && !Array.isArray(current) && current !== undefined) {
        emit('update:modelValue', (current === '' ? [] : [current]) as TValue)
      } else if (!props.multiple && Array.isArray(current)) {
        emit('update:modelValue', current[0] as TValue)
      }
    }
  )

  const isSelected = (value: unknown): boolean => {
    const current = props.modelValue
    if (Array.isArray(current)) return current.includes(value)
    return current === value
  }

  const toggleValue = (value: unknown) => {
    if (isDisabled.value || props.readonly) return
    if (props.multiple) {
      const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
      const index = current.indexOf(value)
      if (index === -1) current.push(value)
      else current.splice(index, 1)
      emit('update:modelValue', current as TValue)
      return
    }
    emit('update:modelValue', value as TValue)
    setOpen(false)
  }

  const filled = computed(() => {
    const current = props.modelValue
    if (Array.isArray(current)) return current.length > 0
    return current !== undefined && current !== '' && current !== null
  })

  const displayValueComputed = computed((): string => {
    const current = props.modelValue
    if (props.displayValue) return props.displayValue(current as TValue)
    if (Array.isArray(current)) return current.length === 0 ? '' : current.join(', ')
    if (current === undefined || current === null) return ''
    return String(current)
  })

  provide(selectContextKey, {
    contentId: `select-${useId()}`,
    triggerRef: ref<globalThis.HTMLElement | null>(null),
    open: openState,
    setOpen,
    modelValue: toRef(props, 'modelValue') as Ref<SelectValue>,
    toggleValue,
    isSelected,
    multiple: computed(() => props.multiple),
    size: computed(() => props.size),
    kind: computed(() => props.kind),
    disabled: isDisabled,
    readonly: computed(() => props.readonly),
    invalid: isInvalid,
    required: isRequired,
    controlId,
    describedBy,
    ariaLabel: computed(() => attrs['aria-label'] as string | undefined),
    ariaLabelledby: computed(() => attrs['aria-labelledby'] as string | undefined),
    placeholder: computed(() => props.placeholder),
    displayValue: displayValueComputed,
    filled
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
    :data-mode="multiple ? 'multiple' : 'single'"
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
  </div>
</template>

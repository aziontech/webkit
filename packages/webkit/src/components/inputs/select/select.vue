<script setup lang="ts">
  import { computed, provide, ref, toRef, useAttrs, useId, watch } from 'vue'

  import {
    selectContextKey,
    type SelectSize,
    type SelectValue
  } from './injection-key'

  defineOptions({
    name: 'Select',
    inheritAttrs: false
  })

  interface Props {
    /** Two-way bound selection. Scalar in single mode; array in multi mode. */
    modelValue?: SelectValue
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
    /** Disables the trigger and prevents opening. */
    disabled?: boolean
    /** Marks the field read-only; selection visible, dropdown locked. */
    readonly?: boolean
    /** Marks the field as required; sets aria-required on the trigger. */
    required?: boolean
    /** Applies invalid border + ring tokens and aria-invalid on the trigger. */
    invalid?: boolean
    /** Custom formatter for the trigger label; receives the current modelValue. */
    displayValue?: (value: unknown) => string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    multiple: false,
    open: undefined,
    defaultOpen: false,
    placeholder: undefined,
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    displayValue: undefined
  })

  const emit = defineEmits<{
    'update:modelValue': [value: SelectValue]
    'update:open': [value: boolean]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'select')

  const uncontrolledOpen = ref(props.defaultOpen)
  const openState = computed(() => (props.open !== undefined ? props.open : uncontrolledOpen.value))

  const setOpen = (value: boolean) => {
    if (props.disabled || props.readonly) return
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
        emit('update:modelValue', current === '' ? [] : [current])
      } else if (!props.multiple && Array.isArray(current)) {
        emit('update:modelValue', current[0] as SelectValue)
      }
    }
  )

  const isSelected = (value: unknown): boolean => {
    const current = props.modelValue
    if (Array.isArray(current)) return current.includes(value)
    return current === value
  }

  const toggleValue = (value: unknown) => {
    if (props.disabled || props.readonly) return
    if (props.multiple) {
      const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
      const index = current.indexOf(value)
      if (index === -1) current.push(value)
      else current.splice(index, 1)
      emit('update:modelValue', current)
      return
    }
    emit('update:modelValue', value as SelectValue)
    setOpen(false)
  }

  const filled = computed(() => {
    const current = props.modelValue
    if (Array.isArray(current)) return current.length > 0
    return current !== undefined && current !== '' && current !== null
  })

  const displayValueComputed = computed((): string => {
    const current = props.modelValue
    if (props.displayValue) return props.displayValue(current)
    if (Array.isArray(current)) return current.length === 0 ? '' : current.join(', ')
    if (current === undefined || current === null) return ''
    return String(current)
  })

  provide(selectContextKey, {
    contentId: `select-${useId()}`,
    triggerRef: ref<globalThis.HTMLElement | null>(null),
    open: openState,
    setOpen,
    modelValue: toRef(props, 'modelValue'),
    toggleValue,
    isSelected,
    multiple: computed(() => props.multiple),
    size: computed(() => props.size),
    disabled: computed(() => props.disabled),
    readonly: computed(() => props.readonly),
    invalid: computed(() => props.invalid),
    required: computed(() => props.required),
    placeholder: computed(() => props.placeholder),
    displayValue: displayValueComputed,
    filled
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="openState ? 'open' : 'closed'"
    :data-mode="multiple ? 'multiple' : 'single'"
    :data-size="size"
    :data-disabled="disabled || null"
    :data-readonly="readonly || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    :data-filled="filled || null"
    :class="attrs.class"
    class="relative inline-block w-full"
  >
    <slot />
  </div>
</template>

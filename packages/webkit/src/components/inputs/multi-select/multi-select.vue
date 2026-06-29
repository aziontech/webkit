<script setup lang="ts">
  import { computed, provide, ref, toRef, useAttrs, useId } from 'vue'

  import { multiSelectContextKey, type MultiSelectSize } from './injection-key'

  defineOptions({
    name: 'MultiSelect',
    inheritAttrs: false
  })

  interface Props {
    /** Two-way bound selection. Always an array; each item is the value of a selected option. */
    modelValue?: unknown[]
    /** Controlled open state for the dropdown. */
    open?: boolean
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
    displayValue?: (value: unknown[]) => string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    open: undefined,
    defaultOpen: false,
    placeholder: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    displayValue: undefined
  })

  const emit = defineEmits<{
    'update:modelValue': [value: unknown[]]
    'update:open': [value: boolean]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-multi-select'
  )

  const uncontrolledOpen = ref(props.defaultOpen)
  const openState = computed(() => (props.open !== undefined ? props.open : uncontrolledOpen.value))

  const setOpen = (value: boolean) => {
    if (props.disabled || props.readonly) return
    if (props.open === undefined) {
      uncontrolledOpen.value = value
    }
    emit('update:open', value)
  }

  const currentArray = (): unknown[] => (Array.isArray(props.modelValue) ? props.modelValue : [])

  const isSelected = (value: unknown): boolean => currentArray().indexOf(value) !== -1

  const toggleValue = (value: unknown) => {
    if (props.disabled || props.readonly) return
    const next = [...currentArray()]
    const index = next.indexOf(value)
    if (index === -1) next.push(value)
    else next.splice(index, 1)
    emit('update:modelValue', next)
  }

  const filled = computed(() => currentArray().length > 0)

  const displayValueComputed = computed((): string => {
    const current = currentArray()
    if (props.displayValue) return props.displayValue(current)
    if (current.length === 0) return ''
    return current.join(', ')
  })

  provide(multiSelectContextKey, {
    contentId: `multi-select-${useId()}`,
    triggerRef: ref<globalThis.HTMLElement | null>(null),
    open: openState,
    setOpen,
    modelValue: toRef(props, 'modelValue') as unknown as import('vue').Ref<unknown[]>,
    toggleValue,
    isSelected,
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

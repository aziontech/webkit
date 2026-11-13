<script setup lang="ts" generic="TValue = unknown">
  import { computed, provide, ref, shallowReactive, useAttrs, useId } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { fieldContextKey } from '../field/injection-key'
  import { multiSelectContextKey, type MultiSelectSize } from './injection-key'

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
    }>(),
    {
      defaultOpen: false,
      placeholder: '',
      size: 'medium',
      disabled: false,
      readonly: false,
      required: false,
      invalid: false,
      displayValue: undefined
    }
  )

  /** Two-way bound selection. Always an array; each item is the value of a selected option, typed as the bound array's items. */
  const model = defineModel<TValue[]>({ default: () => [] })

  /** Controlled open state for the dropdown. Use with v-model:open; while unbound the dropdown is uncontrolled and seeded by defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

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

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-multi-select'
  )

  const rootAttrs = computed(() => {
    const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs
    return rest
  })

  const openState = computed(() => openModel.value ?? props.defaultOpen)

  const setOpen = (value: boolean) => {
    if (isDisabled.value || props.readonly) return
    openModel.value = value
  }

  const currentArray = (): unknown[] => (Array.isArray(model.value) ? model.value : [])

  const isSelected = (value: unknown): boolean => currentArray().indexOf(value) !== -1

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

  const displayValueComputed = computed((): string => {
    const current = currentArray()
    if (props.displayValue) return props.displayValue(current as TValue[])
    if (current.length === 0) return ''
    return current.map((value) => labels.get(value) ?? String(value)).join(', ')
  })

  provide(multiSelectContextKey, {
    contentId: `multi-select-${useId()}`,
    triggerRef: ref<globalThis.HTMLElement | null>(null),
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
    ariaLabel: computed(() => attrs['aria-label'] as string | undefined),
    ariaLabelledby: computed(() => attrs['aria-labelledby'] as string | undefined),
    placeholder: computed(() => props.placeholder),
    displayValue: displayValueComputed,
    filled,
    registerLabel,
    labelsPending
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
    :class="attrs.class"
    class="relative inline-block w-full"
  >
    <slot />
  </div>
</template>

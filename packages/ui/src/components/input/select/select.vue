<script setup lang="ts" generic="TValue extends SelectValue = SelectValue">
  import { computed, provide, type Ref, useAttrs } from 'vue'

  import { useSelectRoot } from '../../../composables/use-select-root'
  import { FormValue } from '../parts/form-value'
  import {
    SelectInjectionKey,
    type SelectSize,
    type SelectValue,
    type SelectVariant
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
      /**
       * Trigger look: `outline` is the bordered field; `ghost` has no border or fill until hover, sized to
       * its value, for a switcher inside a line of text such as the environment at the end of a breadcrumb.
       */
      variant?: SelectVariant
      /** Disables the trigger and prevents opening. */
      disabled?: boolean
      /** Marks the field read-only; selection visible, dropdown locked. */
      readonly?: boolean
      /** Marks the field as required and sets aria-required on the trigger; it draws no border of its own. */
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
      variant: 'outline',
      disabled: false,
      readonly: false,
      required: false,
      invalid: false,
      displayValue: undefined,
      name: ''
    }
  )

  /** Two-way bound selection: the one picked value. Its type flows to displayValue and to the v-model update. */
  const model = defineModel<TValue>({ default: undefined as never })

  /** Controlled open state for the dropdown. Use with v-model:open; while unbound the dropdown is uncontrolled and seeded by defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const root = useSelectRoot('select', props, openModel)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'select')

  const isSelected = (value: unknown): boolean => model.value === value

  const toggleValue = (value: unknown) => {
    if (root.locked()) return
    model.value = value as TValue
    root.setOpen(false)
  }

  const filled = computed(() => model.value != null && (model.value !== '' || root.labels.has('')))
  const selectedValues = (): unknown[] => (filled.value ? [model.value] : [])
  const labelsPending = computed(
    () =>
      (model.value === '' && !root.labels.has('')) ||
      (!props.displayValue && selectedValues().some((value) => !root.labels.has(value)))
  )

  const displayValueComputed = computed((): string => {
    const current = model.value
    if (props.displayValue) return props.displayValue(current as TValue)
    return selectedValues()
      .map((value) => root.labels.get(value) ?? String(value))
      .join(', ')
  })

  provide(SelectInjectionKey, {
    ...root,
    modelValue: model as Ref<SelectValue>,
    toggleValue,
    isSelected,
    variant: computed(() => props.variant),
    placeholder: computed(() => props.placeholder),
    displayValue: displayValueComputed,
    filled,
    labelsPending
  })
</script>

<script lang="ts">
  export type { SelectOptionItem, SelectSize, SelectValue, SelectVariant } from './injection-key'
</script>

<template>
  <div
    v-bind="root.rootAttrs.value"
    :data-testid="testId"
    :data-variant="variant"
    :data-filled="filled || null"
    :class="attrs.class"
    class="relative inline-block w-full data-[variant=ghost]:w-auto data-[variant=ghost]:max-w-full"
  >
    <slot />
    <FormValue
      :name="name"
      :value="selectedValues()"
      :required="root.required.value"
      :disabled="root.disabled.value"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { useLocale } from '../../../composables/use-locale'
  import * as en from '../../../i18n/messages/en'
  import { PASSWORD_MANAGER_IGNORE } from '../../../utils/autofill'

  export type NumberInputSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'NumberInput',
    inheritAttrs: false
  })

  interface Props {
    /** v-model value (always numeric; cleared input falls back to `min ?? 0`). */
    modelValue?: number
    /** Text shown when the input is empty. */
    placeholder?: string
    /** Size token; affects height, padding, and typography. */
    size?: NumberInputSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the field as read-only; spinner buttons are inert. */
    readonly?: boolean
    /** Applies the invalid border/ring tokens. */
    invalid?: boolean
    /** Marks the field as required for assistive tech. */
    required?: boolean
    /** Minimum allowed value; spinner stops at this bound. */
    min?: number
    /** Maximum allowed value; spinner stops at this bound. */
    max?: number
    /** Increment used by the spinner buttons and arrow keys. */
    step?: number
    /** Renders the chevron-up/chevron-down spinner controls. */
    showButtons?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    placeholder: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    invalid: false,
    required: false,
    min: undefined,
    max: undefined,
    step: 1,
    showButtons: true
  })

  const emit = defineEmits<{
    'update:modelValue': [value: number]
    change: [value: number]
  }>()

  defineSlots<{
    prefix(): unknown
    suffix(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useLocale({ numberInput: en.numberInput })

  const {
    controlId,
    describedBy,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldControl({
    id: () => attrs['id'] as string | undefined,
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    invalid: () => props.invalid,
    disabled: () => props.disabled,
    required: () => props.required
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'number-input')

  const passthroughAttrs = computed(() => {
    const rest: Record<string, unknown> = { ...attrs }
    delete rest['class']
    delete rest['data-testid']
    return rest
  })

  const fallback = (): number => props.min ?? 0

  const clamp = (value: number): number => {
    let next = value
    if (typeof props.min === 'number' && next < props.min) next = props.min
    if (typeof props.max === 'number' && next > props.max) next = props.max
    return next
  }

  const readValue = (event: Event): number => {
    const target = event.target as HTMLInputElement | null
    const raw = target?.valueAsNumber ?? Number.NaN
    return clamp(Number.isNaN(raw) ? fallback() : raw)
  }

  const handleInput = (event: Event) => {
    emit('update:modelValue', readValue(event))
  }

  const handleChange = (event: Event) => {
    emit('change', readValue(event))
  }

  const canInteract = computed(() => !isDisabled.value && !props.readonly)

  const handleIncrement = () => {
    if (!canInteract.value) return
    emit('update:modelValue', clamp(props.modelValue + props.step))
  }

  const handleDecrement = () => {
    if (!canInteract.value) return
    emit('update:modelValue', clamp(props.modelValue - props.step))
  }
</script>

<template>
  <span
    :data-size="size"
    :data-disabled="isDisabled || null"
    :data-invalid="isInvalid || null"
    :data-required="isRequired || null"
    :class="[
      'relative inline-flex w-full items-center overflow-hidden',
      'rounded-(--shape-elements)',
      'border border-(--border-default) bg-(--bg-surface) text-(--text-default)',
      'transition-colors duration-150 ease-out motion-reduce:transition-none',
      '[&:not(:focus-within):not([data-disabled])]:hover:border-(--border-strong)',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-(--ring-color) focus-within:ring-offset-2 focus-within:ring-offset-(--bg-canvas)',
      'data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10',
      'data-[invalid]:border-(--danger-border)',
      'data-[required]:border-(--warning-border)',
      'data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed data-[disabled]:hover:border-(--border-default) data-[disabled]:focus-within:ring-0 data-[disabled]:focus-within:ring-offset-0',
      attrs['class']
    ]"
  >
    <span
      v-if="$slots['prefix']"
      class="relative z-(--z-input-field) flex items-center ps-(--spacing-md) text-(--text-muted)"
    >
      <slot name="prefix" />
    </span>

    <input
      type="number"
      :id="controlId"
      :aria-describedby="describedBy"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :required="isRequired"
      :min="min"
      :max="max"
      :step="step"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :data-testid="testId"
      dir="auto"
      v-bind="{ ...PASSWORD_MANAGER_IGNORE, ...passthroughAttrs }"
      class="relative z-(--z-input-field) w-full min-w-0 border-0 bg-transparent outline-none px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled) read-only:cursor-default [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      @input="handleInput"
      @change="handleChange"
    />

    <span
      v-if="$slots['suffix']"
      class="relative z-(--z-input-field) flex items-center pe-(--spacing-md) text-(--text-muted)"
    >
      <slot name="suffix" />
    </span>

    <span
      v-if="disabled"
      class="relative z-(--z-input-field) flex items-center pe-(--spacing-md) text-(--text-disabled)"
      aria-hidden="true"
    >
      <i class="pi pi-lock text-label-sm leading-none" />
    </span>

    <span
      v-if="showButtons"
      class="relative z-(--z-input-field) flex h-full w-12 shrink-0 flex-col self-stretch border-s border-(--border-default)"
    >
      <button
        type="button"
        tabindex="-1"
        :aria-label="t('numberInput.increment')"
        :disabled="isDisabled || readonly"
        class="flex flex-1 items-center justify-center border-b border-(--border-default) text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) disabled:cursor-not-allowed disabled:text-(--text-disabled)"
        @click="handleIncrement"
      >
        <i
          class="pi pi-chevron-up text-[0.625rem] leading-none"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        tabindex="-1"
        :aria-label="t('numberInput.decrement')"
        :disabled="isDisabled || readonly"
        class="flex flex-1 items-center justify-center text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) disabled:cursor-not-allowed disabled:text-(--text-disabled)"
        @click="handleDecrement"
      >
        <i
          class="pi pi-chevron-down text-[0.625rem] leading-none"
          aria-hidden="true"
        />
      </button>
    </span>
  </span>
</template>

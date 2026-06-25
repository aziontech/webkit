<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type InputNumberSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'InputNumber',
    inheritAttrs: false
  })

  interface Props {
    /** v-model value (always numeric; cleared input falls back to `min ?? 0`). */
    modelValue?: number
    /** Text shown when the input is empty. */
    placeholder?: string
    /** Size token; affects height, padding, and typography. */
    size?: InputNumberSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the field as read-only; spinner buttons are inert. */
    readonly?: boolean
    /** Applies the invalid border/ring tokens. */
    invalid?: boolean
    /** Marks the field as required for assistive tech. */
    required?: boolean
    /** Minimum allowed value; spinner stops at this bound. */
    min?: number | null
    /** Maximum allowed value; spinner stops at this bound. */
    max?: number | null
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
    min: null,
    max: null,
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-number')

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

  const canInteract = computed(() => !props.disabled && !props.readonly)

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
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    :class="[
      'relative inline-flex w-full items-center overflow-hidden',
      'rounded-[var(--shape-elements)]',
      'border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-default)]',
      'transition-colors duration-150 ease-out motion-reduce:transition-none',
      '[&:not(:focus-within):not([data-disabled])]:hover:border-[var(--border-strong)]',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring-color)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-canvas)]',
      'data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10',
      'data-[invalid]:border-[var(--danger-border)]',
      'data-[required]:border-[var(--warning-border)]',
      'data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:cursor-not-allowed data-[disabled]:hover:border-[var(--border-default)] data-[disabled]:focus-within:ring-0 data-[disabled]:focus-within:ring-offset-0',
      attrs['class']
    ]"
  >
    <span
      v-if="$slots['prefix']"
      class="relative z-[1] flex items-center pl-[var(--spacing-md)] text-[var(--text-muted)]"
    >
      <slot name="prefix" />
    </span>

    <input
      type="number"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :min="min"
      :max="max"
      :step="step"
      :aria-invalid="invalid || undefined"
      :aria-required="required || undefined"
      :data-testid="testId"
      v-bind="passthroughAttrs"
      class="relative z-[1] w-full min-w-0 border-0 bg-transparent outline-none px-[var(--spacing-md)] text-label-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] read-only:cursor-default [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      @input="handleInput"
      @change="handleChange"
    />

    <span
      v-if="$slots['suffix']"
      class="relative z-[1] flex items-center pr-[var(--spacing-md)] text-[var(--text-muted)]"
    >
      <slot name="suffix" />
    </span>

    <span
      v-if="disabled"
      class="relative z-[1] flex items-center pr-[var(--spacing-md)] text-[var(--text-disabled)]"
      aria-hidden="true"
    >
      <i class="pi pi-lock text-label-sm leading-none" />
    </span>

    <span
      v-if="showButtons"
      class="relative z-[1] flex h-full w-12 shrink-0 flex-col self-stretch border-l border-[var(--border-default)]"
    >
      <button
        type="button"
        tabindex="-1"
        aria-label="Increment"
        :disabled="disabled || readonly"
        class="flex flex-1 items-center justify-center border-b border-[var(--border-default)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
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
        aria-label="Decrement"
        :disabled="disabled || readonly"
        class="flex flex-1 items-center justify-center text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
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

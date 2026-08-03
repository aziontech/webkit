<script setup lang="ts">
  import { computed, ref, useAttrs, useSlots } from 'vue'

  export type InputTextSize = 'small' | 'medium' | 'large'
  export type InputTextType = 'text' | 'email' | 'number'

  defineOptions({
    name: 'InputText',
    inheritAttrs: false
  })

  interface Props {
    /** Two-way bound value of the field. */
    modelValue?: string
    /** Placeholder shown when the field is empty. */
    placeholder?: string
    /** Native input type. Restricted to plain-text variants the field treats identically. */
    type?: InputTextType
    /** Native maxlength — maximum number of characters allowed. */
    maxLength?: number
    /** Size token; affects height only. Heights: small=28px, medium=32px, large=40px. */
    size?: InputTextSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the field read-only; value is visible but not editable. */
    readonly?: boolean
    /** Marks the field as required; sets native required and aria-required. */
    required?: boolean
    /** Applies the invalid border + ring tokens and sets aria-invalid. */
    invalid?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    type: 'text',
    maxLength: undefined
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  defineSlots<{
    iconLeft(): unknown
    iconRight(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const inputRef = ref<globalThis.HTMLInputElement | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-text')

  const passthroughAttrs = computed(() => {
    const rest: Record<string, unknown> = { ...attrs }
    delete rest['class']
    delete rest['data-testid']
    return rest
  })

  const hasIconLeft = computed(() => Boolean(slots['iconLeft']))
  const hasIconRight = computed(() => Boolean(slots['iconRight']))

  const handleInput = (event: globalThis.Event) => {
    const target = event.target as globalThis.HTMLInputElement
    emit('update:modelValue', target.value)
  }

  const handleChromeMouseDown = (event: globalThis.MouseEvent) => {
    if (props.disabled) return
    if (event.target === inputRef.value) return
    event.preventDefault()
    inputRef.value?.focus()
  }
</script>

<template>
  <span
    :data-size="size"
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    :data-has-icon-left="hasIconLeft || null"
    :data-has-icon-right="hasIconRight || null"
    :class="[
      'relative inline-flex items-center w-full cursor-text',
      'gap-(--spacing-xs) px-(--spacing-sm)',
      'rounded-(--shape-elements)',
      'border border-(--border-default) bg-(--bg-surface) text-(--text-default)',
      'transition-colors duration-150 ease-out motion-reduce:transition-none',
      '[&:not(:focus-within):not([data-disabled])]:hover:border-(--border-strong)',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-(--ring-color) focus-within:ring-offset-2 focus-within:ring-offset-(--bg-canvas)',
      'data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10',
      'data-[invalid]:border-(--danger-border)',
      'data-[required]:border-(--warning-border)',
      'data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed data-[disabled]:hover:border-(--border-default) data-[disabled]:focus-within:ring-0 data-[disabled]:focus-within:ring-offset-0',
      attrs.class
    ]"
    @mousedown="handleChromeMouseDown"
  >
    <span
      v-if="hasIconLeft"
      class="inline-flex shrink-0 items-center justify-center text-(--text-muted)"
      aria-hidden="true"
    >
      <slot name="iconLeft" />
    </span>

    <input
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :aria-invalid="invalid || undefined"
      :aria-required="required || undefined"
      :data-testid="testId"
      class="relative z-(--z-input-field) h-full w-full min-w-0 self-stretch border-0 bg-transparent p-0 outline-none text-label-sm text-(--text-default) placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled) read-only:cursor-default"
      v-bind="passthroughAttrs"
      @input="handleInput"
    />

    <span
      v-if="hasIconRight"
      class="inline-flex shrink-0 items-center justify-center text-(--text-muted)"
      aria-hidden="true"
    >
      <slot name="iconRight" />
    </span>
  </span>
</template>

<script setup lang="ts">
  import { computed, ref, useAttrs, useSlots } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { passwordManagerHints } from '../../../utils/autofill'

  export type InputSize = 'small' | 'medium' | 'large'
  export type InputType = 'text' | 'email' | 'number'

  defineOptions({
    name: 'Input',
    inheritAttrs: false
  })

  interface Props {
    /** Two-way bound value of the field. */
    modelValue?: string
    /** Placeholder shown when the field is empty. */
    placeholder?: string
    /** Native input type. Restricted to plain-text variants the field treats identically. */
    type?: InputType
    /** Native maxlength — maximum number of characters allowed. */
    maxLength?: number
    /**
     * Native autocomplete token for the <input> (e.g. "email", "username", "off"). Omitted when
     * unset, so the browser keeps its own default.
     */
    autocomplete?: string
    /**
     * Native spellcheck on the <input>. Set false for slugs, IDs, domains and code. Omitted when
     * unset, so the browser keeps its own default.
     */
    spellcheck?: boolean
    /** Size token; affects height only. Heights: small=28px, medium=32px, large=40px. */
    size?: InputSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the field read-only; value is visible but not editable. */
    readonly?: boolean
    /** Marks the field as required; sets native required and aria-required. */
    required?: boolean
    /** Applies the invalid border + ring tokens and sets aria-invalid. */
    invalid?: boolean
    /** Sets the value and placeholder in the monospace code face, for CLI commands, IDs, tokens and hashes. */
    monospace?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    monospace: false,
    type: 'text',
    maxLength: undefined,
    autocomplete: undefined,
    spellcheck: undefined
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input')

  const passthroughAttrs = computed(() => {
    const rest: Record<string, unknown> = { ...attrs }
    delete rest['class']
    delete rest['data-testid']
    return rest
  })

  const autofillHints = computed(() =>
    passwordManagerHints({
      autocomplete: props.autocomplete,
      type: props.type,
      readonly: props.readonly
    })
  )

  const hasIconLeft = () => Boolean(slots['iconLeft'])
  const hasIconRight = () => Boolean(slots['iconRight'])

  const handleInput = (event: globalThis.Event) => {
    const target = event.target as globalThis.HTMLInputElement
    emit('update:modelValue', target.value)
  }

  const handleChromeMouseDown = (event: globalThis.MouseEvent) => {
    if (isDisabled.value) return
    if (event.target === inputRef.value) return
    event.preventDefault()
    inputRef.value?.focus()
  }
</script>

<template>
  <span
    :data-size="size"
    :data-disabled="isDisabled || null"
    :data-readonly="readonly || null"
    :data-invalid="isInvalid || null"
    :data-required="isRequired || null"
    :data-monospace="monospace || null"
    :data-has-icon-left="hasIconLeft() || null"
    :data-has-icon-right="hasIconRight() || null"
    :class="[
      'group/input relative inline-flex items-center w-full cursor-text',
      'gap-(--spacing-xs) px-(--spacing-sm)',
      'rounded-(--shape-elements)',
      'border border-(--border-default) bg-(--bg-surface) text-(--text-default)',
      'transition-colors duration-150 ease-out motion-reduce:transition-none',
      '[&:not(:focus-within):not([data-disabled]):not([data-readonly])]:hover:border-(--border-strong)',
      // The ring offset must match the surface BEHIND the field: a host that puts the
      // field on something other than the canvas retunes it by redeclaring the input
      // ring-offset custom property on any ancestor — custom properties inherit, so one
      // declaration covers a whole group of fields.
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-(--ring-color) focus-within:ring-offset-2 focus-within:ring-offset-[var(--input-ring-offset,var(--bg-canvas))]',
      'data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10',
      'data-[invalid]:border-(--danger-border)',
      'data-[required]:border-(--warning-border)',
      'data-[readonly]:cursor-default',
      'data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed data-[disabled]:hover:border-(--border-default) data-[disabled]:focus-within:ring-0 data-[disabled]:focus-within:ring-offset-0',
      attrs.class
    ]"
    @mousedown="handleChromeMouseDown"
  >
    <span
      v-if="hasIconLeft()"
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
      :autocomplete="autocomplete"
      :spellcheck="spellcheck"
      :disabled="isDisabled"
      :readonly="readonly"
      :required="isRequired"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :data-testid="testId"
      dir="auto"
      class="relative z-(--z-input-field) h-full w-full min-w-0 self-stretch border-0 bg-transparent p-0 outline-none text-label-sm group-data-[monospace]/input:text-label-code-sm text-(--text-default) placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled) read-only:cursor-default"
      v-bind="{ ...autofillHints, ...passthroughAttrs }"
      :id="controlId"
      :aria-describedby="describedBy"
      @input="handleInput"
    />

    <span
      v-if="hasIconRight()"
      class="inline-flex shrink-0 items-center justify-center text-(--text-muted)"
      aria-hidden="true"
    >
      <slot name="iconRight" />
    </span>
  </span>
</template>

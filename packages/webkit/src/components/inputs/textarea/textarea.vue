<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Textarea',
    inheritAttrs: false
  })

  type TextareaResize = 'vertical' | 'horizontal' | 'both' | 'none'

  interface Props {
    /** Bound value (v-model). */
    modelValue?: string
    /** Placeholder shown when the field is empty. */
    placeholder?: string
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
    /** Marks the field as read-only; keeps focus styling, blocks edits. */
    readonly?: boolean
    /** Applies invalid styling and sets aria-invalid. */
    invalid?: boolean
    /** Marks the field as required and sets aria-required. */
    required?: boolean
    /** Which axes the user can drag to resize the field. */
    resizable?: TextareaResize
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '',
    disabled: false,
    readonly: false,
    invalid: false,
    required: false,
    resizable: 'vertical'
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-textarea')
  const isFilled = computed(() => props.modelValue.length > 0)

  const passthroughAttrs = computed(() => {
    const rest: Record<string, unknown> = { ...attrs }
    delete rest['class']
    delete rest['data-testid']
    return rest
  })

  const handleInput = (event: globalThis.Event) => {
    const target = event.target as globalThis.HTMLTextAreaElement
    emit('update:modelValue', target.value)
  }
</script>

<template>
  <!-- `style="width: 100%"` is inline on purpose: Storybook's Tailwind runs with
       `important: true` (apps/storybook/tailwind.config.js), so `w-full` compiles
       to `width: 100% !important` and beats the plain inline width the browser
       writes when the user drags the native resize handle horizontally. Setting
       width as a plain inline declaration lets the drag handle overwrite it. -->
  <textarea
    v-bind="passthroughAttrs"
    style="width: 100%"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :aria-invalid="invalid || undefined"
    :aria-required="required || undefined"
    :aria-disabled="disabled || undefined"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    :data-readonly="readonly || null"
    :data-filled="isFilled || null"
    :data-resize="resizable"
    :class="[
      'relative block min-w-0 min-h-[80px]',
      'px-[var(--spacing-sm)] py-[var(--spacing-sm)]',
      'rounded-[var(--shape-elements)]',
      'border border-[var(--border-default)] bg-[var(--bg-surface)] text-body-xs text-[var(--text-default)]',
      'placeholder:text-[var(--text-muted)]',
      'transition-colors duration-150 ease-out motion-reduce:transition-none',
      '[&:not(:focus):not([data-disabled])]:hover:border-[var(--border-strong)]',
      'focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:ring-offset-2 focus:ring-offset-[var(--bg-canvas)]',
      'data-[invalid]:border-[var(--danger-border)]',
      'data-[required]:border-[var(--warning-border)]',
      'data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:placeholder:text-[var(--text-disabled)] data-[disabled]:cursor-not-allowed data-[disabled]:hover:border-[var(--border-default)] data-[disabled]:focus:ring-0 data-[disabled]:focus:ring-offset-0',
      'data-[readonly]:cursor-default',
      'data-[resize=vertical]:resize-y data-[resize=horizontal]:resize-x data-[resize=both]:resize data-[resize=none]:resize-none',
      attrs.class
    ]"
    @input="handleInput"
  />
</template>

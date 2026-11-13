<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'

  defineOptions({
    name: 'Textarea',
    inheritAttrs: false
  })

  type TextareaResize = 'vertical' | 'horizontal' | 'both' | 'none'

  interface Props {
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
    /** Sets the value and placeholder in the monospace code face, for pasted zone files, certificates, JSON and lists of IPs. */
    monospace?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    disabled: false,
    readonly: false,
    invalid: false,
    required: false,
    resizable: 'vertical',
    monospace: false
  })

  /** Bound value (v-model). */
  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()
  const textareaRef = ref<globalThis.HTMLTextAreaElement | null>(null)

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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-textarea')
  const isFilled = computed(() => (model.value ?? '').length > 0)

  const passthroughAttrs = computed(() => {
    const rest: Record<string, unknown> = { ...attrs }
    delete rest['class']
    delete rest['data-testid']
    return rest
  })

  const handleInput = (event: globalThis.Event) => {
    const target = event.target as globalThis.HTMLTextAreaElement
    model.value = target.value
  }

  defineExpose({
    /** Moves focus to the native field. */
    focus: (): void => textareaRef.value?.focus()
  })
</script>

<template>
  <textarea
    ref="textareaRef"
    dir="auto"
    v-bind="passthroughAttrs"
    :id="controlId"
    :aria-describedby="describedBy"
    style="width: 100%"
    :value="model"
    :placeholder="placeholder"
    :disabled="isDisabled"
    :readonly="readonly"
    :required="isRequired"
    :aria-invalid="isInvalid || undefined"
    :aria-required="isRequired || undefined"
    :aria-disabled="isDisabled || undefined"
    :data-testid="testId"
    :data-disabled="isDisabled || null"
    :data-invalid="isInvalid || null"
    :data-required="isRequired || null"
    :data-readonly="readonly || null"
    :data-monospace="monospace || null"
    :data-filled="isFilled || null"
    :data-resize="resizable"
    class="relative block min-w-0 min-h-[80px] px-(--spacing-sm) py-(--spacing-sm) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) text-body-xs text-(--text-default) data-[monospace]:text-body-code-sm placeholder:text-(--text-muted) transition-colors duration-150 ease-out motion-reduce:transition-none [&:not(:focus):not([data-disabled]):not([data-readonly])]:hover:border-(--border-strong) focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-(--ring-color) focus:ring-offset-2 focus:ring-offset-(--bg-canvas) data-[invalid]:border-(--danger-border) data-[required]:border-(--warning-border) data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:placeholder:text-(--text-disabled) data-[disabled]:cursor-not-allowed data-[disabled]:hover:border-(--border-default) data-[disabled]:focus:ring-0 data-[disabled]:focus:ring-offset-0 data-[readonly]:cursor-default data-[resize=vertical]:resize-y data-[resize=horizontal]:resize-x data-[resize=both]:resize data-[resize=none]:resize-none"
    :class="attrs.class"
    @input="handleInput"
  />
</template>

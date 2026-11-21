<script setup lang="ts">
  import type { StyleValue } from 'vue'
  import { computed, nextTick, onMounted, ref, useAttrs, watch } from 'vue'

  import { useFieldAttrs } from '../../../composables/use-field-attrs'

  defineOptions({
    name: 'Textarea',
    inheritAttrs: false
  })

  /** Axes the user can drag to resize the field. */
  export type TextareaResize = 'vertical' | 'horizontal' | 'both' | 'none'

  export interface TextareaProps {
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
    /** Which axes the user can drag to resize the field, named after the CSS resize property. */
    resize?: TextareaResize
    /** Sets the value and placeholder in the monospace code face, for pasted zone files, certificates, JSON and lists of IPs. */
    monospace?: boolean
    /** Grows the field with its content instead of a fixed height; turns the drag handle off. */
    autoResize?: boolean
    /** Lines the field shows when empty while autoResize is on. */
    minRows?: number
    /** Lines the field grows to before it scrolls while autoResize is on; 0 sets no limit. */
    maxRows?: number
  }
  const props = withDefaults(defineProps<TextareaProps>(), {
    placeholder: '',
    disabled: false,
    readonly: false,
    invalid: false,
    required: false,
    resize: 'vertical',
    monospace: false,
    autoResize: false,
    minRows: 1,
    maxRows: 0
  })

  /** Bound value (v-model). */
  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()
  const textareaEl = ref<globalThis.HTMLTextAreaElement | null>(null)

  const {
    controlId,
    describedBy,
    passthroughAttrs,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldAttrs(props)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'textarea')
  const isFilled = computed(() => (model.value ?? '').length > 0)

  const resizeAxis = computed(() => (props.autoResize ? 'none' : props.resize))
  const maxRows = computed(() => (props.autoResize && props.maxRows > 0 ? props.maxRows : null))
  const sizing = computed<StyleValue>(() =>
    props.autoResize
      ? {
          width: '100%',
          '--textarea-min-rows': props.minRows,
          '--textarea-max-rows': maxRows.value ?? undefined
        }
      : { width: '100%' }
  )

  const measuresHeight = ref(false)

  const fitHeight = () => {
    const field = textareaEl.value
    if (!field || !measuresHeight.value || !props.autoResize) return
    field.style.height = 'auto'
    field.style.height = `${field.scrollHeight + field.offsetHeight - field.clientHeight}px`
  }

  onMounted(() => {
    measuresHeight.value = !globalThis.CSS?.supports?.('field-sizing', 'content')
    fitHeight()
  })

  watch(
    () => [model.value, props.autoResize, props.minRows, props.maxRows],
    () => nextTick(fitHeight)
  )

  const onInput = (event: globalThis.Event) => {
    const target = event.target as globalThis.HTMLTextAreaElement
    model.value = target.value
  }

  defineExpose({
    /** Moves focus to the native field. */
    focus: (): void => textareaEl.value?.focus()
  })

  const ROOT_CLASS =
    'relative block min-w-0 min-h-[80px] px-(--spacing-sm) py-(--spacing-sm) rounded-(--shape-control) border border-(--border-input) bg-(--bg-surface) text-body-xs ' +
    'text-(--text-default) ' +
    'data-[monospace]:text-body-code-sm ' +
    'pointer-coarse:text-body-md pointer-coarse:data-[monospace]:text-label-code-lg placeholder:text-(--text-muted) ' +
    'transition-colors duration-150 ease-out motion-reduce:transition-none ' +
    '[&:not(:focus):not([data-disabled]):not([data-readonly])]:hover:border-(--border-strong) ' +
    'focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-(--ring-color) focus:ring-offset-2 focus:ring-offset-(--bg-canvas) ' +
    'data-[invalid]:border-(--danger-border) ' +
    'data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:placeholder:text-(--text-disabled) data-[disabled]:cursor-not-allowed ' +
    'data-[disabled]:hover:border-(--border-input) data-[disabled]:focus:ring-0 data-[disabled]:focus:ring-offset-0 ' +
    'data-[readonly]:cursor-default ' +
    'data-[resize=vertical]:resize-y data-[resize=horizontal]:resize-x data-[resize=both]:resize data-[resize=none]:resize-none ' +
    'data-[auto-resize]:field-sizing-content data-[auto-resize]:min-h-[calc(var(--textarea-min-rows)*1lh+var(--spacing-sm)*2+2px)] ' +
    'data-[max-rows]:max-h-[calc(var(--textarea-max-rows)*1lh+var(--spacing-sm)*2+2px)] data-[max-rows]:overflow-y-auto'
</script>

<template>
  <textarea
    ref="textareaEl"
    dir="auto"
    v-bind="passthroughAttrs"
    :id="controlId"
    :aria-describedby="describedBy"
    :style="sizing"
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
    :data-resize="resizeAxis"
    :data-auto-resize="autoResize || null"
    :data-max-rows="maxRows"
    :class="[ROOT_CLASS, attrs.class]"
    @input="onInput"
  />
</template>

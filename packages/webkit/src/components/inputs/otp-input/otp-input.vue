<script setup lang="ts">
  import { computed, onMounted, ref, useAttrs, watch } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'

  export type OtpInputMode = 'numeric' | 'alphanumeric'

  defineOptions({
    name: 'OtpInput',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** The code typed so far, without separators. */
      modelValue?: string
      /** How many characters the code has; one box each. */
      length?: number
      /** `numeric` keeps digits and opens the number keypad; `alphanumeric` keeps letters and digits, upper case. */
      mode?: OtpInputMode
      /** Draw a separator after every `group` boxes (`3` gives `123 – 456`). `0` draws none. */
      group?: number
      /** Disables the field while a code is being checked. */
      disabled?: boolean
      /** Danger borders on every box and `aria-invalid`; set after a rejected code. */
      invalid?: boolean
      /** Native `required` and `aria-required`. */
      required?: boolean
      /** Focus the field on mount, for a screen whose only task is the code. */
      autofocus?: boolean
    }>(),
    {
      modelValue: '',
      length: 6,
      mode: 'numeric',
      group: 0,
      disabled: false,
      invalid: false,
      required: false,
      autofocus: false
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    complete: [value: string]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ otpInput: en.otpInput })

  const {
    field,
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

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'otp-input')

  const passthroughAttrs = computed<Record<string, unknown>>(() => {
    const rest: Record<string, unknown> = { ...attrs }
    delete rest['class']
    delete rest['data-testid']
    delete rest['id']
    delete rest['aria-describedby']
    return rest
  })

  const fallbackName = computed<string | undefined>(() => {
    if (field || attrs['id'] || attrs['aria-label'] || attrs['aria-labelledby']) return undefined
    return t('otpInput.label')
  })

  const size = computed<number>(() => Math.max(1, Math.floor(props.length)))

  const clean = (raw: string): string => {
    const kept =
      props.mode === 'numeric'
        ? raw.replace(/\D+/g, '')
        : raw.replace(/[^0-9a-z]+/gi, '').toUpperCase()
    return kept.slice(0, size.value)
  }

  const input = ref<HTMLInputElement | null>(null)
  const focused = ref<boolean>(false)
  const value = computed<string>(() => clean(props.modelValue ?? ''))

  const boxes = computed(() =>
    Array.from({ length: size.value }, (_, index) => ({
      index,
      char: value.value.charAt(index),
      separator: props.group > 0 && index > 0 && index % props.group === 0
    }))
  )

  const activeIndex = computed<number>(() => Math.min(value.value.length, size.value - 1))

  const caretToEnd = () => {
    const element = input.value
    if (!element || typeof element.setSelectionRange !== 'function') return
    const end = element.value.length
    if (element.selectionStart !== end || element.selectionEnd !== end) {
      element.setSelectionRange(end, end)
    }
  }

  let lastComplete = ''

  const commit = (next: string) => {
    if (input.value && input.value.value !== next) input.value.value = next
    if (next !== props.modelValue) emit('update:modelValue', next)
    if (next.length === size.value && next !== lastComplete) {
      lastComplete = next
      emit('complete', next)
    }
    if (next.length < size.value) lastComplete = ''
  }

  const onInput = (event: Event) => {
    commit(clean((event.target as HTMLInputElement).value))
    caretToEnd()
  }

  const onPaste = (event: ClipboardEvent) => {
    const text = event.clipboardData?.getData('text') ?? ''
    if (!text) return
    event.preventDefault()
    const pasted = clean(text)
    if (!pasted) return
    commit(pasted.length >= size.value ? pasted : clean(value.value + pasted))
    caretToEnd()
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      caretToEnd()
    }
  }

  const onFocus = () => {
    focused.value = true
    caretToEnd()
  }

  watch(value, (next) => {
    if (input.value && input.value.value !== next) input.value.value = next
    if (next.length < size.value) lastComplete = ''
  })

  onMounted(() => {
    if (props.autofocus && !isDisabled.value) input.value?.focus()
  })

  defineExpose({
    focus: () => input.value?.focus()
  })
</script>

<template>
  <span
    dir="ltr"
    :data-testid="testId"
    :data-invalid="isInvalid || null"
    :data-disabled="isDisabled || null"
    :class="attrs.class"
    class="group relative inline-flex max-w-full items-center gap-(--spacing-xs)"
  >
    <template
      v-for="box in boxes"
      :key="box.index"
    >
      <span
        v-if="box.separator"
        aria-hidden="true"
        :data-testid="`${testId}__separator`"
        class="pointer-events-none w-(--spacing-sm) text-center text-label-md text-(--text-muted)"
        >–</span
      >
      <span
        aria-hidden="true"
        :data-testid="`${testId}__box`"
        :data-state="box.char ? 'filled' : 'empty'"
        :data-active="focused && box.index === activeIndex ? '' : null"
        class="pointer-events-none flex h-10 w-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) text-label-lg text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[active]:border-(--border-strong) data-[active]:ring-2 data-[active]:ring-(--ring-color) data-[active]:ring-offset-2 data-[active]:ring-offset-(--bg-canvas) group-data-[invalid]:border-(--danger-border) group-data-[disabled]:bg-(--bg-disabled) group-data-[disabled]:text-(--text-disabled)"
        >{{ box.char }}</span
      >
    </template>
    <input
      ref="input"
      type="text"
      :id="controlId"
      :aria-describedby="describedBy"
      :aria-label="fallbackName"
      :value="value"
      :maxlength="size"
      :inputmode="mode === 'numeric' ? 'numeric' : 'text'"
      :pattern="mode === 'numeric' ? '[0-9]*' : undefined"
      :autocapitalize="mode === 'numeric' ? 'off' : 'characters'"
      autocomplete="one-time-code"
      autocorrect="off"
      spellcheck="false"
      enterkeyhint="done"
      :disabled="isDisabled"
      :required="isRequired"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :data-testid="`${testId}__input`"
      class="absolute inset-0 z-(--z-input-field) h-full w-full cursor-text appearance-none border-0 bg-transparent p-0 text-transparent caret-transparent outline-none selection:bg-transparent disabled:cursor-not-allowed"
      v-bind="passthroughAttrs"
      @input="onInput"
      @paste="onPaste"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="focused = false"
      @click="caretToEnd"
      @select="caretToEnd"
    />
  </span>
</template>

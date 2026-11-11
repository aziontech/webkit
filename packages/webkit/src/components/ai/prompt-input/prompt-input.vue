<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'

  export type PromptInputState = 'ready' | 'submitted' | 'streaming'

  defineOptions({
    name: 'PromptInput',
    inheritAttrs: false
  })

  interface Props {
    /** Hint shown while empty, a suggested question with no end punctuation. Empty uses the locale catalog (`Ask a question`). */
    placeholder?: string
    /** Accessible name of the text area; the input has no visible label. Empty uses the locale catalog (`Prompt`). */
    ariaLabel?: string
    /** Character limit; shows an `n/max` counter and blocks submit over it. `0` means no limit. */
    maxLength?: number
    /** Rows shown while empty. */
    minRows?: number
    /** Rows the text area grows to before it scrolls. */
    maxRows?: number
    /** Request lifecycle: `submitted` and `streaming` swap Submit for Stop and block another submit; typing stays allowed. */
    state?: PromptInputState
    /** Disables the text area, the submit control and every control in the slots' row. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    ariaLabel: '',
    maxLength: 0,
    minRows: 1,
    maxRows: 6,
    state: 'ready',
    disabled: false
  })

  const model = defineModel<string>({ default: '' })

  const emit = defineEmits<{
    /** The reader submitted a prompt (Enter or the Submit control); the payload is the trimmed text. */
    submit: [value: string]
    /** The reader asked to stop the response being generated. */
    stop: []
  }>()

  const slots = defineSlots<{
    /** Attached files or context chips, shown above the text. */
    attachments?(): unknown
    /** Secondary controls at the inline start of the toolbar: attach, mode select, shortcuts. */
    actions?(): unknown
    /** Constraint text under the input: a disclaimer or the shortcuts it accepts. */
    hint?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ promptInput: en.promptInput })
  const uid = useId()
  const counterId = `${uid}-counter`
  const hintId = `${uid}-hint`

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-prompt-input'
  )
  const textarea = ref<HTMLTextAreaElement | null>(null)
  const composing = ref<boolean>(false)

  const length = computed<number>(() => model.value.length)
  const overBy = computed<number>(() =>
    props.maxLength > 0 ? Math.max(0, length.value - props.maxLength) : 0
  )
  const busy = computed<boolean>(() => props.state !== 'ready')
  const canSubmit = computed<boolean>(
    () => !props.disabled && !busy.value && overBy.value === 0 && model.value.trim().length > 0
  )
  const describedBy = computed<string | undefined>(() => {
    const ids = [props.maxLength > 0 ? counterId : '', slots.hint ? hintId : ''].filter(Boolean)
    return ids.join(' ') || undefined
  })

  function resize(): void {
    const el = textarea.value
    if (!el || typeof window === 'undefined') return
    const style = window.getComputedStyle(el)
    const line = Number.parseFloat(style.lineHeight) || 20
    const padding =
      (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0)
    el.style.height = 'auto'
    const min = props.minRows * line + padding
    const max = props.maxRows * line + padding
    const next = Math.min(Math.max(el.scrollHeight, min), max)
    el.style.height = `${next}px`
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
  }

  function onInput(event: Event): void {
    model.value = (event.target as HTMLTextAreaElement).value
  }

  function submit(): void {
    if (!canSubmit.value) return
    emit('submit', model.value.trim())
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing || composing.value) return
    event.preventDefault()
    submit()
  }

  function focus(): void {
    textarea.value?.focus()
  }

  watch(
    () => [model.value, props.minRows, props.maxRows],
    () => void nextTick(resize)
  )
  onMounted(resize)

  defineExpose({ focus })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-status="state"
    :data-disabled="disabled || null"
    :data-invalid="overBy > 0 || null"
    class="flex w-full flex-col gap-(--spacing-xs)"
  >
    <div
      :data-invalid="overBy > 0 || null"
      :data-disabled="disabled || null"
      class="flex w-full flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none focus-within:border-(--border-strong) focus-within:ring-2 focus-within:ring-(--ring-color) data-[invalid]:border-(--danger-border) data-[disabled]:bg-(--bg-disabled)"
    >
      <div
        v-if="slots.attachments"
        :data-testid="`${testId}__attachments`"
        class="flex flex-wrap gap-(--spacing-xs) px-(--spacing-xs) pt-(--spacing-xxs)"
      >
        <slot name="attachments" />
      </div>
      <textarea
        ref="textarea"
        :value="model"
        :rows="minRows"
        :placeholder="placeholder || t('promptInput.placeholder')"
        :aria-label="ariaLabel || t('promptInput.label')"
        :aria-describedby="describedBy"
        :aria-invalid="overBy > 0 || undefined"
        :disabled="disabled"
        :data-testid="`${testId}__textarea`"
        enterkeyhint="send"
        class="w-full resize-none bg-transparent px-(--spacing-xs) py-(--spacing-xxs) text-body-md text-(--text-default) placeholder:text-(--text-muted) outline-none disabled:cursor-not-allowed disabled:text-(--text-disabled)"
        @input="onInput"
        @keydown="onKeydown"
        @compositionstart="composing = true"
        @compositionend="composing = false"
      />
      <div class="flex items-center justify-between gap-(--spacing-xs)">
        <fieldset
          :disabled="disabled"
          class="m-0 flex min-w-0 flex-wrap items-center gap-(--spacing-xxs) border-0 p-0"
        >
          <slot name="actions" />
        </fieldset>
        <div class="flex shrink-0 items-center gap-(--spacing-sm)">
          <span
            v-if="maxLength > 0"
            :id="counterId"
            :data-invalid="overBy > 0 || null"
            :data-testid="`${testId}__counter`"
            class="text-body-xs text-(--text-muted) tabular-nums data-[invalid]:text-(--danger-contrast)"
          >
            {{ t('promptInput.count', { count: length, max: maxLength }) }}
          </span>
          <IconButton
            v-if="busy"
            key="stop"
            icon="pi pi-stop"
            kind="secondary"
            size="medium"
            :ariaLabel="t('promptInput.stop')"
            :disabled="disabled"
            :data-testid="`${testId}__stop`"
            @click="emit('stop')"
          />
          <IconButton
            v-else
            key="submit"
            icon="pi pi-arrow-up"
            kind="primary"
            size="medium"
            :ariaLabel="t('promptInput.submit')"
            :disabled="!canSubmit"
            :data-testid="`${testId}__submit`"
            @click="submit"
          />
        </div>
      </div>
    </div>
    <div
      v-if="slots.hint"
      :id="hintId"
      :data-testid="`${testId}__hint`"
      class="px-(--spacing-xs) text-body-xs text-(--text-muted)"
    >
      <slot name="hint" />
    </div>
    <div
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__limit`"
    >
      {{ overBy > 0 ? t('promptInput.overLimit', { count: overBy }) : '' }}
    </div>
  </div>
</template>

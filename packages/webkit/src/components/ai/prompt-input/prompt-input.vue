<script setup lang="ts">
  import {
    computed,
    defineAsyncComponent,
    nextTick,
    onMounted,
    ref,
    useAttrs,
    useId,
    watch
  } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'

  export type PromptInputState = 'ready' | 'submitted' | 'streaming'

  export interface PromptInputMenuOption {
    value: string
    label: string
    description?: string
    icon?: string
  }

  export interface PromptInputMenu {
    trigger: string
    label: string
    options: PromptInputMenuOption[]
  }

  export interface PromptInputReference {
    trigger: string
    value: string
    label: string
  }

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
    /** Shortcut menus opened by a trigger character at the start of a word: `/` for commands, `@` for things to reference. Choosing an option inserts `<trigger><label>` and adds it to `references`. */
    menus?: PromptInputMenu[]
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    ariaLabel: '',
    maxLength: 0,
    minRows: 1,
    maxRows: 6,
    state: 'ready',
    disabled: false,
    menus: () => []
  })

  const model = defineModel<string>({ default: '' })
  const references = defineModel<PromptInputReference[]>('references', { default: () => [] })

  const emit = defineEmits<{
    /** The reader submitted a prompt (Enter or the Submit control); the payload is the trimmed text and the references it carries. */
    submit: [value: string, references: PromptInputReference[]]
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

  const PromptInputReferences = defineAsyncComponent(() => import('./prompt-input-references.vue'))

  const attrs = useAttrs()
  const { t } = useTranslate({ promptInput: en.promptInput, promptInputMenu: en.promptInputMenu })
  const uid = useId()
  const counterId = `${uid}-counter`
  const hintId = `${uid}-hint`
  const listId = `${uid}-menu`

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

  const MAX_OPTIONS = 8
  const query = ref<{ menu: PromptInputMenu; start: number; text: string } | null>(null)
  const activeIndex = ref<number>(0)

  const matches = computed<PromptInputMenuOption[]>(() => {
    const current = query.value
    if (!current) return []
    const needle = current.text.toLocaleLowerCase()
    return current.menu.options
      .filter(
        (option) =>
          option.label.toLocaleLowerCase().includes(needle) ||
          option.value.toLocaleLowerCase().includes(needle)
      )
      .slice(0, MAX_OPTIONS)
  })
  const menuOpen = computed<boolean>(() => !!query.value && matches.value.length > 0)
  const optionId = (index: number): string => `${listId}-${index}`
  const announcement = computed<string>(() => {
    if (!query.value) return ''
    return matches.value.length
      ? t('promptInputMenu.results', { count: matches.value.length })
      : t('promptInputMenu.noMatches')
  })

  function readQuery(): void {
    const el = textarea.value
    if (!el || !props.menus.length) {
      query.value = null
      return
    }
    const text = el.value
    const caret = el.selectionStart ?? text.length
    const before = text.slice(0, caret)
    const word = /(^|\s)(\S*)$/.exec(before)
    const token = word?.[2] ?? ''
    const menu = props.menus.find((candidate) => token.startsWith(candidate.trigger))
    if (!menu || el.selectionStart !== el.selectionEnd) {
      query.value = null
      return
    }
    const next = { menu, start: caret - token.length, text: token.slice(menu.trigger.length) }
    if (query.value?.menu !== next.menu || query.value.text !== next.text) activeIndex.value = 0
    query.value = next
  }

  function choose(option: PromptInputMenuOption): void {
    const current = query.value
    const el = textarea.value
    if (!current || !el) return
    const text = el.value
    const caret = el.selectionStart ?? text.length
    const inserted = `${current.menu.trigger}${option.label} `
    const next = text.slice(0, current.start) + inserted + text.slice(caret)
    el.value = next
    model.value = next
    if (
      !references.value.some(
        (reference) =>
          reference.trigger === current.menu.trigger && reference.value === option.value
      )
    ) {
      references.value = [
        ...references.value,
        { trigger: current.menu.trigger, value: option.value, label: option.label }
      ]
    }
    query.value = null
    const position = current.start + inserted.length
    void nextTick(() => {
      el.focus()
      el.setSelectionRange(position, position)
    })
  }

  function removeReference(reference: PromptInputReference): void {
    references.value = references.value.filter((item) => item !== reference)
    const token = `${reference.trigger}${reference.label}`
    const at = model.value.indexOf(token)
    if (at === -1) return
    const end = model.value[at + token.length] === ' ' ? at + token.length + 1 : at + token.length
    model.value = model.value.slice(0, at) + model.value.slice(end)
  }

  function onInput(event: Event): void {
    model.value = (event.target as HTMLTextAreaElement).value
    readQuery()
  }

  function submit(): void {
    if (!canSubmit.value) return
    const text = model.value.trim()
    emit(
      'submit',
      text,
      references.value.filter((reference) =>
        text.includes(`${reference.trigger}${reference.label}`)
      )
    )
  }

  function onKeydown(event: KeyboardEvent): void {
    if (menuOpen.value) {
      const count = matches.value.length
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        activeIndex.value =
          (activeIndex.value + (event.key === 'ArrowDown' ? 1 : count - 1)) % count
        return
      }
      if ((event.key === 'Enter' || event.key === 'Tab') && !event.isComposing) {
        event.preventDefault()
        choose(matches.value[Math.min(activeIndex.value, count - 1)]!)
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        query.value = null
        return
      }
    }
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
      class="relative flex w-full flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none focus-within:border-(--border-strong) focus-within:ring-2 focus-within:ring-(--ring-color) data-[invalid]:border-(--danger-border) data-[disabled]:bg-(--bg-disabled)"
    >
      <div
        v-if="slots.attachments || references.length"
        :data-testid="`${testId}__attachments`"
        class="flex flex-wrap gap-(--spacing-xs) px-(--spacing-xs) pt-(--spacing-xxs)"
      >
        <slot name="attachments" />
        <PromptInputReferences
          v-if="references.length"
          :references="references"
          :label="t('promptInputMenu.references')"
          :disabled="disabled"
          :test-id="testId"
          @remove="removeReference"
        />
      </div>
      <ul
        v-if="menuOpen"
        :id="listId"
        role="listbox"
        :aria-label="query?.menu.label"
        :data-testid="`${testId}__menu`"
        :data-trigger="query?.menu.trigger"
        class="absolute inset-x-0 bottom-full z-(--z-input-overlay) m-0 mb-(--spacing-xxs) flex max-h-72 list-none flex-col overflow-y-auto rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-xxs) shadow-(--shadow-xs)"
      >
        <li
          v-for="(option, index) in matches"
          :id="optionId(index)"
          :key="option.value"
          role="option"
          :aria-selected="index === activeIndex"
          :data-active="index === activeIndex || null"
          class="flex cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-default) hover:bg-(--bg-hover) data-[active]:bg-(--bg-selected)"
          @mousedown.prevent
          @click="choose(option)"
          @keydown.enter.prevent="choose(option)"
          @mousemove="activeIndex = index"
        >
          <i
            v-if="option.icon"
            :class="option.icon"
            class="shrink-0 text-(--text-muted)"
            aria-hidden="true"
          />
          <span class="min-w-0 truncate">{{ option.label }}</span>
          <span
            v-if="option.description"
            class="min-w-0 truncate text-body-xs text-(--text-muted)"
            >{{ option.description }}</span
          >
        </li>
      </ul>
      <textarea
        ref="textarea"
        :value="model"
        :rows="minRows"
        :placeholder="placeholder || t('promptInput.placeholder')"
        :aria-label="ariaLabel || t('promptInput.label')"
        :aria-describedby="describedBy"
        :aria-invalid="overBy > 0 || undefined"
        :aria-controls="menuOpen ? listId : undefined"
        :aria-activedescendant="menuOpen ? optionId(activeIndex) : undefined"
        :aria-keyshortcuts="menus.length ? menus.map((menu) => menu.trigger).join(' ') : undefined"
        :disabled="disabled"
        :data-testid="`${testId}__textarea`"
        enterkeyhint="send"
        class="w-full resize-none bg-transparent px-(--spacing-xs) py-(--spacing-xxs) text-body-md text-(--text-default) placeholder:text-(--text-muted) outline-none disabled:cursor-not-allowed disabled:text-(--text-disabled)"
        @input="onInput"
        @keydown="onKeydown"
        @click="readQuery"
        @blur="query = null"
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
    <div
      v-if="menus.length"
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__menu-status`"
    >
      {{ announcement }}
    </div>
  </div>
</template>

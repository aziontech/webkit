<script setup lang="ts">
  import {
    computed,
    defineAsyncComponent,
    nextTick,
    onMounted,
    provide,
    ref,
    shallowRef,
    useAttrs,
    useId,
    watch
  } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import type { FileTokenGroupItem } from '../../input/file-token-group/file-token-group.vue'
  import type { PromptInputAttachHandlers } from './injection-key'
  import { PromptInputInjectionKey } from './injection-key'

  export type PromptInputStatus = 'ready' | 'pending' | 'streaming'

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

  /** An attached file with the upload state the owner sets on it. */
  export type PromptInputFile = FileTokenGroupItem

  /** Why picked, dropped or pasted files were not attached. */
  export type PromptInputRejectReason = 'accept' | 'max-files' | 'max-file-size'

  defineOptions({
    name: 'PromptInput',
    inheritAttrs: false
  })

  export interface PromptInputProps {
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
    /** Request lifecycle: `pending` and `streaming` swap Submit for Stop and block another submit (unless `queueable`); typing stays allowed. */
    status?: PromptInputStatus
    /** Disables the text area, the submit control and every control in the slots' rows. */
    disabled?: boolean
    /** Shortcut menus opened by a trigger character at the start of a word: `/` for commands, `@` for things to reference. Choosing an option inserts `<trigger><label>` and adds it to `references`. */
    menus?: PromptInputMenu[]
    /** File filter in the native accept syntax (extensions, MIME types, wildcards) for picked, dropped and pasted files. Empty accepts every file. */
    accept?: string
    /** Most files attached at once; files past it are rejected. `0` means no limit. */
    maxFiles?: number
    /** Largest file in bytes; larger files are rejected. `0` means no limit. */
    maxFileSize?: number
    /** Shows a Start voice conversation control in place of Submit while there is nothing to send; it emits `voice-start`. */
    voice?: boolean
    /** While `status` is `pending` or `streaming`, keeps Submit beside Stop and lets Enter submit, so the owner queues the prompt for after the response. */
    queueable?: boolean
  }

  const props = withDefaults(defineProps<PromptInputProps>(), {
    placeholder: '',
    ariaLabel: '',
    maxLength: 0,
    minRows: 1,
    maxRows: 6,
    status: 'ready',
    disabled: false,
    menus: () => [],
    accept: '',
    maxFiles: 0,
    maxFileSize: 0,
    voice: false,
    queueable: false
  })

  const model = defineModel<string>({ default: '' })
  const references = defineModel<PromptInputReference[]>('references', { default: () => [] })
  const files = defineModel<PromptInputFile[]>('files', { default: () => [] })

  const emit = defineEmits<{
    /** The reader submitted a prompt (Enter or the Submit control); the payload holds the trimmed text, the references it carries and the attached files. */
    submit: [
      event: MouseEvent | KeyboardEvent,
      payload: { value: string; references: PromptInputReference[]; files: PromptInputFile[] }
    ]
    /** The reader asked to stop the response being generated. */
    stop: [event: MouseEvent]
    /** The reader pressed Start voice conversation; the app opens and owns the audio session. */
    'voice-start': [event: MouseEvent]
    /** Picked, dropped or pasted files were not attached, once per reason. */
    reject: [event: Event, payload: { files: File[]; reason: PromptInputRejectReason }]
  }>()

  const slots = defineSlots<{
    /** Attached context the app draws itself, above the text, before the file tokens and the references. */
    attachments?(): unknown
    /** Controls at the inline start of the toolbar, such as PromptInput.AttachButton. */
    actions?(): unknown
    /** Controls at the inline end of the toolbar, before Submit: PromptInput.ModelPicker, PromptInput.DictateButton. */
    end?(): unknown
    /** The secondary row under the box: PromptInput.ContextPicker, PromptInput.Tools, links. */
    footer?(): unknown
    /** Constraint text under the input: a disclaimer or the shortcuts it accepts. */
    hint?(): unknown
  }>()

  const PromptInputReferences = defineAsyncComponent(
    () => import('./parts/prompt-input-references.vue')
  )

  const FileTokenGroup = defineAsyncComponent(
    () => import('../../input/file-token-group/file-token-group.vue')
  )

  const attrs = useAttrs()
  const { t } = useTranslate({ promptInput: en.promptInput })
  const uid = useId()
  const counterId = `${uid}-counter`
  const hintId = `${uid}-hint`
  const listId = `${uid}-menu`

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'prompt-input'
  )
  const textareaEl = ref<HTMLTextAreaElement | null>(null)
  const composing = ref<boolean>(false)

  const length = computed<number>(() => model.value.length)
  const overBy = computed<number>(() =>
    props.maxLength > 0 ? Math.max(0, length.value - props.maxLength) : 0
  )
  const busy = computed<boolean>(() => props.status !== 'ready')
  const filesPending = computed<boolean>(() =>
    files.value.some((item) => item.loading || !!item.error)
  )
  const hasContent = computed<boolean>(
    () => model.value.trim().length > 0 || files.value.length > 0
  )
  const canSubmit = computed<boolean>(
    () =>
      !props.disabled &&
      (!busy.value || props.queueable) &&
      overBy.value === 0 &&
      hasContent.value &&
      !filesPending.value
  )
  const showVoice = computed<boolean>(() => props.voice && !busy.value && !hasContent.value)

  const attach = shallowRef<PromptInputAttachHandlers | null>(null)
  const dragging = ref<boolean>(false)
  const rejection = ref<string>('')
  const controlEl = ref<HTMLElement | null>(null)
  const control = computed<string>(() => {
    if (busy.value) return props.queueable && canSubmit.value ? 'stop-submit' : 'stop'
    if (showVoice.value) return 'voice'
    return canSubmit.value ? 'submit' : 'submit-off'
  })
  const describedBy = () => {
    const ids = [props.maxLength > 0 ? counterId : '', slots.hint ? hintId : ''].filter(Boolean)
    return ids.join(' ') || undefined
  }

  function resize(): void {
    const el = textareaEl.value
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
      ? t('promptInput.menuResults', { count: matches.value.length })
      : t('promptInput.noMatch')
  })

  function readQuery(): void {
    const el = textareaEl.value
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
    const el = textareaEl.value
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

  function submit(event: MouseEvent | KeyboardEvent): void {
    if (!canSubmit.value) return
    const text = model.value.trim()
    rejection.value = ''
    emit('submit', event, {
      value: text,
      references: references.value.filter((reference) =>
        text.includes(`${reference.trigger}${reference.label}`)
      ),
      files: files.value
    })
  }

  function removeFile(index: number): void {
    files.value = files.value.filter((_item, position) => position !== index)
    rejection.value = ''
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
    submit(event)
  }

  function focus(): void {
    textareaEl.value?.focus()
  }

  provide(PromptInputInjectionKey, {
    disabled: computed(() => props.disabled),
    accept: computed(() => props.accept),
    maxFiles: computed(() => props.maxFiles),
    getText: () => model.value,
    setText: (value: string) => {
      model.value = value
    },
    maxFileSize: computed(() => props.maxFileSize),
    fileCount: computed(() => files.value.length),
    appendFiles: (added: File[]) => {
      files.value = [...files.value, ...added.map((file) => ({ file }))]
    },
    reject: (event: Event, refused: File[], reason: PromptInputRejectReason) =>
      emit('reject', event, { files: refused, reason }),
    setRejection: (message: string) => {
      rejection.value = message
    },
    setDragging: (value: boolean) => {
      dragging.value = value
    },
    registerAttach: (handlers: PromptInputAttachHandlers) => {
      attach.value = handlers
      return () => {
        if (attach.value === handlers) attach.value = null
        dragging.value = false
      }
    },
    focus
  })

  watch(
    () => [model.value, props.minRows, props.maxRows],
    () => void nextTick(resize)
  )
  watch(control, () => {
    if (typeof document === 'undefined') return
    const held = !!controlEl.value?.contains(document.activeElement)
    if (!held) return
    void nextTick(() => {
      const active = document.activeElement as HTMLButtonElement | null
      if (!active || active === document.body || active.disabled) focus()
    })
  })
  onMounted(resize)

  defineExpose({ focus })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-status="status"
    :data-disabled="disabled || null"
    :data-invalid="overBy > 0 || null"
    class="flex w-full flex-col gap-(--spacing-xs)"
  >
    <div
      :data-invalid="overBy > 0 || null"
      :data-disabled="disabled || null"
      :data-dragging="(dragging && !disabled) || null"
      :data-testid="`${testId}__box`"
      class="relative flex w-full flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none focus-within:border-(--border-strong) focus-within:ring-2 focus-within:ring-(--ring-color) data-[invalid]:border-(--danger-border) data-[disabled]:bg-(--bg-disabled)"
      @dragenter="attach?.drag"
      @dragover="attach?.drag"
      @dragleave="attach?.drag"
      @drop="attach?.drag"
    >
      <div
        v-if="dragging && !disabled"
        aria-hidden="true"
        :data-testid="`${testId}__drop`"
        class="pointer-events-none absolute inset-0 z-2 flex items-center justify-center rounded-(--shape-card) border-2 border-dashed border-(--border-selected) bg-(--bg-surface) text-label-md text-(--text-default) before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-selected) before:content-['']"
      >
        <span class="relative">{{ t('promptInput.drop') }}</span>
      </div>
      <div
        v-if="slots.attachments || references.length || files.length"
        :data-testid="`${testId}__attachments`"
        class="flex flex-wrap gap-(--spacing-xs) px-(--spacing-xs) pt-(--spacing-2xs)"
      >
        <slot name="attachments" />
        <FileTokenGroup
          v-if="files.length"
          :items="files"
          orientation="horizontal"
          :readonly="disabled"
          :data-testid="`${testId}__files`"
          class="w-full"
          @remove="(_event: MouseEvent, payload: { index: number }) => removeFile(payload.index)"
        />
        <PromptInputReferences
          v-if="references.length"
          :references="references"
          :label="t('promptInput.menuReferences')"
          :disabled="disabled"
          :test-id="testId"
          @remove="
            (_event: MouseEvent, reference: PromptInputReference) => removeReference(reference)
          "
        />
      </div>
      <ul
        v-if="menuOpen"
        :id="listId"
        role="listbox"
        :aria-label="query?.menu.label"
        :data-testid="`${testId}__menu`"
        :data-trigger="query?.menu.trigger"
        class="absolute inset-x-0 bottom-full z-(--z-control-overlay) m-0 mb-(--spacing-2xs) flex max-h-72 list-none flex-col overflow-y-auto rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-2xs) shadow-(--shadow-xs)"
      >
        <li
          v-for="(option, index) in matches"
          :id="optionId(index)"
          :key="option.value"
          role="option"
          :aria-selected="index === activeIndex"
          :data-active="index === activeIndex || null"
          class="flex cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-control) border-y border-transparent bg-clip-padding forced-colors:border-y-0 px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-default) hover:bg-(--bg-hover) data-[active]:bg-(--bg-selected)"
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
        ref="textareaEl"
        :value="model"
        :rows="minRows"
        :placeholder="placeholder || t('promptInput.placeholder')"
        :aria-label="ariaLabel || t('promptInput.label')"
        :aria-describedby="describedBy()"
        :aria-invalid="overBy > 0 || undefined"
        :aria-controls="menuOpen ? listId : undefined"
        :aria-activedescendant="menuOpen ? optionId(activeIndex) : undefined"
        :aria-keyshortcuts="menus.length ? menus.map((menu) => menu.trigger).join(' ') : undefined"
        :disabled="disabled"
        :data-testid="`${testId}__textarea`"
        enterkeyhint="send"
        class="w-full resize-none bg-transparent px-(--spacing-xs) py-(--spacing-2xs) text-body-md text-(--text-default) placeholder:text-(--text-muted) outline-none disabled:cursor-not-allowed disabled:text-(--text-disabled)"
        @input="onInput"
        @keydown="onKeydown"
        @click="readQuery"
        @blur="query = null"
        @paste="attach?.paste"
        @compositionstart="composing = true"
        @compositionend="composing = false"
      />
      <div class="flex items-center justify-between gap-(--spacing-xs)">
        <fieldset
          :disabled="disabled"
          class="m-0 flex min-w-0 flex-wrap items-center gap-(--spacing-2xs) border-0 p-0"
        >
          <slot name="actions" />
        </fieldset>
        <div
          ref="controlEl"
          class="flex min-w-0 shrink-0 items-center gap-(--spacing-sm)"
        >
          <fieldset
            v-if="slots.end"
            :disabled="disabled"
            class="m-0 flex min-w-0 items-center gap-(--spacing-2xs) border-0 p-0"
          >
            <slot name="end" />
          </fieldset>
          <span
            v-if="maxLength > 0"
            :id="counterId"
            :data-invalid="overBy > 0 || null"
            :data-testid="`${testId}__counter`"
            class="text-body-xs text-(--text-muted) tabular-nums data-[invalid]:text-(--danger-foreground)"
          >
            {{ t('promptInput.count', { count: length, max: maxLength }) }}
          </span>
          <IconButton
            v-if="busy"
            key="stop"
            icon="az az-stop"
            variant="secondary"
            size="medium"
            :ariaLabel="t('promptInput.stop')"
            :disabled="disabled"
            :data-testid="`${testId}__stop`"
            @click="(event: MouseEvent) => emit('stop', event)"
          />
          <IconButton
            v-if="busy && queueable && canSubmit"
            key="queue"
            icon="az az-arrow-up"
            variant="primary"
            size="medium"
            :ariaLabel="t('promptInput.submit')"
            :data-testid="`${testId}__submit`"
            @click="submit"
          />
          <IconButton
            v-else-if="showVoice"
            key="voice"
            icon="az az-headphones"
            variant="primary"
            size="medium"
            :ariaLabel="t('promptInput.voice')"
            :disabled="disabled"
            :data-testid="`${testId}__voice`"
            @click="(event: MouseEvent) => emit('voice-start', event)"
          />
          <IconButton
            v-else-if="!busy"
            key="submit"
            icon="az az-arrow-up"
            variant="primary"
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
      aria-live="polite"
      :data-testid="`${testId}__rejected`"
      class="px-(--spacing-xs) text-body-xs text-(--danger-foreground) empty:hidden"
    >
      {{ rejection }}
    </div>
    <fieldset
      v-if="slots.footer"
      :disabled="disabled"
      :data-testid="`${testId}__footer`"
      class="m-0 flex min-w-0 flex-wrap items-center gap-(--spacing-2xs) border-0 p-0"
    >
      <slot name="footer" />
    </fieldset>
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

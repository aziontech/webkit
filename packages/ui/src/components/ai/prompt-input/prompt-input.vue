<script setup lang="ts">
  import { computed, defineAsyncComponent, ref, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { usePromptInputAttach } from './composables/use-prompt-input-attach'
  import { usePromptInputAutosize } from './composables/use-prompt-input-autosize'
  import { type PromptInputQuery, usePromptInputMenu } from './composables/use-prompt-input-menu'
  import { usePromptInputSubmit } from './composables/use-prompt-input-submit'
  import { focusFromBox } from './lib/box-focus'
  import { BOX_CLASS, DROP_CLASS, TEXTAREA_CLASS } from './lib/classes'
  import { withoutReference } from './lib/references'
  import PromptInputMenuList from './parts/prompt-input-menu-list.vue'
  import PromptInputSend from './parts/prompt-input-send.vue'
  import type {
    PromptInputFile,
    PromptInputMenu,
    PromptInputMenuOption,
    PromptInputReference,
    PromptInputRejectReason,
    PromptInputStatus
  } from './types'

  export type {
    PromptInputFile,
    PromptInputMenu,
    PromptInputMenuOption,
    PromptInputReference,
    PromptInputRejectReason,
    PromptInputStatus
  } from './types'

  defineOptions({
    name: 'PromptInput',
    inheritAttrs: false
  })

  export interface PromptInputProps {
    /** Hint shown while empty, a suggested question with no end punctuation. Empty uses the locale catalog (`Ask a question`). */
    placeholder?: string
    /** Accessible name of the text area; the input has no visible label. Empty uses the locale catalog (`Prompt`). */
    ariaLabel?: string
    /** Character limit; an `n/max` counter shows from 80% of it and submit is blocked over it. `0` means no limit. */
    maxLength?: number
    /** Rows shown while empty. */
    minRows?: number
    /** Rows the text area grows to before it scrolls. */
    maxRows?: number
    /** Request lifecycle: `pending` and `streaming` swap Submit for Stop and block another submit (unless `queueable`); typing stays allowed. */
    status?: PromptInputStatus
    /** Disables the text area, the submit control and every control in the slots' rows. */
    disabled?: boolean
    /**
     * Shortcut menus opened by a trigger character at the start of a word: `/` for commands, `@`
     * for things to reference. Choosing an option inserts `<trigger><label>` and adds it to
     * `references`.
     */
    menus?: PromptInputMenu[]
    /** File filter in the native accept syntax (extensions, MIME types, wildcards) for picked, dropped and pasted files. Empty accepts every file. */
    accept?: string
    /** Most files attached at once; files past it are rejected. `0` means no limit. */
    maxFiles?: number
    /** Largest file in bytes; larger files are rejected. `0` means no limit. */
    maxFileSize?: number
    /** Shows a Start voice conversation control in place of Submit while there is nothing to send; it emits `voice-start`. */
    voice?: boolean
    /** A live voice conversation is active: disables dictation (`PromptInput.DictateButton`) and swaps Start voice for End voice (`voice-end`). */
    voiceActive?: boolean
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
    voiceActive: false,
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
    /** The reader pressed End voice conversation while `voiceActive` is true. */
    'voice-end': [event: MouseEvent]
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

  const dragging = ref<boolean>(false)
  const chips = ref<number>(0)
  const rejection = ref<string>('')
  const controlEl = ref<HTMLElement | null>(null)
  const { overBy, nearLimit, busy, canSubmit, showVoice, submit, enterKeyHint, submitOnEnter } =
    usePromptInputSubmit({
      model,
      files,
      references,
      rejection,
      controlEl,
      maxLength: () => props.maxLength,
      status: () => props.status,
      disabled: () => props.disabled,
      queueable: () => props.queueable,
      voice: () => props.voice,
      focus,
      send: (event, payload) => emit('submit', event, payload)
    })
  const describedBy = () => {
    const ids = [nearLimit.value ? counterId : '', slots.hint ? hintId : ''].filter(Boolean)
    return ids.join(' ') || undefined
  }

  const query = ref<PromptInputQuery | null>(null)
  const activeIndex = ref<number>(0)
  const { matches, menuOpen, readQuery, choose, onMenuKeydown } = usePromptInputMenu(
    textareaEl,
    () => props.menus,
    model,
    references,
    query,
    activeIndex
  )

  const stacked = (): boolean =>
    props.minRows > 1 ||
    !!slots.attachments ||
    references.value.length > 0 ||
    files.value.length > 0 ||
    chips.value > 0 ||
    (menuOpen.value && !!query.value)
  const { multiline } = usePromptInputAutosize(
    textareaEl,
    model,
    () => props.minRows,
    () => props.maxRows,
    stacked
  )
  const expanded = (): boolean => stacked() || multiline.value
  const announcement = computed<string>(() => {
    if (!query.value) return ''
    return matches.value.length
      ? t('promptInput.menuResults', { count: matches.value.length })
      : t('promptInput.noMatch')
  })

  function removeReference(reference: PromptInputReference): void {
    references.value = references.value.filter((item) => item !== reference)
    model.value = withoutReference(model.value, reference)
  }

  function onInput(event: Event): void {
    model.value = (event.target as HTMLTextAreaElement).value
    readQuery()
  }

  function removeFile(index: number): void {
    files.value = files.value.filter((_item, position) => position !== index)
    rejection.value = ''
  }

  function onKeydown(event: KeyboardEvent): void {
    if (!onMenuKeydown(event)) submitOnEnter(event, composing.value)
  }

  function focus(): void {
    textareaEl.value?.focus()
  }

  const boxEl = ref<globalThis.HTMLElement | null>(null)
  const { paste } = usePromptInputAttach({
    boxEl,
    disabled: () => props.disabled,
    voiceActive: () => props.voiceActive,
    accept: () => props.accept,
    maxFiles: () => props.maxFiles,
    maxFileSize: () => props.maxFileSize,
    model,
    files,
    dragging,
    rejection,
    chips,
    reject: (event, refused, reason) => emit('reject', event, { files: refused, reason }),
    focus
  })

  defineExpose({ focus })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-status="status"
    :data-disabled="disabled || null"
    :data-invalid="overBy > 0 || null"
    :data-multiline="expanded() || null"
    class="flex w-full flex-col gap-(--spacing-xs)"
  >
    <div
      :data-invalid="overBy > 0 || null"
      :data-disabled="disabled || null"
      :data-dragging="(dragging && !disabled) || null"
      :data-multiline="expanded() || null"
      ref="boxEl"
      :data-testid="`${testId}__box`"
      :class="BOX_CLASS"
      @pointerdown="(event: PointerEvent) => focusFromBox(event, disabled, focus)"
    >
      <div
        v-if="dragging && !disabled"
        aria-hidden="true"
        :data-testid="`${testId}__drop`"
        :class="DROP_CLASS"
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
      <PromptInputMenuList
        v-if="menuOpen && query"
        :id="listId"
        v-model:active-index="activeIndex"
        :label="query.menu.label"
        :trigger="query.menu.trigger"
        :options="matches"
        :test-id="testId"
        @select="(_event: Event, option: PromptInputMenuOption) => choose(option)"
      />
      <div
        class="flex flex-wrap items-center gap-(--spacing-2xs) group-data-[multiline]/prompt-input-box:items-end"
      >
        <div
          v-if="slots.actions"
          class="flex min-h-10 min-w-0 items-center"
        >
          <fieldset
            :disabled="disabled"
            class="m-0 flex min-w-0 flex-wrap items-center gap-(--spacing-2xs) border-0 p-0"
          >
            <slot name="actions" />
          </fieldset>
        </div>
        <textarea
          ref="textareaEl"
          :value="model"
          :rows="minRows"
          :placeholder="placeholder || t('promptInput.placeholder')"
          :aria-label="ariaLabel || t('promptInput.label')"
          :aria-describedby="describedBy()"
          :aria-invalid="overBy > 0 || undefined"
          :aria-autocomplete="menus.length ? 'list' : undefined"
          :aria-controls="menuOpen ? listId : undefined"
          :aria-activedescendant="menuOpen ? `${listId}-${activeIndex}` : undefined"
          :aria-keyshortcuts="
            menus.length ? menus.map((menu) => menu.trigger).join(' ') : undefined
          "
          :disabled="disabled"
          :data-testid="`${testId}__textarea`"
          :enterkeyhint="enterKeyHint"
          :class="TEXTAREA_CLASS"
          @input="onInput"
          @keydown="onKeydown"
          @click="readQuery"
          @blur="query = null"
          @paste="paste"
          @compositionstart="composing = true"
          @compositionend="composing = false"
        />
        <div
          ref="controlEl"
          class="ms-auto flex min-h-10 min-w-0 shrink-0 items-center gap-(--spacing-2xs)"
        >
          <fieldset
            v-if="slots.end"
            :disabled="disabled"
            class="m-0 flex min-w-0 items-center gap-(--spacing-2xs) border-0 p-0"
          >
            <slot name="end" />
          </fieldset>
          <span
            v-if="nearLimit"
            :id="counterId"
            :data-invalid="overBy > 0 || null"
            :data-testid="`${testId}__counter`"
            class="px-(--spacing-2xs) text-body-xs text-(--text-muted) tabular-nums data-[invalid]:text-(--text-danger)"
          >
            {{ t('promptInput.count', { count: model.length, max: maxLength }) }}
          </span>
          <PromptInputSend
            :busy="busy"
            :queueable="queueable"
            :can-submit="canSubmit"
            :show-voice="showVoice"
            :voice-active="voiceActive"
            :disabled="disabled"
            :labels="{
              stop: t('promptInput.stop'),
              submit: t('promptInput.submit'),
              voice: t('promptInput.voice'),
              voiceEnd: t('promptInput.voiceEnd')
            }"
            :test-id="testId"
            @stop="(event: MouseEvent) => emit('stop', event)"
            @submit="submit"
            @voice-start="(event: MouseEvent) => emit('voice-start', event)"
            @voice-end="(event: MouseEvent) => emit('voice-end', event)"
          />
        </div>
      </div>
    </div>
    <div
      aria-live="polite"
      :data-testid="`${testId}__rejected`"
      class="px-(--spacing-xs) text-body-xs text-(--text-danger) empty:hidden"
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
      class="px-(--spacing-xs) text-center text-body-xs text-(--text-muted)"
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

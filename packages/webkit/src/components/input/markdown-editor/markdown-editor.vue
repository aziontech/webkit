<script setup lang="ts">
  import { computed, defineAsyncComponent, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import { useAnnouncer } from '../../../composables/use-announcer'
  import { useFieldControl } from '../../../composables/use-field-control'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Tabs from '../../navigation/tabs'
  import type { TabsValue } from '../../navigation/tabs/injection-key'
  import Textarea from '../textarea/textarea.vue'
  import {
    type MarkdownEditorMention,
    type MarkdownEditorPickEvent,
    useMarkdownEditorMention
  } from './composables/use-markdown-editor-mention'
  import { applyEdit, formatMarkdown, type MarkdownFormat } from './lib/markdown-format'
  import MarkdownEditorToolbar from './parts/markdown-editor-toolbar.vue'

  defineOptions({ name: 'MarkdownEditor', inheritAttrs: false })

  export type { MarkdownEditorMention } from './composables/use-markdown-editor-mention'

  export interface MarkdownEditorProps {
    /** Placeholder shown in the empty field. */
    placeholder?: string
    /** Accessible name of the field when no Field label or aria-labelledby names it; empty uses the built-in Message label. Write it as the aria-label attribute. */
    ariaLabel?: string
    /** Disables the field, the toolbar, the tabs and the mention menu. */
    disabled?: boolean
    /** Shows the value without letting it change: the toolbar is disabled and the mention menu never opens; the Preview tab still works. */
    readonly?: boolean
    /** Applies the invalid border to the field and the preview and sets aria-invalid on the field. */
    invalid?: boolean
    /** Marks the field as required and sets aria-required. */
    required?: boolean
    /** People the menu offers after the at sign; each inserts the at sign plus its value. Empty turns the menu off. */
    mentions?: MarkdownEditorMention[]
    /** Lines the empty field shows; the field grows with its content from here. */
    minRows?: number
    /** Lines the field grows to before it scrolls; 0 sets no limit. */
    maxRows?: number
  }

  const props = withDefaults(defineProps<MarkdownEditorProps>(), {
    placeholder: '',
    ariaLabel: '',
    disabled: false,
    readonly: false,
    invalid: false,
    required: false,
    mentions: () => [],
    minRows: 4,
    maxRows: 12
  })

  const emit = defineEmits<{
    'mention-select': [event: MouseEvent | KeyboardEvent, mention: MarkdownEditorMention]
  }>()

  /** The Markdown text. */
  const model = defineModel<string>({ default: '' })

  const slots = defineSlots<{
    /** A row under the field for attachments and actions. */
    footer?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ markdownEditor: en.markdownEditor })
  const { announce } = useAnnouncer()
  const uid = useId()
  const control = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled,
    required: () => props.required
  })

  const textareaEl = ref<InstanceType<typeof Textarea> | null>(null)
  const tab = ref<'write' | 'preview'>('write')
  const previewReady = ref(false)
  const previewFailed = ref(false)

  const MentionList = defineAsyncComponent(
    () => import('../../ai/prompt-input/parts/prompt-input-menu-list.vue')
  )

  const MarkdownPreview = defineAsyncComponent({
    loader: () =>
      import('../../ai/streaming-response/streaming-response.vue').then((module) => {
        previewReady.value = true
        return module.default
      }),
    onError: (_error, _retry, fail) => {
      previewFailed.value = true
      fail()
    }
  })

  const testId = computed(() => String(attrs['data-testid'] ?? 'markdown-editor'))
  const fieldId = computed(() => {
    const id = attrs['id']
    return (typeof id === 'string' && id) || control.field?.controlId || `${uid}-field`
  })
  const listId = `${uid}-mentions`
  const editable = computed(() => !control.disabled.value && !props.readonly)
  const previewBusy = computed(
    () => tab.value === 'preview' && !!model.value && !previewReady.value && !previewFailed.value
  )

  const fieldEl = (): HTMLTextAreaElement | null => {
    const el: unknown = textareaEl.value?.$el
    return el instanceof HTMLTextAreaElement ? el : null
  }

  const mention = useMarkdownEditorMention({
    field: fieldEl,
    mentions: () => props.mentions,
    enabled: () => editable.value,
    onPick: (event: MarkdownEditorPickEvent, picked: MarkdownEditorMention) =>
      emit('mention-select', event, picked)
  })

  const fieldAttrs = computed(() => {
    const { class: _class, 'data-testid': _testId, id: _id, ...rest } = attrs
    const named = control.field || attrs['aria-labelledby'] || attrs['id']
    return {
      ...rest,
      id: fieldId.value,
      'aria-label': props.ariaLabel || (named ? undefined : t('markdownEditor.label')),
      'aria-autocomplete': props.mentions.length ? ('list' as const) : undefined,
      'aria-controls': mention.open.value ? listId : undefined,
      'aria-activedescendant': mention.open.value
        ? `${listId}-${mention.activeIndex.value}`
        : undefined
    }
  })

  watch(
    () => (mention.open.value ? mention.matches.value.length : 0),
    (count) => {
      if (count) announce(t('markdownEditor.mentionResults', { count }))
    }
  )

  const SHORTCUTS: Record<string, MarkdownFormat> = { b: 'bold', i: 'italic', k: 'link' }

  function applyFormat(format: MarkdownFormat): void {
    const field = fieldEl()
    if (!field || !editable.value) return
    const selection = { value: field.value, start: field.selectionStart, end: field.selectionEnd }
    applyEdit(field, formatMarkdown(selection, format, t('markdownEditor.linkPlaceholder')))
  }

  function onKeydown(event: KeyboardEvent): void {
    if (mention.onKeydown(event)) return
    const modified = (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey
    const format = modified ? SHORTCUTS[event.key.toLowerCase()] : undefined
    if (!format || !editable.value) return
    event.preventDefault()
    applyFormat(format)
  }

  const MENU_KEYS = new Set(['ArrowUp', 'ArrowDown', 'Enter', 'Tab', 'Escape'])

  function onKeyup(event: KeyboardEvent): void {
    if (!MENU_KEYS.has(event.key)) mention.readQuery()
  }

  function onSelect(event: Event, picked: MarkdownEditorMention): void {
    if (event instanceof MouseEvent || event instanceof KeyboardEvent) mention.pick(event, picked)
  }

  function onTabChange(next: TabsValue | null | undefined): void {
    if (next === 'write' || next === 'preview') tab.value = next
    mention.close()
  }

  defineExpose({
    /** Switches to the Write tab and moves focus to the field. */
    focus: (): void => {
      tab.value = 'write'
      void nextTick(() => fieldEl()?.focus())
    }
  })

  const PREVIEW_CLASS =
    'min-h-[calc(var(--markdown-editor-preview-rows)*1lh+var(--spacing-sm)*2+2px)] w-full min-w-0 rounded-(--shape-control) border border-(--border-input) bg-(--bg-surface) ' +
    'px-(--spacing-sm) py-(--spacing-sm) text-body-xs pointer-coarse:text-body-md text-(--text-default) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    'data-[invalid]:border-(--danger-border) data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled)'
</script>

<template>
  <div
    :class="['flex w-full min-w-0 flex-col gap-(--spacing-xs)', attrs.class]"
    data-slot="markdown-editor"
    :data-testid="testId"
    :data-tab="tab"
    :data-disabled="control.disabled.value || null"
    :data-readonly="readonly || null"
    :data-invalid="control.invalid.value || null"
    :data-mention-state="mention.open.value ? 'open' : 'closed'"
  >
    <Tabs
      :model-value="tab"
      @update:model-value="onTabChange"
    >
      <div
        data-slot="header"
        class="flex w-full flex-wrap items-center gap-(--spacing-xs)"
      >
        <div class="min-w-0">
          <Tabs.List :data-testid="`${testId}__tabs`">
            <Tabs.Trigger
              value="write"
              :label="t('markdownEditor.write')"
              :disabled="control.disabled.value"
              :data-testid="`${testId}__write`"
            />
            <Tabs.Trigger
              value="preview"
              :label="t('markdownEditor.preview')"
              :disabled="control.disabled.value"
              :data-testid="`${testId}__preview`"
            />
          </Tabs.List>
        </div>
        <MarkdownEditorToolbar
          v-if="tab === 'write'"
          :controls="fieldId"
          :disabled="!editable"
          :test-id="testId"
          @format="(_event: MouseEvent, format: MarkdownFormat) => applyFormat(format)"
        />
      </div>
      <Tabs.Content
        value="write"
        tabindex="-1"
        class="pt-(--spacing-xs)"
        :data-testid="`${testId}__write-panel`"
      >
        <div class="relative">
          <Textarea
            ref="textareaEl"
            v-model="model"
            v-bind="fieldAttrs"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :invalid="invalid"
            :required="required"
            auto-resize
            :min-rows="minRows"
            :max-rows="maxRows"
            :data-testid="`${testId}__field`"
            @keydown="onKeydown"
            @keyup="onKeyup"
            @input="mention.readQuery"
            @click="mention.readQuery"
            @blur="mention.close"
          />
          <MentionList
            v-if="mention.open.value"
            :id="listId"
            :label="t('markdownEditor.mentionMenu')"
            trigger="@"
            :options="mention.matches.value"
            :test-id="testId"
            :active-index="mention.activeIndex.value"
            @update:active-index="mention.setActiveIndex"
            @select="onSelect"
          />
        </div>
      </Tabs.Content>
      <Tabs.Content
        value="preview"
        tabindex="-1"
        class="pt-(--spacing-xs)"
        :data-testid="`${testId}__preview-panel`"
      >
        <div
          tabindex="0"
          dir="auto"
          data-slot="preview"
          :aria-busy="previewBusy || undefined"
          :data-loading="previewBusy || null"
          :data-invalid="control.invalid.value || null"
          :data-disabled="control.disabled.value || null"
          :data-testid="`${testId}__preview-box`"
          :style="{ '--markdown-editor-preview-rows': minRows }"
          :class="PREVIEW_CLASS"
        >
          <p
            v-if="!model"
            class="m-0 text-(--text-muted)"
            :data-testid="`${testId}__empty`"
          >
            {{ t('markdownEditor.emptyTitle') }}
          </p>
          <p
            v-else-if="previewFailed"
            class="m-0 whitespace-pre-wrap"
            :data-testid="`${testId}__source`"
          >
            {{ model }}
          </p>
          <template v-else>
            <p
              v-if="!previewReady"
              class="m-0 text-(--text-muted)"
              :data-testid="`${testId}__loading`"
            >
              {{ t('markdownEditor.previewLoading') }}
            </p>
            <MarkdownPreview
              :content="model"
              class="text-body-xs pointer-coarse:text-body-md"
              :data-testid="`${testId}__rendered`"
            />
          </template>
        </div>
      </Tabs.Content>
    </Tabs>
    <div
      v-if="slots.footer"
      data-slot="footer"
      class="flex flex-wrap items-center gap-(--spacing-xs)"
      :data-testid="`${testId}__footer`"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, inject, nextTick, onMounted, provide, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import Textarea from '../../input/textarea/textarea.vue'
  import { ConversationInjectionKey } from '../conversation/injection-key'
  import ResponseLoading from '../response-loading/response-loading.vue'
  import type { ChatMessageFrom, ChatMessageStatus } from './injection-key'
  import { ChatMessageInjectionKey } from './injection-key'
  import { contentText } from './lib/content-text'

  export type { ChatMessageFrom, ChatMessageStatus }

  defineOptions({
    name: 'ChatMessage',
    inheritAttrs: false
  })

  export interface ChatMessageProps {
    /** Who wrote the message: the person (`user`), the generative AI assistant, or the product (`system`). */
    from?: ChatMessageFrom
    /** Author name read in the message's accessible name; it is not shown. Empty uses the locale catalog (`You`, `AI assistant`, `System`). */
    author?: string
    /** Time the message was sent, already formatted for display (`10:42`). Added to the accessible name and shown on hover over the user's bubble. */
    timestamp?: string
    /** Lifecycle: `pending` shows the loading text, `streaming` marks the content busy, `success` shows the actions, `error` shows the error line with Try again. */
    status?: ChatMessageStatus
    /** Follows a message by the same author: tightens the gap above it so stacked messages read as one turn. */
    grouped?: boolean
    /** Error text shown while `status` is `error`. Empty uses the locale catalog. */
    errorMessage?: string
    /** Loading text shown while `status` is `pending`. Empty uses `ResponseLoading`'s own (`Generating a response`). */
    loadingLabel?: string
  }

  const props = withDefaults(defineProps<ChatMessageProps>(), {
    from: 'assistant',
    author: '',
    timestamp: '',
    status: 'success',
    grouped: false,
    errorMessage: '',
    loadingLabel: ''
  })

  const emit = defineEmits<{
    /** The reader asked to generate the failed response again (Try again). */
    retry: [event: MouseEvent]
    /** The reader sent an edited prompt: `text` is the new prompt, trimmed. Hand it to `setMessages` and `sendMessage`. */
    edit: [event: MouseEvent | KeyboardEvent, text: string]
  }>()

  /** A user message is open for editing: the bubble turns into a field with Cancel and Send. Supports v-model:editing. */
  const editing = defineModel<boolean>('editing', { default: false })

  const slots = defineSlots<{
    /** The message content: text, a `StreamingResponse`, `Reasoning`, `Sources`, artifacts. Not rendered while `pending`. */
    default?(): unknown
    /** The action row under the content, usually a `ChatMessage.Actions`; shown only when the message status is `success`. */
    actions?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ chatMessage: en.chatMessage })
  const conversation = inject(ConversationInjectionKey, null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'chat-message'
  )
  const name = computed<string>(() => props.author || t(`chatMessage.${props.from}`))
  const accessibleName = computed<string>(() =>
    props.timestamp
      ? t('chatMessage.labelWithTime', { author: name.value, time: props.timestamp })
      : name.value
  )
  const alignment = computed(() => conversation?.alignment.value ?? 'split')
  const busy = computed<boolean>(() => props.status === 'pending' || props.status === 'streaming')
  const showActions = () => props.status === 'success' && Boolean(slots.actions)

  const bodyEl = ref<HTMLElement | null>(null)
  const editorEl = ref<InstanceType<typeof Textarea> | null>(null)
  const draft = ref<string>('')
  const isEditing = computed<boolean>(() => editing.value && props.from === 'user')
  let returnFocus: HTMLElement | null = null

  function announce(): void {
    if (!conversation || props.from === 'user') return
    const text =
      props.status === 'error'
        ? props.errorMessage || t('chatMessage.error')
        : (bodyEl.value?.textContent ?? '')
    conversation.announce(name.value, text.slice(0, 600))
  }

  watch(
    () => props.status,
    (next, previous) => {
      if (previous !== next && (next === 'success' || next === 'error')) announce()
    },
    { flush: 'post' }
  )

  onMounted(() => {
    if (conversation?.ready.value && (props.status === 'success' || props.status === 'error'))
      announce()
  })

  watch(
    isEditing,
    async (now) => {
      if (!now) return
      draft.value = contentText(bodyEl.value)
      const active = globalThis.document?.activeElement
      returnFocus = active instanceof HTMLElement ? active : null
      await nextTick()
      editorEl.value?.focus()
    },
    { flush: 'pre' }
  )

  async function closeEditor(): Promise<void> {
    editing.value = false
    await nextTick()
    if (returnFocus?.isConnected) returnFocus.focus()
    returnFocus = null
  }

  function send(event: MouseEvent | KeyboardEvent): void {
    const text = draft.value.trim()
    if (!text) return
    emit('edit', event, text)
    void closeEditor()
  }

  function onEditorKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault()
      void closeEditor()
    } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      send(event)
    }
  }

  provide(ChatMessageInjectionKey, {
    from: computed(() => props.from),
    status: computed(() => props.status),
    editing: isEditing,
    edit: () => {
      if (props.from === 'user') editing.value = true
    },
    contentText: () => contentText(bodyEl.value)
  })

  const COLUMN_CLASS =
    'flex min-w-0 flex-col gap-(--spacing-xs) ' +
    'data-[from=assistant]:flex-1 data-[from=user]:max-w-[80%] data-[from=user]:data-[alignment=split]:items-end data-[from=system]:max-w-full data-[from=system]:items-center ' +
    'data-[editing]:w-full data-[from=user]:data-[editing]:max-w-full'

  const ACTIONS_CLASS =
    'flex min-w-0 items-center data-[from=assistant]:-ms-(--spacing-sm) ' +
    'data-[from=user]:opacity-0 data-[from=user]:transition-opacity data-[from=user]:duration-fast-02 data-[from=user]:ease-productive-entrance ' +
    'data-[from=user]:motion-reduce:transition-none data-[from=user]:group-hover/message:opacity-100 data-[from=user]:group-focus-within/message:opacity-100 ' +
    'data-[from=user]:pointer-coarse:opacity-100'

  const CONTENT_CLASS =
    'flex min-w-0 flex-col gap-(--spacing-md) text-body-lg text-(--text-default) break-words ' +
    'data-[from=user]:gap-(--spacing-sm) data-[from=user]:rounded-(--shape-card) data-[from=user]:bg-(--bg-selected) ' +
    'data-[from=user]:px-(--spacing-md) data-[from=user]:py-(--spacing-sm) ' +
    'data-[from=system]:text-body-sm data-[from=system]:text-(--text-muted) data-[from=system]:text-center'
</script>

<template>
  <article
    v-bind="$attrs"
    :aria-label="accessibleName"
    :aria-busy="busy || undefined"
    :data-testid="testId"
    :data-from="from"
    :data-status="status"
    :data-alignment="alignment"
    :data-grouped="grouped || null"
    class="group/message flex w-full min-w-0 data-[from=user]:data-[alignment=split]:justify-end data-[from=system]:justify-center data-[grouped]:-mt-(--spacing-sm)"
  >
    <div
      :data-from="from"
      :data-alignment="alignment"
      :data-editing="isEditing || null"
      :class="COLUMN_CLASS"
    >
      <p
        v-if="!grouped && from !== 'system'"
        :data-testid="`${testId}__author`"
        class="sr-only"
      >
        {{ accessibleName }}
      </p>
      <ResponseLoading
        v-if="status === 'pending'"
        :label="loadingLabel"
        :delay="0"
        :data-testid="`${testId}__loading`"
      />
      <div
        v-else-if="isEditing"
        :data-testid="`${testId}__editor`"
        class="flex w-full min-w-0 flex-col gap-(--spacing-sm) rounded-(--shape-card) bg-(--bg-selected) p-(--spacing-sm)"
      >
        <Textarea
          ref="editorEl"
          v-model="draft"
          auto-resize
          :min-rows="1"
          :max-rows="12"
          :aria-label="t('chatMessage.editField')"
          :data-testid="`${testId}__field`"
          @keydown="onEditorKeydown"
        />
        <div class="flex items-center justify-end gap-(--spacing-xs)">
          <Button
            :label="t('chatMessage.cancel')"
            variant="outline"
            size="medium"
            :data-testid="`${testId}__cancel`"
            @click="closeEditor"
          />
          <Button
            :label="t('chatMessage.send')"
            variant="primary"
            size="medium"
            :disabled="!draft.trim()"
            :data-testid="`${testId}__send`"
            @click="send"
          />
        </div>
      </div>
      <div
        v-else
        ref="bodyEl"
        :data-from="from"
        :data-testid="`${testId}__content`"
        :title="from === 'user' && timestamp ? timestamp : undefined"
        :class="CONTENT_CLASS"
      >
        <slot />
      </div>
      <div
        v-if="status === 'error'"
        :data-testid="`${testId}__error`"
        class="flex flex-wrap items-center gap-(--spacing-sm) text-body-sm text-(--danger-foreground)"
      >
        <span class="inline-flex items-center gap-(--spacing-xs)">
          <i
            class="az az-circle-alert"
            aria-hidden="true"
          />
          {{ errorMessage || t('chatMessage.error') }}
        </span>
        <Button
          :label="t('chatMessage.retry')"
          variant="outline"
          size="small"
          icon="az az-refresh"
          :data-testid="`${testId}__retry`"
          @click="(event: MouseEvent) => emit('retry', event)"
        />
      </div>
      <div
        v-if="showActions()"
        v-show="!isEditing"
        :data-testid="`${testId}__actions`"
        :data-from="from"
        :class="ACTIONS_CLASS"
      >
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>

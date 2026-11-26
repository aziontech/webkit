<script setup lang="ts">
  import { useResizeObserver } from '@vueuse/core'
  import { computed, h, inject, onMounted, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { defineClientLazy } from '../../../../utils/client-lazy'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import { ConversationInjectionKey } from '../../conversation/injection-key'
  import ChatMessageFeedback from '../chat-message-feedback/chat-message-feedback.vue'
  import { useChatMessageContext } from '../composables/use-chat-message-context'
  import type { ChatMessageFeedbackValue } from '../injection-key'
  import { LazyCopyButton, LazyTooltip } from '../lib/lazy-overlays'
  import ChatMessageReadAloud from '../parts/chat-message-read-aloud.vue'

  defineOptions({
    name: 'ChatMessageActions',
    inheritAttrs: false
  })

  export interface ChatMessageActionsProps {
    /** Accessible name of the action group. Empty uses the locale catalog (`Message actions`). */
    ariaLabel?: string
    /** Shows Copy first in the row; it copies `copyText`, or the text of the message when that is empty. */
    copyable?: boolean
    /** Text Copy puts on the clipboard. Empty copies the text of the message's `StreamingResponse` content. */
    copyText?: string
    /** Shows Edit after Copy on a user message: it opens the bubble as a field with Cancel and Send. */
    editable?: boolean
    /** Shows the Feedback button, a menu with Good response and Bad response bound to `v-model:feedback`; in a narrow row the two move into More. */
    showFeedback?: boolean
    /** Shows Read aloud after the thumbs: it speaks the response with the browser's speech synthesis, turns into Stop while speaking, and is hidden where the browser has none. */
    showReadAloud?: boolean
    /** Text Read aloud speaks. Empty reads the text of the message's `StreamingResponse` content. */
    readAloudText?: string
    /** Shows Share after Read aloud; it emits `share` and the app makes the link. */
    shareable?: boolean
    /** Shows Try again after Share; it emits `retry`. In a narrow row it moves into More. */
    retryable?: boolean
    /** Adds Branch in new chat to More; it emits `branch`. */
    branchable?: boolean
    /** Locks the actions that start a response (Edit, Try again, Branch in new chat), for example while another response runs. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<ChatMessageActionsProps>(), {
    ariaLabel: '',
    copyable: false,
    copyText: '',
    editable: false,
    showFeedback: false,
    showReadAloud: false,
    readAloudText: '',
    shareable: false,
    retryable: false,
    branchable: false,
    disabled: false
  })

  const emit = defineEmits<{
    /** The reader pressed Share; the app makes the link to the response. */
    share: [event: MouseEvent]
    /** The reader pressed Try again; regenerate the response (TanStack AI `reload`). */
    retry: [event: MouseEvent | KeyboardEvent]
    /** The reader chose Branch in new chat; start a new chat from the conversation up to this message. */
    branch: [event: MouseEvent | KeyboardEvent]
  }>()

  /** The thumb the reader chose: `up`, `down`, or `null` when cleared. Supports v-model:feedback. */
  const feedback = defineModel<ChatMessageFeedbackValue | null>('feedback', { default: null })

  defineSlots<{
    /** Before Copy: the `ResponseBranches` pager of a regenerated response or an edited prompt. */
    leading?(): unknown
    /** App actions after the built-in ones and before More. */
    default?(): unknown
    /** At the end of the same row: the `Sources` pill of the response. */
    trailing?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ chatMessage: en.chatMessage, common: en.common })
  const { from, status, edit, contentText } = useChatMessageContext()

  const rowEl = ref<HTMLElement | null>(null)
  const copyValue = ref<string>(props.copyText)
  const width = ref<number>(0)
  const conversation = inject(ConversationInjectionKey, null)
  const near = ref<boolean>(!conversation)
  let frame = 0

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'chat-message-actions'
  )
  const compact = computed<boolean>(() => width.value > 0 && width.value < 480)
  const menuFeedback = computed<boolean>(() => compact.value && props.showFeedback)
  const menuRetry = computed<boolean>(() => compact.value && props.retryable)
  const showMore = computed<boolean>(
    () => menuFeedback.value || menuRetry.value || props.branchable
  )
  const speech = () => props.readAloudText || contentText()

  const ChatMessageMore = defineClientLazy(() => import('../parts/chat-message-more.vue'), {
    inheritAttrs: false,
    render: () =>
      h(IconButton, {
        icon: 'az az-ellipsis',
        ariaLabel: t('chatMessage.more'),
        variant: 'ghost',
        size: 'medium',
        disabled: true
      })
  })

  function refreshCopy(): void {
    copyValue.value = props.copyText || contentText()
  }

  function rate(value: ChatMessageFeedbackValue): void {
    feedback.value = feedback.value === value ? null : value
  }

  function onSelect(event: MouseEvent | KeyboardEvent, value: string | number): void {
    if (value === 'up' || value === 'down') rate(value)
    else if (value === 'retry') emit('retry', event)
    else if (value === 'branch') emit('branch', event)
  }

  let nearObserver: IntersectionObserver | null = null

  function onNear(entries: IntersectionObserverEntry[]): void {
    const entry = entries.find((item) => item.isIntersecting)
    if (!entry) return
    width.value = entry.boundingClientRect.width
    near.value = true
    nearObserver?.disconnect()
  }

  watch(
    rowEl,
    (el) => {
      nearObserver?.disconnect()
      if (!el || near.value) return
      if (typeof globalThis.IntersectionObserver === 'undefined') {
        near.value = true
        return
      }
      nearObserver = new IntersectionObserver(onNear, {
        root: conversation?.viewportEl.value,
        rootMargin: '600px'
      })
      nearObserver.observe(el)
    },
    { flush: 'post', immediate: true }
  )

  useResizeObserver(rowEl, (entries) => {
    const next = entries[0]?.contentRect.width ?? 0
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      width.value = next
    })
  })

  onScopeDispose(() => {
    cancelAnimationFrame(frame)
    nearObserver?.disconnect()
  })
  onMounted(refreshCopy)
  watch(() => props.copyText, refreshCopy)

  const ACTIONS_CLASS =
    'relative z-1 flex min-h-8 w-full min-w-0 flex-nowrap items-center gap-(--spacing-2xs) data-[from=user]:w-auto data-[from=user]:justify-end ' +
    '[&_button[data-size=medium]_[data-transition]]:size-5 [&_button[data-size=medium]_i]:text-body-lg ' +
    '[&_button[data-size=medium]:not([data-inert])_i]:text-(--text-muted) ' +
    '[&_button[data-size=medium]:not([data-inert]):hover_i]:text-(--text-default)'
</script>

<template>
  <div
    v-if="status === 'success'"
    ref="rowEl"
    v-bind="$attrs"
    :role="near ? 'group' : undefined"
    :aria-label="near ? ariaLabel || t('chatMessage.actions') : undefined"
    :data-testid="testId"
    :data-from="from"
    :data-compact="compact || null"
    :class="ACTIONS_CLASS"
    @focusin="refreshCopy"
    @pointerenter="refreshCopy"
  >
    <template v-if="near">
      <slot name="leading" />
      <LazyCopyButton
        v-if="copyable"
        :value="copyValue"
        :aria-label="t('common.copy')"
        size="medium"
        :data-testid="`${testId}__copy`"
      />
      <LazyTooltip
        v-if="editable"
        :content="t('chatMessage.edit')"
      >
        <IconButton
          icon="az az-pencil"
          :aria-label="t('chatMessage.edit')"
          variant="ghost"
          size="medium"
          :disabled="disabled"
          :data-testid="`${testId}__edit`"
          @click="edit"
        />
      </LazyTooltip>
      <ChatMessageFeedback
        v-if="showFeedback && !compact"
        v-model="feedback"
        :data-testid="`${testId}__feedback`"
      />
      <ChatMessageReadAloud
        v-if="showReadAloud"
        :text="speech"
        :data-testid="`${testId}__read-aloud`"
      />
      <LazyTooltip
        key="tooltip-2"
        v-if="shareable"
        :content="t('chatMessage.share')"
      >
        <IconButton
          icon="az az-share"
          :aria-label="t('chatMessage.share')"
          variant="ghost"
          size="medium"
          :data-testid="`${testId}__share`"
          @click="(event: MouseEvent) => emit('share', event)"
        />
      </LazyTooltip>
      <LazyTooltip
        key="tooltip-3"
        v-if="retryable && !compact"
        :content="t('chatMessage.retry')"
      >
        <IconButton
          icon="az az-refresh"
          :aria-label="t('chatMessage.retry')"
          variant="ghost"
          size="medium"
          :disabled="disabled"
          :data-testid="`${testId}__retry`"
          @click="(event: MouseEvent) => emit('retry', event)"
        />
      </LazyTooltip>
      <slot />
      <ChatMessageMore
        v-if="showMore"
        :show-feedback="menuFeedback"
        :feedback="feedback"
        :retryable="menuRetry"
        :branchable="branchable"
        :disabled="disabled"
        :data-testid="`${testId}__more`"
        @select="onSelect"
      />
      <div
        v-if="$slots['trailing']"
        :data-testid="`${testId}__trailing`"
        class="ms-(--spacing-2xs) -my-(--spacing-2xs) flex min-w-0 shrink items-center overflow-hidden p-(--spacing-2xs)"
      >
        <slot name="trailing" />
      </div>
    </template>
  </div>
</template>

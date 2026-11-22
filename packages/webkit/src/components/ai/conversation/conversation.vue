<script setup lang="ts">
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    useAttrs,
    watch
  } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import { useConversationPin } from './composables/use-conversation-pin'
  import type { ConversationLayout } from './injection-key'
  import { ConversationInjectionKey } from './injection-key'
  import { firstMessage, observeHistory } from './lib/conversation-dom'

  export type { ConversationLayout }

  defineOptions({
    name: 'Conversation',
    inheritAttrs: false
  })

  export interface ConversationProps {
    /** Accessible name of the message log. Empty uses the locale catalog (`Conversation`). */
    ariaLabel?: string
    /** `split` puts the user's messages at the inline end (a full chat page); `start` keeps every message at the inline start (a side panel or drawer). */
    layout?: ConversationLayout
    /** Older messages exist above the first one. A Load earlier messages button opens the thread and the log emits `load-more` as the reader scrolls near the top. */
    moreMessages?: boolean
    /** The older messages are loading; the button at the top of the thread shows its spinner and holds further `load-more` requests. */
    loadingMore?: boolean
  }

  const props = withDefaults(defineProps<ConversationProps>(), {
    ariaLabel: '',
    layout: 'split',
    moreMessages: false,
    loadingMore: false
  })

  const emit = defineEmits<{
    /** Older messages are wanted: the Load earlier messages button was pressed, or the top of the thread neared the viewport. */
    'load-more': [event: Event]
  }>()

  const slots = defineSlots<{
    /** The thread: `ChatMessage` items in order, oldest first, plus anything that follows the last response (suggestions, an approval card). */
    default(): unknown
    /** The composer floating over the bottom of the thread, in the reading column: `PromptInput`, with any status, alert or queue above it. The thread scrolls under it behind a fade. */
    composer?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ conversation: en.conversation })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'conversation'
  )

  const viewportEl = ref<HTMLElement | null>(null)
  const contentEl = ref<HTMLElement | null>(null)
  const olderEl = ref<HTMLElement | null>(null)
  const composerEl = ref<HTMLElement | null>(null)
  const composerHeight = ref<number>(0)
  const ready = ref<boolean>(false)
  const announcement = ref<string>('')

  const pinned = ref<boolean>(true)
  const { scrollToBottom, findAnchor, holdAnchor } = useConversationPin(
    viewportEl,
    contentEl,
    olderEl,
    pinned
  )

  function say(text: string): void {
    announcement.value = ''
    void nextTick(() => {
      announcement.value = text
    })
  }

  function announce(author: string, text: string): void {
    const body = text.replace(/\s+/g, ' ').trim()
    if (!body) return
    say(t('conversation.announcement', { author, text: body }))
  }

  const showOlder = computed<boolean>(() => props.moreMessages || props.loadingMore)
  let requested = false
  let firstBefore: Element | null = null
  let observer: ResizeObserver | undefined
  let composerObserver: ResizeObserver | undefined
  let watcher: IntersectionObserver | undefined

  function settle(): void {
    void nextTick(() => {
      ready.value = true
    })
  }

  function hold(): void {
    if (!requested) firstBefore = firstMessage(contentEl.value, olderEl.value)
    requested = true
    ready.value = false
  }

  function onLoadMore(event: Event): void {
    if (!props.moreMessages || props.loadingMore) return
    hold()
    if (!pinned.value) findAnchor()
    emit('load-more', event)
  }

  function swapOlder(now: HTMLElement | null, was?: HTMLElement | null): void {
    if (was) watcher?.unobserve(was)
    if (now) watcher?.observe(now)
  }

  function onResize(): void {
    if (pinned.value) scrollToBottom()
    else holdAnchor()
    if (
      !requested ||
      props.loadingMore ||
      firstMessage(contentEl.value, olderEl.value) === firstBefore
    )
      return
    requested = false
    settle()
    say(t('conversation.moreLoaded'))
    if (olderEl.value) swapOlder(olderEl.value, olderEl.value)
  }

  function onNear(entries: IntersectionObserverEntry[]): void {
    if (entries.some((entry) => entry.isIntersecting) && !requested)
      onLoadMore(new Event('load-more'))
  }

  watch(
    () => props.loadingMore,
    (now, was) => {
      if (now) {
        hold()
        say(t('conversation.loadingMore'))
        return
      }
      if (was) settle()
    }
  )

  watch(showOlder, (now) => {
    if (now || !olderEl.value?.contains(document.activeElement)) return
    void nextTick(() => viewportEl.value?.focus({ preventScroll: true }))
  })

  watch(olderEl, swapOlder, { flush: 'post' })

  function measureComposer(): void {
    composerHeight.value = composerEl.value?.offsetHeight ?? 0
  }

  watch(
    composerEl,
    (now, was) => {
      if (was) composerObserver?.unobserve(was)
      if (now) composerObserver?.observe(now)
      measureComposer()
    },
    { flush: 'post' }
  )

  onMounted(() => {
    if (typeof ResizeObserver !== 'undefined')
      composerObserver = new ResizeObserver(measureComposer)
    if (composerEl.value) composerObserver?.observe(composerEl.value)
    measureComposer()
    scrollToBottom()
    ready.value = true
    ;[watcher, observer] = observeHistory(
      viewportEl.value,
      contentEl.value,
      olderEl.value,
      onNear,
      onResize
    )
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    watcher?.disconnect()
    composerObserver?.disconnect()
  })

  provide(ConversationInjectionKey, {
    alignment: computed(() => props.layout),
    ready,
    announce
  })

  defineExpose({ scrollToBottom })

  const VIEWPORT_CLASS =
    'min-h-0 flex-1 overflow-y-auto overscroll-contain [overflow-anchor:none] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset'

  const CONTENT_CLASS =
    'mx-auto flex min-h-full w-full max-w-(--layout-measure-content) flex-col gap-(--spacing-lg) px-(--spacing-md) pt-(--spacing-md) ' +
    'pb-[calc(var(--conversation-composer-height,0rem)+var(--spacing-md))] ' +
    '[&>[data-from=user]:not(:first-child,[data-grouped])]:mt-(--spacing-lg)'

  const COMPOSER_CLASS =
    'pointer-events-none absolute inset-x-0 bottom-0 z-1 bg-[linear-gradient(to_top,var(--conversation-composer-fade,var(--bg-canvas))_60%,transparent)] pt-(--spacing-lg)'

  const SCROLL_CLASS =
    'pointer-events-auto border-(--border-default) bg-[color-mix(in_srgb,var(--bg-surface-raised)_88%,transparent)]! shadow-(--shadow-md) backdrop-blur-md'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-layout="layout"
    :data-pinned="pinned || null"
    :data-loading-more="loadingMore || null"
    :style="
      slots.composer ? { '--conversation-composer-height': `${composerHeight}px` } : undefined
    "
    class="relative flex min-h-0 w-full flex-1 flex-col"
  >
    <div
      ref="viewportEl"
      role="log"
      aria-live="off"
      tabindex="0"
      :aria-label="ariaLabel || t('conversation.label')"
      :aria-busy="loadingMore || undefined"
      :data-testid="`${testId}__viewport`"
      :class="VIEWPORT_CLASS"
    >
      <div
        ref="contentEl"
        :class="CONTENT_CLASS"
      >
        <div
          v-if="showOlder"
          ref="olderEl"
          class="flex justify-center"
          :data-testid="`${testId}__older`"
        >
          <Button
            variant="ghost"
            size="small"
            icon="az az-arrow-up"
            :label="loadingMore ? t('conversation.loadingMore') : t('conversation.loadMore')"
            :loading="loadingMore"
            :data-testid="`${testId}__load-more`"
            @click="onLoadMore"
          />
        </div>
        <slot />
      </div>
    </div>
    <div
      v-if="!pinned"
      class="pointer-events-none absolute inset-x-0 bottom-[calc(var(--conversation-composer-height,0rem)+var(--spacing-sm))] z-2 flex justify-center"
    >
      <IconButton
        icon="az az-arrow-down"
        variant="outline"
        size="large"
        :class="SCROLL_CLASS"
        :ariaLabel="t('conversation.scrollToLatest')"
        :data-testid="`${testId}__scroll-to-latest`"
        @click="scrollToBottom(true)"
      />
    </div>
    <div
      v-if="slots.composer"
      ref="composerEl"
      :data-testid="`${testId}__composer`"
      :class="COMPOSER_CLASS"
    >
      <div
        class="pointer-events-auto mx-auto flex w-full max-w-(--layout-measure-content) flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-md)"
      >
        <slot name="composer" />
      </div>
    </div>
    <div
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
      :data-testid="`${testId}__announcer`"
    >
      {{ announcement }}
    </div>
  </div>
</template>

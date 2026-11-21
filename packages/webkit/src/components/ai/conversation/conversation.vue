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

  import { useElementListener } from '../../../composables/use-element-listener'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import type { ConversationLayout } from './injection-key'
  import { ConversationInjectionKey } from './injection-key'

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

  defineSlots<{
    /** The thread: `ChatMessage` items in order, oldest first, plus anything that follows the last response (suggestions, an approval card). */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ conversation: en.conversation })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'conversation'
  )

  const viewportEl = ref<HTMLElement | null>(null)
  const contentEl = ref<HTMLElement | null>(null)
  const olderEl = ref<HTMLElement | null>(null)
  const pinned = ref<boolean>(true)
  const ready = ref<boolean>(false)
  const announcement = ref<string>('')
  const THRESHOLD = 32
  const LOOKAHEAD = 200

  const showOlder = computed<boolean>(() => props.moreMessages || props.loadingMore)

  function distanceFromEnd(): number {
    const el = viewportEl.value
    if (!el) return 0
    return el.scrollHeight - el.scrollTop - el.clientHeight
  }

  function reducedMotion(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }

  let intent = false
  let intentTimer: ReturnType<typeof setTimeout> | undefined
  let smoothing = false
  let smoothTimer: ReturnType<typeof setTimeout> | undefined
  let anchor: Element | null = null
  let anchorTop = 0
  let requested = false
  let firstBefore: Element | null = null

  function scrollToBottom(smooth = false): void {
    const el = viewportEl.value
    if (!el) return
    pinned.value = true
    const animate = smooth && !reducedMotion()
    smoothing = animate
    if (smoothTimer) clearTimeout(smoothTimer)
    if (animate) smoothTimer = setTimeout(() => (smoothing = false), 1000)
    el.scrollTo({ top: el.scrollHeight, behavior: animate ? 'smooth' : 'auto' })
  }

  function markIntent(): void {
    intent = true
    smoothing = false
    if (intentTimer) clearTimeout(intentTimer)
    intentTimer = setTimeout(() => (intent = false), 400)
  }

  useElementListener(viewportEl, 'keydown', markIntent)

  function firstMessage(): Element | null {
    const items = contentEl.value?.children
    if (!items) return null
    return (items[0] === olderEl.value ? items[1] : items[0]) ?? null
  }

  function findAnchor(): void {
    const el = viewportEl.value
    const items = contentEl.value?.children
    anchor = null
    if (!el || !items) return
    const top = el.getBoundingClientRect().top
    if (olderEl.value?.contains(document.activeElement)) {
      anchor = olderEl.value
      anchorTop = anchor.getBoundingClientRect().top - top
      return
    }
    let low = items[0] === olderEl.value ? 1 : 0
    let high = items.length - 1
    let found = -1
    while (low <= high) {
      const middle = (low + high) >> 1
      if (items[middle].getBoundingClientRect().bottom > top) {
        found = middle
        high = middle - 1
      } else low = middle + 1
    }
    if (found < 0) return
    anchor = items[found]
    anchorTop = anchor.getBoundingClientRect().top - top
  }

  function holdAnchor(): void {
    const el = viewportEl.value
    if (el && anchor?.isConnected) {
      const delta = anchor.getBoundingClientRect().top - el.getBoundingClientRect().top - anchorTop
      if (Math.abs(delta) >= 1) el.scrollTop += delta
    }
    findAnchor()
  }

  function onScroll(): void {
    const atEnd = distanceFromEnd() <= THRESHOLD
    if (intent || atEnd) {
      pinned.value = atEnd
      findAnchor()
      return
    }
    if (pinned.value && !smoothing) scrollToBottom()
    findAnchor()
  }

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

  function settle(): void {
    void nextTick(() => {
      ready.value = true
    })
  }

  function hold(): void {
    if (!requested) firstBefore = firstMessage()
    requested = true
    ready.value = false
  }

  function request(event: Event): void {
    if (!props.moreMessages || props.loadingMore) return
    hold()
    if (!pinned.value) findAnchor()
    emit('load-more', event)
  }

  function onLoadMore(event: MouseEvent): void {
    request(event)
  }

  let observer: ResizeObserver | undefined
  let watcher: IntersectionObserver | undefined

  function rearm(): void {
    const el = olderEl.value
    if (!watcher || !el) return
    watcher.unobserve(el)
    watcher.observe(el)
  }

  function onResize(): void {
    if (pinned.value) scrollToBottom()
    else holdAnchor()
    if (!requested || props.loadingMore || firstMessage() === firstBefore) return
    requested = false
    settle()
    say(t('conversation.moreLoaded'))
    rearm()
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

  watch(
    olderEl,
    (now, was) => {
      if (was) watcher?.unobserve(was)
      if (now) watcher?.observe(now)
    },
    { flush: 'post' }
  )

  onMounted(() => {
    scrollToBottom()
    ready.value = true
    if (typeof IntersectionObserver !== 'undefined' && viewportEl.value) {
      watcher = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting) && !requested)
            request(new Event('load-more'))
        },
        { root: viewportEl.value, rootMargin: `${LOOKAHEAD}px 0% 0% 0%` }
      )
      if (olderEl.value) watcher.observe(olderEl.value)
    }
    if (typeof ResizeObserver === 'undefined' || !contentEl.value || !viewportEl.value) return
    observer = new ResizeObserver(onResize)
    observer.observe(contentEl.value)
    observer.observe(viewportEl.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    watcher?.disconnect()
    if (intentTimer) clearTimeout(intentTimer)
    if (smoothTimer) clearTimeout(smoothTimer)
  })

  provide(ConversationInjectionKey, {
    alignment: computed(() => props.layout),
    ready,
    announce
  })

  defineExpose({ scrollToBottom })

  const VIEWPORT_CLASS =
    'min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-(--shape-control) [overflow-anchor:none] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-layout="layout"
    :data-pinned="pinned || null"
    :data-loading-more="loadingMore || null"
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
      @scroll.passive="onScroll"
      @wheel.passive="markIntent"
      @touchmove.passive="markIntent"
      @pointerdown="markIntent"
    >
      <div
        ref="contentEl"
        class="mx-auto flex w-full max-w-(--layout-measure-content) flex-col gap-(--spacing-lg) p-(--spacing-md)"
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
      class="pointer-events-none absolute inset-x-0 bottom-(--spacing-sm) flex justify-center"
    >
      <IconButton
        icon="az az-arrow-down"
        variant="outline"
        size="medium"
        class="pointer-events-auto bg-(--bg-surface) shadow-(--shadow-sm)"
        :ariaLabel="t('conversation.scrollToLatest')"
        :data-testid="`${testId}__scroll-to-latest`"
        @click="scrollToBottom(true)"
      />
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

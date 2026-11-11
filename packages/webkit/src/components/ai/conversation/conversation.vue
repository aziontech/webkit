<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import type { ConversationAlignment } from './injection-key'
  import { ConversationInjectionKey } from './injection-key'

  export type { ConversationAlignment }

  defineOptions({
    name: 'Conversation',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name of the message log. Empty uses the locale catalog (`Conversation`). */
    ariaLabel?: string
    /** `split` puts the user's messages at the inline end (a full chat page); `start` keeps every message at the inline start (a side panel or drawer). */
    alignment?: ConversationAlignment
  }

  const props = withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    alignment: 'split'
  })

  defineSlots<{
    /** The thread: `ChatMessage` items in order, oldest first, plus anything that follows the last response (suggestions, an approval card). */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ conversation: en.conversation })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-conversation'
  )

  const viewport = ref<HTMLElement | null>(null)
  const content = ref<HTMLElement | null>(null)
  const pinned = ref<boolean>(true)
  const ready = ref<boolean>(false)
  const announcement = ref<string>('')
  const THRESHOLD = 32

  function distanceFromEnd(): number {
    const el = viewport.value
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

  function scrollToBottom(smooth = false): void {
    const el = viewport.value
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

  function onScroll(): void {
    const atEnd = distanceFromEnd() <= THRESHOLD
    if (intent || atEnd) {
      pinned.value = atEnd
      return
    }
    if (pinned.value && !smoothing) scrollToBottom()
  }

  function announce(author: string, text: string): void {
    const body = text.replace(/\s+/g, ' ').trim()
    if (!body) return
    announcement.value = ''
    void nextTick(() => {
      announcement.value = t('conversation.announcement', { author, text: body })
    })
  }

  let observer: ResizeObserver | undefined

  onMounted(() => {
    scrollToBottom()
    ready.value = true
    if (typeof ResizeObserver === 'undefined' || !content.value || !viewport.value) return
    observer = new ResizeObserver(() => {
      if (pinned.value) scrollToBottom()
    })
    observer.observe(content.value)
    observer.observe(viewport.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    if (intentTimer) clearTimeout(intentTimer)
    if (smoothTimer) clearTimeout(smoothTimer)
  })

  provide(ConversationInjectionKey, {
    alignment: computed(() => props.alignment),
    ready,
    announce
  })

  defineExpose({ scrollToBottom })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-alignment="alignment"
    :data-pinned="pinned || null"
    class="relative flex min-h-0 w-full flex-1 flex-col"
  >
    <div
      ref="viewport"
      role="log"
      aria-live="off"
      tabindex="0"
      :aria-label="ariaLabel || t('conversation.label')"
      :data-testid="`${testId}__viewport`"
      class="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-(--shape-elements) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
      @scroll.passive="onScroll"
      @wheel.passive="markIntent"
      @touchmove.passive="markIntent"
      @pointerdown="markIntent"
      @keydown="markIntent"
    >
      <div
        ref="content"
        class="mx-auto flex w-full max-w-(--layout-measure-content) flex-col gap-(--spacing-lg) p-(--spacing-md)"
      >
        <slot />
      </div>
    </div>
    <div
      v-if="!pinned"
      class="pointer-events-none absolute inset-x-0 bottom-(--spacing-sm) flex justify-center"
    >
      <IconButton
        icon="pi pi-arrow-down"
        kind="outlined"
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

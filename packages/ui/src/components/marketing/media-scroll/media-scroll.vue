<script setup lang="ts">
  import { useEventListener } from '@vueuse/core'
  import {
    Comment,
    computed,
    Fragment,
    isVNode,
    onMounted,
    onScopeDispose,
    ref,
    Text,
    useAttrs,
    watch
  } from 'vue'

  import { useMediaQuery } from '../../../composables/use-media-query'
  import Texture from '../../content/texture/texture.vue'

  defineOptions({
    name: 'MediaScroll',
    inheritAttrs: false
  })

  /** One claim in the run: the sentence a reader arrives at and the medium it stands for. */
  export type MediaScrollItem = {
    /** The claim's heading, naming it in the stack. */
    title: string
    /** The sentence that opens with the claim. */
    description: string
    /** Source of the image shown while this claim is open; ignored when the media slot is filled. */
    src?: string
    /** Alternative text for that image; empty leaves it decorative. */
    alt?: string
  }

  /** Height the open claim is held to, and so the height of the whole stack. */
  export type MediaScrollSize = 'small' | 'medium' | 'large'

  export interface MediaScrollProps {
    /** The claims, in reading order; each item is a title, the sentence that opens with it, and the image shown while it is open. */
    items?: MediaScrollItem[]
    /** Height the open claim is held to, and so the height of the whole stack beside the media. */
    size?: MediaScrollSize
    /** Screen-heights of scrolling each claim holds while the band is pinned; the band's total scroll is one screen plus this much per claim. */
    dwell?: number
    /** Fills a hairline along the open claim's bottom edge as its share of the scroll is spent. */
    showProgress?: boolean
  }

  const props = withDefaults(defineProps<MediaScrollProps>(), {
    items: () => [],
    size: 'medium',
    dwell: 0.7,
    showProgress: true
  })

  const emit = defineEmits<{
    /** The open claim changed; the index now open. */
    'active-index-change': [index: number]
  }>()

  const slots = defineSlots<{
    /** The claim's medium; replaces the image built from the item's own source. */
    media?(props: { item: MediaScrollItem; index: number; active: boolean }): unknown
    /** The claim's own controls, under its description; shown while the claim is open. */
    actions?(props: { item: MediaScrollItem; index: number; active: boolean }): unknown
    /** Fills the media frame behind every claim's medium; mounted once, so it holds still as the claims change. */
    backdrop?(): unknown
  }>()

  const attrs = useAttrs()
  const pinned = useMediaQuery('(min-width: 64rem)')

  const trackEl = ref<globalThis.HTMLElement | null>(null)
  const frameEl = ref<globalThis.HTMLElement | null>(null)
  const activeIndex = ref(0)
  const sliceProgress = ref(0)
  let pending: number | null = null

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'media-scroll')

  const DENSE_FROM = 6

  const count = computed(() => props.items.length)
  const hasItems = computed(() => count.value > 0)
  const dense = computed(() => count.value >= DENSE_FROM)
  const span = computed(() => 1 + count.value * props.dwell)
  const activeItem = computed<MediaScrollItem | null>(() => props.items[activeIndex.value] ?? null)

  useEventListener(
    typeof globalThis.window !== 'undefined' ? globalThis.window : null,
    'scroll',
    schedule,
    { passive: true, capture: true }
  )
  useEventListener(
    typeof globalThis.window !== 'undefined' ? globalThis.window : null,
    'resize',
    schedule,
    { passive: true }
  )

  watch(count, (length) => {
    if (activeIndex.value < length) return
    activeIndex.value = 0
    sliceProgress.value = 0
  })

  onMounted(measure)

  onScopeDispose(() => {
    if (pending === null) return
    globalThis.cancelAnimationFrame(pending)
    pending = null
  })

  function hasActions(item: MediaScrollItem, index: number): boolean {
    return rendersContent(slots.actions?.({ item, index, active: isActive(index) }))
  }

  function rendersContent(nodes: unknown): boolean {
    if (!Array.isArray(nodes)) return false
    return nodes.some((node) => {
      if (!isVNode(node) || node.type === Comment) return false
      if (node.type === Fragment) return rendersContent(node.children)
      if (node.type === Text) return String(node.children ?? '').trim().length > 0
      return true
    })
  }

  function isActive(index: number): boolean {
    return index === activeIndex.value
  }

  function pinnedMetrics(): { total: number; scrolled: number } | null {
    if (!trackEl.value || !frameEl.value) return null
    const trackRect = trackEl.value.getBoundingClientRect()
    const frameRect = frameEl.value.getBoundingClientRect()
    const total = trackRect.height - frameRect.height
    if (total <= 1) return null
    return { total, scrolled: frameRect.top - trackRect.top }
  }

  function measure(): void {
    const metrics = pinnedMetrics()
    if (!metrics || count.value === 0) {
      sliceProgress.value = 0
      return
    }
    const progress = Math.min(1, Math.max(0, metrics.scrolled / metrics.total))
    const raw = progress * count.value
    const next = Math.min(count.value - 1, Math.floor(raw + 1e-4))
    sliceProgress.value = Math.min(1, Math.max(0, raw - next))
    if (next === activeIndex.value) return
    activeIndex.value = next
    emit('active-index-change', next)
  }

  function schedule(): void {
    if (pending !== null) return
    pending = globalThis.requestAnimationFrame(() => {
      pending = null
      measure()
    })
  }

  function goTo(index: number): void {
    if (index !== activeIndex.value && index >= 0 && index < count.value) {
      activeIndex.value = index
      sliceProgress.value = 0
      emit('active-index-change', index)
    }
    const metrics = pinnedMetrics()
    if (!metrics || !trackEl.value || !frameEl.value || count.value === 0) return
    const pinnedTop = Number.parseFloat(globalThis.getComputedStyle(frameEl.value).top) || 0
    const trackTop = trackEl.value.getBoundingClientRect().top + globalThis.scrollY
    const share = metrics.total / count.value
    globalThis.scrollTo({ top: trackTop - pinnedTop + share * (index + 0.5) })
  }

  const ROOT_CLASS =
    'relative [--media-scroll-open:calc(var(--spacing-xl)*4)] ' +
    'data-[size=large]:[--media-scroll-open:calc(var(--spacing-xl)*5)] data-[size=small]:[--media-scroll-open:calc(var(--spacing-xl)*3)] ' +
    'lg:h-[calc(100dvh*var(--media-scroll-span))]'

  const GRID_CLASS =
    'grid w-full grid-cols-1 lg:shrink-0 lg:h-[var(--media-scroll-height,100%)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:border-y-[length:var(--media-scroll-frame-border,0)] ' +
    'lg:border-solid lg:border-(--border-default)'

  const ITEM_CLASS =
    'group relative border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-lg) ' +
    'last:border-b-0 lg:flex lg:grow-0 lg:flex-col lg:justify-start lg:transition-[flex-grow] lg:duration-moderate-01 lg:ease-productive-entrance lg:data-[dense]:py-(--spacing-md) ' +
    'lg:data-[active]:min-h-(--media-scroll-open) lg:data-[active]:grow lg:data-[active]:justify-center lg:data-[active]:py-(--spacing-xl) lg:data-[active]:data-[actions]:justify-start ' +
    'lg:data-[active]:data-[actions]:pb-(--spacing-lg) lg:data-[active]:data-[dense]:py-(--spacing-lg) lg:data-[active]:data-[dense]:data-[actions]:pb-(--spacing-md) ' +
    'motion-reduce:transition-none'

  const ITEM_TITLE_CLASS =
    'm-0 text-heading-md text-(--text-default) transition-[color,opacity] duration-moderate-01 ease-out ' +
    'motion-reduce:transition-none lg:text-(--text-muted) lg:group-data-[active]:text-(--text-default) lg:group-data-[completed]:opacity-55'

  const ITEM_BUTTON_CLASS =
    "m-0 cursor-default p-0 text-start lg:cursor-pointer lg:after:absolute lg:after:inset-0 lg:after:content-[''] focus-visible:ring-2 focus-visible:ring-(--ring-color) " +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'

  const ITEM_BODY_CLASS =
    'grid grid-rows-[1fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance ' +
    'motion-reduce:transition-none lg:min-h-0 lg:grid-rows-[0fr] lg:group-data-[active]:grid-rows-[1fr] lg:group-data-[active]:group-data-[actions]:flex-1'

  const ITEM_DESCRIPTION_CLASS =
    'm-0 max-w-(--container-sm) pt-(--spacing-sm) text-body-md text-(--text-muted) transition-[opacity,translate] duration-moderate-02 ease-productive-entrance ' +
    'motion-reduce:transition-none lg:translate-y-(--spacing-sm) lg:opacity-0 lg:group-data-[active]:translate-y-0 lg:group-data-[active]:opacity-100 lg:group-data-[active]:delay-100'

  const ITEM_ACTIONS_CLASS =
    'mt-(--spacing-xl) flex items-center gap-(--spacing-sm) transition-[opacity,translate] duration-moderate-02 ease-productive-entrance ' +
    'motion-reduce:transition-none lg:invisible lg:mt-auto lg:translate-y-(--spacing-sm) lg:pt-(--spacing-xl) lg:opacity-0 lg:group-data-[active]:visible ' +
    'lg:group-data-[active]:translate-y-0 lg:group-data-[active]:opacity-100 lg:group-data-[active]:delay-200'
</script>

<template>
  <div
    v-if="hasItems"
    ref="trackEl"
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-progress="showProgress || null"
    :style="{ '--media-scroll-span': span, '--media-scroll-dwell': dwell }"
    :class="ROOT_CLASS"
  >
    <div
      ref="frameEl"
      class="lg:sticky lg:top-[var(--media-scroll-top,0)] lg:h-[calc(100dvh-var(--media-scroll-top,0rem))] lg:flex lg:flex-col lg:overflow-hidden"
    >
      <div
        aria-hidden="true"
        class="relative hidden lg:block lg:min-h-0 lg:flex-1"
      >
        <Texture variant="lines" />
      </div>
      <div :class="GRID_CLASS">
        <ol
          class="m-0 flex list-none flex-col p-0 lg:min-w-0 lg:[align-self:var(--media-scroll-align,start)]"
        >
          <li
            v-for="(item, index) in items"
            :key="`${item.title}-${index}`"
            :data-active="isActive(index) || null"
            :data-completed="index < activeIndex || null"
            :data-actions="hasActions(item, index) || null"
            :data-dense="dense || null"
            :class="ITEM_CLASS"
          >
            <h3 :class="ITEM_TITLE_CLASS">
              <button
                v-if="pinned"
                type="button"
                :aria-current="isActive(index) ? 'true' : undefined"
                :class="ITEM_BUTTON_CLASS"
                @click="goTo(index)"
                @focus="goTo(index)"
              >
                {{ item.title }}
              </button>
              <template v-else>{{ item.title }}</template>
            </h3>

            <div :class="ITEM_BODY_CLASS">
              <div class="min-h-0 overflow-hidden lg:flex lg:flex-col">
                <p :class="ITEM_DESCRIPTION_CLASS">
                  {{ item.description }}
                </p>

                <div
                  v-if="hasActions(item, index)"
                  :class="ITEM_ACTIONS_CLASS"
                >
                  <slot
                    name="actions"
                    :item="item"
                    :index="index"
                    :active="isActive(index)"
                  />
                </div>

                <div class="relative mt-(--spacing-md) w-full min-w-0 lg:hidden">
                  <slot
                    name="media"
                    :item="item"
                    :index="index"
                    :active="isActive(index)"
                  >
                    <img
                      v-if="item.src"
                      :src="item.src"
                      :alt="item.alt ?? ''"
                      class="aspect-video w-full object-cover"
                    />
                  </slot>
                </div>
              </div>
            </div>

            <span
              v-if="showProgress && isActive(index)"
              aria-hidden="true"
              :style="{ width: `${sliceProgress * 100}%` }"
              class="absolute -bottom-px start-0 hidden h-px bg-(--primary) lg:block"
            />
          </li>
        </ol>

        <div
          class="relative hidden bg-(--bg-canvas) lg:block lg:h-full lg:min-w-0 lg:border-s lg:border-(--border-default)"
        >
          <div
            v-if="$slots['backdrop']"
            aria-hidden="true"
            class="pointer-events-none absolute inset-0"
          >
            <slot name="backdrop" />
          </div>
          <Transition
            enter-active-class="animate-fade-in motion-reduce:animate-none"
            leave-active-class="animate-fade-out motion-reduce:animate-none"
          >
            <div
              v-if="activeItem"
              :key="activeIndex"
              class="absolute inset-0 flex items-center justify-center p-(--spacing-xl)"
            >
              <slot
                name="media"
                :item="activeItem"
                :index="activeIndex"
                :active="true"
              >
                <img
                  v-if="activeItem.src"
                  :src="activeItem.src"
                  :alt="activeItem.alt ?? ''"
                  class="max-h-full w-full object-contain"
                />
              </slot>
            </div>
          </Transition>
        </div>
      </div>

      <div
        aria-hidden="true"
        class="relative hidden lg:block lg:min-h-0 lg:flex-1"
      >
        <Texture variant="lines" />
      </div>
    </div>
  </div>
</template>

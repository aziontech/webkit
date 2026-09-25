<script setup lang="ts">
  import { useEventListener } from '@vueuse/core'
  import { computed, onMounted, onScopeDispose, ref, useAttrs, watch } from 'vue'

  defineOptions({
    name: 'StickyStack',
    inheritAttrs: false
  })

  /** One claim in the run: the sentence a reader arrives at and the medium it stands for. */
  export type StickyStackItem = {
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
  export type StickyStackSize = 'small' | 'medium' | 'large'

  interface Props {
    /** The claims, in reading order; each item is a title, the sentence that opens with it, and the image shown while it is open. */
    items?: StickyStackItem[]
    /** Height the open claim is held to, and so the height of the whole stack beside the media. */
    size?: StickyStackSize
    /** Screen-heights of scrolling each claim holds while the band is pinned; the band's total scroll is one screen plus this much per claim. */
    dwell?: number
    /** Fills a hairline along the open claim's bottom edge as its share of the scroll is spent. */
    showProgress?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    size: 'medium',
    dwell: 0.7,
    showProgress: true
  })

  const emit = defineEmits<{
    /** The open claim changed; the index now open. */
    'index-change': [index: number]
  }>()

  defineSlots<{
    /** The claim's medium; replaces the image built from the item's own source. */
    media(props: { item: StickyStackItem; index: number; active: boolean }): unknown
  }>()

  const attrs = useAttrs()

  const track = ref<globalThis.HTMLElement | null>(null)
  const frame = ref<globalThis.HTMLElement | null>(null)
  const activeIndex = ref(0)
  const sliceProgress = ref(0)
  let pending: number | null = null

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-sticky-stack'
  )

  const count = computed(() => props.items.length)
  const hasItems = computed(() => count.value > 0)
  const span = computed(() => 1 + count.value * props.dwell)
  const activeItem = computed<StickyStackItem | null>(() => props.items[activeIndex.value] ?? null)

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

  function isActive(index: number): boolean {
    return index === activeIndex.value
  }

  function pinnedMetrics(): { total: number; scrolled: number } | null {
    if (!track.value || !frame.value) return null
    const trackRect = track.value.getBoundingClientRect()
    const frameRect = frame.value.getBoundingClientRect()
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
    emit('index-change', next)
  }

  function schedule(): void {
    if (pending !== null) return
    pending = globalThis.requestAnimationFrame(() => {
      pending = null
      measure()
    })
  }

  function goTo(index: number): void {
    if (!pinnedMetrics()) return
    const anchor = track.value?.querySelectorAll('[data-sticky-stack-anchor]')[index]
    if (!(anchor instanceof globalThis.HTMLElement)) return
    anchor.scrollIntoView({ block: 'start' })
  }
</script>

<template>
  <div
    v-if="hasItems"
    ref="track"
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-progress="showProgress || null"
    :style="{ '--sticky-stack-span': span, '--sticky-stack-dwell': dwell }"
    class="relative [--sticky-stack-open:calc(var(--spacing-xl)*4)] data-[size=large]:[--sticky-stack-open:calc(var(--spacing-xl)*5)] data-[size=small]:[--sticky-stack-open:calc(var(--spacing-xl)*3)] lg:h-[calc(100dvh*var(--sticky-stack-span))]"
  >
    <span
      v-for="(item, index) in items"
      :key="`anchor-${item.title}-${index}`"
      data-sticky-stack-anchor
      aria-hidden="true"
      :style="{ '--sticky-stack-slot': index }"
      class="pointer-events-none absolute left-0 hidden w-px lg:block lg:top-[calc(100dvh*var(--sticky-stack-dwell)*var(--sticky-stack-slot))]"
    />

    <div
      ref="frame"
      class="lg:sticky lg:top-0 lg:h-dvh lg:overflow-hidden lg:pt-[var(--sticky-stack-top,0)]"
    >
      <div class="grid grid-cols-1 lg:h-full lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <ol class="m-0 flex list-none flex-col p-0 lg:min-w-0">
          <li
            v-for="(item, index) in items"
            :key="`${item.title}-${index}`"
            :data-active="isActive(index) || null"
            :data-complete="index < activeIndex || null"
            class="group relative border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-lg) last:border-b-0 lg:flex lg:flex-col lg:justify-center lg:data-[active]:min-h-(--sticky-stack-open)"
          >
            <h3
              class="m-0 text-heading-md text-(--text-muted) transition-[color,opacity] duration-moderate-01 ease-out group-data-[active]:text-(--text-default) group-data-[complete]:opacity-55 motion-reduce:transition-none"
            >
              <button
                type="button"
                :aria-current="isActive(index) ? 'true' : undefined"
                class="m-0 cursor-pointer p-0 text-left after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
                @click="goTo(index)"
                @focus="goTo(index)"
              >
                {{ item.title }}
              </button>
            </h3>

            <div
              class="grid grid-rows-[1fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none lg:grid-rows-[0fr] lg:group-data-[active]:grid-rows-[1fr]"
            >
              <div class="min-h-0 overflow-hidden">
                <p class="m-0 pt-(--spacing-sm) text-body-md text-(--text-muted)">
                  {{ item.description }}
                </p>

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
              class="absolute -bottom-px left-0 hidden h-px bg-(--primary) lg:block"
            />
          </li>
        </ol>

        <div
          class="relative hidden bg-(--bg-canvas) lg:block lg:h-full lg:min-w-0 lg:border-l lg:border-(--border-default)"
        >
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
    </div>
  </div>
</template>

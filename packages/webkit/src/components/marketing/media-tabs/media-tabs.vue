<script setup lang="ts">
  import { usePreferredReducedMotion } from '@vueuse/core'
  import { computed, onMounted, onScopeDispose, ref, useAttrs, watch } from 'vue'

  defineOptions({
    name: 'MediaTabs',
    inheritAttrs: false
  })

  /** One tab of the band: the claim a reader selects and the medium it stands for. */
  export type MediaTabsItem = {
    /** The claim's heading, naming the tab in the stack. */
    title: string
    /** The sentence under the title, carrying the claim itself. */
    description: string
    /** Source of the image shown while this tab is active; ignored when the media slot is filled. */
    src?: string
    /** Alternative text for that image; empty leaves it decorative. */
    alt?: string
  }

  /** What moves the selection as the reader points at a row. */
  export type MediaTabsSelectOn = 'hover' | 'click'
  /** Height a row is held to, and so the height of the media column beside the stack. */
  export type MediaTabsSize = 'small' | 'medium' | 'large'

  interface Props {
    /** The tabs, in order; each item is a title, its description, and the image shown while it is active. */
    items?: MediaTabsItem[]
    /** What moves the selection as the reader points at a row. A click always selects, on either setting. */
    selectOn?: MediaTabsSelectOn
    /** Advances to the next tab on a timer; pauses under pointer or focus, stops for good on a click, and never runs under reduced motion. */
    autoPlay?: boolean
    /** Milliseconds each tab is held before the band advances. */
    autoPlayInterval?: number
    /** Advances a hairline along the active row's bottom edge while the timer runs. */
    showProgress?: boolean
    /** Height each row is held to, as a multiple of the band's own padding step; copy longer than that grows its row, and the media column is always as tall as the stack. */
    size?: MediaTabsSize
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    selectOn: 'hover',
    autoPlay: true,
    autoPlayInterval: 5000,
    showProgress: true,
    size: 'medium'
  })

  const emit = defineEmits<{
    /** The selection moved; the DOM event that moved it, then the index now shown. */
    'tab-change': [event: Event, index: number]
  }>()

  defineSlots<{
    /** The tab's medium; replaces the image built from the item's own source. */
    media(props: { item: MediaTabsItem; index: number; active: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const reducedMotion = usePreferredReducedMotion()

  const PROGRESS_TICK_MS = 100

  const activeIndex = ref(0)
  const elapsed = ref(0)
  const selected = ref(false)
  const paused = ref(false)
  let ticker: ReturnType<typeof globalThis.setInterval> | null = null

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-media-tabs'
  )

  const hasItems = computed(() => props.items.length > 0)

  const autoPlayEnabled = computed(
    () =>
      props.autoPlay &&
      !selected.value &&
      props.items.length > 1 &&
      reducedMotion.value !== 'reduce'
  )

  const autoPlayRunning = computed(() => autoPlayEnabled.value && !paused.value)

  const progress = computed(() =>
    Math.min(100, Math.max(0, (elapsed.value / props.autoPlayInterval) * 100))
  )

  watch(autoPlayRunning, (running) => (running ? start() : stop()))

  watch(
    () => props.items.length,
    (length) => {
      if (activeIndex.value < length) return
      activeIndex.value = 0
      elapsed.value = 0
    }
  )

  onMounted(() => {
    if (autoPlayRunning.value) start()
  })

  onScopeDispose(stop)

  function isActive(index: number): boolean {
    return activeIndex.value === index
  }

  function stop(): void {
    if (ticker === null) return
    globalThis.clearInterval(ticker)
    ticker = null
  }

  function start(): void {
    stop()
    ticker = globalThis.setInterval(tick, PROGRESS_TICK_MS)
  }

  function tick(): void {
    elapsed.value += PROGRESS_TICK_MS
    if (elapsed.value < props.autoPlayInterval) return
    elapsed.value = 0
    activeIndex.value = (activeIndex.value + 1) % props.items.length
  }

  function pause(): void {
    paused.value = true
  }

  function resume(): void {
    paused.value = false
  }

  function move(event: globalThis.Event, index: number): void {
    elapsed.value = 0
    if (index === activeIndex.value) return
    activeIndex.value = index
    emit('tab-change', event, index)
  }

  function point(event: globalThis.Event, index: number): void {
    if (props.selectOn !== 'hover') return
    move(event, index)
  }

  function select(event: globalThis.MouseEvent, index: number): void {
    selected.value = true
    move(event, index)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-select-on="selectOn"
    :data-autoplay="autoPlayRunning || null"
    class="[--media-tabs-row:calc(var(--spacing-xl)*4.5)] data-[size=small]:[--media-tabs-row:calc(var(--spacing-xl)*3)] data-[size=large]:[--media-tabs-row:calc(var(--spacing-xl)*6)]"
    @pointerenter="pause"
    @pointerleave="resume"
    @focusin="pause"
    @focusout="resume"
  >
    <div
      v-if="hasItems"
      class="flex flex-col border-y border-(--border-default) lg:flex-row"
    >
      <ul class="flex flex-col lg:w-[calc(50%+var(--spacing-xl))] lg:shrink-0">
        <li
          v-for="(item, index) in items"
          :key="`${item.title}-${index}`"
          :data-active="isActive(index) || null"
          class="relative flex flex-col justify-center gap-(--spacing-md) border-b border-(--border-default) bg-(--bg-surface) p-(--spacing-xl) transition-colors duration-moderate-01 ease-out last:border-b-0 data-[active]:bg-(--bg-surface-raised) motion-reduce:transition-none lg:min-h-(--media-tabs-row)"
          @pointerenter="point($event, index)"
        >
          <h3 class="m-0 text-heading-md text-(--text-default)">
            <button
              type="button"
              :aria-current="isActive(index) ? 'true' : undefined"
              class="m-0 cursor-pointer p-0 text-left after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
              @click="select($event, index)"
              @focus="point($event, index)"
            >
              {{ item.title }}
            </button>
          </h3>

          <p class="m-0 text-body-md text-(--text-muted)">
            {{ item.description }}
          </p>

          <div
            v-if="isActive(index)"
            class="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-(--bg-canvas) lg:hidden"
          >
            <slot
              name="media"
              :item="item"
              :index="index"
              :active="true"
            >
              <img
                v-if="item.src"
                :src="item.src"
                :alt="item.alt ?? ''"
                class="size-full object-cover"
              />
            </slot>
          </div>

          <span
            v-if="isActive(index) && showProgress && autoPlayEnabled"
            aria-hidden="true"
            :style="{ width: `${progress}%` }"
            class="absolute -bottom-px left-0 h-px bg-(--primary) transition-[width] duration-fast-01 ease-linear motion-reduce:transition-none"
          />
        </li>
      </ul>

      <div
        class="relative hidden overflow-hidden bg-(--bg-canvas) lg:block lg:min-w-0 lg:flex-1 lg:border-l lg:border-(--border-default)"
      >
        <div
          v-for="(item, index) in items"
          :key="`${item.title}-${index}`"
          :data-active="isActive(index) || null"
          :aria-hidden="!isActive(index) || undefined"
          class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-slow-01 ease-out data-[active]:opacity-100 motion-reduce:transition-none"
        >
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
              class="size-full object-cover"
            />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

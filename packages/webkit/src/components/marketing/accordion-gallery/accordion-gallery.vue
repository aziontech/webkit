<script setup lang="ts">
  import { usePreferredReducedMotion } from '@vueuse/core'
  import { computed, onMounted, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import ProgressBar from '../../feedback/progress-bar/progress-bar.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'

  defineOptions({
    name: 'AccordionGallery',
    inheritAttrs: false
  })

  /** One step of the gallery: the copy the reader selects and the picture it stands for. */
  export type AccordionGalleryItem = {
    /** The step's heading, naming it in the stack. */
    title: string
    /** The short lines under the title, rendered as a list of plain text. */
    points: string[]
    /** Source of the picture shown while this step is the active one. */
    backgroundImage: string
  }

  interface Props {
    /** The steps, in order; each item is a title, its points, and the background image shown while it is active. */
    items?: AccordionGalleryItem[]
    /** Advances to the next step on a timer; stops on interaction and never runs under reduced motion. */
    autoPlay?: boolean
    /** Milliseconds each step is held before the gallery advances. */
    autoPlayInterval?: number
    /** Draws the autoplay progress bar over the active step. */
    showProgress?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    autoPlay: true,
    autoPlayInterval: 5000,
    showProgress: true
  })

  const emit = defineEmits<{
    /** The active step changed; the DOM event that selected it, then the index now shown. */
    'step-change': [event: MouseEvent, index: number]
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
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-accordion-gallery'
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

  function select(event: globalThis.MouseEvent, index: number): void {
    selected.value = true
    elapsed.value = 0
    if (index === activeIndex.value) return
    activeIndex.value = index
    emit('step-change', event, index)
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-autoplay="autoPlayRunning || null"
    @pointerenter="pause"
    @pointerleave="resume"
    @focusin="pause"
    @focusout="resume"
  >
    <div
      v-if="hasItems"
      class="flex flex-col gap-(--spacing-xl) lg:flex-row"
    >
      <ul class="flex flex-col gap-(--spacing-md) lg:flex-1">
        <li
          v-for="(item, index) in items"
          :key="`${item.title}-${index}`"
          :data-active="isActive(index) || null"
          class="group"
        >
          <FrameBox
            class="h-full opacity-50 transition-opacity duration-150 ease-out group-hover:opacity-75 group-focus-within:opacity-100 group-data-[active]:opacity-100 motion-reduce:transition-none"
          >
            <div class="flex flex-col gap-(--spacing-md) p-(--spacing-lg)">
              <ProgressBar
                v-if="isActive(index) && showProgress && autoPlayEnabled"
                :value="progress"
                :aria-label="`Time remaining on ${item.title}`"
              />
              <h3
                class="m-0 text-heading-md text-(--text-default) group-data-[active]:text-(--primary)"
              >
                <button
                  type="button"
                  :aria-current="isActive(index) ? 'true' : undefined"
                  class="m-0 cursor-pointer p-0 text-left after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
                  @click="select($event, index)"
                >
                  {{ item.title }}
                </button>
              </h3>
              <ul class="flex flex-col gap-(--spacing-xxs) text-body-sm text-(--text-muted)">
                <li
                  v-for="(point, pointIndex) in item.points"
                  :key="`${point}-${pointIndex}`"
                >
                  {{ point }}
                </li>
              </ul>
              <div
                v-if="isActive(index)"
                class="aspect-video w-full overflow-hidden rounded-(--shape-elements) bg-(--bg-surface) lg:hidden"
              >
                <img
                  :src="item.backgroundImage"
                  :alt="item.title"
                  class="size-full object-cover"
                />
              </div>
            </div>
          </FrameBox>
        </li>
      </ul>

      <div
        class="relative hidden overflow-hidden rounded-(--shape-elements) bg-(--bg-surface) lg:block lg:flex-1"
      >
        <img
          v-for="(item, index) in items"
          :key="`${item.title}-${index}`"
          :src="item.backgroundImage"
          :alt="item.title"
          :data-active="isActive(index) || null"
          :aria-hidden="isActive(index) ? undefined : 'true'"
          class="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 ease-out data-[active]:opacity-100 motion-reduce:transition-none"
        />
      </div>
    </div>
  </section>
</template>

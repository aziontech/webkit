<script setup lang="ts">
  import { usePreferredReducedMotion } from '@vueuse/core'
  import { computed, onMounted, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import TextureMaterial, {
    type TextureMaterialFade,
    type TextureMaterialKind,
    type TextureMaterialSize
  } from '../texture-material/texture-material.vue'

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
  /** Which side of the media the tabs sit on. */
  export type MediaTabsPosition = 'left' | 'right' | 'top' | 'bottom'
  /** Height each row is held to beside the media, and the title scale of a row of tabs. */
  export type MediaTabsSize = 'small' | 'medium' | 'large'

  interface Props {
    /** The tabs, in order, at most three when the position is left or right and five when it is top or bottom; each item is a title, its description, and the image shown while it is active. Items past the limit are not rendered. */
    items?: MediaTabsItem[]
    /** Which side of the media the tabs sit on. Below the large breakpoint every position stacks, with the active tab's media inside its row. */
    position?: MediaTabsPosition
    /** Height each row is held to, as a multiple of the band's own padding step: three, four and a half, six. In a row of tabs, small sets the title and description two steps down and tightens the inset. */
    size?: MediaTabsSize
    /** What moves the selection as the reader points at a row. A click always selects, on either setting. */
    selectOn?: MediaTabsSelectOn
    /** Advances to the next tab on a timer; pauses under the pointer or keyboard focus, restarts its count on a click, and never runs under reduced motion. */
    autoPlay?: boolean
    /** Milliseconds each tab is held before the band advances. */
    autoPlayInterval?: number
    /** Advances a hairline along the active row's bottom edge while the timer runs. */
    showProgress?: boolean
    /** Texture the media column is grounded with; `none` leaves it bare. */
    texture?: TextureMaterialKind
    /** Pitch of the ground's tiling — how far apart its cells sit. */
    textureSize?: TextureMaterialSize
    /** How the ground fades out before the column's edges. */
    textureFade?: TextureMaterialFade
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    position: 'left',
    size: 'medium',
    selectOn: 'hover',
    autoPlay: true,
    autoPlayInterval: 5000,
    showProgress: true,
    texture: 'none',
    textureSize: 'medium',
    textureFade: 'vignette'
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
  const MAX_TABS = { vertical: 3, horizontal: 5 } as const

  const activeIndex = ref(0)
  const elapsed = ref(0)
  const pointerInside = ref(false)
  const focusInside = ref(false)
  let ticker: ReturnType<typeof globalThis.setInterval> | null = null

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-media-tabs'
  )

  const orientation = computed(() =>
    props.position === 'top' || props.position === 'bottom' ? 'horizontal' : 'vertical'
  )

  const tabs = computed(() => props.items.slice(0, MAX_TABS[orientation.value]))

  const hasItems = computed(() => tabs.value.length > 0)

  const autoPlayEnabled = computed(
    () => props.autoPlay && tabs.value.length > 1 && reducedMotion.value !== 'reduce'
  )

  const autoPlayRunning = computed(
    () => autoPlayEnabled.value && !pointerInside.value && !focusInside.value
  )

  const progress = computed(() =>
    Math.min(100, Math.max(0, (elapsed.value / props.autoPlayInterval) * 100))
  )

  watch(autoPlayRunning, (running) => (running ? start() : stop()))

  watch(
    () => tabs.value.length,
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
    activeIndex.value = (activeIndex.value + 1) % tabs.value.length
  }

  function enterPointer(): void {
    pointerInside.value = true
  }

  function leavePointer(): void {
    pointerInside.value = false
  }

  function enterFocus(event: globalThis.FocusEvent): void {
    const target = event.target as globalThis.Element
    focusInside.value = target.matches(':focus-visible')
  }

  function leaveFocus(): void {
    focusInside.value = false
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
    pointerInside.value = false
    move(event, index)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-position="position"
    :data-orientation="orientation"
    :data-size="size"
    :data-select-on="selectOn"
    :data-autoplay="autoPlayRunning || null"
    class="group/media-tabs [--media-tabs-row:calc(var(--spacing-xl)*4.5)] data-[size=small]:[--media-tabs-row:calc(var(--spacing-xl)*3)] data-[size=large]:[--media-tabs-row:calc(var(--spacing-xl)*6)]"
    @pointerenter="enterPointer"
    @pointerleave="leavePointer"
    @focusin="enterFocus"
    @focusout="leaveFocus"
  >
    <div
      v-if="hasItems"
      class="flex flex-col group-data-[position=left]/media-tabs:lg:flex-row group-data-[position=right]/media-tabs:lg:flex-row-reverse group-data-[position=bottom]/media-tabs:lg:flex-col-reverse"
    >
      <ul
        class="flex flex-col group-data-[orientation=horizontal]/media-tabs:lg:flex-row group-data-[orientation=vertical]/media-tabs:lg:w-[calc(50%+var(--spacing-xl))] group-data-[orientation=vertical]/media-tabs:lg:shrink-0"
      >
        <li
          v-for="(item, index) in tabs"
          :key="`${item.title}-${index}`"
          :data-active="isActive(index) || null"
          class="group/row flex flex-col lg:min-h-(--media-tabs-row) group-data-[orientation=horizontal]/media-tabs:lg:min-h-0 group-data-[orientation=horizontal]/media-tabs:lg:min-w-0 group-data-[orientation=horizontal]/media-tabs:lg:flex-1 group-data-[orientation=horizontal]/media-tabs:lg:not-first:[&>div]:border-l-0 group-data-[position=right]/media-tabs:lg:[&>div]:data-[borders~=left]:border-l-0"
          @pointerenter="point($event, index)"
        >
          <FrameBox
            borders="all"
            marks="all"
            flush="top"
            class="relative flex flex-1 flex-col justify-center bg-(--bg-surface) transition-colors duration-moderate-01 ease-out group-data-[active]/row:bg-(--bg-surface-raised) before:pointer-events-none before:absolute before:inset-0 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-fast-02 before:ease-productive-entrance before:content-[''] hover:before:opacity-100 group-data-[active]/row:before:hidden motion-reduce:transition-none motion-reduce:before:transition-none"
          >
            <div
              class="flex flex-col gap-(--spacing-md) p-(--spacing-xl) group-data-[orientation=horizontal]/media-tabs:lg:gap-(--spacing-xs) group-data-[orientation=horizontal]/media-tabs:lg:p-(--spacing-md) group-data-[orientation=horizontal]/media-tabs:group-data-[size=small]/media-tabs:lg:gap-(--spacing-xxs) group-data-[orientation=horizontal]/media-tabs:group-data-[size=small]/media-tabs:lg:p-(--spacing-sm)"
            >
              <h3
                class="m-0 text-heading-md text-(--text-default) group-data-[orientation=horizontal]/media-tabs:group-data-[size=small]/media-tabs:lg:text-heading-xs"
              >
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

              <p
                class="m-0 text-body-md text-(--text-muted) group-data-[orientation=horizontal]/media-tabs:lg:text-body-sm group-data-[orientation=horizontal]/media-tabs:group-data-[size=small]/media-tabs:lg:text-body-xs"
              >
                {{ item.description }}
              </p>
            </div>

            <div
              v-if="isActive(index)"
              class="relative flex aspect-video min-h-[var(--media-tabs-media-min,0)] w-full group-data-[orientation=horizontal]/media-tabs:aspect-auto items-center justify-center overflow-hidden bg-[var(--media-tabs-media-bg,var(--bg-canvas))] lg:hidden"
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
              data-progress
              :style="{ width: `${progress}%` }"
              class="absolute bottom-0 left-0 h-px bg-(--primary) transition-[width] duration-fast-01 ease-linear motion-reduce:transition-none"
            />
          </FrameBox>
        </li>
      </ul>

      <FrameBox
        borders="all"
        marks="all"
        :flush="position === 'left' ? ['left', 'top'] : 'top'"
        class="relative hidden overflow-hidden bg-[var(--media-tabs-media-bg,var(--bg-canvas))] lg:block lg:min-w-0 group-data-[orientation=vertical]/media-tabs:lg:flex-1"
      >
        <TextureMaterial
          :kind="texture"
          :size="textureSize"
          :fade="textureFade"
        />

        <div
          class="contents group-data-[orientation=horizontal]/media-tabs:grid group-data-[orientation=horizontal]/media-tabs:min-h-[var(--media-tabs-media-min-lg,24rem)]"
        >
          <div
            v-for="(item, index) in tabs"
            :key="`${item.title}-${index}`"
            :data-active="isActive(index) || null"
            :aria-hidden="!isActive(index) || undefined"
            class="z-10 col-start-1 row-start-1 flex min-w-0 group-data-[orientation=vertical]/media-tabs:absolute group-data-[orientation=vertical]/media-tabs:inset-0 translate-y-(--spacing-lg) items-center justify-center opacity-0 transition-[translate,opacity] duration-moderate-02 ease-productive-entrance data-[active]:translate-y-0 data-[active]:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
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
      </FrameBox>
    </div>
  </div>
</template>

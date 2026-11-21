<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import { useAutoplayProgress } from '../../../composables/use-autoplay-progress'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Texture, {
    type TextureFade,
    type TextureSize,
    type TextureVariant
  } from '../../content/texture/texture.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'

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
  export type MediaTabsSide = 'start' | 'end' | 'top' | 'bottom'
  /** Height each row is held to beside the media, and the title scale of a row of tabs. */
  export type MediaTabsSize = 'small' | 'medium' | 'large'

  export interface MediaTabsProps {
    /**
     * The tabs, in order, at most three when the tabs side is start or end and five when it is top or
     * bottom; each item is a title, its description, and the image shown while it is active. Items past
     * the limit are not rendered.
     */
    items?: MediaTabsItem[]
    /** Which side of the media the tabs sit on. Below the large breakpoint every side stacks, with the active tab's media inside its row. */
    tabsSide?: MediaTabsSide
    /** Height each row is held to, as a multiple of the band's own padding step: three, four and a half, six. In a row of tabs, small sets the title and description two steps down. */
    size?: MediaTabsSize
    /** What moves the selection as the reader points at a row. A click always selects, on either setting. */
    selectOn?: MediaTabsSelectOn
    /** Advances to the next tab on a timer, with a visible pause control; pauses under the pointer or keyboard focus, restarts its count on a click, and never runs under reduced motion. */
    autoplay?: boolean
    /** Milliseconds each tab is held before the band advances. */
    autoplayInterval?: number
    /** Advances a hairline along the active row's bottom edge while the timer runs. */
    showProgress?: boolean
    /** Texture the media column is grounded with; `none` leaves it bare. */
    texture?: TextureVariant
    /** Pitch of the ground's tiling — how far apart its cells sit. */
    textureSize?: TextureSize
    /** How the ground fades out before the column's edges. */
    textureFade?: TextureFade
  }

  const props = withDefaults(defineProps<MediaTabsProps>(), {
    items: () => [],
    tabsSide: 'start',
    size: 'medium',
    selectOn: 'hover',
    autoplay: true,
    autoplayInterval: 5000,
    showProgress: true,
    texture: 'none',
    textureSize: 'medium',
    textureFade: 'vignette'
  })

  /** Index of the tab shown; moved by a click, a hover or the autoplay timer. */
  const activeIndex = defineModel<number>({ default: 0 })

  defineSlots<{
    /** The tab's medium; replaces the image built from the item's own source. */
    media?(props: { item: MediaTabsItem; index: number; active: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const MAX_TABS = { vertical: 3, horizontal: 5 } as const

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'media-tabs')

  const orientation = computed(() =>
    props.tabsSide === 'top' || props.tabsSide === 'bottom' ? 'horizontal' : 'vertical'
  )

  const tabs = computed(() => props.items.slice(0, MAX_TABS[orientation.value]))

  const hasItems = computed(() => tabs.value.length > 0)

  const WIDE = '(min-width: 64rem)'
  const sideBySide = ref(Boolean(globalThis.matchMedia?.(WIDE).matches))
  let wideQuery: globalThis.MediaQueryList | null = null
  const onWideChange = () => {
    sideBySide.value = Boolean(wideQuery?.matches)
  }

  const {
    autoplayEnabled,
    autoplayRunning,
    paused,
    pauseLabel,
    progress,
    restartProgress,
    togglePause,
    enterPointer,
    leavePointer,
    enterFocus,
    leaveFocus
  } = useAutoplayProgress({
    enabled: () => props.autoplay && sideBySide.value && tabs.value.length > 1,
    interval: () => props.autoplayInterval,
    onAdvance: () => {
      activeIndex.value = (activeIndex.value + 1) % tabs.value.length
    }
  })

  watch(
    () => tabs.value.length,
    (length) => {
      if (activeIndex.value < length) return
      activeIndex.value = 0
      restartProgress()
    }
  )

  onMounted(() => {
    wideQuery = globalThis.matchMedia?.(WIDE) ?? null
    wideQuery?.addEventListener('change', onWideChange)
    onWideChange()
  })

  onScopeDispose(() => wideQuery?.removeEventListener('change', onWideChange))

  function isActive(index: number): boolean {
    return activeIndex.value === index
  }

  function move(index: number): void {
    restartProgress()
    if (index === activeIndex.value) return
    activeIndex.value = index
  }

  function point(index: number): void {
    if (props.selectOn !== 'hover') return
    move(index)
  }

  function select(index: number): void {
    leavePointer()
    move(index)
  }

  const ROOT_CLASS =
    'group/media-tabs relative [--media-tabs-row:calc(var(--spacing-xl)*4.5)] ' +
    'data-[size=small]:[--media-tabs-row:calc(var(--spacing-xl)*3)] data-[size=large]:[--media-tabs-row:calc(var(--spacing-xl)*6)]'

  const TAB_LIST_CLASS =
    'flex flex-col ' +
    'group-data-[orientation=horizontal]/media-tabs:lg:flex-row group-data-[orientation=vertical]/media-tabs:lg:w-[calc(50%+var(--spacing-xl))] ' +
    'group-data-[orientation=vertical]/media-tabs:lg:shrink-0'

  const TAB_ROW_CLASS =
    'group/row flex flex-col lg:min-h-(--media-tabs-row) ' +
    'group-data-[orientation=horizontal]/media-tabs:lg:min-h-0 group-data-[orientation=horizontal]/media-tabs:lg:min-w-0 group-data-[orientation=horizontal]/media-tabs:lg:flex-1 ' +
    'group-data-[orientation=horizontal]/media-tabs:lg:not-first:[&>div]:border-s-0 ' +
    'group-data-[tabs-side=end]/media-tabs:lg:[&>div]:data-[borders~=left]:border-s-0'

  const TAB_FRAME_CLASS =
    'relative flex flex-1 flex-col justify-center bg-(--bg-surface) transition-colors duration-moderate-01 ease-out ' +
    'group-data-[active]/row:bg-(--bg-surface-raised) ' +
    'before:pointer-events-none before:absolute before:inset-0 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-fast-02 before:ease-productive-entrance ' +
    "before:content-[''] hover:before:opacity-100 " +
    'group-data-[active]/row:before:hidden ' +
    'motion-reduce:transition-none motion-reduce:before:transition-none'

  const TAB_COPY_CLASS =
    'flex flex-col gap-(--spacing-md) p-(--spacing-xl) ' +
    'group-data-[orientation=horizontal]/media-tabs:lg:gap-(--spacing-xs) group-data-[orientation=horizontal]/media-tabs:lg:p-(--spacing-md) ' +
    'group-data-[orientation=horizontal]/media-tabs:group-data-[size=small]/media-tabs:lg:gap-(--spacing-2xs)'

  const TAB_TITLE_CLASS =
    'm-0 text-heading-md text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance ' +
    'group-hover/row:text-(--text-default) ' +
    'group-data-[active]/row:text-(--text-default) ' +
    'motion-reduce:transition-none ' +
    'group-data-[orientation=horizontal]/media-tabs:group-data-[size=small]/media-tabs:lg:text-heading-xs'

  const TAB_BUTTON_CLASS =
    "m-0 cursor-pointer p-0 text-start after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 " +
    'focus-visible:ring-offset-(--bg-canvas)'

  const TAB_DESCRIPTION_CLASS =
    'm-0 text-body-md text-(--text-muted) ' +
    'group-data-[orientation=horizontal]/media-tabs:lg:text-body-sm group-data-[orientation=horizontal]/media-tabs:group-data-[size=small]/media-tabs:lg:text-body-xs'

  const TAB_MEDIA_CLASS =
    'relative flex aspect-video min-h-[var(--media-tabs-media-min,0)] w-full ' +
    'group-data-[orientation=horizontal]/media-tabs:aspect-auto ' +
    'items-center justify-center overflow-hidden bg-[var(--media-tabs-media-bg,var(--bg-canvas))] ' +
    'lg:hidden'

  const MEDIA_PANEL_CLASS =
    'z-10 col-start-1 row-start-1 flex min-w-0 ' +
    'group-data-[orientation=vertical]/media-tabs:absolute group-data-[orientation=vertical]/media-tabs:inset-0 ' +
    'translate-y-(--spacing-lg) items-center justify-center opacity-0 transition-[translate,opacity] duration-moderate-02 ease-productive-entrance ' +
    'data-[active]:translate-y-0 data-[active]:opacity-100 ' +
    'motion-reduce:translate-y-0 motion-reduce:transition-none'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-tabs-side="tabsSide"
    :data-orientation="orientation"
    :data-size="size"
    :data-select-on="selectOn"
    :data-autoplay="autoplayRunning || null"
    :data-paused="(autoplayEnabled && paused) || null"
    :class="ROOT_CLASS"
    @pointerenter="enterPointer"
    @pointerleave="leavePointer"
    @focusin="enterFocus"
    @focusout="leaveFocus"
  >
    <div
      v-if="hasItems"
      class="flex flex-col group-data-[tabs-side=start]/media-tabs:lg:flex-row group-data-[tabs-side=end]/media-tabs:lg:flex-row-reverse group-data-[tabs-side=bottom]/media-tabs:lg:flex-col-reverse"
    >
      <ul :class="TAB_LIST_CLASS">
        <li
          v-for="(item, index) in tabs"
          :key="`${item.title}-${index}`"
          :data-active="isActive(index) || null"
          :class="TAB_ROW_CLASS"
          @pointerenter="point(index)"
        >
          <RegistrationFrame
            borders="all"
            marks="all"
            flush="top"
            :class="TAB_FRAME_CLASS"
          >
            <div :class="TAB_COPY_CLASS">
              <h3 :class="TAB_TITLE_CLASS">
                <button
                  type="button"
                  :aria-current="isActive(index) ? 'true' : undefined"
                  :class="TAB_BUTTON_CLASS"
                  @click="select(index)"
                  @focus="point(index)"
                >
                  {{ item.title }}
                </button>
              </h3>

              <p :class="TAB_DESCRIPTION_CLASS">
                {{ item.description }}
              </p>
            </div>

            <div
              v-if="isActive(index)"
              :class="TAB_MEDIA_CLASS"
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
              v-if="isActive(index)"
              aria-hidden="true"
              class="pointer-events-none absolute inset-x-0 top-0 h-(--border-width-2) bg-(--primary)"
            />

            <span
              v-if="isActive(index) && showProgress && autoplayEnabled"
              aria-hidden="true"
              data-progress
              :style="{ width: `${progress}%` }"
              class="absolute bottom-0 start-0 h-px bg-(--primary) transition-[width] duration-fast-01 ease-linear motion-reduce:transition-none"
            />
          </RegistrationFrame>
        </li>
      </ul>

      <RegistrationFrame
        borders="all"
        marks="all"
        :flush="tabsSide === 'start' ? ['left', 'top'] : 'top'"
        class="relative hidden overflow-hidden bg-[var(--media-tabs-media-bg,var(--bg-canvas))] lg:block lg:min-w-0 group-data-[orientation=vertical]/media-tabs:lg:flex-1"
      >
        <Texture
          :variant="texture"
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
            :inert="!isActive(index) || undefined"
            :class="MEDIA_PANEL_CLASS"
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
      </RegistrationFrame>
    </div>
    <IconButton
      v-if="hasItems && autoplayEnabled"
      :icon="paused ? 'az az-play' : 'az az-pause'"
      :aria-label="pauseLabel"
      variant="outline"
      size="small"
      class="absolute end-(--spacing-xs) top-(--spacing-xs) z-20"
      @click="togglePause"
    />
  </div>
</template>

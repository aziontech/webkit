<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'

  defineOptions({ name: 'StickyCarousel', inheritAttrs: false })

  /** One card of the row. */
  export type StickyCarouselItem = {
    /** Heading of the card. */
    title: string
    /** Copy of the card. */
    description: string
  }

  interface Props {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** Headline of the band, rendered as its `h2`; the band renders nothing when empty. */
    title?: string
    /** Paragraph beside the headline. */
    description?: string
    /** The cards, in order; each is `{ title, description }` and is numbered by its position. */
    items?: StickyCarouselItem[]
    /** Accessible name of the card row; defaults to the title. */
    ariaLabel?: string
    /** Height of the sticky site header the band pins under, from the large breakpoint up; any CSS length. */
    headerOffset?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    items: () => [],
    ariaLabel: '',
    headerOffset: '3.5rem'
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-sticky-carousel'
  )

  const runway = ref<HTMLElement | null>(null)
  const pinned = ref<HTMLElement | null>(null)
  const viewport = ref<HTMLElement | null>(null)
  const track = ref<HTMLElement | null>(null)

  const runwayHeight = ref('')
  const offset = ref(0)

  let frame: number | null = null
  let observer: ResizeObserver | null = null

  function measure() {
    frame = null
    const runwayEl = runway.value
    const pinnedEl = pinned.value
    const viewportEl = viewport.value
    const trackEl = track.value
    if (!runwayEl || !pinnedEl || !viewportEl || !trackEl) return

    if (getComputedStyle(pinnedEl).position !== 'sticky') {
      runwayHeight.value = ''
      offset.value = 0
      return
    }

    const overflow = Math.max(0, trackEl.offsetWidth - viewportEl.clientWidth)
    runwayHeight.value = `${pinnedEl.offsetHeight + overflow}px`
    const travelled = pinnedEl.getBoundingClientRect().top - runwayEl.getBoundingClientRect().top
    offset.value = Math.min(overflow, Math.max(0, travelled))
  }

  function schedule() {
    if (frame === null) frame = requestAnimationFrame(measure)
  }

  const SCROLL_OPTIONS = { capture: true, passive: true }

  onMounted(() => {
    document.addEventListener('scroll', schedule, SCROLL_OPTIONS)
    window.addEventListener('resize', schedule, { passive: true })
    observer = new ResizeObserver(schedule)
    if (pinned.value) observer.observe(pinned.value)
    if (track.value) observer.observe(track.value)
    measure()
  })

  onBeforeUnmount(() => {
    if (frame !== null) cancelAnimationFrame(frame)
    document.removeEventListener('scroll', schedule, SCROLL_OPTIONS)
    window.removeEventListener('resize', schedule)
    observer?.disconnect()
  })

  const rowName = computed(() => props.ariaLabel || props.title)

  const shift = computed(() => {
    if (!offset.value) return undefined
    const rtl = runway.value?.closest('[dir]')?.getAttribute('dir') === 'rtl'
    return `${rtl ? offset.value : -offset.value}px 0`
  })

  const TEXTURE = {
    '--texture-pool-a': '50% 112%',
    '--texture-pool-b': '50% -10%',
    '--texture-wave-pace': 6,
    '--texture-wave-gain': 1.4
  }

  const cardNumber = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <div
    v-if="title && items.length"
    v-bind="$attrs"
    ref="runway"
    :data-testid="testId"
    :style="{ height: runwayHeight || undefined, '--sticky-carousel-offset': headerOffset }"
  >
    <div
      :id="anchor || undefined"
      ref="pinned"
      class="flex flex-col lg:motion-safe:sticky lg:motion-safe:top-(--sticky-carousel-offset) lg:motion-safe:h-[calc(100dvh-var(--sticky-carousel-offset))]"
    >
      <SectionModule
        :divided="false"
        :padded="false"
      >
        <template #header>
          <SectionTitle
            :eyebrow="eyebrow"
            :title="title"
            :description="description"
          />
        </template>
      </SectionModule>

      <div class="grid flex-1 grid-cols-1">
        <FrameBox
          flush
          borders="y"
          marks="bottom"
        >
          <div
            ref="viewport"
            role="region"
            :aria-label="rowName"
            tabindex="0"
            class="h-full snap-x snap-mandatory overflow-x-auto scrollbar-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) lg:motion-safe:snap-none lg:motion-safe:overflow-hidden [&::-webkit-scrollbar]:hidden"
          >
            <ol
              ref="track"
              :style="{ translate: shift }"
              class="m-0 flex h-full w-max list-none p-0"
            >
              <li
                v-for="(item, index) in items"
                :key="item.title"
                data-theme="dark"
                :style="TEXTURE"
                class="relative flex min-h-80 w-[min(22rem,80vw)] shrink-0 snap-start flex-col justify-between gap-(--spacing-xxl) overflow-hidden border-(--border-default) bg-(--bg-surface) p-(--spacing-xl) not-last:border-e lg:w-104"
              >
                <TextureMaterial
                  kind="pixelate"
                  size="small"
                />
                <div
                  aria-hidden="true"
                  class="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_top,var(--bg-surface)_0%,color-mix(in_srgb,var(--bg-surface)_92%,transparent)_34%,transparent_62%)]"
                />
                <span
                  aria-hidden="true"
                  class="relative text-big-number-lg text-(--text-default) tabular-nums"
                >
                  {{ cardNumber(index) }}
                </span>
                <div class="relative flex flex-col gap-(--spacing-sm)">
                  <h3 class="m-0 text-heading-sm text-balance text-(--text-default)">
                    {{ item.title }}
                  </h3>
                  <p class="m-0 text-body-md text-pretty text-(--text-muted)">
                    {{ item.description }}
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </FrameBox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import type {
    SectionTitleDescriptionWidth,
    SectionTitleKind
  } from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  defineOptions({ name: 'ProcessScroll' })

  export interface ProcessStep {
    /** The stage's name. */
    title: string
    /** What happens during the stage. */
    description: string
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Alignment of the section title over the card row. */
    titleKind?: SectionTitleKind
    /** The band's headline. */
    title: string
    /** The paragraph beside the headline. */
    description?: string
    /** Column span of the paragraph: `wide` runs it across the middle column too. */
    descriptionWidth?: SectionTitleDescriptionWidth
    /** The stages, in order; each gets its own card. */
    steps: ProcessStep[]
    /** Accessible name of the card row. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    titleKind: 'horizontal',
    description: '',
    descriptionWidth: 'narrow',
    ariaLabel: ''
  })

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
    const travelled =
      pinnedEl.getBoundingClientRect().top - runwayEl.getBoundingClientRect().top
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

  const TEXTURE = {
    '--texture-pool-a': '50% 112%',
    '--texture-pool-b': '50% -10%',
    '--texture-wave-pace': 6,
    '--texture-wave-gain': 1.4
  }

  const stepNumber = (index: number) => String(index + 1).padStart(2, '0')
</script>

<template>
  <div
    ref="runway"
    :style="{ height: runwayHeight || undefined }"
  >
    <div
      :id="anchor || undefined"
      ref="pinned"
      class="flex flex-col lg:motion-safe:sticky lg:motion-safe:top-14 lg:motion-safe:h-[calc(100dvh_-_3.5rem)]"
    >
      <SectionModule
        :divided="false"
        :padded="false"
      >
        <template #header>
          <SectionTitle
            :kind="titleKind"
            :title="title"
            :description="description"
            :description-width="descriptionWidth"
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
            :aria-label="ariaLabel || undefined"
            tabindex="0"
            class="h-full snap-x snap-mandatory overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) lg:motion-safe:snap-none lg:motion-safe:overflow-hidden"
          >
            <ol
              ref="track"
              :style="{ translate: offset ? `${-offset}px 0` : undefined }"
              class="m-0 flex h-full w-max list-none p-0"
            >
              <li
                v-for="(step, index) in steps"
                :key="step.title"
                data-theme="dark"
                :style="TEXTURE"
                class="relative flex min-h-80 w-[min(22rem,80vw)] shrink-0 snap-start flex-col justify-between gap-(--spacing-xxl) overflow-hidden border-(--border-default) bg-(--bg-surface) not-last:border-r p-(--spacing-xl) lg:w-104"
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
                  class="relative text-big-number-lg tabular-nums text-(--text-default)"
                >
                  {{ stepNumber(index) }}
                </span>
                <div class="relative flex flex-col gap-(--spacing-sm)">
                  <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
                    {{ step.title }}
                  </h3>
                  <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                    {{ step.description }}
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

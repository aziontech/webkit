<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'

  defineOptions({ name: 'MarqueeLoop' })

  /** What the strip becomes under reduced motion: `wrap` lays the first copy out as a static wrapped row, `scroll` keeps it one row the reader scrolls sideways. */
  export type MarqueeLoopReduced = 'wrap' | 'scroll'

  interface Props {
    /** Seconds one pass over a single copy takes; scaled by the repeats when `fill` is set. */
    duration?: number
    /** Repeats the copy until half the track covers the strip, so a short row still loops seamlessly. */
    fill?: boolean
    /** Hides the track and holds the loop until its content is ready. */
    loading?: boolean
    /** Accessible name of the strip, read when `reduced` is `scroll`. */
    ariaLabel?: string
    /** What the strip becomes under reduced motion; `scroll` also makes the strip a focusable region. */
    reduced?: MarqueeLoopReduced
    /** Fades the strip out toward both edges. */
    faded?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    duration: 0,
    fill: false,
    loading: false,
    ariaLabel: '',
    reduced: 'scroll',
    faded: false
  })

  defineSlots<{
    /** One copy of the row; render it once per call and hide the duplicates from assistive technology. */
    default(props: { copy: number; duplicate: boolean }): unknown
  }>()

  const { t } = useTranslate({ common: en.common })

  const loopEl = ref<globalThis.HTMLElement | null>(null)
  const trackEl = ref<globalThis.HTMLElement | null>(null)
  const repeats = ref(1)
  const copies = computed(() => (props.fill ? repeats.value * 2 : 2))

  const paused = ref(false)
  const pauseLabel = computed(() =>
    paused.value ? t('common.resumeScrolling') : t('common.pauseScrolling')
  )

  const passDuration = computed(
    () => Math.round(props.duration * (props.fill ? repeats.value : 1)) || 1
  )

  const firstRow = computed(
    () => (trackEl.value?.firstElementChild as globalThis.HTMLElement | null) ?? null
  )

  const measureRepeats = () => {
    const strip = loopEl.value?.clientWidth ?? 0
    const row = firstRow.value?.offsetWidth ?? 0
    repeats.value = row > 0 ? Math.max(1, Math.ceil(strip / row)) : 1
  }

  let observer: globalThis.ResizeObserver | null = null

  watch([loopEl, firstRow, () => props.fill], ([strip, row, fill]) => {
    observer?.disconnect()
    observer = null
    if (!fill) return
    observer = new globalThis.ResizeObserver(measureRepeats)
    for (const element of [strip, row]) {
      if (element) observer.observe(element)
    }
  })

  onScopeDispose(() => observer?.disconnect())
</script>

<template>
  <div class="relative w-full">
    <div
      ref="loopEl"
      :role="reduced === 'scroll' ? 'region' : undefined"
      :aria-label="(reduced === 'scroll' && ariaLabel) || undefined"
      :tabindex="reduced === 'scroll' ? 0 : undefined"
      :data-reduced="reduced"
      :data-faded="faded || null"
      class="group/loop relative w-full overflow-hidden focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none focus-visible:ring-inset data-[faded]:mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] data-[reduced=scroll]:motion-reduce:overflow-x-auto data-[reduced=wrap]:motion-reduce:mask-none"
    >
      <div
        ref="trackEl"
        :style="{ animationDuration: `${passDuration}s` }"
        :data-loading="loading || null"
        :data-paused="paused || null"
        :data-reduced="reduced"
        class="flex w-max animate-brand-marquee group-focus-within/loop:[animation-play-state:paused] group-hover/loop:[animation-play-state:paused] data-[loading]:invisible data-[loading]:[animation-play-state:paused] data-[paused]:[animation-play-state:paused] motion-reduce:animate-none data-[reduced=wrap]:motion-reduce:w-full data-[reduced=wrap]:motion-reduce:flex-wrap data-[reduced=wrap]:motion-reduce:justify-center rtl:translate-x-1/2 rtl:[animation-direction:reverse] motion-reduce:rtl:translate-x-0"
      >
        <template
          v-for="copy in copies"
          :key="copy"
        >
          <slot
            :copy="copy"
            :duplicate="copy > 1"
          />
        </template>
      </div>
    </div>
    <IconButton
      :icon="paused ? 'ai ai-play' : 'ai ai-pause'"
      :aria-label="pauseLabel"
      variant="outline"
      size="small"
      class="absolute end-0 top-1/2 z-10 -translate-y-1/2 motion-reduce:hidden"
      @click="paused = !paused"
    />
  </div>
</template>

<script setup lang="ts">
  import { curve, duration } from '@aziontech/theme/animations'
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import { useSceneScript } from '../../composables/use-scene-script'

  defineOptions({ name: 'MockupElevator' })

  interface Props {
    /** Number of distinct rows the elevator cycles through. */
    count: number
    /** Milliseconds the centered row holds before the next step. */
    hold?: number
    /** Whether the elevator is the one running; it parks on the centered row while false. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { hold: 900, active: true })

  defineSlots<{
    /** One row; receives its index and whether it holds the center. */
    default(props: { index: number; active: boolean }): unknown
  }>()

  // Four copies keep rows above and below the center at every step, even when a
  // pass resumes mid-track; the wrap jumps whole copies back onto identical pixels.
  const COPIES = 4
  const slots = computed(() =>
    Array.from({ length: props.count * COPIES }, (_, position) => position)
  )

  const windowEl = ref<globalThis.HTMLElement | null>(null)
  const trackEl = ref<globalThis.HTMLElement | null>(null)

  const at = ref(props.count)
  const jump = ref(true)

  const metrics = ref({ pitch: 0, row: 0, box: 0 })

  let observer: globalThis.ResizeObserver | null = null

  const measure = () => {
    const rows = trackEl.value?.children
    const box = windowEl.value?.offsetHeight ?? 0
    if (!rows || rows.length < 2 || !box) return
    const [first, second] = [rows[0] as globalThis.HTMLElement, rows[1] as globalThis.HTMLElement]
    metrics.value = {
      pitch: second.offsetTop - first.offsetTop,
      row: first.offsetHeight,
      box
    }
  }

  onMounted(() => {
    observer = new globalThis.ResizeObserver(measure)
    if (windowEl.value) observer.observe(windowEl.value)
    measure()
  })

  onScopeDispose(() => observer?.disconnect())

  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const offset = computed(() => {
    const { pitch, row, box } = metrics.value
    if (!pitch || !box) return 0
    return Math.max(0, Math.round(at.value * pitch - (box - row) / 2))
  })

  const trackStyle = computed(() => ({
    translate: `0 ${-offset.value}px`,
    transition:
      reduced || jump.value
        ? 'none'
        : `translate ${duration['moderate-02']} ${curve['productive-entrance']}`
  }))

  const park = () => {
    jump.value = true
    at.value = props.count
  }

  const normalize = () => {
    jump.value = true
    at.value = props.count + (at.value % props.count)
  }

  // Hover-out reverses: the elevator steps back down, row by row, until it rests.
  // A position one whole copy ahead sits on identical pixels, so it parks silently.
  const DESCENT_STEP = 340

  let descent: ReturnType<typeof globalThis.setTimeout> | null = null

  const stopDescent = () => {
    if (!descent) return
    globalThis.clearTimeout(descent)
    descent = null
  }

  const stepDown = () => {
    descent = null
    if (at.value !== props.count && at.value % props.count === 0) park()
    if (at.value <= props.count) return
    jump.value = false
    at.value -= 1
    descent = globalThis.setTimeout(stepDown, DESCENT_STEP)
  }

  watch(
    () => props.active,
    (value) => {
      if (value) stopDescent()
      else stepDown()
    }
  )

  onScopeDispose(stopDescent)

  useSceneScript(windowEl, {
    hold: 200,
    lead: 150,
    active: () => props.active,
    reset: normalize,
    settle: park,
    play: async (wait) => {
      for (let step = 0; step < props.count; step++) {
        jump.value = false
        at.value += 1
        await wait(props.hold)
      }
    }
  })
</script>

<template>
  <div
    ref="windowEl"
    class="h-full min-w-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_26%,black_74%,transparent)] [mask-mode:alpha]"
  >
    <div
      ref="trackEl"
      class="flex min-w-0 flex-col gap-(--spacing-sm)"
      :style="trackStyle"
    >
      <div
        v-for="position in slots"
        :key="position"
        :data-active="position === at || null"
        class="min-w-0 opacity-45 transition-opacity duration-moderate-02 ease-productive-entrance data-active:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none"
      >
        <slot
          :index="position % count"
          :active="position === at"
        />
      </div>
    </div>
  </div>
</template>

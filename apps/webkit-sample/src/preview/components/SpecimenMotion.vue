<script setup>
  // THE MOTION SPECIMEN — the durations and the curves, running.
  //
  // A duration on a slide is a number nobody can judge; 110ms and 240ms are the same word on
  // paper and obviously different in the room. So every bar here transitions with the real
  // token: `duration-fast-02` is the compiled utility, not a reproduction, and the bar beside
  // the label is the only honest way to show what the label buys.
  //
  // TWO DETAILS THAT WOULD SILENTLY BREAK THIS:
  //
  //   `transition-[scale]`, not `transition-transform`. In Tailwind v4 `scale-x-*` compiles to
  //   the standalone `scale` property, so a transition that names `transform` interpolates
  //   nothing — the bar would snap to its end state with no error anywhere.
  //
  //   `motion-reduce:transition-none` on every bar. The value still flips for a reader who
  //   asked for less motion; it just arrives instead of travelling, which is the contract every
  //   motion-bearing surface in the system ships.
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  import SlideHeading from './SlideHeading.vue'

  defineProps({
    slide: { type: Object, required: true }
  })

  // The utility strings ARE the data: each row demonstrates that exact token.
  const DURATIONS = [
    { token: 'fast-01', utility: 'duration-fast-01', ms: '70', use: 'Micro-feedback' },
    { token: 'fast-02', utility: 'duration-fast-02', ms: '110', use: 'Hover, popup close' },
    { token: 'moderate-01', utility: 'duration-moderate-01', ms: '150', use: 'Popup open' },
    { token: 'moderate-02', utility: 'duration-moderate-02', ms: '240', use: 'Colour, layout' },
    { token: 'slow-01', utility: 'duration-slow-01', ms: '400', use: 'Panel close' },
    { token: 'slow-02', utility: 'duration-slow-02', ms: '700', use: 'Large surface enter' }
  ]

  const CURVES = [
    { token: 'productive-entrance', utility: 'ease-productive-entrance', use: 'Chrome entering' },
    { token: 'productive-exit', utility: 'ease-productive-exit', use: 'Chrome exiting' },
    { token: 'expressive-entrance', utility: 'ease-expressive-entrance', use: 'Surface entering' },
    { token: 'expressive-exit', utility: 'ease-expressive-exit', use: 'Surface exiting' }
  ]

  // One shared phase, so every bar starts together and the differences between them are the
  // tokens rather than the timing of six independent loops. The hold is longer than the slowest
  // duration, which is what leaves a beat between the trip out and the trip back.
  const running = ref(false)
  let timer = null

  onMounted(() => {
    timer = setInterval(() => {
      running.value = !running.value
    }, 1800)
  })

  onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="flex h-full flex-col gap-(--spacing-xl)">
    <SlideHeading
      :eyebrow="slide.eyebrow"
      :headline="slide.headline"
      :description="slide.description"
    />

    <div class="grid flex-1 grid-cols-12 gap-x-(--spacing-xxl)">
      <section class="col-span-7 flex flex-col gap-(--spacing-md)">
        <span class="text-overline-sm text-(--text-muted)">Durations</span>
        <dl class="m-0 flex flex-col">
          <div
            v-for="row in DURATIONS"
            :key="row.token"
            class="flex items-center gap-(--spacing-md) border-t border-(--border-muted) py-(--spacing-xs) first:border-t-0"
          >
            <dt class="m-0 w-48 shrink-0 text-label-code-md text-(--primary)">{{ row.token }}</dt>
            <dd class="m-0 flex flex-1 items-center gap-(--spacing-md)">
              <span
                aria-hidden="true"
                class="h-2 flex-1 bg-(--border-muted)"
              >
                <span
                  class="block h-full origin-left bg-(--primary) transition-[scale] ease-productive-entrance motion-reduce:transition-none"
                  :class="[row.utility, running ? 'scale-x-100' : 'scale-x-0']"
                />
              </span>
              <span class="w-16 shrink-0 text-right text-label-md text-(--text-muted)"
                >{{ row.ms }} ms</span
              >
              <span class="w-56 shrink-0 text-label-md text-(--text-muted)">{{ row.use }}</span>
            </dd>
          </div>
        </dl>
      </section>

      <!-- The curves all run at one duration, so the only variable left is the shape. -->
      <section class="col-span-5 flex flex-col gap-(--spacing-md)">
        <span class="text-overline-sm text-(--text-muted)">Curves — all at slow-01</span>
        <dl class="m-0 flex flex-col">
          <div
            v-for="row in CURVES"
            :key="row.token"
            class="flex flex-col gap-(--spacing-xs) border-t border-(--border-muted) py-(--spacing-xs) first:border-t-0"
          >
            <dt class="m-0 flex items-baseline justify-between gap-(--spacing-md)">
              <code class="text-label-code-md text-(--primary)">{{ row.token }}</code>
              <span class="text-label-md text-(--text-muted)">{{ row.use }}</span>
            </dt>
            <dd class="m-0">
              <span
                aria-hidden="true"
                class="block h-2 bg-(--border-muted)"
              >
                <span
                  class="block h-full origin-left bg-(--text-default) transition-[scale] duration-slow-01 motion-reduce:transition-none"
                  :class="[row.utility, running ? 'scale-x-100' : 'scale-x-0']"
                />
              </span>
            </dd>
          </div>
        </dl>
      </section>
    </div>

    <p
      class="m-0 shrink-0 border-t border-(--border-muted) pt-(--spacing-md) text-body-md text-(--text-muted)"
    >
      Every motion-bearing surface ships a reduced-motion fallback. With
      <code class="text-label-code-md text-(--text-default)">prefers-reduced-motion: reduce</code>
      each bar above still reaches its end state — it arrives instead of travelling.
    </p>
  </div>
</template>

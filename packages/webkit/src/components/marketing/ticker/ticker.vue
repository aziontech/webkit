<script setup lang="ts">
  import {
    type Component,
    computed,
    markRaw,
    onScopeDispose,
    ref,
    shallowRef,
    useAttrs,
    watch
  } from 'vue'

  import { brandMarkLabel, resolveBrandMark } from '../../../svg/brands/registry'
  import Overline from '../../overline/overline.vue'

  defineOptions({ name: 'Ticker', inheritAttrs: false })

  /** Mark scale. */
  export type TickerSize = 'small' | 'medium'

  /** Whether the strip paints its own ground. */
  export type TickerKind = 'plain' | 'band'

  interface Props {
    /** Whether the strip paints its own ground; band fills it with the page canvas so a textured hero cannot show through the marks, and the floor still reads continuous with the band above it. */
    kind?: TickerKind
    /** Registry names of the marks rendered in the row, in order; an unregistered name renders as its own typographic wordmark so the row stays complete. */
    marks?: string[]
    /** Overline above the row, stating the claim the marks make. */
    label?: string
    /** Mark scale; medium is the marketing band and climbs 32/40/48 px by device class, small is a flat 24 px for a column. */
    size?: TickerSize
    /** Seconds for one full pass; left at 0 it is derived from the number of marks so every strip moves at one speed. */
    duration?: number
    /** Accessible name for the row of marks, announced instead of an unnamed list. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'plain',
    marks: () => [],
    label: '',
    size: 'medium',
    duration: 0,
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'marketing-ticker')

  const SECONDS_PER_MARK = 2

  const loop = ref<globalThis.HTMLElement | null>(null)
  const track = ref<globalThis.HTMLElement | null>(null)
  const repeats = ref(1)
  const copies = computed(() => repeats.value * 2)

  const passDuration = computed(
    () => Math.round((props.duration || props.marks.length * SECONDS_PER_MARK) * repeats.value) || 1
  )

  const artwork = shallowRef(new Map<string, Component>())
  const ready = ref(false)

  const resolved = computed(() =>
    props.marks.map((name) => ({
      name,
      label: brandMarkLabel(name),
      art: artwork.value.get(name) ?? null
    }))
  )

  watch(
    () => props.marks,
    (names, _previous, onCleanup) => {
      let cancelled = false
      onCleanup(() => {
        cancelled = true
      })

      const pending = names.flatMap((name) => {
        const load = resolveBrandMark(name)
        return load && !artwork.value.has(name) ? [{ name, load }] : []
      })
      if (!pending.length) {
        ready.value = true
        return
      }

      ready.value = false
      Promise.allSettled(
        pending.map(({ name, load }) =>
          load().then((module) => [name, markRaw(module.default)] as const)
        )
      ).then((results) => {
        if (cancelled) return
        const next = new Map(artwork.value)
        for (const result of results) {
          if (result.status === 'fulfilled') next.set(...result.value)
        }
        artwork.value = next
        ready.value = true
      })
    },
    { immediate: true }
  )

  const firstRow = computed(
    () => (track.value?.firstElementChild as globalThis.HTMLElement | null) ?? null
  )

  const measureRepeats = () => {
    const strip = loop.value?.clientWidth ?? 0
    const row = firstRow.value?.offsetWidth ?? 0
    repeats.value = row > 0 ? Math.max(1, Math.ceil(strip / row)) : 1
  }

  let observer: globalThis.ResizeObserver | null = null

  watch([loop, firstRow], (elements) => {
    observer?.disconnect()
    observer = new globalThis.ResizeObserver(measureRepeats)
    for (const element of elements) {
      if (element) observer.observe(element)
    }
  })

  onScopeDispose(() => observer?.disconnect())
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-kind="kind"
    class="group/strip flex flex-col items-center gap-(--spacing-xl) data-[kind=band]:w-full data-[kind=band]:bg-(--bg-canvas) data-[kind=band]:py-(--spacing-xl) data-[size=medium]:[--brand-cell:150px] data-[size=medium]:[--brand-mark:32px] data-[size=small]:[--brand-cell:120px] data-[size=small]:[--brand-mark:24px] md:data-[size=medium]:[--brand-cell:200px] md:data-[size=medium]:[--brand-mark:40px] lg:data-[size=medium]:[--brand-cell:240px] lg:data-[size=medium]:[--brand-mark:48px]"
  >
    <Overline
      v-if="label"
      show-cursor
      class="[&>span:first-child]:text-(--text-muted)"
      >{{ label }}</Overline
    >

    <div
      v-if="resolved.length"
      ref="loop"
      class="group/loop relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div
        ref="track"
        :style="{ animationDuration: `${passDuration}s` }"
        :data-loading="!ready || null"
        class="flex w-max animate-brand-marquee data-[loading]:invisible data-[loading]:[animation-play-state:paused] group-focus-within/loop:[animation-play-state:paused] group-hover/loop:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center"
      >
        <ul
          v-for="copy in copies"
          :key="copy"
          :data-size="size"
          :data-duplicate="copy > 1 || null"
          :aria-label="copy === 1 && ariaLabel ? ariaLabel : undefined"
          :aria-hidden="copy > 1 ? 'true' : undefined"
          class="m-0 flex w-max shrink-0 list-none items-center p-0 data-[size=medium]:gap-(--spacing-4) data-[size=medium]:pr-(--spacing-4) data-[size=small]:gap-(--spacing-10) data-[size=small]:pr-(--spacing-10) md:data-[size=medium]:gap-(--spacing-8) md:data-[size=medium]:pr-(--spacing-8) motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-(--spacing-md) motion-reduce:data-[duplicate]:hidden"
        >
          <li
            v-for="mark in resolved"
            :key="`${copy}-${mark.name}`"
            :title="mark.label"
            class="flex w-(--brand-cell) shrink-0 items-center group-data-[size=small]/strip:w-auto justify-center text-(--text-default) opacity-70 transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-100 motion-reduce:transition-none"
          >
            <component
              :is="mark.art"
              v-if="mark.art"
              :data-mark="mark.name"
              class="h-(--brand-mark) w-auto max-w-(--brand-cell) object-contain"
            />

            <span
              v-else
              class="whitespace-nowrap text-heading-xxs"
              >{{ mark.label }}</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

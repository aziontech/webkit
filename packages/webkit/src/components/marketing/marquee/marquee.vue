<script setup lang="ts">
  import { type Component, computed, markRaw, ref, shallowRef, useAttrs, watch } from 'vue'

  import { brandMarkLabel, resolveBrandMark } from '../../../assets/brands/registry'
  import Eyebrow from '../../content/eyebrow/eyebrow.vue'
  import { useMarqueeMarkSymbols } from './composables/use-marquee-mark-symbols'
  import MarqueeLoop from './marquee-loop.vue'

  defineOptions({ name: 'Marquee', inheritAttrs: false })

  /** Mark scale. */
  export type MarqueeSize = 'small' | 'medium'

  /** Whether the strip paints its own ground. */
  export type MarqueeVariant = 'plain' | 'band'

  /** One short claim in a benefits strip. */
  export interface MarqueeItem {
    /** The claim printed in the row. */
    label: string
    /** Leading glyph, as an icon class. */
    icon?: string
  }

  export interface MarqueeProps {
    /** Whether the strip paints its own ground; band fills it with the page canvas so a textured hero cannot show through the marks, and the floor still reads continuous with the band above it. */
    variant?: MarqueeVariant
    /** Registry names of the marks rendered in the row, in order; an unregistered name renders as its own typographic wordmark so the row stays complete. */
    marks?: string[]
    /** Short claims printed in the row instead of marks, each with its label and an optional leading icon class; when set, `marks` is not rendered. */
    items?: MarqueeItem[]
    /** Eyebrow above the row, stating the claim the marks make. */
    label?: string
    /** Mark scale; medium is the marketing band and climbs 32/40/48 px by device class, small is a flat 24 px for a column. */
    size?: MarqueeSize
    /** Seconds for one full pass; left at 0 it is derived from the number of marks, or of items, so every strip moves at one speed. */
    duration?: number
    /** Accessible name for the row of marks, announced instead of an unnamed list. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<MarqueeProps>(), {
    variant: 'plain',
    marks: () => [],
    items: () => [],
    label: '',
    size: 'medium',
    duration: 0,
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'marquee')

  const SECONDS_PER_MARK = 2
  const SECONDS_PER_ITEM = 6

  const isItems = computed(() => props.items.length > 0)

  const passDuration = computed(
    () =>
      props.duration ||
      (isItems.value
        ? props.items.length * SECONDS_PER_ITEM
        : props.marks.length * SECONDS_PER_MARK)
  )

  const artwork = shallowRef(new Map<string, Component>())
  const ready = ref(false)

  const resolved = computed(() =>
    (isItems.value ? [] : props.marks).map((name) => ({
      name,
      label: brandMarkLabel(name),
      art: artwork.value.get(name) ?? null
    }))
  )

  watch(
    () => (isItems.value ? [] : props.marks),
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

  const drawn = computed(() => resolved.value.filter((mark) => mark.art))

  const { defsEl, viewBoxes, measured, symbolId } = useMarqueeMarkSymbols(
    () => drawn.value.map((mark) => mark.name),
    ready
  )

  const setDefsEl = (el: unknown) => {
    defsEl.value = el instanceof SVGSVGElement ? el : null
  }

  const ROOT_CLASS =
    'group/strip relative flex flex-col items-center gap-(--spacing-xl) ' +
    'data-[variant=band]:w-full data-[variant=band]:bg-(--bg-canvas) data-[variant=band]:py-(--spacing-xl) ' +
    'data-[size=medium]:[--marquee-brand-cell:150px] data-[size=medium]:[--marquee-brand-mark:32px] data-[size=small]:[--marquee-brand-cell:120px] ' +
    'data-[size=small]:[--marquee-brand-mark:24px] ' +
    'md:data-[size=medium]:[--marquee-brand-cell:200px] md:data-[size=medium]:[--marquee-brand-mark:40px] lg:data-[size=medium]:[--marquee-brand-cell:240px] ' +
    'lg:data-[size=medium]:[--marquee-brand-mark:48px]'

  const STRIP_CLASS =
    'm-0 flex w-max shrink-0 list-none items-center p-0 ' +
    'data-[size=medium]:gap-(--spacing-4) data-[size=medium]:pe-(--spacing-4) data-[size=small]:gap-(--spacing-10) data-[size=small]:pe-(--spacing-10) ' +
    'md:data-[size=medium]:gap-(--spacing-8) md:data-[size=medium]:pe-(--spacing-8) ' +
    'data-[content=items]:data-[size]:gap-[max(var(--spacing-2xl),calc(var(--spacing-xl)*2))] data-[content=items]:data-[size]:pe-[max(var(--spacing-2xl),calc(var(--spacing-xl)*2))] ' +
    'motion-reduce:data-[content=items]:data-[size]:gap-(--spacing-md) motion-reduce:data-[content=items]:data-[size]:pe-0 motion-reduce:w-full motion-reduce:flex-wrap ' +
    'motion-reduce:justify-center motion-reduce:gap-(--spacing-md) motion-reduce:data-[duplicate]:hidden ' +
    'max-sm:motion-reduce:data-[content=marks]:grid max-sm:motion-reduce:data-[content=marks]:grid-cols-2 max-sm:motion-reduce:data-[content=marks]:justify-items-center'

  const ITEM_CLASS =
    'flex shrink-0 items-center gap-(--spacing-xs) whitespace-nowrap text-body-md text-(--text-default) ' +
    'group-data-[size=small]/strip:text-body-sm ' +
    'motion-reduce:max-w-full motion-reduce:shrink motion-reduce:whitespace-normal motion-reduce:text-center'

  const MARK_CLASS =
    'flex w-(--marquee-brand-cell) shrink-0 items-center ' +
    'group-data-[size=small]/strip:w-auto ' +
    'justify-center text-(--text-default) opacity-70 transition-opacity duration-fast-02 ease-productive-entrance ' +
    'hover:opacity-100 motion-reduce:transition-none'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-variant="variant"
    :data-content="isItems ? 'items' : 'marks'"
    :class="ROOT_CLASS"
  >
    <Eyebrow
      v-if="label"
      cursor
      class="[&>span:first-child]:text-(--text-muted)"
      >{{ label }}</Eyebrow
    >

    <svg
      v-if="drawn.length"
      :ref="setDefsEl"
      data-slot="marquee-symbols"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      class="absolute overflow-hidden"
    >
      <symbol
        v-for="mark in drawn"
        :id="symbolId(mark.name)"
        :key="mark.name"
      >
        <component
          :is="mark.art"
          width="100%"
          height="100%"
        />
      </symbol>
    </svg>

    <MarqueeLoop
      v-if="resolved.length || isItems"
      v-slot="{ copy, duplicate }"
      :duration="passDuration"
      :loading="!ready || !measured"
      fill
      faded
      reduced="wrap"
    >
      <ul
        :data-size="size"
        :data-content="isItems ? 'items' : 'marks'"
        :data-duplicate="duplicate || null"
        :aria-label="!duplicate && ariaLabel ? ariaLabel : undefined"
        :aria-hidden="duplicate ? 'true' : undefined"
        :class="STRIP_CLASS"
      >
        <li
          v-for="(item, index) in items"
          :key="`${copy}-item-${index}`"
          :class="ITEM_CLASS"
        >
          <span
            v-if="item.icon"
            aria-hidden="true"
            :class="item.icon"
          />
          {{ item.label }}
        </li>
        <li
          v-for="mark in resolved"
          :key="`${copy}-${mark.name}`"
          :title="mark.label"
          :class="MARK_CLASS"
        >
          <svg
            v-if="mark.art && viewBoxes.has(mark.name)"
            :data-mark="mark.name"
            :viewBox="viewBoxes.get(mark.name)"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            class="h-(--marquee-brand-mark) w-auto max-w-(--marquee-brand-cell)"
          >
            <use :href="`#${symbolId(mark.name)}`" />
          </svg>
          <span
            v-else-if="!mark.art"
            class="whitespace-nowrap font-medium group-data-[size=medium]/strip:text-heading-md group-data-[size=small]/strip:text-heading-xs"
            >{{ mark.label }}</span
          >
        </li>
      </ul>
    </MarqueeLoop>
  </div>
</template>

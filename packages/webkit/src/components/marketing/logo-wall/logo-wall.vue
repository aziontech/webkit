<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'LogoWall',
    inheritAttrs: false
  })

  /** One company mark in the wall, optionally linked. */
  export type LogoItem = {
    /** URL of the mark rendered in the cell. */
    src: string
    /** Alternative text naming the company the mark belongs to. */
    alt: string
    /** Destination the mark links to, when there is somewhere worth going. */
    href?: string
  }

  interface Props {
    /** The marks rendered in the grid, in order; each item is `{ src, alt, href? }` where `src` is the mark's URL, `alt` names the company, and `href` links the mark when there is somewhere to go. */
    items?: LogoItem[]
    /** Accessible name for the group of marks, announced instead of an unnamed list. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    ariaLabel: ''
  })

  const slots = defineSlots<{
    /** Content set beside the wall from `lg` up, such as one customer's quotation. */
    aside?(): unknown
    /** One cell's mark, replacing the image built from the item — for a mark that owns its own theming; it carries its own alternative text. */
    mark?(props: { item: LogoItem; index: number }): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-logo-wall'
  )

  const hasItems = computed(() => props.items.length > 0)

  const hasAside = computed(() => Boolean(slots.aside))
</script>

<template>
  <section
    v-bind="$attrs"
    class="group grid gap-(--spacing-xxl) data-[aside]:lg:grid-cols-2"
    :data-testid="testId"
    :data-aside="hasAside || null"
    :aria-label="ariaLabel || undefined"
  >
    <ul
      v-if="hasItems"
      class="m-0 grid list-none grid-cols-2 gap-(--spacing-xl) p-0 sm:grid-cols-3 lg:grid-cols-6 group-data-[aside]:lg:grid-cols-4"
    >
      <li
        v-for="(item, index) in items"
        :key="`${item.alt}-${index}`"
        class="flex items-center justify-center"
      >
        <a
          v-if="item.href"
          :href="item.href"
          class="flex items-center justify-center rounded-(--shape-elements) opacity-60 transition-opacity duration-150 ease-out hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
        >
          <slot
            name="mark"
            :item="item"
            :index="index"
          >
            <img
              :src="item.src"
              :alt="item.alt"
              loading="lazy"
              decoding="async"
              class="h-8 w-auto max-w-full object-contain"
            />
          </slot>
        </a>
        <span
          v-else
          class="flex items-center justify-center opacity-60"
        >
          <slot
            name="mark"
            :item="item"
            :index="index"
          >
            <img
              :src="item.src"
              :alt="item.alt"
              loading="lazy"
              decoding="async"
              class="h-8 w-auto max-w-full object-contain"
            />
          </slot>
        </span>
      </li>
    </ul>

    <div
      v-if="hasAside"
      class="flex min-w-0 flex-col"
    >
      <slot name="aside" />
    </div>
  </section>
</template>

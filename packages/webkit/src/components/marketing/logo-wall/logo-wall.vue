<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../card-grid/card-grid.vue'
  import CardGridCell from '../card-grid/card-grid-cell/card-grid-cell.vue'

  defineOptions({
    name: 'LogoWall',
    inheritAttrs: false
  })

  /** How tall a mark sits in its cell: `wide` for a wordmark, `compact` for a mark closer to square. */
  export type LogoShape = 'wide' | 'compact'

  /** The cell's proportion: `square` cells, or `rectangle` cells at 3:2 that fit nine marks in the height six squares take. */
  export type LogoWallKind = 'square' | 'rectangle'

  /** One company mark in the wall, optionally linked. */
  export type LogoItem = {
    /** URL of the mark rendered in the cell. */
    src: string
    /** Alternative text naming the company the mark belongs to. */
    alt: string
    /** Destination the mark links to, such as that customer's success case. */
    href?: string
    /** How tall the mark sits in its cell; defaults to `wide`. */
    shape?: LogoShape
  }

  interface Props {
    /** The cell's proportion; `rectangle` sets every cell at 3:2, keeps three columns below `sm`, and holds three columns beside `aside` from `lg`. */
    kind?: LogoWallKind
    /** The marks rendered in the grid, in order; each item is `{ src, alt, href?, shape? }` where `src` is the mark's URL, `alt` names the company, `href` links the cell to that customer's story, and `shape` sets a near-square mark taller than a wordmark. */
    items?: LogoItem[]
    /** Accessible name for the group of marks, announced instead of an unnamed region. */
    ariaLabel?: string
    /** Words revealed under a linked mark on hover and focus, and the lead of that link's accessible name. */
    linkLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'square',
    items: () => [],
    ariaLabel: '',
    linkLabel: 'Read story'
  })

  const emit = defineEmits<{
    /** Fired when a linked cell is activated; `item` is the matched entry, so a router can take over the navigation. */
    'item-click': [event: MouseEvent, item: LogoItem]
  }>()

  const slots = defineSlots<{
    /** Content set beside the wall from `lg` up, such as one customer's quotation, on a padded canvas panel framed like the cells. */
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

  const onItemClick = (event: MouseEvent, item: LogoItem) => {
    emit('item-click', event, item)
  }
</script>

<template>
  <section
    v-bind="$attrs"
    class="group/logo-wall grid data-[aside]:lg:grid-cols-2"
    :data-testid="testId"
    :data-kind="kind"
    :data-aside="hasAside || null"
    :aria-label="ariaLabel || undefined"
  >
    <CardGrid
      v-if="hasItems"
      kind="frame"
      flush
      :columns="3"
      :mobile-columns="2"
      role="list"
      class="sm:grid-cols-3! lg:grid-cols-6! group-data-[aside]/logo-wall:lg:grid-cols-2! group-data-[aside]/logo-wall:xl:grid-cols-3! group-data-[kind=rectangle]/logo-wall:max-sm:grid-cols-3! group-data-[kind=rectangle]/logo-wall:group-data-[aside]/logo-wall:lg:grid-cols-3!"
    >
      <CardGridCell
        v-for="(item, index) in items"
        :key="`${item.alt}-${index}`"
        kind="surface"
        :padded="false"
        role="listitem"
      >
        <a
          v-if="item.href"
          :href="item.href"
          :aria-label="`${linkLabel}, ${item.alt}`"
          class="group/logo relative isolate flex aspect-square group-data-[kind=rectangle]/logo-wall:aspect-3/2 items-center justify-center px-(--spacing-md) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance hover:before:opacity-100 motion-reduce:before:transition-none"
          @click="onItemClick($event, item)"
        >
          <span
            class="flex h-7 max-w-full items-center justify-center transition-[translate] duration-moderate-01 ease-productive-entrance group-hover/logo:-translate-y-(--spacing-sm) group-focus-visible/logo:-translate-y-(--spacing-sm) motion-reduce:transition-none"
          >
            <slot
              name="mark"
              :item="item"
              :index="index"
            >
              <img
                :src="item.src"
                :alt="item.alt"
                :data-shape="item.shape ?? 'wide'"
                loading="lazy"
                decoding="async"
                class="h-5 w-auto max-w-full object-contain data-[shape=compact]:h-7 sm:max-w-24"
              />
            </slot>
          </span>
          <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 top-1/2 mt-(--spacing-xs) flex translate-y-1 items-center justify-center gap-(--spacing-xxs) whitespace-nowrap text-overline-md uppercase text-(--text-default) opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-hover/logo:translate-y-0 group-hover/logo:opacity-100 group-focus-visible/logo:translate-y-0 group-focus-visible/logo:opacity-100 motion-reduce:transition-none"
          >
            {{ linkLabel }}
            <i class="pi pi-arrow-up-right leading-none" />
          </span>
        </a>
        <div
          v-else
          class="flex aspect-square items-center justify-center px-(--spacing-md) group-data-[kind=rectangle]/logo-wall:aspect-3/2"
        >
          <span class="flex h-7 max-w-full items-center justify-center">
            <slot
              name="mark"
              :item="item"
              :index="index"
            >
              <img
                :src="item.src"
                :alt="item.alt"
                :data-shape="item.shape ?? 'wide'"
                loading="lazy"
                decoding="async"
                class="h-5 w-auto max-w-full object-contain data-[shape=compact]:h-7 sm:max-w-24"
              />
            </slot>
          </span>
        </div>
      </CardGridCell>
    </CardGrid>

    <FrameBox
      v-if="hasAside"
      borders="none"
      marks="all"
      :data-seam="hasItems || null"
      class="min-w-0 bg-(--bg-canvas) lg:contain-size data-[seam]:max-lg:border-t data-[seam]:lg:border-l"
    >
      <div class="flex h-full min-w-0 items-center p-(--spacing-xl) *:flex-1">
        <slot name="aside" />
      </div>
    </FrameBox>
  </section>
</template>

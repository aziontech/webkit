<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import CardGrid from '../../layout/card-grid/card-grid.vue'
  import CardGridCell from '../../layout/card-grid/card-grid-cell/card-grid-cell.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import LogoWallImage from './parts/logo-wall-image.vue'

  defineOptions({
    name: 'LogoWall',
    inheritAttrs: false
  })

  /** How tall a mark sits in its cell: `wide` for a wordmark, `compact` for a mark closer to square. */
  export type LogoWallShape = 'wide' | 'compact'

  /** The cell's proportion: `square` cells, or `rectangle` cells at 3:2 that fit nine marks in the height six squares take. */
  export type LogoWallVariant = 'square' | 'rectangle'

  /** One company mark in the wall, optionally linked. */
  export type LogoWallItem = {
    /** URL of the mark rendered in the cell. */
    src: string
    /** Alternative text naming the company the mark belongs to. */
    alt: string
    /** Destination the mark links to, such as that customer's success case. */
    href?: string
    /** How tall the mark sits in its cell; defaults to `wide`. */
    shape?: LogoWallShape
  }

  export interface LogoWallProps {
    /** The cell's proportion; `rectangle` sets every cell at 3:2, keeps three columns below `sm`, and holds three columns beside `aside` from `lg`. */
    variant?: LogoWallVariant
    /**
     * The marks rendered in the grid, in order; each item is `{ src, alt, href?, shape? }` where `src` is
     * the mark's URL, `alt` names the company, `href` links the cell to that customer's story, and `shape`
     * sets a near-square mark taller than a wordmark.
     */
    items?: LogoWallItem[]
    /** Accessible name for the group of marks, announced instead of an unnamed region. */
    ariaLabel?: string
    /** Words revealed under a linked mark on hover and focus, and the lead of that link's accessible name. Empty uses the locale catalog (`Read story`). */
    linkLabel?: string
  }

  const props = withDefaults(defineProps<LogoWallProps>(), {
    variant: 'square',
    items: () => [],
    ariaLabel: '',
    linkLabel: ''
  })

  const emit = defineEmits<{
    /** Fired when a linked cell is activated; `item` is the matched entry, so a router can take over the navigation. */
    'item-click': [event: MouseEvent, item: LogoWallItem]
  }>()

  const slots = defineSlots<{
    /** Content set beside the wall from `lg` up, such as one customer's quotation, on a padded canvas panel framed like the cells. */
    aside?(): unknown
    /** One cell's mark, replacing the image built from the item — for a mark that owns its own theming; it carries its own alternative text. */
    mark?(props: { item: LogoWallItem; index: number }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ logoWall: en.logoWall })
  const linkText = computed(() => props.linkLabel || t('logoWall.link'))

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'logo-wall')

  const hasItems = computed(() => props.items.length > 0)

  const hasAside = () => Boolean(slots.aside)

  const onItemClick = (event: MouseEvent, item: LogoWallItem) => {
    emit('item-click', event, item)
  }

  const GRID_CLASS =
    'sm:grid-cols-3! lg:grid-cols-6! ' +
    'group-data-[aside]/logo-wall:lg:grid-cols-2! group-data-[aside]/logo-wall:xl:grid-cols-3! ' +
    'group-data-[variant=rectangle]/logo-wall:max-sm:grid-cols-3! group-data-[variant=rectangle]/logo-wall:group-data-[aside]/logo-wall:lg:grid-cols-3!'

  const LOGO_LINK_CLASS =
    'group/logo relative isolate flex aspect-square ' +
    'group-data-[variant=rectangle]/logo-wall:aspect-3/2 ' +
    'items-center justify-center px-(--spacing-md) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset before:pointer-events-none ' +
    'before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance ' +
    'hover:before:opacity-100 motion-reduce:before:transition-none'

  const LOGO_MARK_CLASS =
    'flex h-7 max-w-full items-center justify-center transition-[translate] duration-moderate-01 ease-productive-entrance ' +
    'group-hover/logo:-translate-y-(--spacing-sm) group-focus-visible/logo:-translate-y-(--spacing-sm) motion-reduce:transition-none'

  const LINK_HINT_CLASS =
    'pointer-events-none absolute inset-x-0 top-1/2 mt-(--spacing-xs) flex translate-y-1 items-center justify-center gap-(--spacing-2xs) whitespace-nowrap text-overline-md uppercase ' +
    'text-(--text-default) opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance ' +
    'group-hover/logo:translate-y-0 group-hover/logo:opacity-100 group-focus-visible/logo:translate-y-0 group-focus-visible/logo:opacity-100 motion-reduce:transition-none'
</script>

<template>
  <section
    v-bind="$attrs"
    class="group/logo-wall grid data-[aside]:lg:grid-cols-2"
    :data-testid="testId"
    :data-variant="variant"
    :data-aside="hasAside() || null"
    :aria-label="ariaLabel || undefined"
  >
    <CardGrid
      v-if="hasItems"
      variant="frame"
      layout="fixed"
      flush
      :columns="3"
      :mobile-columns="2"
      role="list"
      :class="GRID_CLASS"
    >
      <CardGridCell
        v-for="(item, index) in items"
        :key="`${item.alt}-${index}`"
        variant="surface"
        :padded="false"
        role="listitem"
      >
        <a
          v-if="item.href"
          :href="safeHref(item.href) ?? undefined"
          :aria-label="`${linkText}, ${item.alt}`"
          :class="LOGO_LINK_CLASS"
          @click="onItemClick($event, item)"
        >
          <span :class="LOGO_MARK_CLASS">
            <slot
              name="mark"
              :item="item"
              :index="index"
            >
              <LogoWallImage :item="item" />
            </slot>
          </span>
          <span
            aria-hidden="true"
            :class="LINK_HINT_CLASS"
          >
            {{ linkText }}
            <i class="az az-arrow-up-right leading-none" />
          </span>
        </a>
        <div
          v-else
          class="flex aspect-square items-center justify-center px-(--spacing-md) group-data-[variant=rectangle]/logo-wall:aspect-3/2"
        >
          <span class="flex h-7 max-w-full items-center justify-center">
            <slot
              name="mark"
              :item="item"
              :index="index"
            >
              <LogoWallImage :item="item" />
            </slot>
          </span>
        </div>
      </CardGridCell>
    </CardGrid>

    <RegistrationFrame
      v-if="hasAside()"
      borders="none"
      marks="all"
      :data-seam="hasItems || null"
      class="min-w-0 bg-(--bg-canvas) lg:contain-size data-[seam]:max-lg:border-t data-[seam]:lg:border-s"
    >
      <div class="flex h-full min-w-0 items-center p-(--spacing-xl) *:flex-1">
        <slot name="aside" />
      </div>
    </RegistrationFrame>
  </section>
</template>

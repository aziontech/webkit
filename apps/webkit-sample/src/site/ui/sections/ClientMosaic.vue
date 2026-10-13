<script setup lang="ts">
  import BentoGridCell from '@aziontech/webkit/bento-grid-cell'
  import BentoGrid from '@aziontech/webkit/bento-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import LogoWall from '@aziontech/webkit/logo-wall'
  import MiniButton from '@aziontech/webkit/mini-button'
  import SectionModule from '@aziontech/webkit/section-module'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'

  import { useSiteLink } from '../../composables/use-site-link'

  defineOptions({ name: 'ClientMosaic' })

  /** The tile's fill: the canvas, the raised surface, white, or the brand orange. */
  export type ClientMosaicFill = 'canvas' | 'surface' | 'white' | 'primary'

  /** How many tracks a tile spans across or down. */
  export type ClientMosaicSpan = '1' | '2'

  /** How the cells are laid out: a bento mosaic, or one framed column per story. */
  export type ClientMosaicKind = 'mosaic' | 'columns'

  export interface ClientMosaicBrand {
    /** The face's base colour. */
    base: string
    /** The colour of the two glows drawn over the base; equal to the base for a flat face. */
    glow: string
    /** Sets the mark and the copy black for a light face. */
    ink?: 'dark'
  }

  export interface ClientMosaicCell {
    /** The client's name, the mark's alternative text. */
    name: string
    /** URL of the client's logo, drawn as one flat ink. */
    logo: string
    /** The client's success story. */
    href: string
    /** A story headline; a tile with one leads with the mark and closes on the headline and a link. */
    story?: string
    /** URL of the client's photograph behind the story. */
    photo?: string
    /** Tracks the tile spans across. */
    span?: ClientMosaicSpan
    /** Tracks the tile spans down. */
    rows?: ClientMosaicSpan
    /** The tile's fill. */
    fill?: ClientMosaicFill
    /** Draws a stacked lockup, squarer than a wordmark, one step taller. */
    stacked?: boolean
    /** The client's registry entry; in the columns layout it places the mark per theme. */
    client?: Record<string, unknown>
    /** The face the story's tile paints in the columns layout. */
    brand?: ClientMosaicBrand
  }

  interface Props {
    /** The tiles in placement order; the grid fills the next free track with each. */
    cells: ClientMosaicCell[]
    /** The layout; `columns` draws one framed column per cell, a branded tile over its story. */
    kind?: ClientMosaicKind
    /** Accessible name for the grid. */
    ariaLabel?: string
    /** Label of the link under a story headline. */
    storyLabel?: string
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  withDefaults(defineProps<Props>(), {
    kind: 'mosaic',
    ariaLabel: 'Client stories',
    storyLabel: 'Learn more',
    anchor: ''
  })

  const { follow } = useSiteLink()

  const faceOf = (brand: ClientMosaicBrand) => ({
    '--wall-face': [
      `radial-gradient(354px 354px at -15% -15%, ${brand.glow}, transparent 70%)`,
      `radial-gradient(354px 354px at 45% 115%, ${brand.glow}, transparent 70%)`,
      brand.base
    ].join(', '),
    '--wall-ink': brand.ink === 'dark' ? 'var(--color-base-black)' : 'var(--color-base-white)'
  })

  const inkOf = (cell: ClientMosaicCell) =>
    cell.fill === 'white' || cell.fill === 'primary' ? 'knockout' : 'monochrome'
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <FrameBox
      v-if="kind === 'columns'"
      key="columns"
      flush
      borders="y"
      marks="none"
    >
      <div
        role="list"
        :aria-label="ariaLabel"
        class="grid gap-px bg-(--border-default) lg:grid-cols-3"
      >
        <FrameBox
          v-for="cell in cells"
          :key="cell.name"
          role="listitem"
          borders="none"
          marks="all"
        >
          <div class="group/card flex h-full flex-col gap-px bg-(--border-default)">
            <LogoWall
              kind="rectangle"
              :aria-label="cell.name"
              :link-label="storyLabel"
              :items="[{ src: cell.logo, alt: cell.name, href: cell.href }]"
              :style="cell.brand ? faceOf(cell.brand) : undefined"
              class="[&_[role=list]]:grid-cols-1! [&_a]:[background:var(--wall-face)] [&_a]:[--text-default:var(--wall-ink)] group-hover/card:[&_a]:before:opacity-100 group-hover/card:[&_a>span:first-child]:-translate-y-(--spacing-sm) group-hover/card:[&_a>span:last-child]:translate-y-0 group-hover/card:[&_a>span:last-child]:opacity-100"
              @item-click="(event: MouseEvent) => follow(event, cell.href)"
            >
              <template #mark>
                <ClientMark
                  v-if="cell.client"
                  :client="cell.client"
                  monochrome
                  :knockout="cell.brand?.ink === 'dark'"
                  mark="h-7 w-auto max-w-full object-contain sm:max-w-40"
                />
                <img
                  v-else
                  :src="cell.logo"
                  :alt="cell.name"
                  class="h-7 w-auto max-w-full object-contain brightness-0 invert sm:max-w-40"
                />
              </template>
            </LogoWall>

            <a
              :href="cell.href"
              tabindex="-1"
              aria-hidden="true"
              class="relative isolate flex-1 bg-(--bg-canvas) p-(--spacing-lg) before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance group-hover/card:before:opacity-100 motion-reduce:before:transition-none"
              @click="follow($event, cell.href)"
            >
              <p class="m-0 text-balance text-heading-sm text-(--text-default)">
                {{ cell.story }}
              </p>
            </a>
          </div>
        </FrameBox>
      </div>
    </FrameBox>

    <FrameBox
      v-else
      key="mosaic"
      flush
      borders="y"
      marks="all"
    >
      <BentoGrid
        flush
        :columns="4"
        :mobile-columns="2"
        :aria-label="ariaLabel"
      >
        <BentoGridCell
          v-for="cell in cells"
          :key="cell.name"
          :span="cell.span ?? '1'"
          :rows="cell.rows ?? '1'"
          kind="none"
          :padded="false"
        >
          <div
            v-if="cell.story"
            :data-fill="cell.fill ?? 'canvas'"
            class="relative flex h-full min-h-[clamp(180px,18vw,240px)] min-w-0 flex-col justify-between gap-(--spacing-xl) overflow-hidden p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none data-[fill=canvas]:bg-(--bg-canvas) data-[fill=canvas]:hover:bg-(--bg-surface-raised) data-[fill=primary]:bg-(--primary) data-[fill=primary]:hover:bg-(--color-orange-600) data-[fill=surface]:bg-(--bg-surface) data-[fill=white]:bg-(--color-base-white)"
          >
            <template v-if="cell.photo">
              <img
                :src="cell.photo"
                alt=""
                aria-hidden="true"
                decoding="async"
                loading="lazy"
                class="absolute inset-0 z-0 h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                class="absolute inset-0 z-0 [background-image:linear-gradient(to_top,var(--bg-canvas)_0%,color-mix(in_srgb,var(--bg-canvas)_90%,transparent)_38%,color-mix(in_srgb,var(--bg-canvas)_46%,transparent)_70%,color-mix(in_srgb,var(--bg-canvas)_16%,transparent)_100%)]"
              />
            </template>

            <img
              :src="cell.logo"
              :alt="cell.name"
              decoding="async"
              :data-ink="inkOf(cell)"
              :data-stacked="cell.stacked || null"
              class="relative z-10 h-6 w-auto max-w-32 object-contain object-left brightness-0 data-[stacked]:h-9 data-[ink=monochrome]:[[data-theme=dark]_&]:invert"
            />

            <div class="relative z-10 flex flex-col items-start gap-(--spacing-md)">
              <p
                :data-lead="cell.span === '2' || null"
                class="m-0 text-(--text-default) data-[lead]:text-heading-md not-data-[lead]:text-pretty not-data-[lead]:text-body-lg"
              >
                {{ cell.story }}
              </p>
              <MiniButton
                :label="storyLabel"
                show-icon
                icon="pi pi-angle-right"
                :href="cell.href"
                @click="follow($event, cell.href)"
              />
            </div>
          </div>
          <a
            v-else
            :href="cell.href"
            :data-fill="cell.fill ?? 'canvas'"
            class="relative flex h-full min-h-[clamp(180px,18vw,240px)] min-w-0 flex-col items-center justify-center overflow-hidden p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none data-[fill=canvas]:bg-(--bg-canvas) data-[fill=canvas]:hover:bg-(--bg-surface-raised) data-[fill=primary]:bg-(--primary) data-[fill=primary]:hover:bg-(--color-orange-600) data-[fill=surface]:bg-(--bg-surface) data-[fill=white]:bg-(--color-base-white)"
            @click="follow($event, cell.href)"
          >
            <img
              :src="cell.logo"
              :alt="cell.name"
              decoding="async"
              :data-ink="inkOf(cell)"
              :data-stacked="cell.stacked || null"
              class="relative z-10 h-8 w-auto max-w-36 object-contain brightness-0 data-[stacked]:h-12 data-[ink=monochrome]:[[data-theme=dark]_&]:invert"
            />
          </a>
        </BentoGridCell>
      </BentoGrid>
    </FrameBox>
  </SectionModule>
</template>

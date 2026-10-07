<script setup lang="ts">
  import BentoGridCell from '@aziontech/webkit/bento-grid-cell'
  import BentoGrid from '@aziontech/webkit/bento-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import MiniButton from '@aziontech/webkit/mini-button'
  import SectionModule from '@aziontech/webkit/section-module'

  import { useSiteLink } from '../../composables/use-site-link'

  defineOptions({ name: 'ClientMosaic' })

  /** The tile's fill: the canvas, the raised surface, white, or the brand orange. */
  export type ClientMosaicFill = 'canvas' | 'surface' | 'white' | 'primary'

  /** How many tracks a tile spans across or down. */
  export type ClientMosaicSpan = '1' | '2'

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
  }

  interface Props {
    /** The tiles in placement order; the grid fills the next free track with each. */
    cells: ClientMosaicCell[]
    /** Accessible name for the grid. */
    ariaLabel?: string
    /** Label of the link under a story headline. */
    storyLabel?: string
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Client stories',
    storyLabel: 'Learn more',
    anchor: ''
  })

  const { follow } = useSiteLink()

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

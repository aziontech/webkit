<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import MiniButton from '../../actions/mini-button/mini-button.vue'
  import Logo, { type LogoKind } from '../../content/logo/logo.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import BentoGrid from '../../marketing/bento-grid/bento-grid.vue'
  import BentoGridCell from '../../marketing/bento-grid/bento-grid-cell/bento-grid-cell.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'ClientMosaic',
    inheritAttrs: false
  })

  /** The fill of a cell face. */
  export type ClientMosaicFill = 'canvas' | 'surface' | 'white' | 'primary'

  /** How a client mark is inked against its fill. */
  export type ClientMosaicLogoTreatment = 'monochrome' | 'knockout' | 'as-is'

  /** A story cell: a photograph, the client mark, one line of its result and a case study link. */
  export type ClientMosaicStory = {
    /** Source of the client mark. */
    logo: string
    /** Accessible name of the client mark. */
    logoAlt: string
    /** Source of the decorative photograph behind the story; without one the story sits on its fill. */
    photo?: string
    /** One line of the client's result. */
    text: string
    /** Destination of the case study link. */
    href: string
    /** Fill of the cell face. */
    fill?: ClientMosaicFill
    /** How the client mark is inked. */
    logoTreatment?: ClientMosaicLogoTreatment
  }

  /** A mark cell: only the client's linked logo on a chosen fill. */
  export type ClientMosaicLogo = {
    /** Source of the client mark. */
    logo: string
    /** Accessible name of the client mark. */
    logoAlt: string
    /** Destination of the mark link. */
    href: string
    /** Fill of the cell face. */
    fill?: ClientMosaicFill
    /** How the client mark is inked. */
    logoTreatment?: ClientMosaicLogoTreatment
  }

  /** How many grid tracks a cell spans across or down. */
  export type ClientMosaicSpan = '1' | '2'

  /** One cell of the ordered mosaic: a story cell when it has `text`, a mark cell otherwise. */
  export type ClientMosaicCell = {
    /** Source of the client mark. */
    logo: string
    /** Accessible name of the client mark. */
    logoAlt: string
    /** Destination of the case study link, or of the mark link in a mark cell. */
    href: string
    /** One line of the client's result; a cell with text is a story cell. */
    text?: string
    /** Source of the decorative photograph behind a story cell. */
    photo?: string
    /** Grid columns the cell spans; defaults to one. */
    span?: ClientMosaicSpan
    /** Grid rows the cell spans; defaults to one. */
    rows?: ClientMosaicSpan
    /** Fill of the cell face; defaults to `canvas`. */
    fill?: ClientMosaicFill
    /** How the client mark is inked; defaults to `knockout` on a `white` or `primary` fill and `monochrome` on the others. */
    logoTreatment?: ClientMosaicLogoTreatment
    /** Draws the mark one step taller, for a stacked lockup that is squarer than a wordmark. */
    stacked?: boolean
  }

  interface Props {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Accessible name of the grid. */
    ariaLabel?: string
    /** Label of the link under every story. */
    linkLabel?: string
    /** The story cells, in order; the first spans two columns and two rows, the rest one column and two rows. */
    stories?: ClientMosaicStory[]
    /** The mark cells, in order; each one is a single cell linked to its client. */
    logos?: ClientMosaicLogo[]
    /** The cells in placement order, story and mark cells interleaved, each with its own `span` and `rows`; when set it replaces `stories` and `logos`. */
    cells?: ClientMosaicCell[]
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    ariaLabel: '',
    linkLabel: '',
    stories: () => [],
    logos: () => [],
    cells: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-client-mosaic'
  )

  const placed = computed<ClientMosaicCell[]>(() => {
    if (props.cells.length > 0) return props.cells
    return [
      ...props.stories.map((story, index) => ({
        ...story,
        span: index === 0 ? ('2' as const) : ('1' as const),
        rows: '2' as const,
        fill: story.fill ?? 'surface'
      })),
      ...props.logos
    ]
  })

  const hasContent = computed(() => placed.value.length > 0)

  const treatmentOf = (cell: ClientMosaicCell): ClientMosaicLogoTreatment =>
    cell.logoTreatment ??
    (cell.fill === 'white' || cell.fill === 'primary' ? 'knockout' : 'monochrome')

  const inkOf = (cell: ClientMosaicCell): LogoKind => {
    const treatment = treatmentOf(cell)
    return treatment === 'as-is' ? 'color' : treatment
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-xxl)"
    :data-testid="testId"
    :aria-label="ariaLabel || undefined"
  >
    <SectionModule
      v-if="hasContent"
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
        >
          <BentoGridCell
            v-for="(cell, index) in placed"
            :key="`${cell.href}-${index}`"
            :span="cell.span ?? '1'"
            :rows="cell.rows ?? '1'"
            kind="none"
            :padded="false"
            :data-cell="cell.text ? 'story' : 'logo'"
            class="min-h-[clamp(180px,18vw,240px)]"
          >
            <div
              v-if="cell.text"
              :data-fill="cell.fill ?? 'canvas'"
              class="relative flex h-full min-w-0 flex-col justify-between gap-(--spacing-xl) overflow-hidden p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none data-[fill=canvas]:bg-(--bg-canvas) data-[fill=canvas]:hover:bg-(--bg-surface-raised) data-[fill=primary]:bg-(--primary) data-[fill=primary]:hover:brightness-90 data-[fill=surface]:bg-(--bg-surface) data-[fill=white]:bg-(--color-base-white)"
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
              <Logo
                :name="cell.logoAlt"
                :src="cell.logo"
                :kind="inkOf(cell)"
                :data-treatment="treatmentOf(cell)"
                :data-stacked="cell.stacked || undefined"
                class="z-10 h-6 max-w-32 self-start data-[stacked]:h-9"
              />
              <div class="relative z-10 flex flex-col items-start gap-(--spacing-md)">
                <p
                  :data-lead="cell.span === '2' || null"
                  class="m-0 text-(--text-default) text-body-lg data-[lead]:text-heading-md"
                >
                  {{ cell.text }}
                </p>
                <MiniButton
                  :label="linkLabel"
                  icon="pi pi-angle-right"
                  :href="cell.href"
                />
              </div>
            </div>
            <a
              v-else
              :href="cell.href"
              :data-fill="cell.fill ?? 'canvas'"
              class="relative flex h-full min-w-0 flex-col items-center justify-center overflow-hidden p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none data-[fill=canvas]:bg-(--bg-canvas) data-[fill=canvas]:hover:bg-(--bg-surface-raised) data-[fill=primary]:bg-(--primary) data-[fill=primary]:hover:brightness-90 data-[fill=surface]:bg-(--bg-surface) data-[fill=white]:bg-(--color-base-white)"
            >
              <Logo
                :name="cell.logoAlt"
                :src="cell.logo"
                :kind="inkOf(cell)"
                :data-treatment="treatmentOf(cell)"
                :data-stacked="cell.stacked || undefined"
                class="z-10 h-8 max-w-36 data-[stacked]:h-12"
              />
            </a>
          </BentoGridCell>
        </BentoGrid>
      </FrameBox>
    </SectionModule>
  </section>
</template>

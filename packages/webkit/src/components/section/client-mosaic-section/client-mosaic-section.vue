<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { safeHref } from '../../../utils/safe-href'
  import ThirdPartyLogo, {
    type ThirdPartyLogoTreatment,
    type ThirdPartyLogoVariant
  } from '../../content/third-party-logo/third-party-logo.vue'
  import BentoGrid from '../../layout/bento-grid/bento-grid.vue'
  import BentoGridCell from '../../layout/bento-grid/bento-grid-cell/bento-grid-cell.vue'
  import Module from '../../layout/module/module.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import Link from '../../navigation/link/link.vue'

  defineOptions({
    name: 'ClientMosaicSection',
    inheritAttrs: false
  })

  export type { ThirdPartyLogoTreatment }

  /** The fill of a cell face. */
  export type ClientMosaicSectionFill = 'canvas' | 'surface' | 'white' | 'primary'

  /** A story cell: a photograph, the client mark, one line of its result and a case study link. */
  export type ClientMosaicSectionStory = {
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
    fill?: ClientMosaicSectionFill
    /** How the client mark is inked. */
    logoTreatment?: ThirdPartyLogoTreatment
  }

  /** A mark cell: only the client's linked logo on a chosen fill. */
  export type ClientMosaicSectionLogo = {
    /** Source of the client mark. */
    logo: string
    /** Accessible name of the client mark. */
    logoAlt: string
    /** Destination of the mark link. */
    href: string
    /** Fill of the cell face. */
    fill?: ClientMosaicSectionFill
    /** How the client mark is inked. */
    logoTreatment?: ThirdPartyLogoTreatment
  }

  /** How many grid tracks a cell spans across or down. */
  export type ClientMosaicSectionSpan = '1' | '2'

  /** One cell of the ordered mosaic: a story cell when it has `text`, a mark cell otherwise. */
  export type ClientMosaicSectionCell = {
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
    span?: ClientMosaicSectionSpan
    /** Grid rows the cell spans; defaults to one. */
    rows?: ClientMosaicSectionSpan
    /** Fill of the cell face; defaults to `canvas`. */
    fill?: ClientMosaicSectionFill
    /** How the client mark is inked; defaults to `knockout` on a `white` or `primary` fill and `monochrome` on the others. */
    logoTreatment?: ThirdPartyLogoTreatment
    /** Draws the mark one step taller, for a stacked lockup that is squarer than a wordmark. */
    stacked?: boolean
  }

  export interface ClientMosaicSectionProps {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Accessible name of the grid. */
    ariaLabel?: string
    /** Label of the link under every story. */
    linkLabel?: string
    /** The story cells, in order; the first spans two columns and two rows, the rest one column and two rows. */
    stories?: ClientMosaicSectionStory[]
    /** The mark cells, in order; each one is a single cell linked to its client. */
    logos?: ClientMosaicSectionLogo[]
    /** The cells in placement order, story and mark cells interleaved, each with its own `span` and `rows`; when set it replaces `stories` and `logos`. */
    cells?: ClientMosaicSectionCell[]
  }

  const props = withDefaults(defineProps<ClientMosaicSectionProps>(), {
    anchor: '',
    ariaLabel: '',
    linkLabel: '',
    stories: () => [],
    logos: () => [],
    cells: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'client-mosaic-section'
  )

  const placed = computed<ClientMosaicSectionCell[]>(() => {
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

  const treatmentOf = (cell: ClientMosaicSectionCell): ThirdPartyLogoTreatment =>
    cell.logoTreatment ??
    (cell.fill === 'white' || cell.fill === 'primary' ? 'knockout' : 'monochrome')

  const inkOf = (cell: ClientMosaicSectionCell): ThirdPartyLogoVariant => {
    return treatmentOf(cell)
  }

  const STORY_CELL_CLASS =
    'relative flex h-full min-w-0 flex-col justify-between gap-(--spacing-xl) overflow-hidden p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none ' +
    'data-[fill=canvas]:bg-(--bg-canvas) data-[fill=canvas]:hover:bg-(--bg-surface-raised) data-[fill=primary]:bg-(--primary) data-[fill=primary]:hover:brightness-90 ' +
    'data-[fill=surface]:bg-(--bg-surface) data-[fill=white]:bg-(--bg-surface)'

  const STORY_SCRIM_CLASS =
    'absolute inset-0 z-0 ' +
    '[background-image:linear-gradient(to_top,var(--bg-canvas)_0%,color-mix(in_srgb,var(--bg-canvas)_90%,transparent)_38%,color-mix(in_srgb,var(--bg-canvas)_46%,transparent)_70%,color-mix(in_srgb,var(--bg-canvas)_16%,transparent)_100%)]'

  const LOGO_CELL_LINK_CLASS =
    'relative flex h-full min-w-0 flex-col items-center justify-center overflow-hidden p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none ' +
    'data-[fill=canvas]:bg-(--bg-canvas) data-[fill=canvas]:hover:bg-(--bg-surface-raised) data-[fill=primary]:bg-(--primary) data-[fill=primary]:hover:brightness-90 ' +
    'data-[fill=surface]:bg-(--bg-surface) data-[fill=white]:bg-(--bg-surface)'
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-2xl)"
    :data-testid="testId"
    :aria-label="ariaLabel || undefined"
  >
    <Module
      v-if="hasContent"
      :divided="false"
      :padded="false"
    >
      <RegistrationFrame
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
            variant="none"
            :padded="false"
            :data-cell="cell.text ? 'story' : 'logo'"
            class="min-h-[clamp(180px,18vw,240px)] max-md:data-[span=2]:col-span-full max-sm:data-[cell=story]:col-span-full"
          >
            <div
              v-if="cell.text"
              :data-fill="cell.fill ?? 'canvas'"
              :data-theme="cell.fill === 'white' ? 'light' : undefined"
              :class="STORY_CELL_CLASS"
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
                  :class="STORY_SCRIM_CLASS"
                />
              </template>
              <ThirdPartyLogo
                :name="cell.logoAlt"
                :src="cell.logo"
                :variant="inkOf(cell)"
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
                <Link
                  :label="linkLabel"
                  icon="az az-chevron-right"
                  :href="cell.href"
                />
              </div>
            </div>
            <a
              v-else
              :href="safeHref(cell.href) ?? undefined"
              :data-fill="cell.fill ?? 'canvas'"
              :data-theme="cell.fill === 'white' ? 'light' : undefined"
              :class="LOGO_CELL_LINK_CLASS"
            >
              <ThirdPartyLogo
                :name="cell.logoAlt"
                :src="cell.logo"
                :variant="inkOf(cell)"
                :data-treatment="treatmentOf(cell)"
                :data-stacked="cell.stacked || undefined"
                class="z-10 h-8 max-w-36 data-[stacked]:h-12"
              />
            </a>
          </BentoGridCell>
        </BentoGrid>
      </RegistrationFrame>
    </Module>
  </section>
</template>

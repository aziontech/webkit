<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import MiniButton from '../../actions/mini-button/mini-button.vue'
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
    /** Source of the decorative photograph behind the story. */
    photo: string
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

  interface Props {
    /** Accessible name of the grid. */
    ariaLabel?: string
    /** Label of the link under every story. */
    linkLabel?: string
    /** The story cells, in order; the first spans two columns and two rows, the rest one column and two rows. */
    stories?: ClientMosaicStory[]
    /** The mark cells, in order; each one is a single cell linked to its client. */
    logos?: ClientMosaicLogo[]
  }

  const props = withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    linkLabel: '',
    stories: () => [],
    logos: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-client-mosaic'
  )

  const hasContent = computed(() => props.stories.length > 0 || props.logos.length > 0)
</script>

<template>
  <section
    v-bind="$attrs"
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
            v-for="(story, index) in stories"
            :key="story.href"
            :span="index === 0 ? '2' : '1'"
            rows="2"
            kind="none"
            :padded="false"
            class="min-h-[clamp(180px,18vw,240px)]"
          >
            <div
              :data-fill="story.fill ?? 'surface'"
              class="relative flex h-full min-w-0 flex-col justify-between gap-(--spacing-xl) overflow-hidden p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none data-[fill=canvas]:bg-(--bg-canvas) data-[fill=canvas]:hover:bg-(--bg-surface-raised) data-[fill=primary]:bg-(--primary) data-[fill=primary]:hover:brightness-90 data-[fill=surface]:bg-(--bg-surface) data-[fill=white]:bg-(--color-base-white)"
            >
              <img
                :src="story.photo"
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
              <img
                :src="story.logo"
                :alt="story.logoAlt"
                decoding="async"
                :data-treatment="story.logoTreatment ?? 'monochrome'"
                class="relative z-10 h-6 w-auto max-w-32 object-contain object-left data-[treatment=monochrome]:brightness-0 [[data-theme=dark]_&[data-treatment=monochrome]]:invert data-[treatment=knockout]:brightness-0"
              />
              <div class="relative z-10 flex flex-col items-start gap-(--spacing-md)">
                <p
                  :data-lead="index === 0 || null"
                  class="m-0 text-(--text-default) text-body-lg data-[lead]:text-heading-md"
                >
                  {{ story.text }}
                </p>
                <MiniButton
                  :label="linkLabel"
                  show-icon
                  icon="pi pi-angle-right"
                  :href="story.href"
                />
              </div>
            </div>
          </BentoGridCell>
          <BentoGridCell
            v-for="logo in logos"
            :key="logo.href"
            span="1"
            rows="1"
            kind="none"
            :padded="false"
            class="min-h-[clamp(180px,18vw,240px)]"
          >
            <a
              :href="logo.href"
              :data-fill="logo.fill ?? 'canvas'"
              class="relative flex h-full min-w-0 flex-col items-center justify-center overflow-hidden p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none data-[fill=canvas]:bg-(--bg-canvas) data-[fill=canvas]:hover:bg-(--bg-surface-raised) data-[fill=primary]:bg-(--primary) data-[fill=primary]:hover:brightness-90 data-[fill=surface]:bg-(--bg-surface) data-[fill=white]:bg-(--color-base-white)"
            >
              <img
                :src="logo.logo"
                :alt="logo.logoAlt"
                decoding="async"
                :data-treatment="logo.logoTreatment ?? 'monochrome'"
                class="relative z-10 h-8 w-auto max-w-36 object-contain data-[treatment=monochrome]:brightness-0 [[data-theme=dark]_&[data-treatment=monochrome]]:invert data-[treatment=knockout]:brightness-0"
              />
            </a>
          </BentoGridCell>
        </BentoGrid>
      </FrameBox>
    </SectionModule>
  </section>
</template>

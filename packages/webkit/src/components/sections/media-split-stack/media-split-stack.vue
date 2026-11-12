<script setup lang="ts">
  import { computed, defineAsyncComponent, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import type { ProductWidgetName } from '../../content/product-widget/product-widget.vue'
  import BandStack from '../../marketing/band-stack/band-stack.vue'
  import type { DiagramName } from '../../marketing/diagram/diagram.vue'
  import MediaSplit from '../../marketing/media-split/media-split.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'MediaSplitStack',
    inheritAttrs: false
  })

  /** Layout of the run. */
  export type MediaSplitStackKind = 'media-end' | 'alternating'

  /** The outlined button of a band, and the link the whole band follows. */
  export type MediaSplitStackAction = {
    /** Visible label of the button. */
    label: string
    /** Destination the button and the band link to. */
    href: string
  }

  /** One band of the run: a claim beside its picture. */
  export type MediaSplitStackBand = {
    /** Headline of the band, naming its region. */
    title: string
    /** Supporting sentence under the headline. */
    description: string
    /** Name of the product console widget shown in the media cell; wins over every other picture. */
    widget?: ProductWidgetName
    /** Name of the request-flow diagram shown in the media cell, when no widget is set. */
    diagram?: DiagramName
    /** URL of the picture shown in the media cell. */
    image?: string
    /** Alternative text of the picture; empty keeps it decorative. */
    imageAlt?: string
    /** Sets the picture whole on a rounded, bordered plate inset in the cell, for a badge, a logo or a screenshot. */
    imageFramed?: boolean
    /** Registry name of the illustration shown in the media cell, instead of `image`. */
    illustration?: string
    /** Accessible name of the illustration; empty keeps it decorative. */
    illustrationLabel?: string
    /** The outlined button and the link the whole band follows; `{ label, href }`. Omitted when absent. */
    action?: MediaSplitStackAction
  }

  interface Props {
    /** Layout of the run: `media-end` sets every picture at the closing end, `alternating` starts it at the opening end and swaps sides band by band. */
    kind?: MediaSplitStackKind
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the run, rendered by the large centered section title as its `h2`; the run renders no header when empty. */
    title?: string
    /** The bands, in order; each is `{ title, description, widget?, diagram?, image?, imageAlt?, imageFramed?, illustration?, illustrationLabel?, action? }` where `widget` is a `ProductWidget` name, `diagram` a `Diagram` name, `image` a picture URL, `illustration` a registry name, and `action` `{ label, href }` the outlined button and the link the whole band follows. */
    bands?: MediaSplitStackBand[]
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'media-end',
    eyebrow: '',
    title: '',
    bands: () => []
  })

  const ProductWidget = defineAsyncComponent(
    () => import('../../content/product-widget/product-widget.vue')
  )
  const Diagram = defineAsyncComponent(() => import('../../marketing/diagram/diagram.vue'))

  const attrs = useAttrs()

  const hovered = ref<number | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-media-split-stack'
  )

  const hasBands = computed(() => props.bands.length > 0)

  const hasHeader = computed(() => props.title.length > 0)

  const mediaPadded = (band: MediaSplitStackBand) =>
    Boolean(band.widget || band.diagram || (band.imageFramed && band.image && !band.illustration))

  const mediaSide = (index: number) =>
    props.kind === 'alternating' && index % 2 === 0 ? 'media-start' : 'media-end'
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :aria-label="title || undefined"
  >
    <template v-if="hasBands">
      <SectionTitle
        v-if="hasHeader"
        kind="centered"
        size="large"
        :eyebrow="eyebrow"
        :title="title"
      />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <BandStack
          sticky
          flush
        >
          <MediaSplit
            v-for="(band, index) in bands"
            :key="band.title"
            :kind="mediaSide(index)"
            divided
            :heading-level="2"
            align="center"
            size="large"
            media-fill="canvas"
            texture="pixelate"
            texture-size="small"
            texture-fade="top"
            :title="band.title"
            :description="band.description"
            :media-href="band.action?.href ?? ''"
            :media-padded="mediaPadded(band)"
            @pointerenter="hovered = index"
            @pointerleave="hovered = null"
          >
            <template
              v-if="band.widget"
              #media
            >
              <ProductWidget
                :name="band.widget"
                :hover="hovered === index"
                :cursor="false"
              />
            </template>
            <template
              v-else-if="band.diagram"
              #media
            >
              <Diagram :name="band.diagram" />
            </template>
            <template
              v-else-if="band.illustration"
              #media
            >
              <Illustration
                :name="band.illustration"
                :aria-label="band.illustrationLabel ?? ''"
              />
            </template>
            <template
              v-else-if="band.image && band.imageFramed"
              #media
            >
              <div
                class="flex w-full items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
              >
                <img
                  :src="band.image"
                  :alt="band.imageAlt ?? ''"
                  decoding="async"
                  class="block h-auto max-h-80 w-auto max-w-full object-contain"
                />
              </div>
            </template>
            <template
              v-else-if="band.image"
              #media
            >
              <div class="flex aspect-592/300 w-full items-center justify-center">
                <img
                  :src="band.image"
                  :alt="band.imageAlt ?? ''"
                  width="360"
                  height="165"
                  decoding="async"
                  class="block h-auto max-h-full w-[60.81%] object-contain"
                />
              </div>
            </template>
            <template
              v-if="band.action"
              #actions
            >
              <Button
                :label="band.action.label"
                :href="band.action.href"
                kind="outlined"
                size="medium"
                icon="pi pi-chevron-right"
                icon-position="trailing"
                animated
              />
            </template>
          </MediaSplit>
        </BandStack>
      </SectionModule>
    </template>
  </section>
</template>

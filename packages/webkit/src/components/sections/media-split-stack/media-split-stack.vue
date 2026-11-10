<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import BandStack from '../../marketing/band-stack/band-stack.vue'
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
    /** URL of the picture shown in the media cell. */
    image?: string
    /** Alternative text of the picture; empty keeps it decorative. */
    imageAlt?: string
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
    /** The bands, in order; each is `{ title, description, image?, imageAlt?, illustration?, illustrationLabel?, action? }` where `image` is a picture URL, `illustration` a registry name, and `action` `{ label, href }` the outlined button and the link the whole band follows. */
    bands?: MediaSplitStackBand[]
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'media-end',
    eyebrow: '',
    title: '',
    bands: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-media-split-stack'
  )

  const hasBands = computed(() => props.bands.length > 0)

  const hasHeader = computed(() => props.title.length > 0)

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
          >
            <template
              v-if="band.illustration"
              #media
            >
              <Illustration
                :name="band.illustration"
                :aria-label="band.illustrationLabel ?? ''"
              />
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
                  class="block h-auto w-[60.81%]"
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

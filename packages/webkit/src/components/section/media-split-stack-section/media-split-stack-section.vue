<script setup lang="ts">
  import { type Component, computed, defineAsyncComponent, ref, useAttrs } from 'vue'

  import { resolveScene, type SceneRef } from '../../../assets/scene-registry'
  import Button from '../../action/button/button.vue'
  import type { ConsoleMockupName } from '../../content/console-mockup/console-mockup.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import type { DiagramName } from '../../marketing/diagram/diagram.vue'
  import MediaSplit from '../../marketing/media-split/media-split.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionStack from '../../marketing/section-stack/section-stack.vue'
  import type { SectionTitleAction } from '../../marketing/section-title/section-title.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'MediaSplitStackSection',
    inheritAttrs: false
  })

  export type { SectionTitleAction }

  /** Layout of the run. */
  export type MediaSplitStackSectionVariant = 'media-end' | 'alternating'

  /** A live scene drawn in a band's media cell. */
  export type MediaSplitStackSectionScene = SceneRef

  /** One band of the run: a claim beside its picture. */
  export type MediaSplitStackSectionBand = {
    /** Headline of the band, naming its region. */
    title: string
    /** Supporting sentence under the headline. */
    description: string
    /** Short overline above the band's headline. */
    eyebrow?: string
    /** Destination the whole band links to; falls back to the action's. */
    href?: string
    /** Live scene drawn in the media cell, `{ component, props? }` naming a webkit scene asset; wins over every other picture. */
    scene?: MediaSplitStackSectionScene
    /** Name of the product console widget shown in the media cell when no scene is set. */
    widget?: ConsoleMockupName
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
    /** The outlined button, whose `href` the whole band follows when the band has none; `{ label, href }`. Omitted when absent. */
    action?: SectionTitleAction
  }

  export interface MediaSplitStackSectionProps {
    /** Layout of the run: `media-end` sets every picture at the closing end, `alternating` starts it at the opening end and swaps sides band by band. */
    variant?: MediaSplitStackSectionVariant
    /** In-page id set on the run so a `#hash` link can scroll to it. */
    anchor?: string
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the run, rendered by the large centered section title as its `h2`; the run renders no header when empty, and with a header each band's headline drops to an `h3`. */
    title?: string
    /** Supporting sentence under the section title. */
    description?: string
    /** The bands, in order; each is `{ title, description, eyebrow?, href?, scene?, widget?, diagram?, image?, imageAlt?, imageFramed?, illustration?, illustrationLabel?, action? }` where `eyebrow` is the band's overline, `href` the link the whole band follows (falling back to the action's), `scene` a webkit scene asset, `widget` a `ConsoleMockup` name, `diagram` a `Diagram` name, `image` a picture URL, `illustration` a registry name, and `action` `{ label, href }` the outlined button. */
    bands?: MediaSplitStackSectionBand[]
  }

  const props = withDefaults(defineProps<MediaSplitStackSectionProps>(), {
    variant: 'media-end',
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    bands: () => []
  })

  const ConsoleMockup = defineAsyncComponent(
    () => import('../../content/console-mockup/console-mockup.vue')
  )
  const Diagram = defineAsyncComponent(() => import('../../marketing/diagram/diagram.vue'))

  const attrs = useAttrs()

  const hovered = ref<number | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'media-split-stack-section'
  )

  const hasBands = computed(() => props.bands.length > 0)

  const hasHeader = computed(() => props.title.length > 0)

  const scenes = computed<(Component | null)[]>(() =>
    props.bands.map((band) => (band.scene ? resolveScene(band.scene.component) : null))
  )

  const bandHref = (band: MediaSplitStackSectionBand) => band.href || band.action?.href || ''

  const mediaPadded = (band: MediaSplitStackSectionBand, index: number) =>
    !scenes.value[index] &&
    Boolean(band.widget || band.diagram || (band.imageFramed && band.image && !band.illustration))

  const mediaSide = (index: number) =>
    props.variant === 'alternating' && index % 2 === 0 ? 'media-start' : 'media-end'
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :data-variant="variant"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <template v-if="hasBands">
      <SectionTitle
        v-if="hasHeader"
        variant="center"
        size="large"
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <SectionStack
          sticky
          flush
        >
          <MediaSplit
            v-for="(band, index) in bands"
            :key="band.title"
            :variant="mediaSide(index)"
            divided
            :heading-level="hasHeader ? 3 : 2"
            align="center"
            size="large"
            media-fill="canvas"
            texture="pixelate"
            texture-size="small"
            texture-fade="top"
            :eyebrow="band.eyebrow ?? ''"
            :title="band.title"
            :description="band.description"
            :media-href="bandHref(band)"
            :media-padded="mediaPadded(band, index)"
            @pointerenter="hovered = index"
            @pointerleave="hovered = null"
          >
            <template
              v-if="scenes[index]"
              #media
            >
              <component
                :is="scenes[index]"
                v-bind="band.scene?.props ?? {}"
              />
            </template>
            <template
              v-else-if="band.widget"
              #media
            >
              <ConsoleMockup
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
                variant="outline"
                size="medium"
                icon="ai ai-chevron-right"
                icon-position="trailing"
                animated
              />
            </template>
          </MediaSplit>
        </SectionStack>
      </SectionModule>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import type { SceneName } from '../../../assets/scene-registry'
  import Button from '../../action/button/button.vue'
  import type { ConsoleMockupName } from '../../content/console-mockup/console-mockup.vue'
  import Module from '../../layout/module/module.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import ModuleHeader from '../../layout/module-header/module-header.vue'
  import SplitStack from '../../layout/split-stack/split-stack.vue'
  import MediaSplit from '../../marketing/media-split/media-split.vue'
  import { resolveMedia } from '../media-split-section/lib/media-split-media'
  import MediaSplitSectionMedia from '../media-split-section/parts/media-split-section-media.vue'

  defineOptions({
    name: 'MediaSplitStackSection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** A live scene drawn in a band's media cell, every webkit scene asset except the request-flow diagram. */
  export type MediaSplitStackSectionScene = {
    /** Registry name of the scene. */
    component: Exclude<SceneName, 'Diagram'>
    /** Props bound onto the scene, such as the `name` of a `ConsoleMockup`. */
    props?: Record<string, unknown>
  }

  /** The copy and the action of a band. */
  export type MediaSplitStackSectionBandCopy = {
    /** Headline of the band, naming its region. */
    title: string
    /** Supporting sentence under the headline. */
    description: string
    /** Short overline above the band's headline. */
    eyebrow?: string
    /** Destination the whole band links to; falls back to the action's. */
    href?: string
    /** The outlined button, whose `href` the whole band follows when the band has none; `{ label, href }`. Omitted when absent. */
    action?: ModuleHeaderAction
  }

  /** A band's picture drawn as a live scene. */
  export type MediaSplitStackSectionSceneMedia = {
    /** Live scene drawn in the media cell, `{ component, props? }` naming a webkit scene asset; wins over every other picture. */
    scene: MediaSplitStackSectionScene
  }

  /** A band's picture drawn as a product console widget. */
  export type MediaSplitStackSectionWidgetMedia = {
    /** Name of the product console widget shown in the media cell. */
    widget: ConsoleMockupName
  }

  /** A band's picture drawn as a registry illustration. */
  export type MediaSplitStackSectionIllustrationMedia = {
    /** Registry name of the illustration shown in the media cell. */
    illustration: string
    /** Accessible name of the illustration; empty keeps it decorative. */
    illustrationLabel?: string
  }

  /** The required picture of a band: a scene, a console widget or a registry illustration. */
  export type MediaSplitStackSectionBandMedia =
    | MediaSplitStackSectionSceneMedia
    | MediaSplitStackSectionWidgetMedia
    | MediaSplitStackSectionIllustrationMedia

  /** One band of the run: a claim beside its required picture. */
  export type MediaSplitStackSectionBand = MediaSplitStackSectionBandCopy &
    MediaSplitStackSectionBandMedia

  type MediaSplitStackSectionBandFields = MediaSplitStackSectionBandCopy &
    Partial<
      MediaSplitStackSectionSceneMedia &
        MediaSplitStackSectionWidgetMedia &
        MediaSplitStackSectionIllustrationMedia
    >

  export interface MediaSplitStackSectionProps {
    /** In-page id set on the run so a `#hash` link can scroll to it. */
    anchor?: string
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the run, rendered by the large centered section title as its `h2`; the run renders no header when empty, and with a header each band's headline drops to an `h3`. */
    title?: string
    /** Supporting sentence under the section title. */
    description?: string
    /**
     * The bands, in order; each is `{ title, description, eyebrow?, href?, action? }` plus its
     * required picture, one of `scene`, `widget` or `illustration` (with `illustrationLabel?`),
     * where `eyebrow` is the band's overline, `href` the link the whole band follows (falling
     * back to the action's), `scene` a webkit scene asset other than `Diagram`, `widget` a
     * `ConsoleMockup` name, `illustration` a name of the illustration registry, and `action` `{
     * label, href }` the outlined button.
     */
    bands?: MediaSplitStackSectionBand[]
  }

  const props = withDefaults(defineProps<MediaSplitStackSectionProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    bands: () => []
  })

  const attrs = useAttrs()

  const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true

  const hovered = ref<number | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'media-split-stack-section'
  )

  const hasBands = computed(() => props.bands.length > 0)

  const hasHeader = computed(() => props.title.length > 0)

  const views = computed<MediaSplitStackSectionBandFields[]>(() => props.bands)

  const media = computed(() => views.value.map((band) => resolveMedia(band)))

  const bare = computed(() =>
    views.value.filter((_band, index) => !media.value[index]?.kind).map((band) => band.title)
  )

  if (dev)
    watch(
      bare,
      (titles) => {
        if (titles.length)
          console.warn(
            `[webkit] <MediaSplitStackSection>: ${titles.map((title) => `"${title}"`).join(', ')} has no picture. ` +
              'Give every band an illustration, a widget or a scene; ' +
              'a request-flow diagram goes in ConsoleShowcaseSection.'
          )
      },
      { immediate: true }
    )

  const bandHref = (band: MediaSplitStackSectionBandFields) => band.href || band.action?.href || ''
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <template v-if="hasBands">
      <ModuleHeader
        v-if="hasHeader"
        align="center"
        size="medium"
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      />

      <Module
        :divided="false"
        :padded="false"
      >
        <SplitStack
          sticky
          flush
        >
          <MediaSplit
            v-for="(band, index) in views"
            :key="band.title"
            variant="media-end"
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
            :media-padded="media[index]?.mockup"
            @pointerenter="hovered = index"
            @pointerleave="hovered = null"
          >
            <template
              v-if="media[index]?.kind"
              #media
            >
              <MediaSplitSectionMedia
                :source="band"
                :illustration-aria-label="band.illustrationLabel ?? ''"
                :hovered="hovered === index"
              />
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
                icon="az az-chevron-right"
                icon-position="trailing"
                animated
              />
            </template>
          </MediaSplit>
        </SplitStack>
      </Module>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { computed, defineAsyncComponent, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import MediaSplit from '../../marketing/media-split/media-split.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'MediaSplitBand',
    inheritAttrs: false
  })

  /** Type scale of the copy. */
  export type MediaSplitBandSize = 'medium' | 'large'

  /** Name of a webkit scene asset. */
  export type MediaSplitBandSceneName = 'BrandGlobeScene' | 'SpinningGlobe'

  /** A scene drawn in the media cell. */
  export type MediaSplitBandScene = {
    /** The webkit scene asset to draw. */
    component: MediaSplitBandSceneName
  }

  /** A picture drawn in the media cell. */
  export type MediaSplitBandImage = {
    /** URL of the picture. */
    src: string
    /** Alternative text describing the picture; empty keeps it decorative. */
    alt?: string
    /** Intrinsic width of the picture, in pixels. */
    width?: number
    /** Intrinsic height of the picture, in pixels. */
    height?: number
  }

  /** A call to action under the copy. */
  export type MediaSplitBandAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action. */
    target?: '_blank' | '_self'
  }

  interface Props {
    /** Short overline above the headline. */
    eyebrow?: string
    /** Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty. */
    title?: string
    /** Paragraph under the headline. */
    description?: string
    /** Type scale of the copy; `large` sets the headline at heading-xl and centres the copy beside the media. */
    size?: MediaSplitBandSize
    /** Scene drawn in the media cell, `{ component }` naming a webkit scene asset; wins over `image` and `illustration`. */
    scene?: MediaSplitBandScene
    /** Picture drawn in the media cell when no scene is set; `{ src, alt?, width?, height? }`. */
    image?: MediaSplitBandImage
    /** Registry name of the illustration drawn in the media cell when neither a scene nor an image is set. */
    illustration?: string
    /** Accessible name of the illustration; empty keeps it decorative. */
    illustrationAriaLabel?: string
    /** First button under the copy; `{ label, href, trailing?, target? }`. When it is the only action, the whole band links to it. */
    primaryAction?: MediaSplitBandAction
    /** Second, outlined button beside the first; `{ label, href, trailing?, target? }`. With two actions the band stays unlinked. */
    secondaryAction?: MediaSplitBandAction
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    size: 'medium',
    scene: undefined,
    image: undefined,
    illustration: '',
    illustrationAriaLabel: '',
    primaryAction: undefined,
    secondaryAction: undefined
  })

  const SCENES = {
    BrandGlobeScene: defineAsyncComponent(
      () => import('../../../assets/globe/brand-globe-scene.vue')
    ),
    SpinningGlobe: defineAsyncComponent(() => import('../../../assets/globe/spinning-globe.vue'))
  }

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-media-split-band'
  )

  const sceneComponent = computed(() =>
    props.scene ? (SCENES[props.scene.component] ?? null) : null
  )

  const hasImage = computed(() => Boolean(props.image?.src))

  const hasMedia = computed(
    () => Boolean(sceneComponent.value) || hasImage.value || props.illustration.length > 0
  )

  const primary = computed(() =>
    props.primaryAction?.label && props.primaryAction.href ? props.primaryAction : null
  )

  const secondary = computed(() =>
    props.secondaryAction?.label && props.secondaryAction.href ? props.secondaryAction : null
  )

  const bandHref = computed(() => {
    const actions = [primary.value, secondary.value].filter(Boolean)
    return actions.length === 1 ? (actions[0]?.href ?? '') : ''
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
  >
    <SectionModule
      v-if="title"
      :divided="false"
      :padded="false"
    >
      <MediaSplit
        framed
        align="center"
        :size="size"
        media-fill="surface"
        texture="pixelate"
        texture-size="small"
        texture-fade="top"
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
        :media-href="bandHref"
      >
        <template
          v-if="hasMedia"
          #media
        >
          <component
            :is="sceneComponent"
            v-if="sceneComponent"
          />
          <img
            v-else-if="hasImage"
            :src="image?.src"
            :alt="image?.alt ?? ''"
            :width="image?.width"
            :height="image?.height"
            :aria-hidden="image?.alt ? undefined : 'true'"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover"
          />
          <Illustration
            v-else
            :name="illustration"
            :aria-label="illustrationAriaLabel"
          />
        </template>
        <template
          v-if="primary || secondary"
          #actions
        >
          <Button
            v-if="primary"
            :label="primary.label"
            :href="primary.href"
            :target="primary.target"
            kind="secondary"
            size="medium"
            :icon="primary.trailing ? 'pi pi-chevron-right' : ''"
            :icon-position="primary.trailing ? 'trailing' : 'leading'"
            :animated="Boolean(primary.trailing)"
          />
          <Button
            key="button-2"
            v-if="secondary"
            :label="secondary.label"
            :href="secondary.href"
            :target="secondary.target"
            kind="outlined"
            size="medium"
            :icon="secondary.trailing ? 'pi pi-chevron-right' : ''"
            :icon-position="secondary.trailing ? 'trailing' : 'leading'"
            :animated="Boolean(secondary.trailing)"
          />
        </template>
      </MediaSplit>
    </SectionModule>
  </div>
</template>

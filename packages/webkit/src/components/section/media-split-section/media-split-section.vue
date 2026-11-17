<script setup lang="ts">
  import { computed, defineAsyncComponent, ref, useAttrs, watch } from 'vue'

  import { resolveScene, type SceneName } from '../../../assets/scene-registry'
  import Button from '../../action/button/button.vue'
  import type { ConsoleMockupName } from '../../content/console-mockup/console-mockup.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import MediaSplit from '../../marketing/media-split/media-split.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import type { TextureVariant } from '../../marketing/texture/texture.vue'

  defineOptions({
    name: 'MediaSplitSection',
    inheritAttrs: false
  })

  /** Type scale of the copy. */
  export type MediaSplitSectionSize = 'medium' | 'large'

  /** Axis the band splits on. */
  export type MediaSplitSectionOrientation = 'horizontal' | 'vertical'

  /** Name of a webkit scene asset a media band may draw, every one except the request-flow diagram. */
  export type MediaSplitSectionSceneName = Exclude<SceneName, 'Diagram'>

  /** A scene drawn in the media cell. */
  export type MediaSplitSectionScene = {
    /** The webkit scene asset to draw. */
    component: MediaSplitSectionSceneName
    /** MediaSplitSectionProps bound onto the scene. */
    props?: Record<string, unknown>
  }

  /** A picture drawn in the media cell. */
  export type MediaSplitSectionImage = {
    /** URL of the picture. */
    src: string
    /** Alternative text describing the picture; empty keeps it decorative. */
    alt?: string
    /** Intrinsic width of the picture, in pixels. */
    width?: number
    /** Intrinsic height of the picture, in pixels. */
    height?: number
    /** Sets the picture whole on a rounded, bordered plate inset in the cell instead of covering the cell, for a badge, a logo or a screenshot. */
    framed?: boolean
  }

  /** Button variant of an action, overriding the one the band draws. */
  export type MediaSplitSectionActionVariant = 'secondary' | 'outline' | 'ghost'

  /** A call to action under the copy. */
  export type MediaSplitSectionAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Icon class drawn before the label when the action has no trailing chevron. */
    icon?: string
    /** Link target of the action. */
    target?: '_blank' | '_self'
    /** Button variant; wins over the variant the band draws, and transparent draws a quiet text button. */
    variant?: MediaSplitSectionActionVariant
  }

  export interface MediaSplitSectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Short overline above the headline. */
    eyebrow?: string
    /** Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty. */
    title?: string
    /** Paragraph under the headline. */
    description?: string
    /** Type scale of the copy; `large` sets the headline at heading-xl and centres the copy beside the media, `medium` aligns it to the top of the media. */
    size?: MediaSplitSectionSize
    /** Axis the band splits on; `vertical` stacks the media under the copy for a wide scene. */
    orientation?: MediaSplitSectionOrientation
    /** Texture painted under the media: `dots`, `grid`, `lines`, `dither`, `pixelate` or `none`. */
    texture?: TextureVariant
    /** Links the whole band to a lone action; turn it off when the media holds controls of its own. */
    linked?: boolean
    /** Scene drawn in the media cell, `{ component, props? }` naming a webkit scene asset other than `Diagram` and the props bound onto it; wins over every other media. */
    scene?: MediaSplitSectionScene
    /** Name of the product console widget drawn in the media cell when no scene is set. */
    widget?: ConsoleMockupName
    /** Picture drawn in the media cell when neither a scene nor a widget is set; `{ src, alt?, width?, height?, framed? }`, where `framed` sets it whole on a rounded plate instead of covering the cell. */
    image?: MediaSplitSectionImage
    /** Registry name of the illustration drawn in the media cell when no other media is set. */
    illustration?: string
    /** Accessible name of the illustration; empty keeps it decorative. */
    illustrationAriaLabel?: string
    /** First button under the copy; `{ label, href, trailing?, icon?, target?, variant? }`. When it is the only action it renders outlined with a trailing chevron, and the whole band links to it; `variant` overrides the drawn variant. */
    primaryAction?: MediaSplitSectionAction
    /** Second, outlined button beside the first; `{ label, href, trailing?, icon?, target?, variant? }`. With two actions the band stays unlinked. */
    secondaryAction?: MediaSplitSectionAction
  }

  const props = withDefaults(defineProps<MediaSplitSectionProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    size: 'medium',
    orientation: 'horizontal',
    texture: 'pixelate',
    linked: true,
    scene: undefined,
    widget: undefined,
    image: undefined,
    illustration: '',
    illustrationAriaLabel: '',
    primaryAction: undefined,
    secondaryAction: undefined
  })

  const ConsoleMockup = defineAsyncComponent(
    () => import('../../content/console-mockup/console-mockup.vue')
  )

  const attrs = useAttrs()

  const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true

  const hovered = ref(false)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'media-split-section'
  )

  const sceneComponent = computed(() =>
    props.scene && props.scene.component !== ('Diagram' as SceneName)
      ? resolveScene(props.scene.component)
      : null
  )

  const hasImage = computed(() => Boolean(props.image?.src))

  const media = computed(() => {
    if (sceneComponent.value) return 'scene'
    if (props.widget) return 'widget'
    if (hasImage.value) return props.image?.framed ? 'framed-image' : 'image'
    if (props.illustration.length > 0) return 'illustration'
    return null
  })

  const hasMedia = computed(() => media.value !== null)

  const mediaPadded = computed(() => media.value === 'widget' || media.value === 'framed-image')

  const mockup = computed(
    () =>
      media.value === 'widget' ||
      (media.value === 'scene' && props.scene?.component === 'ConsoleMockup')
  )

  const primary = computed(() =>
    props.primaryAction?.label && props.primaryAction.href ? props.primaryAction : null
  )

  const secondary = computed(() =>
    props.secondaryAction?.label && props.secondaryAction.href ? props.secondaryAction : null
  )

  const lone = computed(() => {
    const actions = [primary.value, secondary.value].filter((action) => action !== null)
    return actions.length === 1 ? (actions[0] ?? null) : null
  })

  const bandHref = computed(() => (props.linked && lone.value ? lone.value.href : ''))

  if (dev)
    watch(
      () => Boolean(props.title) && !hasMedia.value,
      (bare) => {
        if (bare)
          console.warn(
            `[webkit] <MediaSplitSection>: the band "${props.title}" has no media. Give it an illustration, an image or a scene; code goes in FeatureScrollSection and a request-flow diagram in ConsoleShowcaseSection.`
          )
      },
      { immediate: true }
    )

  const actionIcon = (action: MediaSplitSectionAction): string =>
    action.trailing ? 'az az-chevron-right' : (action.icon ?? '')
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-2xl)"
  >
    <SectionModule
      v-if="title"
      :divided="false"
      :padded="false"
    >
      <MediaSplit
        framed
        :orientation="orientation"
        :align="size === 'large' ? 'center' : 'start'"
        :size="size"
        media-fill="surface"
        :texture="texture"
        texture-size="small"
        texture-fade="top"
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
        :media-href="bandHref"
        :media-padded="mediaPadded"
        @pointerenter="hovered = true"
        @pointerleave="hovered = false"
      >
        <template
          v-if="hasMedia"
          #media
        >
          <div
            v-if="mockup"
            :data-orientation="orientation"
            class="flex w-full self-stretch max-lg:min-h-(--size-80) data-[orientation=vertical]:min-h-(--size-80)"
          >
            <component
              :is="sceneComponent"
              v-if="media === 'scene'"
              v-bind="scene?.props ?? {}"
            />
            <ConsoleMockup
              v-else-if="widget"
              :name="widget"
              :hover="hovered"
              :cursor="false"
            />
          </div>
          <component
            :is="sceneComponent"
            v-else-if="media === 'scene'"
            v-bind="scene?.props ?? {}"
          />
          <div
            v-else-if="media === 'framed-image'"
            class="flex w-full items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) p-(--spacing-md)"
          >
            <img
              :src="image?.src"
              :alt="image?.alt ?? ''"
              :width="image?.width"
              :height="image?.height"
              :aria-hidden="image?.alt ? undefined : 'true'"
              loading="lazy"
              decoding="async"
              class="block h-auto max-h-80 w-auto max-w-full object-contain"
            />
          </div>
          <img
            v-else-if="media === 'image'"
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
            v-else-if="media === 'illustration'"
            :name="illustration"
            :aria-label="illustrationAriaLabel"
          />
        </template>
        <template
          v-if="primary || secondary"
          #actions
        >
          <Button
            key="button-1"
            v-if="lone"
            :label="lone.label"
            :href="lone.href"
            :target="lone.target"
            :variant="lone.variant ?? 'outline'"
            size="medium"
            :icon="lone.icon && !lone.trailing ? lone.icon : 'az az-chevron-right'"
            :icon-position="lone.icon && !lone.trailing ? 'leading' : 'trailing'"
            :animated="!(lone.icon && !lone.trailing)"
          />
          <Button
            key="button-2"
            v-else-if="primary"
            :label="primary.label"
            :href="primary.href"
            :target="primary.target"
            :variant="primary.variant ?? 'secondary'"
            size="medium"
            :icon="actionIcon(primary)"
            :icon-position="primary.trailing ? 'trailing' : 'leading'"
            :animated="Boolean(primary.trailing)"
          />
          <Button
            key="button-3"
            v-if="secondary && !lone"
            :label="secondary.label"
            :href="secondary.href"
            :target="secondary.target"
            :variant="secondary.variant ?? 'outline'"
            size="medium"
            :icon="actionIcon(secondary)"
            :icon-position="secondary.trailing ? 'trailing' : 'leading'"
            :animated="Boolean(secondary.trailing)"
          />
        </template>
      </MediaSplit>
    </SectionModule>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineAsyncComponent, ref, useAttrs } from 'vue'

  import { resolveScene, type SceneName } from '../../../assets/scene-registry'
  import Button from '../../actions/button/button.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import type { ProductWidgetName } from '../../content/product-widget/product-widget.vue'
  import type { DiagramName } from '../../marketing/diagram/diagram.vue'
  import MediaSplit from '../../marketing/media-split/media-split.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import type { TextureMaterialKind } from '../../marketing/texture-material/texture-material.vue'

  defineOptions({
    name: 'MediaSplitBand',
    inheritAttrs: false
  })

  /** Type scale of the copy. */
  export type MediaSplitBandSize = 'medium' | 'large'

  /** Axis the band splits on. */
  export type MediaSplitBandOrientation = 'horizontal' | 'vertical'

  /** Name of a webkit scene asset. */
  export type MediaSplitBandSceneName = SceneName

  /** A scene drawn in the media cell. */
  export type MediaSplitBandScene = {
    /** The webkit scene asset to draw. */
    component: MediaSplitBandSceneName
    /** Props bound onto the scene. */
    props?: Record<string, unknown>
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
    /** Sets the picture whole on a rounded, bordered plate inset in the cell instead of covering the cell, for a badge, a logo or a screenshot. */
    framed?: boolean
  }

  /** Button kind of an action, overriding the one the band draws. */
  export type MediaSplitBandActionKind = 'secondary' | 'outlined' | 'transparent'

  /** A call to action under the copy. */
  export type MediaSplitBandAction = {
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
    /** Button kind; wins over the kind the band draws, and transparent draws a quiet text button. */
    kind?: MediaSplitBandActionKind
  }

  /** One file of the code sample drawn in the media cell. */
  export type MediaSplitBandCodeTab = {
    /** Label of the tab in the strip. */
    label: string
    /** Stable id of the tab. */
    value: string
    /** The code shown verbatim; a tab without it is skipped. */
    code: string
    /** Language the code is highlighted as. */
    language?: string
    /** File name shown in the filename bar. */
    fileName?: string
    /** Icon class shown beside the file name. */
    fileIcon?: string
    /** Icon class of the mark drawn beside the tab label. */
    icon?: string
  }

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Short overline above the headline. */
    eyebrow?: string
    /** Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty. */
    title?: string
    /** Paragraph under the headline. */
    description?: string
    /** Type scale of the copy; `large` sets the headline at heading-xl and centres the copy beside the media, `medium` aligns it to the top of the media. */
    size?: MediaSplitBandSize
    /** Axis the band splits on; `vertical` stacks the media under the copy for a wide scene. */
    orientation?: MediaSplitBandOrientation
    /** Texture painted under the media: `dots`, `grid`, `lines`, `dither`, `pixelate` or `none`. */
    texture?: TextureMaterialKind
    /** Links the whole band to a lone action; turn it off when the media holds controls of its own. */
    linked?: boolean
    /** Scene drawn in the media cell, `{ component, props? }` naming a webkit scene asset and the props bound onto it; wins over every other media. */
    scene?: MediaSplitBandScene
    /** Files of the code sample drawn in the media cell when no scene is set, in order; each is `{ label, value, code, language?, fileName?, fileIcon?, icon? }` where `icon` is a mark beside the tab label. A tab without `code` is skipped. */
    codeTabs?: MediaSplitBandCodeTab[]
    /** `value` of the code tab open first; empty, or a value no tab carries, opens the first tab. */
    defaultFile?: string
    /** Accessible name of the code sample's copy button; empty keeps the code block's own. */
    copyAriaLabel?: string
    /** Name of the product console widget drawn in the media cell when neither a scene nor code is set. */
    widget?: ProductWidgetName
    /** Name of the request-flow diagram drawn in the media cell when neither a scene nor a widget is set. */
    diagram?: DiagramName
    /** Picture drawn in the media cell when no scene, widget or diagram is set; `{ src, alt?, width?, height?, framed? }`, where `framed` sets it whole on a rounded plate instead of covering the cell. */
    image?: MediaSplitBandImage
    /** Registry name of the illustration drawn in the media cell when no other media is set. */
    illustration?: string
    /** Accessible name of the illustration; empty keeps it decorative. */
    illustrationAriaLabel?: string
    /** First button under the copy; `{ label, href, trailing?, icon?, target?, kind? }`. When it is the only action it renders outlined with a trailing chevron, and the whole band links to it (not over code); `kind` overrides the drawn kind. */
    primaryAction?: MediaSplitBandAction
    /** Second, outlined button beside the first; `{ label, href, trailing?, icon?, target?, kind? }`. With two actions the band stays unlinked. */
    secondaryAction?: MediaSplitBandAction
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    size: 'medium',
    orientation: 'horizontal',
    texture: 'pixelate',
    linked: true,
    scene: undefined,
    codeTabs: () => [],
    defaultFile: '',
    copyAriaLabel: '',
    widget: undefined,
    diagram: undefined,
    image: undefined,
    illustration: '',
    illustrationAriaLabel: '',
    primaryAction: undefined,
    secondaryAction: undefined
  })

  const ProductWidget = defineAsyncComponent(
    () => import('../../content/product-widget/product-widget.vue')
  )
  const Diagram = defineAsyncComponent(() => import('../../marketing/diagram/diagram.vue'))
  const CodeBlock = defineAsyncComponent(() => import('../../code/code-block/code-block.vue'))

  const attrs = useAttrs()

  const hovered = ref(false)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-media-split-band'
  )

  const sceneComponent = computed(() => (props.scene ? resolveScene(props.scene.component) : null))

  const tabs = computed(() => props.codeTabs.filter((tab) => tab.code.length > 0))

  const tabIcons = computed<Record<string, string>>(() =>
    Object.fromEntries(tabs.value.map((tab) => [tab.value, tab.icon ?? '']))
  )

  const hasTabIcons = computed(() => tabs.value.some((tab) => Boolean(tab.icon)))

  const openFile = computed(() =>
    tabs.value.some((tab) => tab.value === props.defaultFile) ? props.defaultFile : undefined
  )

  const hasImage = computed(() => Boolean(props.image?.src))

  const media = computed(() => {
    if (sceneComponent.value) return 'scene'
    if (tabs.value.length > 0) return 'code'
    if (props.widget) return 'widget'
    if (props.diagram) return 'diagram'
    if (hasImage.value) return props.image?.framed ? 'framed-image' : 'image'
    if (props.illustration.length > 0) return 'illustration'
    return null
  })

  const hasMedia = computed(() => media.value !== null)

  const mediaPadded = computed(
    () =>
      media.value === 'code' ||
      media.value === 'widget' ||
      media.value === 'diagram' ||
      media.value === 'framed-image'
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

  const bandHref = computed(() =>
    props.linked && lone.value && media.value !== 'code' ? lone.value.href : ''
  )

  const actionIcon = (action: MediaSplitBandAction): string =>
    action.trailing ? 'ai ai-chevron-right' : (action.icon ?? '')
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
        :align="size === 'large' ? 'center' : 'top'"
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
          <component
            :is="sceneComponent"
            v-if="media === 'scene'"
            v-bind="scene?.props ?? {}"
          />
          <div
            v-else-if="media === 'code'"
            class="-mb-(--spacing-xl) h-[20rem] w-full min-w-0 overflow-hidden rounded-t-(--shape-control) border-x border-t border-(--border-default) bg-(--bg-surface) shadow-(--shadow-sm)"
          >
            <CodeBlock
              :tabs="tabs"
              :default-value="openFile"
              show-line-numbers
              :bordered="false"
              v-bind="{ animateLines: true }"
              :copy-aria-label="copyAriaLabel || undefined"
            >
              <template
                v-if="hasTabIcons"
                #tab-icon="{ tab }"
              >
                <i
                  v-if="tabIcons[tab.value]"
                  :class="tabIcons[tab.value]"
                  class="size-3.5!"
                  aria-hidden="true"
                />
              </template>
            </CodeBlock>
          </div>
          <ProductWidget
            v-else-if="media === 'widget' && widget"
            :name="widget"
            :hover="hovered"
            :cursor="false"
          />
          <Diagram
            v-else-if="media === 'diagram' && diagram"
            :name="diagram"
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
            :kind="lone.kind ?? 'outlined'"
            size="medium"
            :icon="lone.icon && !lone.trailing ? lone.icon : 'ai ai-chevron-right'"
            :icon-position="lone.icon && !lone.trailing ? 'leading' : 'trailing'"
            :animated="!(lone.icon && !lone.trailing)"
          />
          <Button
            key="button-2"
            v-else-if="primary"
            :label="primary.label"
            :href="primary.href"
            :target="primary.target"
            :kind="primary.kind ?? 'secondary'"
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
            :kind="secondary.kind ?? 'outlined'"
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

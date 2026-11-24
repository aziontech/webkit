<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { resolveScene, type SceneRef } from '../../../assets/scene-registry'
  import CodeBlock, { type CodeBlockTab } from '../../code/code-block/code-block.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import MediaTabs from '../../marketing/media-tabs/media-tabs.vue'
  import Link from '../../navigation/link/link.vue'
  import { sectionActions } from '../lib/section-actions'
  import SectionActions from '../parts/section-actions.vue'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'FeatureTabsSection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** A code file a tab opens as its media. */
  export type FeatureTabsSectionCode = CodeBlockTab

  /** A live scene drawn as the media of every tab without code. */
  export type FeatureTabsSectionScene = SceneRef

  /** One feature of the band: a tab and the media it shows. */
  export type FeatureTabsSectionTab = {
    /** The tab's heading, naming it in the stack. */
    title: string
    /** The sentence under the heading. */
    description: string
    /** Stable key of the tab, handed to the band scene as its `tab`. */
    value?: string
    /** Code file the tab opens as its media; wins over the scene and the illustration. */
    code?: FeatureTabsSectionCode
    /** Registry name of the illustration shown while the tab is active, when it has no code and the band has no scene. */
    illustration?: string
    /** Accessible name of the illustration; empty keeps it decorative. */
    illustrationLabel?: string
  }

  export interface FeatureTabsSectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /**
     * The features, in order, at most three; each is `{ title, description, value?, code?, illustration?,
     * illustrationLabel? }` where `value` is the key handed to the band scene as its `tab`, `code` is the
     * file the tab opens as its media, `illustration` is a registry name drawn when the tab has no code
     * and the band no scene, and `illustrationLabel` its accessible name.
     */
    tabs?: FeatureTabsSectionTab[]
    /** Live scene drawn as the media of every tab without code, `{ component, props? }` naming a webkit scene asset; it receives the tab's `value` as `tab` and whether the tab is open as `active`. */
    scene?: FeatureTabsSectionScene
    /** Opens the next tab on a timer, with the composed tabs' visible pause control. */
    autoplay?: boolean
    /** Milliseconds each tab holds before the next one opens. */
    autoplayInterval?: number
    /** Accessible name of the copy button on each tab's code file; empty keeps the code block's own. */
    copyAriaLabel?: string
    /** Button in the section title, beside the headline (under the frame when the band has no title); `{ label, href, trailing?, target? }` where `trailing` adds the chevron. Omitted when absent. */
    primaryAction?: ModuleHeaderAction
  }

  const props = withDefaults(defineProps<FeatureTabsSectionProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    tabs: () => [],
    scene: undefined,
    autoplay: true,
    autoplayInterval: 5200,
    copyAriaLabel: '',
    primaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feature-tabs-section'
  )
  const headerActions = computed(() => sectionActions(props.primaryAction, undefined))

  const hasHeader = computed(() => props.title.length > 0)

  const items = computed(() =>
    props.tabs.map((tab) => ({ title: tab.title, description: tab.description }))
  )

  const codeFiles = computed(() => props.tabs.map((tab) => (tab.code ? [tab.code] : [])))

  const hasCode = computed(() => props.tabs.some((tab) => tab.code))

  const sceneComponent = computed(() => (props.scene ? resolveScene(props.scene.component) : null))
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :anchor="anchor"
    :label="title"
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
    :filled="tabs.length > 0"
    :framed="false"
    align="split"
  >
    <template
      v-if="headerActions.length"
      #header-actions
    >
      <SectionActions :actions="headerActions" />
    </template>

    <RegistrationFrame
      flush
      :borders="primaryAction && !hasHeader ? 'y' : 'none'"
      marks="bottom"
    >
      <div
        :data-code="hasCode || null"
        class="-mx-px [--media-tabs-media-min:24rem] data-[code]:[--media-tabs-media-min:30rem]"
      >
        <MediaTabs
          :items="items"
          size="medium"
          :texture="hasCode ? 'pixelate' : 'none'"
          texture-size="small"
          texture-fade="top"
          :autoplay="autoplay"
          :autoplay-interval="autoplayInterval"
        >
          <template #media="{ index, active }">
            <div
              v-if="codeFiles[index]?.length"
              class="w-full min-w-0 p-(--spacing-xl)"
            >
              <div class="min-w-0 rounded-(--shape-control) shadow-(--shadow-sm)">
                <CodeBlock
                  :tabs="codeFiles[index]"
                  show-line-numbers
                  v-bind="{ animateLines: active }"
                  :copy-aria-label="copyAriaLabel || undefined"
                />
              </div>
            </div>
            <component
              :is="sceneComponent"
              v-else-if="sceneComponent"
              v-bind="{ ...scene?.props, tab: tabs[index]?.value, active }"
              class="size-full"
            />
            <Illustration
              v-else-if="tabs[index]?.illustration"
              :name="tabs[index]?.illustration ?? ''"
              :aria-label="tabs[index]?.illustrationLabel ?? ''"
              class="size-full"
            />
          </template>
        </MediaTabs>
      </div>

      <div
        v-if="primaryAction && !hasHeader"
        class="p-(--spacing-xl)"
      >
        <Link
          :label="primaryAction.label"
          :href="primaryAction.href"
          :target="primaryAction.target"
          :icon="primaryAction.trailing ? 'az az-chevron-right' : ''"
        />
      </div>
    </RegistrationFrame>
  </SectionBand>
</template>

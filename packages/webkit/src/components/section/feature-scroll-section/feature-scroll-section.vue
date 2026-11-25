<script setup lang="ts">
  import { computed, defineAsyncComponent, onMounted, ref, useAttrs } from 'vue'

  import type { SceneRef } from '../../../assets/scene-registry'
  import { useMediaQuery } from '../../../composables/use-media-query'
  import { resolveItemScenes } from '../../../utils/item-scenes'
  import Button from '../../action/button/button.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import Texture from '../../content/texture/texture.vue'
  import CardGrid from '../../layout/card-grid/card-grid.vue'
  import CardGridCell from '../../layout/card-grid/card-grid-cell/card-grid-cell.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import MediaScroll from '../../marketing/media-scroll/media-scroll.vue'
  import MediaTile from '../../marketing/media-tile/media-tile.vue'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'FeatureScrollSection',
    inheritAttrs: false
  })

  /** The small action under a step's copy on the large layout. */
  export type FeatureScrollSectionAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action; `_blank` opens it in a new tab. */
    target?: '_blank' | '_self'
    /** Button variant; defaults to secondary, and transparent draws a quiet text button. */
    variant?: FeatureScrollSectionActionVariant
  }

  /** Button variant of a step's action. */
  export type FeatureScrollSectionActionVariant = 'secondary' | 'outline' | 'ghost'

  /** The one-file code sample a step shows as its media. */
  export type FeatureScrollSectionCode = {
    /** File name shown in the sample's filename bar. */
    fileName: string
    /** The code shown verbatim. */
    code: string
    /** Language the code is highlighted as. */
    language?: string
    /** Icon class shown beside the file name. */
    fileIcon?: string
    /** Accessible name of the sample's copy button; empty keeps the code block's own. */
    copyAriaLabel?: string
  }

  /** One feature of the walkthrough: a step of the stack and a tile of the grid. */
  export type FeatureScrollSectionItem = {
    /** The feature's heading, naming its step. */
    title: string
    /** One sentence explaining the feature. */
    description: string
    /** Live scene pinned for this step and shown still as the tile's media, `{ component, props? }` naming a webkit scene asset; wins over the code and the illustration. */
    scene?: SceneRef
    /** One-file code sample pinned for this step and shown as the tile's media when no scene is set, `{ fileName, code, language?, fileIcon?, copyAriaLabel? }`. */
    code?: FeatureScrollSectionCode
    /** Registry name of the illustration pinned for this step and shown as the tile's media when neither a scene nor code is set. */
    illustration?: string
    /** Small button under the step; `{ label, href, trailing?, target?, variant? }`, secondary unless `variant` says otherwise. Omitted when absent. */
    action?: FeatureScrollSectionAction
  }

  export interface FeatureScrollSectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the large section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /**
     * The features, in order; each is `{ title, description, scene?, code?, illustration?, action? }`
     * where `scene` is `{ component, props? }` naming a webkit scene asset (drawn live in the stack, still
     * in the grid), `code` is a one-file sample `{ fileName, code, language?, fileIcon?, copyAriaLabel? }`
     * drawn when no scene is set, `illustration` is a registry name drawn when neither is set, and
     * `action` is `{ label, href, trailing?, target?, variant? }` rendered as a small button under the
     * step, secondary unless `variant` says otherwise.
     */
    items?: FeatureScrollSectionItem[]
  }

  const props = withDefaults(defineProps<FeatureScrollSectionProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    items: () => []
  })

  const CodeBlock = defineAsyncComponent(() => import('../../code/code-block/code-block.vue'))
  const SectionCodeWindow = defineAsyncComponent(() => import('../parts/section-code-window.vue'))

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feature-scroll-section'
  )

  const scenes = computed(() => resolveItemScenes(props.items))

  const wide = useMediaQuery('(min-width: 64rem)')
  const hydrated = ref(false)
  onMounted(() => {
    hydrated.value = true
  })
  const showGrid = computed(() => !hydrated.value || !wide.value)
  const showScroll = computed(() => !hydrated.value || wide.value)

  const sampleTabs = (sample: FeatureScrollSectionCode) => [
    {
      label: sample.fileName,
      value: sample.fileName,
      code: sample.code,
      language: sample.language,
      fileName: sample.fileName,
      fileIcon: sample.fileIcon
    }
  ]

  const tileTabs = (sample: FeatureScrollSectionCode) => [
    { label: sample.fileName, value: sample.fileName, code: sample.code, language: sample.language }
  ]

  const MEDIA_FRAME_CLASS =
    'relative h-[30rem] w-full min-w-0 overflow-hidden rounded-(--shape-card) bg-(--bg-surface) ' +
    'lg:absolute lg:inset-0 lg:h-auto lg:rounded-none lg:border-0 [background-clip:var(--illustration-rim-boxes)] ' +
    '[background-image:linear-gradient(var(--bg-surface),var(--bg-surface)),var(--illustration-rim),linear-gradient(var(--bg-surface),var(--bg-surface))] ' +
    '[background-origin:var(--illustration-rim-boxes)] [border:var(--illustration-rim-width-hairline)_solid_transparent]'
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
    :filled="items.length > 0"
    :framed="false"
    header-size="large"
  >
    <RegistrationFrame
      v-if="showGrid"
      key="grid"
      flush
      borders="y"
      marks="bottom"
      class="lg:hidden"
    >
      <CardGrid
        flush
        variant="frame"
        :columns="3"
      >
        <CardGridCell
          v-for="(item, index) in items"
          :key="item.title"
          variant="canvas"
          :padded="false"
          :data-wide="(index === items.length - 1 && items.length % 2 === 1) || null"
          class="sm:data-[wide]:col-span-2"
        >
          <MediaTile
            variant="plain"
            :title="item.title"
            :description="item.description"
          >
            <template #media>
              <div
                v-if="scenes[index]"
                class="h-80 w-full min-w-0"
              >
                <component
                  :is="scenes[index]"
                  v-bind="{ ...item.scene?.props, active: false }"
                />
              </div>
              <div
                v-else-if="item.code"
                class="w-full min-w-0 p-(--spacing-md) max-sm:px-0"
              >
                <CodeBlock
                  :tabs="tileTabs(item.code)"
                  show-label
                  show-line-numbers
                  :copy-aria-label="item.code.copyAriaLabel || undefined"
                />
              </div>
              <Illustration
                v-else-if="item.illustration"
                :name="item.illustration"
              />
            </template>
          </MediaTile>
        </CardGridCell>
      </CardGrid>
    </RegistrationFrame>

    <RegistrationFrame
      v-if="showScroll"
      key="scroll"
      flush
      borders="y"
      marks="bottom"
      class="hidden lg:block [--media-scroll-top:3.5rem] [--media-scroll-align:stretch]"
    >
      <MediaScroll :items="items">
        <template #media="{ index, active }">
          <div class="contents">
            <div :class="MEDIA_FRAME_CLASS">
              <Texture
                variant="dots"
                size="small"
                class="opacity-40"
              />
              <div
                class="relative z-10 flex h-full w-full items-center justify-center p-(--spacing-md) lg:p-(--spacing-xl)"
              >
                <div
                  v-if="scenes[index]"
                  class="h-[30rem] max-h-full w-full min-w-0"
                >
                  <component
                    :is="scenes[index]"
                    v-bind="{ ...items[index].scene?.props, active }"
                  />
                </div>
                <SectionCodeWindow
                  v-else-if="items[index].code"
                  :tabs="sampleTabs(items[index].code)"
                  animated
                  :copy-aria-label="items[index].code.copyAriaLabel"
                  class="w-full"
                />
                <div
                  v-else-if="items[index].illustration"
                  class="w-full min-w-0"
                >
                  <Illustration :name="items[index].illustration" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #actions="{ index }">
          <Button
            v-if="items[index].action"
            :label="items[index].action.label"
            :href="items[index].action.href"
            :target="items[index].action.target"
            :variant="items[index].action.variant ?? 'secondary'"
            size="small"
            :icon="items[index].action.trailing ? 'az az-chevron-right' : ''"
            icon-position="trailing"
            :animated="Boolean(items[index].action.trailing)"
          />
        </template>
      </MediaScroll>
    </RegistrationFrame>
  </SectionBand>
</template>

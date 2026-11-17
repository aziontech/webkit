<script setup lang="ts">
  import { type Component, computed, defineAsyncComponent, useAttrs } from 'vue'

  import { resolveScene, type SceneRef } from '../../../assets/scene-registry'
  import Button from '../../action/button/button.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import MediaTile from '../../marketing/media-tile/media-tile.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import StickyStack from '../../marketing/sticky-stack/sticky-stack.vue'
  import Texture from '../../marketing/texture/texture.vue'

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
    /** The features, in order; each is `{ title, description, scene?, code?, illustration?, action? }` where `scene` is `{ component, props? }` naming a webkit scene asset (drawn live in the stack, still in the grid), `code` is a one-file sample `{ fileName, code, language?, fileIcon?, copyAriaLabel? }` drawn when no scene is set, `illustration` is a registry name drawn when neither is set, and `action` is `{ label, href, trailing?, target?, variant? }` rendered as a small button under the step, secondary unless `variant` says otherwise. */
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

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feature-scroll-section'
  )

  const hasItems = computed(() => props.items.length > 0)

  const hasHeader = computed(() => props.title.length > 0)

  const scenes = computed<(Component | null)[]>(() =>
    props.items.map((item) => (item.scene ? resolveScene(item.scene.component) : null))
  )

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
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <SectionModule
      v-if="hasItems"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasHeader"
        #header
      >
        <SectionTitle
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
          size="large"
        />
      </template>

      <RegistrationFrame
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
                  class="w-full min-w-0 p-(--spacing-md)"
                >
                  <CodeBlock
                    :tabs="sampleTabs(item.code)"
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
        flush
        borders="y"
        marks="bottom"
        class="hidden lg:block [--sticky-stack-top:3.5rem] [--sticky-stack-align:stretch]"
      >
        <StickyStack :items="items">
          <template #media="{ index, active }">
            <div class="contents">
              <div
                class="relative h-[30rem] w-full min-w-0 overflow-hidden rounded-(--shape-card) bg-(--bg-surface) lg:absolute lg:inset-0 lg:h-auto lg:rounded-none lg:border-0 [background-clip:var(--illustration-rim-boxes)] [background-image:linear-gradient(var(--bg-surface),var(--bg-surface)),var(--illustration-rim),linear-gradient(var(--bg-surface),var(--bg-surface))] [background-origin:var(--illustration-rim-boxes)] [border:var(--illustration-rim-width-hairline)_solid_transparent]"
              >
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
                  <div
                    v-else-if="items[index].code"
                    class="w-full min-w-0 rounded-(--shape-control) shadow-(--shadow-sm)"
                  >
                    <CodeBlock
                      :tabs="sampleTabs(items[index].code)"
                      show-line-numbers
                      v-bind="{ animateLines: true }"
                      :copy-aria-label="items[index].code.copyAriaLabel || undefined"
                    />
                  </div>
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
        </StickyStack>
      </RegistrationFrame>
    </SectionModule>
  </section>
</template>

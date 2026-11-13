<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import MediaTile from '../../marketing/media-tile/media-tile.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import StickyStack from '../../marketing/sticky-stack/sticky-stack.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'

  defineOptions({
    name: 'FeatureScroll',
    inheritAttrs: false
  })

  /** The small action under a step's copy on the large layout. */
  export type FeatureScrollAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
  }

  /** One feature of the walkthrough: a step of the stack and a tile of the grid. */
  export type FeatureScrollItem = {
    /** The feature's heading, naming its step. */
    title: string
    /** One sentence explaining the feature. */
    description: string
    /** Registry name of the illustration pinned for this step and shown as the tile's media. */
    illustration: string
    /** Small secondary button under the step; `{ label, href, trailing? }`. Omitted when absent. */
    action?: FeatureScrollAction
  }

  interface Props {
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the large section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** The features, in order; each is `{ title, description, illustration, action? }` where `illustration` is a registry name and `action` is `{ label, href, trailing? }` rendered as a small secondary button under the step. */
    items?: FeatureScrollItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    items: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-feature-scroll'
  )

  const hasItems = computed(() => props.items.length > 0)

  const hasHeader = computed(() => props.title.length > 0)
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="title || undefined"
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

      <FrameBox
        flush
        borders="y"
        marks="bottom"
        class="lg:hidden"
      >
        <CardGrid
          flush
          kind="frame"
          :columns="3"
        >
          <CardGridCell
            v-for="item in items"
            :key="item.title"
            kind="canvas"
            :padded="false"
          >
            <MediaTile
              kind="plain"
              :title="item.title"
              :description="item.description"
            >
              <template #media>
                <Illustration :name="item.illustration" />
              </template>
            </MediaTile>
          </CardGridCell>
        </CardGrid>
      </FrameBox>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
        class="hidden lg:block [--sticky-stack-top:3.5rem] [--sticky-stack-height:min(40rem,calc(100dvh-3.5rem))] [--sticky-stack-align:stretch] [--sticky-stack-frame-border:1px]"
      >
        <StickyStack :items="items">
          <template #media="{ index }">
            <div class="contents">
              <div
                class="relative h-[30rem] w-full min-w-0 overflow-hidden rounded-(--shape-card) bg-(--bg-surface) lg:absolute lg:inset-0 lg:h-auto lg:rounded-none lg:border-0 [background-clip:var(--illustration-rim-boxes)] [background-image:linear-gradient(var(--bg-surface),var(--bg-surface)),var(--illustration-rim),linear-gradient(var(--bg-surface),var(--bg-surface))] [background-origin:var(--illustration-rim-boxes)] [border:var(--illustration-rim-width-hairline)_solid_transparent]"
              >
                <TextureMaterial
                  kind="dots"
                  size="small"
                  class="opacity-40"
                />
                <div
                  class="relative z-10 flex h-full w-full items-center justify-center p-(--spacing-md) lg:p-(--spacing-xl)"
                >
                  <div class="w-full min-w-0">
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
              kind="secondary"
              size="small"
              :icon="items[index].action.trailing ? 'pi pi-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(items[index].action.trailing)"
            />
          </template>
        </StickyStack>
      </FrameBox>
    </SectionModule>
  </section>
</template>

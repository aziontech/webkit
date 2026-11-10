<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Illustration from '../../content/illustration/illustration.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import MediaTile from '../../marketing/media-tile/media-tile.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'FeatureTiles',
    inheritAttrs: false
  })

  /** Layout of the grid. */
  export type FeatureTilesKind = 'artwork' | 'illustrated'

  /** One reason, rendered as a frame cell. */
  export type FeatureTilesTile = {
    /** Heading of the tile, the run-in lead of its caption. */
    title: string
    /** One sentence continuing the caption after the lead. */
    description: string
    /** URL of the picture shown above the caption. */
    image?: string
    /** Registry name of the illustration drawn fluid above the caption, instead of `image`. */
    illustration?: string
    /** Scale of the illustration inside its frame, around its centre. */
    scale?: number
  }

  interface Props {
    /** Layout of the grid: `artwork` is four columns with marks on every corner, `illustrated` three columns with marks on the bottom rule. */
    kind?: FeatureTilesKind
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the centered section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** The tiles rendered as frame cells, in order; each is `{ title, description, image?, illustration?, scale? }` where `image` is a picture URL, `illustration` a registry name drawn fluid, and `scale` its media scale. */
    tiles?: FeatureTilesTile[]
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'artwork',
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    tiles: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-feature-tiles'
  )

  const hasTitle = computed(() => props.title.length > 0)
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :data-kind="kind"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      v-if="tiles.length > 0"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasTitle"
        #header
      >
        <SectionTitle
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        :marks="kind === 'artwork' ? 'all' : 'bottom'"
      >
        <CardGrid
          flush
          kind="frame"
          :columns="kind === 'artwork' ? 4 : 3"
        >
          <CardGridCell
            v-for="tile in tiles"
            :key="tile.title"
            kind="canvas"
            :padded="false"
          >
            <MediaTile
              key="media-tile-1"
              v-if="tile.illustration"
              kind="plain"
              :title="tile.title"
              :description="tile.description"
              :media-scale="tile.scale ?? 1"
              fluid
            >
              <template #media>
                <Illustration :name="tile.illustration" />
              </template>
            </MediaTile>
            <MediaTile
              key="media-tile-2"
              v-else
              kind="plain"
              :title="tile.title"
              :description="tile.description"
              :src="tile.image"
            />
          </CardGridCell>
        </CardGrid>
      </FrameBox>
    </SectionModule>
  </section>
</template>

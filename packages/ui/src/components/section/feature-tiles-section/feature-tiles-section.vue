<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Illustration from '../../content/illustration/illustration.vue'
  import CardGrid from '../../layout/card-grid/card-grid.vue'
  import CardGridCell from '../../layout/card-grid/card-grid-cell/card-grid-cell.vue'
  import MediaTile from '../../marketing/media-tile/media-tile.vue'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'FeatureTilesSection',
    inheritAttrs: false
  })

  /** Layout of the grid. */
  export type FeatureTilesSectionVariant = 'artwork' | 'illustrated'

  /** One reason, rendered as a frame cell. */
  export type FeatureTilesSectionTile = {
    /** Heading of the tile, the run-in lead of its caption. */
    title: string
    /** One sentence continuing the caption after the lead. */
    description: string
    /** Registry name of the illustration drawn fluid above the caption; the tile renders no media without it. */
    illustration?: string
    /** Scale of the illustration inside its frame, around its centre. */
    scale?: number
  }

  export interface FeatureTilesSectionProps {
    /** Layout of the grid: `artwork` is four columns with marks on every corner, `illustrated` three columns with marks on the bottom rule. */
    variant?: FeatureTilesSectionVariant
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the centered section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /**
     * The tiles rendered as frame cells, in order; each is `{ title, description, illustration?,
     * scale? }` where `illustration` is a registry name drawn fluid above the caption, and
     * `scale` its media scale.
     */
    tiles?: FeatureTilesSectionTile[]
  }

  withDefaults(defineProps<FeatureTilesSectionProps>(), {
    variant: 'artwork',
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    tiles: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feature-tiles-section'
  )
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="variant"
    :anchor="anchor"
    :label="title"
    :filled="tiles.length > 0"
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
    :marks="variant === 'artwork' ? 'all' : 'bottom'"
  >
    <CardGrid
      flush
      variant="frame"
      :columns="variant === 'artwork' ? 4 : 3"
    >
      <CardGridCell
        v-for="tile in tiles"
        :key="tile.title"
        variant="canvas"
        :padded="false"
      >
        <MediaTile
          key="media-tile-1"
          v-if="tile.illustration"
          variant="plain"
          :title="tile.title"
          :description="tile.description"
          :media-scale="tile.scale ?? 1"
          fluid
        >
          <template #media>
            <div
              v-if="variant === 'artwork'"
              class="aspect-170/128"
            >
              <Illustration
                :name="tile.illustration"
                class="h-full!"
              />
            </div>
            <Illustration
              v-else
              :name="tile.illustration"
            />
          </template>
        </MediaTile>
        <MediaTile
          key="media-tile-2"
          v-else
          variant="plain"
          :title="tile.title"
          :description="tile.description"
        />
      </CardGridCell>
    </CardGrid>
  </SectionBand>
</template>

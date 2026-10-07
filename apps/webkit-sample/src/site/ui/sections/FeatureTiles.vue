<script setup lang="ts">
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTile from '@aziontech/webkit/media-tile'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'

  defineOptions({ name: 'FeatureTiles' })

  /** artwork: four tiles, each picture an image file, under an optional band title; illustrated: three tiles, each picture a registered illustration. */
  export type FeatureTilesKind = 'artwork' | 'illustrated'

  export interface FeatureTile {
    /** The tile's bold run-in lead. */
    title: string
    /** The sentence after the lead. */
    description: string
    /** URL of the picture, for the artwork kind. */
    src?: string
    /** Alternative text for the artwork picture; empty keeps it decorative. */
    alt?: string
    /** Registered illustration name, for the illustrated kind. */
    illustration?: string
    /** Scale of the illustration inside its frame. */
    scale?: number
  }

  interface Props {
    /** Which picture each tile carries. */
    kind?: FeatureTilesKind
    /** Overline above the band title. */
    eyebrow?: string
    /** Band title over the tiles; without one the band has no header. */
    title?: string
    /** One or two sentences under the band title. */
    description?: string
    /** The tiles, in row order. */
    tiles: FeatureTile[]
    /** Id of the band, for in-page links; the illustrated kind falls back to why-pricing. */
    anchor?: string
  }

  withDefaults(defineProps<Props>(), {
    kind: 'artwork',
    eyebrow: '',
    title: '',
    description: '',
    anchor: ''
  })
</script>

<template>
  <SectionModule
    :id="anchor || (kind === 'illustrated' ? 'why-pricing' : undefined)"
    :divided="false"
    :padded="false"
  >
    <template
      v-if="title"
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
            v-if="kind === 'artwork'"
            kind="plain"
            :src="tile.src ?? ''"
            :alt="tile.alt ?? ''"
            :title="tile.title"
            :description="tile.description"
          />
          <MediaTile
            v-else
            kind="plain"
            :title="tile.title"
            :description="tile.description"
            :media-scale="tile.scale ?? 1"
            fluid
          >
            <template #media>
              <Illustration :name="tile.illustration ?? ''" />
            </template>
          </MediaTile>
        </CardGridCell>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>

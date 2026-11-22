<script setup lang="ts">
  import Hint from '@aziontech/webkit/hint'
  import StatTile, { type StatTileVariant } from '@aziontech/webkit/stat-tile'

  /** One tile of the list. */
  export interface TileListItem {
    /** Stable key. */
    id: string
    /** The tile label. */
    label: string
    /** The figure for the period. */
    value: number
    /** Writes the figure. */
    formatValue: (value: number) => string
    /** Change against the previous period, in percent. */
    delta: number
    /** The sparkline, one value per interval. */
    trend: number[]
    /** A rise is a regression. */
    inverse?: boolean
    /** One sentence that defines the figure; empty hides the hint. */
    description?: string
  }

  /** How many tiles share a row on the widest screens. */
  export type TileListColumns = 3 | 4 | 6

  export interface TileListProps {
    /** The tiles, in the order they render. */
    tiles: TileListItem[]
    /** The comparison label of every delta. */
    comparison: string
    /** How many tiles share a row on the widest screens. */
    columns: TileListColumns
    /** The figure typeface. */
    variant?: StatTileVariant
  }

  withDefaults(defineProps<TileListProps>(), { variant: undefined })
</script>

<template>
  <ul
    class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2"
    :class="{
      'xl:grid-cols-3': columns === 3,
      'xl:grid-cols-4': columns === 4,
      'lg:grid-cols-3 2xl:grid-cols-6': columns === 6
    }"
  >
    <li
      v-for="tile in tiles"
      :key="tile.id"
      class="flex min-w-0 flex-col"
    >
      <StatTile
        :variant="variant"
        :label="tile.label"
        :value="tile.value"
        :format-value="tile.formatValue"
        :delta="tile.delta"
        :delta-label="comparison"
        :inverse="tile.inverse"
        :trend="tile.trend"
      >
        <template
          v-if="tile.description"
          #aside
        >
          <Hint :content="tile.description" />
        </template>
      </StatTile>
    </li>
  </ul>
</template>

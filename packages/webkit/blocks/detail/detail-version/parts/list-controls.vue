<script setup lang="ts">
  import type { TableExposed } from '@aziontech/webkit/data-table'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Tooltip from '@aziontech/webkit/tooltip'

  export interface ListControlsProps {
    /** The placeholder and accessible name of the search field. */
    searchLabel: string
    /** The table the Download CSV button exports; null until it mounts. */
    table: TableExposed | null
    /** The file name of the CSV export. */
    csvFilename: string
    /** When set, the row ends on an Open in Object Storage link to this address. */
    storageHref?: string
  }

  withDefaults(defineProps<ListControlsProps>(), { storageHref: '' })

  const search = defineModel<string>('search', { required: true })
</script>

<template>
  <header class="flex items-center gap-(--layout-group-gap)">
    <div class="flex min-w-36 grow basis-(--container-2xs)">
      <Input
        v-model="search"
        size="medium"
        :placeholder="searchLabel"
        :aria-label="searchLabel"
        class="w-full"
      >
        <template #leading>
          <i
            class="az az-search"
            aria-hidden="true"
          />
        </template>
      </Input>
    </div>
    <div class="flex shrink-0 items-center gap-(--spacing-xs)">
      <Tooltip
        content="Refresh"
        class="shrink-0"
      >
        <IconButton
          icon="az az-refresh"
          variant="outline"
          size="medium"
          aria-label="Refresh"
        />
      </Tooltip>
      <Tooltip
        content="Download CSV"
        class="shrink-0"
      >
        <IconButton
          icon="az az-download"
          variant="outline"
          size="medium"
          :disabled="!table"
          aria-label="Download CSV"
          @click="table?.exportCsv({ filename: csvFilename })"
        />
      </Tooltip>
      <Tooltip
        content="Columns"
        class="shrink-0"
      >
        <IconButton
          icon="az az-columns-3"
          variant="outline"
          size="medium"
          aria-label="Columns"
        />
      </Tooltip>
      <Tooltip
        v-if="storageHref"
        content="Open in Object Storage"
        class="shrink-0"
      >
        <IconButton
          icon="az az-external-link"
          variant="outline"
          size="medium"
          :href="storageHref"
          aria-label="Open in Object Storage"
        />
      </Tooltip>
    </div>
  </header>
</template>

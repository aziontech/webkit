<script setup lang="ts">
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableSearch from '@aziontech/webkit/table-search'
  import Tooltip from '@aziontech/webkit/tooltip'

  defineProps<{ loading: boolean; exportable: boolean }>()

  const search = defineModel<string>('search', { default: '' })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    download: [event: MouseEvent]
  }>()
</script>

<template>
  <div class="flex w-full items-center gap-(--spacing-xs)">
    <div class="flex flex-1">
      <TableSearch
        v-model="search"
        size="medium"
        placeholder="Search in folder"
        class="w-full"
      />
    </div>
    <Tooltip
      content="Refresh"
      class="shrink-0"
    >
      <IconButton
        icon="az az-refresh"
        variant="outline"
        size="medium"
        :loading="loading"
        aria-label="Refresh"
        @click="(event: MouseEvent) => emit('refresh', event)"
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
        :disabled="!exportable"
        aria-label="Download CSV"
        @click="(event: MouseEvent) => emit('download', event)"
      />
    </Tooltip>
    <CollectionPreferences
      :sections="['columns']"
      class="shrink-0"
    />
  </div>
</template>

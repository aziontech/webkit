<script setup lang="ts">
  import CollectionPreferences from '@aziontech/ui/collection-preferences'
  import IconButton from '@aziontech/ui/icon-button'
  import Input from '@aziontech/ui/input'
  import TableSearch from '@aziontech/ui/table-search'
  import Tooltip from '@aziontech/ui/tooltip'

  withDefaults(defineProps<{ loading: boolean; exportable: boolean; disabled?: boolean }>(), {
    disabled: false
  })

  const search = defineModel<string>('search', { default: '' })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    download: [event: MouseEvent]
  }>()
</script>

<template>
  <div class="flex w-full items-center gap-(--spacing-xs)">
    <div class="flex flex-1">
      <Input
        v-if="disabled"
        size="medium"
        placeholder="Search in folder"
        aria-label="Search the table"
        disabled
        class="w-full"
      >
        <template #leading>
          <i
            class="az az-search text-button-md"
            aria-hidden="true"
          />
        </template>
      </Input>
      <TableSearch
        v-else
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
        :disabled="disabled || !exportable"
        aria-label="Download CSV"
        @click="(event: MouseEvent) => emit('download', event)"
      />
    </Tooltip>
    <CollectionPreferences
      :sections="['columns']"
      :disabled="disabled"
      class="shrink-0"
    />
  </div>
</template>

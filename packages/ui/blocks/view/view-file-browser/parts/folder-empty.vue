<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import EmptyState from '@aziontech/ui/empty-state'
  import SplitButton, { type SplitButtonItem } from '@aziontech/ui/split-button'

  import { addToFilesActions } from '../lib/file-rows'

  defineProps<{ search: string }>()

  const emit = defineEmits<{
    'clear-search': [event: MouseEvent]
    add: [event: MouseEvent]
    'add-item': [event: MouseEvent | KeyboardEvent, item: SplitButtonItem]
  }>()
</script>

<template>
  <EmptyState
    key="empty-state-1"
    v-if="search"
    size="medium"
    icon="az az-search"
    title="No matching files"
    :description="`Nothing in this folder matches “${search}”.`"
  >
    <template #actions>
      <Button
        label="Clear search"
        variant="outline"
        size="small"
        @click="(event: MouseEvent) => emit('clear-search', event)"
      />
    </template>
  </EmptyState>
  <EmptyState
    key="empty-state-2"
    v-else
    size="medium"
    title="This folder is empty"
    description="Upload files or create a folder to get started."
  >
    <template #actions>
      <SplitButton
        label="Add to files"
        icon="az az-plus"
        variant="secondary"
        size="medium"
        :items="addToFilesActions"
        @click="(event: MouseEvent) => emit('add', event)"
        @item-click="(event, item) => emit('add-item', event, item)"
      />
    </template>
  </EmptyState>
</template>

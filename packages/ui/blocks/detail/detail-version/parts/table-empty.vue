<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import EmptyState from '@aziontech/ui/empty-state'

  export interface TableEmptyProps {
    /** The search term; when set, the state says nothing matches it and offers to clear it. */
    search: string
    /** The title when the search matches nothing. */
    noMatch: string
    /** The title when the version holds no record yet. */
    emptyTitle: string
    /** The glyph of the no-record state. */
    icon: string
    /** The label of the button that adds the first record. */
    emptyActionLabel: string
  }

  defineProps<TableEmptyProps>()

  const emit = defineEmits<{
    clear: [event: MouseEvent]
    add: [event: MouseEvent]
  }>()
</script>

<template>
  <EmptyState
    v-if="search.trim()"
    key="no-match"
    size="medium"
    icon="az az-search"
    :title="noMatch"
    :description="`Nothing matches ${search.trim()}.`"
  >
    <template #actions>
      <Button
        label="Clear search"
        variant="outline"
        size="small"
        @click="(event: MouseEvent) => emit('clear', event)"
      />
    </template>
  </EmptyState>
  <EmptyState
    v-else
    key="empty"
    size="medium"
    :icon="icon"
    :title="emptyTitle"
    description="Add the first one to this version."
  >
    <template #actions>
      <Button
        :label="emptyActionLabel"
        icon="az az-plus"
        variant="secondary"
        size="small"
        @click="(event: MouseEvent) => emit('add', event)"
      />
    </template>
  </EmptyState>
</template>

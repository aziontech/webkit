<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import PageHeader from '@aziontech/webkit/page-header'

  export interface ListTabHeaderProps {
    /** The tab title. */
    title: string
    /** One sentence on what the list holds. */
    description: string
    /** The label of the heading action. */
    actionLabel: string
    /** The glyph of the heading action. */
    actionIcon: string
  }

  defineProps<ListTabHeaderProps>()

  const emit = defineEmits<{
    action: [event: MouseEvent]
  }>()
</script>

<template>
  <PageHeader
    :title="title"
    :description="description"
    size="small"
  >
    <template #actions>
      <Button
        :label="actionLabel"
        variant="outline"
        size="medium"
        :icon="actionIcon"
        @click="(event: MouseEvent) => emit('action', event)"
      />
    </template>
  </PageHeader>
</template>

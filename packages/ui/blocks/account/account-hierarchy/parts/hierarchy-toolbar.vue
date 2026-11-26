<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import IconButton from '@aziontech/ui/icon-button'
  import Tooltip from '@aziontech/ui/tooltip'

  export interface HierarchyToolbarProps {
    /** The prefix of the ids the toolbar points at. */
    uid: string
    /** How many resources are selected. */
    selectedCount: number
    /** A refresh is in flight. */
    refreshing: boolean
    /** The details panel has something to show; false hides its toggle (a failed load). */
    detailsAvailable: boolean
  }

  defineProps<HierarchyToolbarProps>()

  const detailsOpen = defineModel<boolean>('detailsOpen', { required: true })

  const emit = defineEmits<{
    move: []
    labels: []
    delete: []
    refresh: [event: MouseEvent]
  }>()
</script>

<template>
  <div
    role="group"
    aria-label="Resource actions"
    class="layout-section-start flex flex-wrap items-center gap-(--spacing-xs)"
  >
    <Button
      label="Create Group"
      icon="az az-folder"
      variant="outline"
      size="medium"
      href="/account/resources/new-group"
    />
    <span
      class="mx-(--spacing-2xs) h-(--size-5) w-px bg-(--border-muted)"
      aria-hidden="true"
    />
    <Button
      label="Move"
      icon="az az-arrow-right-left"
      variant="outline"
      size="medium"
      :disabled="!selectedCount"
      @click="emit('move')"
    />
    <Button
      label="Labels"
      icon="az az-tag"
      variant="outline"
      size="medium"
      :disabled="!selectedCount"
      @click="emit('labels')"
    />
    <Button
      label="Delete"
      icon="az az-trash"
      variant="outline"
      size="medium"
      :disabled="!selectedCount"
      @click="emit('delete')"
    />
    <div class="ms-auto flex items-center gap-(--spacing-xs)">
      <Tooltip content="Refresh">
        <IconButton
          icon="az az-refresh"
          variant="outline"
          size="medium"
          :loading="refreshing"
          aria-label="Refresh resources"
          @click="emit('refresh', $event)"
        />
      </Tooltip>
      <Button
        v-if="detailsAvailable"
        :label="detailsOpen ? 'Hide details' : 'Show details'"
        :icon="detailsOpen ? 'az az-eye-off' : 'az az-eye'"
        variant="ghost"
        size="medium"
        :aria-expanded="detailsOpen"
        :aria-controls="`${uid}-details`"
        @click="detailsOpen = !detailsOpen"
      />
    </div>
  </div>
</template>

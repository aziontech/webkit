<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  defineProps<{ selectedCount: number; movableSelection: boolean }>()

  const emit = defineEmits<{
    clear: [event: MouseEvent]
    move: [event: MouseEvent]
  }>()
</script>

<template>
  <div
    class="flex w-full flex-wrap items-center gap-(--spacing-xs) rounded-(--shape-control) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
  >
    <span class="text-label-sm text-(--text-default)">{{ selectedCount }} selected</span>
    <Button
      label="Clear selection"
      variant="ghost"
      size="small"
      @click="(event: MouseEvent) => emit('clear', event)"
    />
    <div class="ms-auto flex items-center gap-(--spacing-xs)">
      <Button
        label="Move"
        icon="az az-arrow-right-left"
        variant="outline"
        size="small"
        :disabled="!movableSelection"
        @click="(event: MouseEvent) => emit('move', event)"
      />
    </div>
  </div>
</template>

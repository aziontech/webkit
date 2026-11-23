<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  import type { FileRow } from '../lib/file-rows'

  defineProps<{ item: FileRow; value: string }>()

  const emit = defineEmits<{
    'go-up': [event: MouseEvent]
    open: [event: MouseEvent, item: FileRow]
  }>()
</script>

<template>
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <i
      v-if="item.kind === 'parent'"
      class="az az-folder-open shrink-0 text-body-lg text-(--text-muted)"
      aria-hidden="true"
    />
    <i
      v-else-if="item.kind === 'folder'"
      class="az az-folder shrink-0 text-body-lg text-(--text-link)"
      aria-hidden="true"
    />
    <i
      v-else
      :class="item.icon"
      class="shrink-0 text-body-lg text-(--text-muted)"
      aria-hidden="true"
    />
    <Button
      key="button-1"
      v-if="item.kind === 'parent'"
      variant="link"
      label=".."
      aria-label="Go up to the parent folder"
      @click.stop="(event: MouseEvent) => emit('go-up', event)"
    />
    <Button
      key="button-2"
      v-else-if="item.kind === 'folder'"
      variant="link"
      :label="value"
      dir="ltr"
      class="min-w-0"
      @click.stop="(event: MouseEvent) => emit('open', event, item)"
    />
    <span
      v-else
      dir="ltr"
      class="truncate"
      >{{ value }}</span
    >
  </div>
</template>

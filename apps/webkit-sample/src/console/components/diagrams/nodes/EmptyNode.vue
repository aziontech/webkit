<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import { Handle, Position } from '@vue-flow/core'

  interface Props {
    id: string
    data: Record<string, unknown>
  }

  defineProps<Props>()

  const emit = defineEmits<{
    bind: []
  }>()
</script>

<template>
  <div
    class="flex w-(--size-52) flex-col gap-(--spacing-xs) rounded-(--shape-elements) border border-dashed border-(--border-strong) bg-(--bg-surface) p-(--spacing-sm) text-left transition-colors duration-150 ease-out hover:border-(--primary) motion-reduce:transition-none"
  >
    <Handle
      v-if="data.target"
      type="target"
      :position="Position.Left"
      :connectable="false"
    />

    <div class="flex items-center gap-(--spacing-xs)">
      <span
        class="flex size-6 shrink-0 items-center justify-center rounded-(--shape-elements) border border-dashed border-(--border-default) text-(--text-muted)"
      >
        <i
          :class="data.icon"
          class="text-body-xs"
          aria-hidden="true"
        />
      </span>
      <span class="truncate text-body-sm text-(--text-default)">{{ data.title }}</span>
    </div>

    <p class="text-body-xs text-(--text-muted)">{{ data.description }}</p>

    <Button
      class="nodrag w-full"
      type="button"
      :label="data.ctaLabel"
      kind="secondary"
      size="small"
      icon="pi pi-plus"
      @click="(event) => emit('bind', event, id)"
    />

    <Handle
      key="handle-2"
      v-if="data.source"
      type="source"
      :position="Position.Right"
      :connectable="false"
    />
  </div>
</template>

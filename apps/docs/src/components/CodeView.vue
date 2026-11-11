<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'

  import type { Highlighted } from '../lib/types'
  import RawHtml from './RawHtml.vue'

  withDefaults(defineProps<{ source: Highlighted; label?: string; tall?: boolean }>(), {
    label: '',
    tall: false
  })
</script>

<template>
  <div
    class="docs-code relative overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <div
      class="flex items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xxs)"
    >
      <span class="truncate text-label-code-sm text-(--text-muted)">{{ label }}</span>
      <CopyButton
        :value="source.code"
        size="small"
      />
    </div>
    <div
      :class="['overflow-auto', tall ? 'max-h-[40rem]' : 'max-h-[24rem]']"
      tabindex="0"
      role="region"
      :aria-label="label || 'Source'"
    >
      <RawHtml :html="source.html" />
    </div>
  </div>
</template>

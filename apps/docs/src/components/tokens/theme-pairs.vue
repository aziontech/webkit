<script setup lang="ts">
  import { messages } from '../../lib/i18n'
  import type { Token } from '../../lib/types'
  import CopyChip from './copy-chip.vue'

  defineProps<{ tokens: Token[] }>()

  const t = messages
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-sm) md:grid-cols-2">
    <div
      v-for="mode in ['light', 'dark'] as const"
      :key="mode"
      :data-theme="mode"
      class="flex flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) p-(--spacing-sm) text-(--text-default)"
    >
      <p class="text-overline-sm text-(--text-muted)">{{ mode === 'light' ? t.light : t.dark }}</p>
      <ul class="flex flex-col gap-(--spacing-2xs)">
        <li
          v-for="token in tokens"
          :key="token.name"
          class="flex min-w-0 items-center gap-(--spacing-xs)"
        >
          <span
            class="size-6 shrink-0 rounded-(--shape-control) border border-(--border-default)"
            :style="{ background: `var(${token.name})` }"
            aria-hidden="true"
          />
          <CopyChip :value="token.name" />
          <code class="ms-auto shrink-0 text-label-code-sm text-(--text-muted)">{{
            (mode === 'light' ? token.value : token.dark) ?? token.value
          }}</code>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Token } from '../lib/types'

  defineProps<{
    tokens: Token[]
    sample: 'swatch' | 'bar' | 'radius' | 'shadow' | 'none'
    showDark?: boolean
  }>()
</script>

<template>
  <ul class="grid grid-cols-1 gap-(--spacing-xs) sm:grid-cols-2 xl:grid-cols-3">
    <li
      v-for="token in tokens"
      :key="token.name"
      class="flex min-w-0 items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) p-(--spacing-xs)"
    >
      <span
        v-if="sample === 'swatch'"
        class="size-10 shrink-0 rounded-(--shape-elements) border border-(--border-default)"
        :style="{ background: `var(${token.name})` }"
        aria-hidden="true"
      />
      <span
        v-else-if="sample === 'bar'"
        class="h-4 shrink-0 rounded-(--shape-flat) bg-(--primary)"
        :style="{ width: `min(var(${token.name}), 6rem)`, minWidth: '2px' }"
        aria-hidden="true"
      />
      <span
        v-else-if="sample === 'radius'"
        class="size-10 shrink-0 border-2 border-(--primary) bg-(--bg-surface)"
        :style="{ borderRadius: `var(${token.name})` }"
        aria-hidden="true"
      />
      <span
        v-else-if="sample === 'shadow'"
        class="size-10 shrink-0 rounded-(--shape-elements) bg-(--bg-surface-raised)"
        :style="{ boxShadow: `var(${token.name})` }"
        aria-hidden="true"
      />
      <span class="flex min-w-0 flex-col">
        <code class="truncate text-label-code-sm text-(--text-default)">{{ token.name }}</code>
        <code class="truncate text-label-code-sm text-(--text-muted)">{{ token.value }}</code>
        <code
          v-if="showDark && token.dark"
          class="truncate text-label-code-sm text-(--text-muted)"
          >dark: {{ token.dark }}</code
        >
      </span>
    </li>
  </ul>
</template>

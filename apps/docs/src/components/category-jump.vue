<script setup lang="ts">
  import { messages } from '../lib/i18n'

  defineProps<{ groups: { id: string; label: string; count: number }[] }>()

  const t = messages
</script>

<template>
  <nav
    v-if="groups.length > 1"
    :aria-label="t.jumpToCategory"
    class="-mx-(--spacing-md) overflow-x-auto border-b border-(--border-default) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xs) md:sticky md:top-14 md:z-10 md:overflow-visible lg:-mx-(--spacing-xl) lg:px-(--spacing-xl)"
  >
    <ul class="flex gap-(--spacing-2xs) md:flex-wrap">
      <li
        v-for="group in groups"
        :key="group.id"
        class="shrink-0"
      >
        <a
          :href="`#category-${group.id}`"
          data-docs-category-chip
          class="inline-flex min-h-8 items-center gap-(--spacing-2xs) rounded-(--shape-button) border border-(--border-default) px-(--spacing-xs) text-label-sm whitespace-nowrap text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance pointer-coarse:min-h-10 hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none motion-reduce:transition-none"
        >
          {{ group.label }}
          <span class="text-body-xs text-(--text-muted)">{{ group.count }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

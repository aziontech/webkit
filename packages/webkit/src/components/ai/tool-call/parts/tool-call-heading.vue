<script setup lang="ts">
  defineOptions({ name: 'ToolCallHeading' })

  interface Props {
    /** Readable title shown before the name; empty shows the name alone. */
    title: string
    /** Identifier of the tool or agent, set in code type. */
    name: string
  }

  defineProps<Props>()
</script>

<template>
  <span
    class="flex min-w-0 flex-1 flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs)"
  >
    <span
      v-if="title"
      class="line-clamp-2 min-w-0 text-label-sm break-words text-(--text-default)"
    >
      {{ title }}
    </span>
    <code
      dir="ltr"
      class="max-w-full truncate rounded-(--shape-control) bg-(--bg-surface-raised) px-1 text-label-code-sm text-(--text-muted)"
      >{{ name }}</code
    >
  </span>
</template>

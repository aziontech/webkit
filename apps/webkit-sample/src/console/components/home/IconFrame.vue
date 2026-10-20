<script setup lang="ts">
  interface Props {
    icon?: string
  }

  withDefaults(defineProps<Props>(), {
    icon: ''
  })

  defineSlots<{
    default(): unknown
  }>()
</script>

<template>
  <span
    class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
  >
    <slot>
      <i
        :class="icon"
        class="text-body-lg leading-none text-(--text-default)"
        aria-hidden="true"
      />
    </slot>
  </span>
</template>

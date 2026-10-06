<script setup lang="ts">
  interface Props {
    size?: 'small' | 'medium'
  }

  withDefaults(defineProps<Props>(), {
    size: 'medium'
  })
</script>

<template>
  <span
    :data-size="size"
    class="flex shrink-0 items-center justify-center data-[size=small]:size-4 data-[size=medium]:size-5"
  >
    <span
      :data-size="size"
      class="flex items-center justify-center rounded-full bg-(--success) data-[size=small]:size-3.5 data-[size=medium]:size-4"
    >
      <i
        :data-size="size"
        class="pi pi-check leading-none text-(--success-contrast) data-[size=small]:text-body-xs data-[size=medium]:text-body-xs"
        aria-hidden="true"
      />
    </span>
  </span>
</template>

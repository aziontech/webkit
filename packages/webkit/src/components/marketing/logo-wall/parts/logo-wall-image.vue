<script setup lang="ts">
  import type { LogoWallItem } from '../logo-wall.vue'

  defineOptions({ name: 'LogoWallImage' })

  interface Props {
    /** The company mark to draw. */
    item: LogoWallItem
  }

  defineProps<Props>()
</script>

<template>
  <img
    :src="item.src"
    :alt="item.alt"
    :data-shape="item.shape ?? 'wide'"
    loading="lazy"
    decoding="async"
    class="h-5 w-auto max-w-full object-contain data-[shape=compact]:h-7 sm:max-w-24"
  />
</template>

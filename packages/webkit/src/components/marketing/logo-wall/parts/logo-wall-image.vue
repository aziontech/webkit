<script setup lang="ts">
  import type { LogoWallItem } from '../logo-wall.vue'

  defineOptions({ name: 'LogoWallImage' })

  interface Props {
    /** The company mark to draw. */
    item: LogoWallItem
  }

  defineProps<Props>()

  const IMAGE_CLASS = 'h-5 w-auto max-w-full object-contain data-[shape=compact]:h-7 sm:max-w-24'
</script>

<template>
  <img
    :src="item.src"
    :alt="item.alt"
    :data-shape="item.shape ?? 'wide'"
    :data-theme-file="item.srcDark ? 'light' : undefined"
    loading="lazy"
    decoding="async"
    :class="IMAGE_CLASS"
    class="data-[theme-file=light]:[[data-theme=dark]_&]:hidden"
  />
  <img
    v-if="item.srcDark"
    :src="item.srcDark"
    :alt="item.alt"
    :data-shape="item.shape ?? 'wide'"
    data-theme-file="dark"
    loading="lazy"
    decoding="async"
    :class="IMAGE_CLASS"
    class="hidden [[data-theme=dark]_&]:block"
  />
</template>

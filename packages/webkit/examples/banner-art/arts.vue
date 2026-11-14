<script setup>
  import BannerArt from '@aziontech/webkit/banner-art'

  const arts = [
    { kind: 'globe', label: 'Globe' },
    { kind: 'map', label: 'Map' },
    { kind: 'network', label: 'Network' }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      v-for="item in arts"
      :key="item.kind"
      class="relative h-80 overflow-hidden border border-(--border-default) bg-(--bg-canvas)"
    >
      <BannerArt :kind="item.kind" />
      <p class="relative z-10 m-0 p-(--spacing-lg) text-heading-md text-(--text-default)">
        {{ item.label }}
      </p>
    </div>
  </div>
</template>

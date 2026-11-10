<script setup>
  import BarList from '@aziontech/webkit/bar-list'

  const items = [
    { name: '/home', value: 843 },
    { name: '/documentation', value: 384 },
    { name: '/blocks', value: 108 },
    { name: '/imprint', value: 46 },
    { name: '/cancellation', value: 3 }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <BarList
      aria-label="Top paths"
      :items="items"
    />
  </div>
</template>

<script setup>
  import BarList from '@aziontech/webkit/bar-list'
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <BarList
      aria-label="Top paths"
      error="The top paths could not be loaded. Try again in a moment."
    />
  </div>
</template>

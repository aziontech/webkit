<script setup lang="ts">
  // CANARY — must keep failing vuejs-accessibility/alt-text.
  // The image carries no alternative text.
  const logoUrl = '/logo.svg'
</script>

<template>
  <img :src="logoUrl" />
</template>

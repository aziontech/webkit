<script setup lang="ts">
  import CreateHub from '../create-hub.vue'
</script>

<template>
  <CreateHub
    connect-error="GitHub didn't connect. The authorization window closed before GitHub answered."
  />
</template>

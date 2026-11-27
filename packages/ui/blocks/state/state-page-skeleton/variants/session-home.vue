<script setup lang="ts">
  import SessionHeader from '../parts/session-header.vue'
  import SessionWire from '../parts/session-wire.vue'
</script>

<template>
  <div
    class="flex h-screen flex-col overflow-hidden bg-(--bg-canvas) animate-fade-in motion-reduce:animate-none"
  >
    <SessionHeader />

    <SessionWire page="home" />
  </div>
</template>

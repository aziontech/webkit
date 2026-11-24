<script setup lang="ts">
  import SessionHeader from '../parts/session-header.vue'
  import SessionWire from '../parts/session-wire.vue'
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    class="flex h-screen flex-col overflow-hidden bg-(--bg-canvas) animate-fade-in motion-reduce:animate-none"
  >
    <span class="sr-only">Session expired. Signing you out.</span>

    <SessionHeader />

    <SessionWire page="detail" />
  </div>
</template>

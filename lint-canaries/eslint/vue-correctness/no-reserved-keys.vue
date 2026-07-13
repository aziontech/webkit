<script lang="ts">
  // CANARY — must keep failing vue/no-reserved-keys.
  // `$refs` in data collides with Vue's own instance surface.
  export default {
    name: 'CanaryReservedKeys',
    data() {
      return {
        $refs: []
      }
    }
  }
</script>

<template>
  <span>reserved keys canary</span>
</template>

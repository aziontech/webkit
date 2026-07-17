<script lang="ts">
  // CANARY — must keep failing vue/no-dupe-keys.
  // The computed `label` collides with the prop of the same name.
  export default {
    name: 'CanaryDupeKeys',
    props: ['label'],
    computed: {
      label() {
        return 'shadowed'
      }
    }
  }
</script>

<template>
  <span>{{ label }}</span>
</template>

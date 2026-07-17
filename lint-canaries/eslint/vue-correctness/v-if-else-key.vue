<script setup lang="ts">
  // CANARY — must keep failing vue/v-if-else-key.
  // The same component in adjacent v-if / v-else branches has no per-branch key,
  // so Vue reuses the instance and state leaks across branches.
  import SplitButton from '@aziontech/webkit/split-button'

  const props = defineProps({
    editing: { type: Boolean, default: false }
  })
</script>

<template>
  <SplitButton v-if="props.editing" />
  <SplitButton
    v-else
    disabled
  />
</template>

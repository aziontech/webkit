<script setup lang="ts">
  // CANARY — must keep failing vue/require-default-prop.
  // The optional `kind` prop declares no default.
  const props = defineProps({
    kind: { type: String },
    disabled: { type: Boolean, default: false }
  })
</script>

<template>
  <button
    :data-kind="props.kind"
    :disabled="props.disabled"
    type="button"
  >
    Deploy
  </button>
</template>

<script setup lang="ts">
  // CANARY — must keep failing `prettier --check`.
  // Script content is not indented (vueIndentScriptAndStyle: true) and the
  // template puts several attributes on one line (singleAttributePerLine: true).
  const props = defineProps({ label: { type: String, default: 'Deploy' } })
</script>

<template>
  <button
    type="button"
    data-kind="primary"
    data-size="large"
    :title="props.label"
  >
    {{ props.label }}
  </button>
</template>

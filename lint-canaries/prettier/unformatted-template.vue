<script setup lang="ts">
// CANARY — must keep failing `prettier --check`.
// Script content is not indented (vueIndentScriptAndStyle: true) and the
// template puts several attributes on one line (singleAttributePerLine: true).
// This tree is listed in the root .prettierignore, so repo-wide
// `prettier --write` sweeps never "fix" it; the canary runner bypasses the
// ignore file with --ignore-path=/dev/null.
const props = defineProps({ label: { type: String, default: 'Deploy' } })
</script>

<template>
  <button type="button" data-kind="primary" data-size="large" :title="props.label">{{ props.label }}</button>
</template>

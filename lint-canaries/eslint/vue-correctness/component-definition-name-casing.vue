<script setup lang="ts">
  // CANARY — must keep failing vue/component-definition-name-casing.
  // Registered component name is camelCase instead of PascalCase.
  defineOptions({ name: 'splitButton' })
</script>

<template>
  <button type="button">Deploy</button>
</template>

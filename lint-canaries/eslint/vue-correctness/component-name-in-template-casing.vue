<script setup lang="ts">
  // CANARY — must keep failing vue/component-name-in-template-casing.
  // The imported component is used with a kebab-case tag instead of PascalCase.
  import SplitButton from '@aziontech/webkit/split-button'
</script>

<template>
  <split-button label="Deploy" />
</template>

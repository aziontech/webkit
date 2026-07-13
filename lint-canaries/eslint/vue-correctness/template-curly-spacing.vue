<script setup lang="ts">
  // CANARY — must keep failing vue/template-curly-spacing.
  // The rule extends the core template-curly-spacing rule into <template>
  // expressions: with the configured default ('never'), spaces inside a
  // template literal's ${ } are an error. (Mustache {{ }} spacing is a
  // different rule — vue/mustache-interpolation-spacing — not enabled here.)
  const label = 'Deploy'
</script>

<template>
  <span :title="`${label}`">{{ label }}</span>
</template>

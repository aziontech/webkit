<script setup>
  // CANARY — must keep failing vue/no-reserved-component-names.
  // `Teleport` is a Vue 3 built-in component name (disallowVue3BuiltInComponents).
  defineOptions({ name: 'Teleport' })
</script>

<template>
  <div>reserved component name</div>
</template>

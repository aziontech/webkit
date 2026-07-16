<script setup lang="ts">
  // CANARY — must keep failing vue/no-unused-vars.
  // `index` is declared in the v-for and never used in the template.
  const items = [
    { id: 1, label: 'One' },
    { id: 2, label: 'Two' }
  ]
</script>

<template>
  <ul>
    <li
      v-for="(item, index) in items"
      :key="item.id"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

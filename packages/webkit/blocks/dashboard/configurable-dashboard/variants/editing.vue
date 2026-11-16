<script setup lang="ts">
  import { ref } from 'vue'

  import ConfigurableDashboard from '../configurable-dashboard.vue'

  const editing = ref(true)
</script>

<template>
  <ConfigurableDashboard v-model:editing="editing" />
</template>

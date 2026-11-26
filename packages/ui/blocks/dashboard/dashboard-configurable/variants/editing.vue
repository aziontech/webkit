<script setup lang="ts">
  import { ref } from 'vue'

  import DashboardConfigurable from '../dashboard-configurable.vue'

  const editing = ref(true)
</script>

<template>
  <DashboardConfigurable v-model:editing="editing" />
</template>

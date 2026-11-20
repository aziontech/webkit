<script setup lang="ts">
  import { ref } from 'vue'

  import DashboardSwitcher from '../dashboard-switcher.vue'

  const view = ref('summary')
</script>

<template>
  <DashboardSwitcher v-model:view="view" />
</template>

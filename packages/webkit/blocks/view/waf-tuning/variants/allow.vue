<script setup lang="ts">
  import WafTuning from '../waf-tuning.vue'
</script>

<template>
  <WafTuning
    :default-selected-keys="['1005', '1201']"
    default-open
  />
</template>

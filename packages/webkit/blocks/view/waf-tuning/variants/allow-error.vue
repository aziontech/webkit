<script setup lang="ts">
  import WafTuning from '../waf-tuning.vue'
</script>

<template>
  <WafTuning
    :default-selection="['1005', '1201']"
    default-open
    allow-error="The allowed rules weren't created. Nothing changed in the rule set; try again."
  />
</template>

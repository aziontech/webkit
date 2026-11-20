<script setup lang="ts">
  import ViewWafTuning from '../view-waf-tuning.vue'
</script>

<template>
  <ViewWafTuning
    :default-selected-keys="['1005', '1201']"
    default-open
    allow-error="The allowed rules weren't created. Nothing changed in the rule set; try again."
  />
</template>

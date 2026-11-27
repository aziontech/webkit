<script setup lang="ts">
  import ViewRuleList from '../view-rule-list.vue'
</script>

<template>
  <ViewRuleList
    :default-edits="[
      { phase: 'request', id: 're-docs', to: 2 },
      { phase: 'request', id: 're-maintenance', active: true },
      { phase: 'response', id: 're-security-headers', to: 0 }
    ]"
    default-review-open
    save-error="The new order wasn't saved. The rules still run in the saved order; save again to apply it."
  />
</template>

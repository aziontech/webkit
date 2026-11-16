<script setup lang="ts">
  import Billing from '../billing.vue'
</script>

<template>
  <Billing
    :default-query="{
      tokens: [{ propertyKey: 'status', operator: '=', value: 'Overdue' }],
      operation: 'and'
    }"
  />
</template>

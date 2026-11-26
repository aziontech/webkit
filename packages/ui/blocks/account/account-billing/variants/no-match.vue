<script setup lang="ts">
  import AccountBilling from '../account-billing.vue'
</script>

<template>
  <AccountBilling
    :default-query="{
      tokens: [{ propertyKey: 'status', operator: '=', value: 'Overdue' }],
      operation: 'and'
    }"
  />
</template>

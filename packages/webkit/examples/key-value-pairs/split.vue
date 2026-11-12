<script setup>
  import Card from '@aziontech/webkit/card'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
</script>

<template>
  <Card
    title="Subscription Plan"
    class="max-w-(--container-xs)"
  >
    <template #content>
      <KeyValuePairs
        kind="split"
        aria-label="Subscription plan"
      >
        <KeyValuePairs.Item label="Plan Price">$0.00 / month</KeyValuePairs.Item>
        <KeyValuePairs.Item label="Billing Period">Nov 1, 2026 to Nov 30, 2026</KeyValuePairs.Item>
        <KeyValuePairs.Item label="Next Invoice">Dec 1, 2026</KeyValuePairs.Item>
        <KeyValuePairs.Item label="Payment Method" />
      </KeyValuePairs>
    </template>
  </Card>
</template>

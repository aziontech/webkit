<script setup>
  import Card from '@aziontech/webkit/card'
  import KeyValueList from '@aziontech/webkit/key-value-list'
</script>

<template>
  <Card
    title="Subscription Plan"
    class="max-w-(--container-xs)"
  >
    <template #default>
      <KeyValueList
        variant="split"
        aria-label="Subscription plan"
      >
        <KeyValueList.Item label="Plan Price">$0.00 / month</KeyValueList.Item>
        <KeyValueList.Item label="Billing Period">Nov 1, 2026 to Nov 30, 2026</KeyValueList.Item>
        <KeyValueList.Item label="Next Invoice">Dec 1, 2026</KeyValueList.Item>
        <KeyValueList.Item label="Payment Method" />
      </KeyValueList>
    </template>
  </Card>
</template>

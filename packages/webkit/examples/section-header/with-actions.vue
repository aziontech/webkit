<script setup>
  import Button from '@aziontech/webkit/button'
  import SectionHeader from '@aziontech/webkit/section-header'
</script>

<template>
  <SectionHeader
    title="Payment methods"
    description="Every card on the account. Invoices are charged to the default one."
    anchor="payment-methods"
  >
    <template #actions>
      <Button
        label="Add payment method"
        variant="outline"
        size="medium"
        icon="ai ai-plus"
      />
    </template>
  </SectionHeader>
</template>

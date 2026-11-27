<script setup>
  import Button from '@aziontech/ui/button'
  import Subheader from '@aziontech/ui/subheader'
</script>

<template>
  <Subheader
    title="Payment methods"
    description="Every card on the account. Invoices are charged to the default one."
    anchor="payment-methods"
  >
    <template #actions>
      <Button
        label="Add payment method"
        variant="outline"
        size="medium"
        icon="az az-plus"
      />
    </template>
  </Subheader>
</template>

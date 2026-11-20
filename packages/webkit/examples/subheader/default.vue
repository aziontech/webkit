<script setup>
  import Button from '@aziontech/webkit/button'
  import Subheader from '@aziontech/webkit/subheader'
</script>

<template>
  <Subheader
    title="Payment information"
    description="Where invoices are sent, and whether the plan renews on its own."
    anchor="payment-information"
  >
    <template #actions>
      <Button
        label="Update"
        variant="outline"
        size="medium"
      />
    </template>
  </Subheader>
</template>

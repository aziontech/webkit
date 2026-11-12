<script setup>
  import Button from '@aziontech/webkit/button'
  import SectionHeader from '@aziontech/webkit/section-header'
</script>

<template>
  <SectionHeader
    title="Payment information"
    description="Where invoices are sent, and whether the plan renews on its own."
    anchor="payment-information"
  >
    <template #actions>
      <Button
        label="Update"
        kind="outlined"
        size="medium"
      />
    </template>
  </SectionHeader>
</template>

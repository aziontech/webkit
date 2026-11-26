<script setup>
  import PaymentBrand from '@aziontech/webkit/payment-brand'
</script>

<template>
  <div class="flex items-center gap-(--spacing-sm)">
    <PaymentBrand brand="visa" />
    <span class="text-label-md text-(--text-default)">Ending in 4242</span>
  </div>
</template>

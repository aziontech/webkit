<script setup>
  import PaymentBrand from '@aziontech/webkit/payment-brand'

  const brands = ['Visa', 'Mastercard', 'American Express', 'Diners Club', 'JCB', 'Elo']
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      v-for="size in ['medium', 'small']"
      :key="size"
      class="flex flex-wrap items-center gap-(--spacing-sm)"
    >
      <PaymentBrand
        v-for="brand in brands"
        :key="brand"
        :brand="brand"
        :size="size"
      />
    </div>
  </div>
</template>

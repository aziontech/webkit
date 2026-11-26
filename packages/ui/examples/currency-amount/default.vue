<script setup>
  import CurrencyAmount from '@aziontech/webkit/currency-amount'
</script>

<template>
  <CurrencyAmount
    value="20"
    prefix="$"
    suffix="per month"
    size="small"
  />
</template>

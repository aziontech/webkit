<script setup>
  import CurrencyAmount from '@aziontech/webkit/currency-amount'
</script>

<template>
  <div class="flex flex-col items-start gap-6">
    <CurrencyAmount
      value="20"
      prefix="$"
      suffix="per month"
      size="small"
    />
    <CurrencyAmount
      value="20"
      prefix="$"
      suffix="per month"
      size="medium"
    />
    <CurrencyAmount
      value="20"
      prefix="$"
      suffix="per month"
      size="large"
    />
  </div>
</template>

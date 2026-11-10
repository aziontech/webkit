<script setup>
  import Currency from '@aziontech/webkit/currency'
</script>

<template>
  <div class="flex flex-col items-start gap-6">
    <Currency
      value="20"
      prefix="$"
      suffix="per month"
      size="small"
    />
    <Currency
      value="20"
      prefix="$"
      suffix="per month"
      size="medium"
    />
    <Currency
      value="20"
      prefix="$"
      suffix="per month"
      size="large"
    />
  </div>
</template>

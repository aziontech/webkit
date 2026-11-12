<script setup>
  import Ticker from '@aziontech/webkit/ticker'
</script>

<template>
  <Ticker
    label="Artwork optional"
    aria-label="Companies with and without a registered mark"
    :marks="['magalu', 'renner', 'iFood', 'dafiti', 'Zoop', 'netshoes']"
  />
</template>

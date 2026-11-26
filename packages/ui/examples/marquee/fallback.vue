<script setup>
  import Marquee from '@aziontech/webkit/marquee'
</script>

<template>
  <Marquee
    label="Artwork optional"
    aria-label="Companies with and without a registered mark"
    :marks="['magalu', 'renner', 'iFood', 'dafiti', 'Zoop', 'netshoes']"
  />
</template>

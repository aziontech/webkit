<script setup>
  import Ticker from '@aziontech/webkit/ticker'
</script>

<template>
  <Ticker
    label="Trusted by mission-critical workloads"
    aria-label="Companies running on Azion"
    :marks="[
      'global-fashion-group',
      'herospark',
      'itau',
      'nzn',
      'netshoes',
      'caixa',
      'agibank',
      'prime-video',
      'america-movil',
      'gpa',
      'fourbank'
    ]"
  />
</template>

<script setup>
  import Marquee from '@aziontech/ui/marquee'
</script>

<template>
  <Marquee
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

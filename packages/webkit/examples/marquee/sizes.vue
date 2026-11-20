<script setup>
  import Marquee from '@aziontech/webkit/marquee'
</script>

<template>
  <div class="flex flex-col gap-12">
    <Marquee
      size="medium"
      label="Medium — the marketing band"
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
    <Marquee
      size="small"
      label="Small — a column's floor"
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
  </div>
</template>

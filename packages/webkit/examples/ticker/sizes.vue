<script setup>
  import Ticker from '@aziontech/webkit/ticker'
</script>

<template>
  <div class="flex flex-col gap-12">
    <Ticker
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
    <Ticker
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

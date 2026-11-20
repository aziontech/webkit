<script setup>
  import Stats from '@aziontech/webkit/stats'
</script>

<template>
  <Stats
    :items="[
      { value: '120', suffix: '+', label: 'Data centers' },
      { value: '99.99', suffix: '%', label: 'Availability' },
      { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
      { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
    ]"
  />
</template>

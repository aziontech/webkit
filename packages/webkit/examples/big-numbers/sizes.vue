<script setup>
  import BigNumbers from '@aziontech/webkit/big-numbers'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <BigNumbers
      size="small"
      :items="[
        { value: '120', suffix: '+', label: 'Points of presence' },
        { value: '99.99', suffix: '%', label: 'Availability' },
        { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
        { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
      ]"
    />
    <BigNumbers
      size="medium"
      :items="[
        { value: '120', suffix: '+', label: 'Points of presence' },
        { value: '99.99', suffix: '%', label: 'Availability' },
        { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
        { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
      ]"
    />
    <BigNumbers
      size="large"
      :items="[
        { value: '120', suffix: '+', label: 'Points of presence' },
        { value: '99.99', suffix: '%', label: 'Availability' },
        { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
        { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
      ]"
    />
  </div>
</template>

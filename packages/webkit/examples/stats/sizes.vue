<script setup>
  import Stats from '@aziontech/webkit/stats'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-2xl)">
    <Stats
      size="small"
      :items="[
        { value: '120', suffix: '+', label: 'Data centers' },
        { value: '99.99', suffix: '%', label: 'Availability' },
        { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
        { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
      ]"
    />
    <Stats
      size="medium"
      :items="[
        { value: '120', suffix: '+', label: 'Data centers' },
        { value: '99.99', suffix: '%', label: 'Availability' },
        { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
        { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
      ]"
    />
    <Stats
      size="large"
      :items="[
        { value: '120', suffix: '+', label: 'Data centers' },
        { value: '99.99', suffix: '%', label: 'Availability' },
        { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
        { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
      ]"
    />
  </div>
</template>

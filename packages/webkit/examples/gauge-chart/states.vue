<script setup>
  import Alert from '@aziontech/webkit/alert'
  import GaugeChart from '@aziontech/webkit/gauge-chart'
  import { ref } from 'vue'

  const failed = ref(true)
  const formatValue = (value) => `${value}%`
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3">
    <GaugeChart
      loading
      aria-label="Cache hit ratio"
    />
    <GaugeChart
      :value="null"
      label="Cache hit ratio"
      empty-description="No request reached this application in the last hour."
    />
    <GaugeChart
      :value="failed ? null : 92"
      label="Cache hit ratio"
      :format-value="formatValue"
      :error="failed ? 'Could not load the cache hit ratio.' : ''"
    >
      <template #error>
        <Alert
          severity="danger"
          label="Could not load the cache hit ratio."
          action-label="Retry"
          @action="failed = false"
        />
      </template>
    </GaugeChart>
  </div>
</template>

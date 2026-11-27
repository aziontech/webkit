<script setup>
  import Button from '@aziontech/ui/button'
  import EmptyState from '@aziontech/ui/empty-state'
  import GaugeChart from '@aziontech/ui/gauge-chart'
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
        <div
          role="alert"
          class="w-full"
        >
          <EmptyState
            title="Could not load the cache hit ratio"
            description="The metrics service did not answer. Check your connection and try again."
            icon="az az-triangle-alert"
            size="small"
            bordered
          >
            <template #actions>
              <Button
                label="Try again"
                variant="secondary"
                size="small"
                icon="az az-refresh"
                @click="failed = false"
              />
            </template>
          </EmptyState>
        </div>
      </template>
    </GaugeChart>
  </div>
</template>

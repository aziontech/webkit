<script setup>
  import ToggleGroup from '@aziontech/webkit/toggle-group'

  const options = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ]
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <ToggleGroup
      :options="options"
      default-value="day"
      size="small"
      aria-label="Small"
    />
    <ToggleGroup
      :options="options"
      default-value="day"
      size="medium"
      aria-label="Medium"
    />
    <ToggleGroup
      :options="options"
      default-value="day"
      size="large"
      aria-label="Large"
    />
  </div>
</template>

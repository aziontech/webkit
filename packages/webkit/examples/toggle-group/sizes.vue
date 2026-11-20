<script setup>
  import ToggleGroup from '@aziontech/webkit/toggle-group'

  const options = [
    { label: 'Label', value: 'option-1' },
    { label: 'Label', value: 'option-2' },
    { label: 'Label', value: 'option-3' }
  ]
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <ToggleGroup
      :options="options"
      default-value="option-1"
      size="small"
      aria-label="Small"
    />
    <ToggleGroup
      :options="options"
      default-value="option-1"
      size="medium"
      aria-label="Medium"
    />
    <ToggleGroup
      :options="options"
      default-value="option-1"
      size="large"
      aria-label="Large"
    />
  </div>
</template>

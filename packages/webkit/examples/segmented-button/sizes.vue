<script setup>
  import SegmentedButton from '@aziontech/webkit/segmented-button'

  const options = [
    { label: 'Label', value: 'option-1' },
    { label: 'Label', value: 'option-2' },
    { label: 'Label', value: 'option-3' }
  ]
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <SegmentedButton
      :options="options"
      default-value="option-1"
      size="small"
      aria-label="Small"
    />
    <SegmentedButton
      :options="options"
      default-value="option-1"
      size="medium"
      aria-label="Medium"
    />
    <SegmentedButton
      :options="options"
      default-value="option-1"
      size="large"
      aria-label="Large"
    />
  </div>
</template>

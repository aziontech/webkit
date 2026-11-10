<script setup>
  import SegmentedButton from '@aziontech/webkit/segmented-button'

  const options = [
    { label: 'Create a new repository', value: 'new' },
    { label: 'Use an existing repository', value: 'existing' }
  ]
</script>

<template>
  <div class="flex w-[34rem] flex-col gap-4">
    <SegmentedButton
      :options="options"
      default-value="new"
      aria-label="Hug its labels"
    />
    <SegmentedButton
      :options="options"
      default-value="new"
      aria-label="Fill the row"
      fluid
    />
  </div>
</template>

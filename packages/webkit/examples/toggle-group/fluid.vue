<script setup>
  import ToggleGroup from '@aziontech/webkit/toggle-group'

  const options = [
    { label: 'Create a new repository', value: 'new' },
    { label: 'Use an existing repository', value: 'existing' }
  ]
</script>

<template>
  <div class="flex w-full max-w-[34rem] flex-col gap-4">
    <ToggleGroup
      :options="options"
      default-value="new"
      aria-label="Hug its labels"
    />
    <ToggleGroup
      :options="options"
      default-value="new"
      aria-label="Fill the row"
      fluid
    />
  </div>
</template>

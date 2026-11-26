<script setup>
  import Field from '@aziontech/ui/field'
  import Slider from '@aziontech/ui/slider'
  import { ref } from 'vue'

  const value = ref(40)
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <div class="flex items-center justify-between gap-(--spacing-xs)">
      <Field.Label>Alert threshold</Field.Label>
      <span
        class="text-body-sm text-(--text-default) tabular-nums"
        aria-hidden="true"
        >{{ value }}%</span
      >
    </div>
    <Slider
      v-model="value"
      :min="0"
      :max="100"
      :step="10"
      ticks
      unit="%"
    />
    <Field.Description>Alert when CPU use passes this level.</Field.Description>
  </Field>
</template>

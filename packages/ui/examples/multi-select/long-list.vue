<script setup>
  import MultiSelectContent from '@aziontech/ui/multi-select-content'
  import MultiSelectItem from '@aziontech/ui/multi-select-item'
  import MultiSelectRoot from '@aziontech/ui/multi-select-root'
  import MultiSelectTrigger from '@aziontech/ui/multi-select-trigger'
  import { ref } from 'vue'

  const value = ref([])
  const options = Array.from({ length: 40 }, (_, i) => ({
    value: `opt-${i + 1}`,
    label: `Option ${i + 1}`
  }))
</script>

<template>
  <div class="w-full max-w-70">
    <MultiSelectRoot
      aria-label="Options"
      v-model="value"
      placeholder="Pick several"
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <MultiSelectItem
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</MultiSelectItem
        >
      </MultiSelectContent>
    </MultiSelectRoot>
  </div>
</template>

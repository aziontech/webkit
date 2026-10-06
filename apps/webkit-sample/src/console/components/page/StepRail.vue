<script setup lang="ts">
  import Stepper from '@aziontech/webkit/stepper'

  interface Props {
    steps?: unknown[]
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    steps: () => [],
    ariaLabel: 'Steps'
  })

  const current = defineModel({ type: String, default: '' })
</script>

<template>
  <aside
    class="hidden h-full w-64 shrink-0 overflow-auto border-r border-(--border-default) px-(--spacing-md) py-(--layout-section-gap) md:block"
  >
    <Stepper
      v-model="current"
      :aria-label="ariaLabel"
      class="h-full"
    >
      <Stepper.Step
        v-for="entry in steps"
        :key="entry.value"
        :value="entry.value"
        :title="entry.title"
        :description="entry.value === current ? entry.description : ''"
        :state="entry.state"
        :disabled="entry.disabled"
      />
    </Stepper>
  </aside>
</template>

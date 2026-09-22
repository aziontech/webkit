<script setup>
  // THE STEP RAIL — the left column of every stepped create in this console, shared by
  // ./StepperCreatePage.vue (the spec-driven creates and the function) and ./WizardPage.vue
  // (the application and the workload), so the two flows cannot drift into two rails.
  //
  // It is the webkit Stepper and nothing else: the dot states, the numbering and the
  // connector that fills between completed steps all belong to the component. What this
  // file owns is where the rail SITS — a full-height column with its own border, hidden
  // below `md`, where the shells print "Step n of N" instead.
  import Stepper from '@aziontech/webkit/stepper'

  defineProps({
    /** The steps, already in rail shape: `{ value, title, description, state, disabled }`. */
    steps: { type: Array, default: () => [] },
    /** Accessible name for the rail — the flow's own title. */
    ariaLabel: { type: String, default: 'Steps' }
  })

  /** The value of the step showing now; two-way so the rail can move it. */
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

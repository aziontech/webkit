<script setup lang="ts">
  import Accordion, { type AccordionValue } from '@aziontech/webkit/accordion'
  import type { PopoverPlacementInput } from '@aziontech/webkit/popover'
  import Stepper, { type StepperStepState } from '@aziontech/webkit/stepper'
  import type { SortDirection, TableStateSnapshot } from '@aziontech/webkit/table'
  import { ref } from 'vue'

  const open = ref<AccordionValue>(null)
  const step = ref<string>('domain')
  const stateOf = (value: string): StepperStepState =>
    value === 'domain' ? 'complete' : 'upcoming'
  const placement: PopoverPlacementInput = 'auto'
  const direction: SortDirection = 'ascending'
  const snapshot: TableStateSnapshot = { globalFilter: '' }
  // @ts-expect-error a step state is one of the four states
  const wrong: StepperStepState = 'done'
</script>

<template>
  <Accordion v-model="open">
    <Accordion.Item value="general">
      <Accordion.Trigger>General</Accordion.Trigger>
      <Accordion.Content
        >{{ placement }} {{ direction }} {{ snapshot.globalFilter }} {{ wrong }}</Accordion.Content
      >
    </Accordion.Item>
  </Accordion>
  <Stepper v-model="step">
    <Stepper.Step
      value="domain"
      :state="stateOf('domain')"
    />
  </Stepper>
</template>

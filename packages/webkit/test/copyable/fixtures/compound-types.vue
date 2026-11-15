<script setup lang="ts">
  import Accordion, { type AccordionValue } from '@aziontech/webkit/accordion'
  import type { PopoverPlacementInput } from '@aziontech/webkit/popover'
  import Stepper, { type StepperStepStatus } from '@aziontech/webkit/stepper'
  import type { SortDirection, TableStateSnapshot } from '@aziontech/webkit/table'
  import { ref } from 'vue'

  const open = ref<AccordionValue>(null)
  const step = ref<string>('domain')
  const statusOf = (value: string): StepperStepStatus =>
    value === 'domain' ? 'success' : 'pending'
  const placement: PopoverPlacementInput = 'auto'
  const direction: SortDirection = 'ascending'
  const snapshot: TableStateSnapshot = { globalFilter: '' }
  // @ts-expect-error a step status is one of the four statuses
  const wrong: StepperStepStatus = 'done'
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
      :status="statusOf('domain')"
    />
  </Stepper>
</template>

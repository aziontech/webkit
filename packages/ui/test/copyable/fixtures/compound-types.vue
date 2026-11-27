<script setup lang="ts">
  import Accordion, { type AccordionValue } from '@aziontech/ui/accordion'
  import type { PopoverSide } from '@aziontech/ui/popover'
  import Stepper, { type StepperStepStatus } from '@aziontech/ui/stepper'
  import type { TableSortDirection, TableStateSnapshot } from '@aziontech/ui/table'
  import { ref } from 'vue'

  const open = ref<AccordionValue>(null)
  const step = ref<string>('domain')
  const statusOf = (value: string): StepperStepStatus =>
    value === 'domain' ? 'success' : 'pending'
  const placement: PopoverSide = 'end'
  const direction: TableSortDirection = 'ascending'
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

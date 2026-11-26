<script setup>
  import Stepper from '@aziontech/webkit/stepper'
  import { ref } from 'vue'

  const step = ref('host')
</script>

<template>
  <Stepper
    v-model="step"
    aria-label="Create network list"
  >
    <Stepper.Step
      value="host"
      title="Where it runs"
      description="The firewall that reads this list."
    />
    <Stepper.Step
      value="configure"
      title="Configure"
      description="Name it and add the addresses."
      disabled
    />
    <Stepper.Step
      value="rules"
      title="Rules"
      description="What the firewall does with a match."
      disabled
    />
    <Stepper.Step
      value="review"
      title="Review"
      description="Check the list before it goes live."
      disabled
    />
  </Stepper>
</template>

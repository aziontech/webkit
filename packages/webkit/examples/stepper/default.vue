<script setup>
  import Stepper from '@aziontech/webkit/stepper'
  import { ref } from 'vue'

  const step = ref('configure')
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
      state="complete"
    />
    <Stepper.Step
      value="configure"
      title="Configure"
      description="Name it and add the addresses."
    />
    <Stepper.Step
      value="rules"
      title="Rules"
      description="What the firewall does with a match."
    />
    <Stepper.Step
      value="review"
      title="Review"
      description="Check the list before it goes live."
    />
  </Stepper>
</template>

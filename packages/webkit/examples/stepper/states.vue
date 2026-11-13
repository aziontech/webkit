<script setup>
  import Stepper from '@aziontech/webkit/stepper'
  import { ref } from 'vue'

  const step = ref('configure')
</script>

<template>
  <Stepper
    v-model="step"
    aria-label="Step states"
  >
    <Stepper.Step
      value="host"
      title="Complete"
      description="The owner marked this step as answered."
      state="complete"
    />
    <Stepper.Step
      value="configure"
      title="Current"
      description="The step the reader is on."
    />
    <Stepper.Step
      value="addresses"
      title="Error"
      description="Two addresses are not valid IPv4 ranges."
      state="error"
    />
    <Stepper.Step
      value="rules"
      title="Loading"
      description="Checking the rules against the firewall."
      state="loading"
    />
    <Stepper.Step
      value="review"
      title="Upcoming"
      description="Not reached yet."
    />
  </Stepper>
</template>

<script setup>
  import Stepper from '@aziontech/webkit/stepper'
  import { ref } from 'vue'

  const step = ref('configure')
</script>

<template>
  <Stepper
    v-model="step"
    aria-label="Step statuses"
  >
    <Stepper.Step
      value="host"
      title="Complete"
      description="The owner marked this step as answered."
      status="success"
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
      status="error"
    />
    <Stepper.Step
      value="rules"
      title="Loading"
      description="Checking the rules against the firewall."
      status="running"
    />
    <Stepper.Step
      value="review"
      title="Upcoming"
      description="Not reached yet."
    />
  </Stepper>
</template>

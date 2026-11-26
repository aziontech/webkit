<script setup>
  import AgentActivity from '@aziontech/webkit/agent-activity'
  import Button from '@aziontech/webkit/button'
  import { computed, onBeforeUnmount, ref } from 'vue'

  const titles = [
    'Searching the docs',
    'Reading 3 files',
    'Checking the workload of app.example.com',
    'Writing the answer'
  ]

  const reached = ref(-1)
  let timer

  const steps = computed(() =>
    titles.map((title, index) => ({
      key: String(index),
      title,
      status: index < reached.value ? 'success' : index === reached.value ? 'running' : 'pending'
    }))
  )

  function start() {
    clearInterval(timer)
    reached.value = 0
    timer = setInterval(() => {
      reached.value += 1
      if (reached.value >= titles.length) clearInterval(timer)
    }, 1500)
  }

  onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col items-start gap-(--spacing-md)">
    <Button
      label="Run the agent"
      variant="secondary"
      size="medium"
      @click="start"
    />
    <AgentActivity
      v-if="reached >= 0"
      :steps="steps"
    />
  </div>
</template>

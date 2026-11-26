<script setup>
  import Reasoning from '@aziontech/webkit/reasoning'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const steps = [
    'Reading the error rate of the workload over the last hour.',
    'The 502 responses started at 14:05, when the origin certificate expired.',
    'Checking whether a renewed certificate is already uploaded.'
  ]

  const shown = ref([])
  const streaming = ref(true)
  let timer

  function stop() {
    clearInterval(timer)
    streaming.value = false
  }

  onMounted(() => {
    timer = setInterval(() => {
      if (shown.value.length < steps.length) shown.value = steps.slice(0, shown.value.length + 1)
      else stop()
    }, 1500)
  })
  onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <Reasoning
      :streaming="streaming"
      default-open
      skippable
      @skip="stop"
    >
      <p
        v-for="step in shown"
        :key="step"
      >
        {{ step }}
      </p>
    </Reasoning>
  </div>
</template>

<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import { onBeforeUnmount, ref } from 'vue'

  const prompt = ref('Why did my cache hit ratio drop?')
  const status = ref('ready')
  let timer

  function send() {
    prompt.value = ''
    status.value = 'pending'
    timer = setTimeout(() => {
      status.value = 'streaming'
      timer = setTimeout(() => (status.value = 'ready'), 4000)
    }, 800)
  }

  function stop() {
    clearTimeout(timer)
    status.value = 'ready'
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <PromptInput
      v-model="prompt"
      :status="status"
      @submit="send"
      @stop="stop"
    />
  </div>
</template>

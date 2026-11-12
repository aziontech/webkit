<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input'
  import { onBeforeUnmount, ref } from 'vue'

  const prompt = ref('Why did my cache hit ratio drop?')
  const state = ref('ready')
  let timer

  function send() {
    prompt.value = ''
    state.value = 'submitted'
    timer = setTimeout(() => {
      state.value = 'streaming'
      timer = setTimeout(() => (state.value = 'ready'), 4000)
    }, 800)
  }

  function stop() {
    clearTimeout(timer)
    state.value = 'ready'
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <PromptInput
      v-model="prompt"
      :state="state"
      @submit="send"
      @stop="stop"
    />
  </div>
</template>

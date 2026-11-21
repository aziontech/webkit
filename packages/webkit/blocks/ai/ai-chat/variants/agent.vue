<script setup lang="ts">
  import type { AiChatInterrupt } from '@aziontech/webkit/utils/ai-chat'
  import { ref } from 'vue'

  import AiChat from '../ai-chat.vue'
  import { sampleAgentInterrupts, sampleAgentMessages } from '../sample'

  const interrupts = ref<AiChatInterrupt[]>(
    sampleAgentInterrupts.map((interrupt) => ({
      ...interrupt,
      resolveInterrupt: () => settle(interrupt.id),
      cancel: () => settle(interrupt.id)
    }))
  )

  function settle(id: string | undefined) {
    interrupts.value = interrupts.value.filter((interrupt) => interrupt.id !== id)
  }
</script>

<template>
  <AiChat
    :messages="sampleAgentMessages"
    :interrupts="interrupts"
  />
</template>

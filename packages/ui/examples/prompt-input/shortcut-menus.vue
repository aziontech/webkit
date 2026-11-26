<script setup>
  import PromptInput from '@aziontech/ui/prompt-input-root'
  import { ref } from 'vue'

  const prompt = ref('')
  const references = ref([])
  const sent = ref(null)

  const menus = [
    {
      trigger: '/',
      label: 'Commands',
      options: [
        {
          value: 'explain',
          label: 'explain',
          description: 'Explain a configuration',
          icon: 'az az-circle-info'
        },
        {
          value: 'troubleshoot',
          label: 'troubleshoot',
          description: 'Find why a request failed',
          icon: 'az az-wrench'
        },
        {
          value: 'summarize',
          label: 'summarize',
          description: 'Summarize recent events',
          icon: 'az az-list'
        }
      ]
    },
    {
      trigger: '@',
      label: 'Resources',
      options: [
        { value: 'app-1', label: 'checkout-web', description: 'Application', icon: 'az az-box' },
        { value: 'fn-7', label: 'image-resize', description: 'Function', icon: 'az az-code' },
        { value: 'fw-2', label: 'login-protection', description: 'Firewall', icon: 'az az-shield' }
      ]
    }
  ]

  const send = (event, { value, references: attached }) => {
    sent.value = { text: value, references: attached.map((item) => `${item.trigger}${item.label}`) }
    prompt.value = ''
    references.value = []
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-md)">
    <PromptInput
      v-model="prompt"
      v-model:references="references"
      :menus="menus"
      placeholder="Type / for commands or @ to reference a resource"
      @submit="send"
    >
      <template #hint>/ opens commands, @ references a resource.</template>
    </PromptInput>
    <p
      v-if="sent"
      class="text-body-sm text-(--text-muted)"
    >
      Sent “{{ sent.text }}” with {{ sent.references.join(', ') || 'no references' }}.
    </p>
  </div>
</template>

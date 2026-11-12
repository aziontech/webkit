<script setup>
  import PromptInput from '@aziontech/webkit/prompt-input'
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
          icon: 'pi pi-info-circle'
        },
        {
          value: 'troubleshoot',
          label: 'troubleshoot',
          description: 'Find why a request failed',
          icon: 'pi pi-wrench'
        },
        {
          value: 'summarize',
          label: 'summarize',
          description: 'Summarize recent events',
          icon: 'pi pi-list'
        }
      ]
    },
    {
      trigger: '@',
      label: 'Resources',
      options: [
        { value: 'app-1', label: 'checkout-web', description: 'Application', icon: 'pi pi-box' },
        { value: 'fn-7', label: 'image-resize', description: 'Function', icon: 'pi pi-code' },
        { value: 'fw-2', label: 'login-protection', description: 'Firewall', icon: 'pi pi-shield' }
      ]
    }
  ]

  const send = (text, attached) => {
    sent.value = { text, references: attached.map((item) => `${item.trigger}${item.label}`) }
    prompt.value = ''
    references.value = []
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-md) pt-(--spacing-4xl)">
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

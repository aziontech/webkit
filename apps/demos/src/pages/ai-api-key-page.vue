<script setup lang="ts">
  import { ref, watch } from 'vue'

  import AiApiKey, {
    type AiApiKeySavedKey,
    type AiApiKeySaveValue,
    type AiApiKeyStatus
  } from '../blocks/ai-api-key.vue'

  const provider = ref('')
  const savedKeys = ref<AiApiKeySavedKey[]>([])
  const status = ref<AiApiKeyStatus>('pending')
  const saving = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(provider, () => {
    status.value = 'pending'
  })

  const onSave = (_event: Event, value: AiApiKeySaveValue) => {
    saving.value = true
    timer = setTimeout(() => {
      savedKeys.value = [
        ...savedKeys.value.filter((item) => item.provider !== value.provider),
        { provider: value.provider, masked: `••••${value.key.slice(-4)}` }
      ]
      saving.value = false
    }, 600)
  }

  const onTest = () => {
    status.value = 'running'
    clearTimeout(timer)
    timer = setTimeout(() => {
      status.value = 'success'
    }, 900)
  }

  const onRemove = (_event: MouseEvent, removed: string) => {
    savedKeys.value = savedKeys.value.filter((item) => item.provider !== removed)
    status.value = 'pending'
  }
</script>

<template>
  <AiApiKey
    v-model:provider="provider"
    :saved-keys="savedKeys"
    :status="status"
    :loading="saving"
    @save="onSave"
    @test="onTest"
    @remove="onRemove"
  />
</template>

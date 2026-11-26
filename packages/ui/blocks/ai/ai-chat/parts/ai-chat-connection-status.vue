<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import type { AiChatConnection } from '@aziontech/webkit/utils/ai-chat'
  import { computed, ref, watch } from 'vue'

  const props = defineProps<{
    connection: AiChatConnection
    resuming: boolean
    sessionGenerating: boolean
    loading: boolean
  }>()

  const wasConnected = ref(props.connection === 'connected')
  watch(
    () => props.connection,
    (value) => {
      if (value === 'connected') wasConnected.value = true
    }
  )
  const reconnecting = computed(
    () => (wasConnected.value && props.connection === 'connecting') || props.resuming
  )
  const offline = computed(
    () =>
      !reconnecting.value &&
      (props.connection === 'error' || (wasConnected.value && props.connection === 'disconnected'))
  )
</script>

<template>
  <StatusIndicator
    v-if="reconnecting"
    key="reconnecting"
    severity="warning"
    label="Reconnecting"
    loading
  />
  <Alert
    v-else-if="offline"
    key="offline"
    severity="danger"
    size="small"
    title="Connection lost"
  >
    Your messages send when the connection returns.
  </Alert>
  <StatusIndicator
    v-else-if="sessionGenerating && !loading"
    key="elsewhere"
    severity="info"
    label="Responding in another tab"
    loading
  />
</template>

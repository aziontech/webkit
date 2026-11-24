<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import { ref } from 'vue'

  import SettingsCannedResponses, {
    type CannedResponsesResponse,
    type CannedResponsesValues
  } from '../blocks/settings-canned-responses.vue'
  import {
    createResponse,
    duplicateResponse,
    removeResponse,
    responses,
    SUPPORT_NOW,
    updateResponse
  } from '../lib/support'

  const loading = ref(false)
  const saving = ref(false)
  const editorOpen = ref(false)
  const editingKey = ref<string | null>(null)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined

  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const save = (apply: () => string) => {
    saving.value = true
    setTimeout(() => {
      const message = apply()
      saving.value = false
      toast.success(message, { closable: true })
    }, 500)
  }

  const onCreate = (_event: Event, values: CannedResponsesValues) =>
    save(() => `${createResponse(values).title} was created.`)

  const onUpdate = (
    _event: Event,
    response: CannedResponsesResponse,
    values: CannedResponsesValues
  ) =>
    save(() => {
      updateResponse(response.id, values)
      return `${values.title} was saved.`
    })

  const onDuplicate = (_event: Event, response: CannedResponsesResponse) => {
    const copy = duplicateResponse(response.id)
    if (copy) toast.success(`${copy.title} was created.`, { closable: true })
  }

  const onRemove = (_event: Event, response: CannedResponsesResponse) => {
    removeResponse(response.id)
    toast.success(`${response.title} was deleted.`, { closable: true })
  }
</script>

<template>
  <SettingsCannedResponses
    v-model:editor-open="editorOpen"
    v-model:editing-key="editingKey"
    :responses="responses"
    :now="SUPPORT_NOW"
    :loading="loading"
    :saving="saving"
    @create="onCreate"
    @update="onUpdate"
    @duplicate="onDuplicate"
    @remove="onRemove"
    @refresh="refresh"
    @retry="refresh"
  />
</template>

<script setup lang="ts">
  import { onBeforeUnmount, ref } from 'vue'

  import EditResource from '../edit-resource.vue'
  import { sampleProjectDraft, sampleStaleProject } from '../sample'

  const saving = ref(false)
  let saveTimer: ReturnType<typeof setTimeout> | undefined

  const onSubmit = () => {
    saving.value = true
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      saving.value = false
    }, 900)
  }

  onBeforeUnmount(() => clearTimeout(saveTimer))
</script>

<template>
  <EditResource
    :default-draft="sampleProjectDraft"
    :stale="sampleStaleProject"
    :loading="saving"
    @submit="onSubmit"
  />
</template>

<script setup>
  import ToolApproval from '@aziontech/ui/tool-approval'
  import { computed, ref } from 'vue'

  const status = ref('pending')
  const input = ref(
    JSON.stringify(
      { urls: ['https://www.example.com/styles.css', 'https://www.example.com/app.js'] },
      null,
      2
    )
  )

  const invalid = computed(() => {
    try {
      JSON.parse(input.value)
      return false
    } catch {
      return true
    }
  })

  function onApprove(event, value) {
    input.value = JSON.stringify(JSON.parse(value), null, 2)
    status.value = 'approved'
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ToolApproval
      v-model="input"
      title="Allow `purge_urls`?"
      description="Purges these URLs from every data center. Edit the list before you approve."
      approve-label="Purge"
      editable
      :invalid="invalid"
      :status="status"
      @approve="onApprove"
      @deny="status = 'denied'"
    />
  </div>
</template>

<script setup>
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import { ref } from 'vue'

  const state = ref('pending')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ToolApproval
      title="Delete the domain `www.example.com`?"
      description="The domain stops answering at once and its certificate is revoked. This cannot be undone."
      kind="danger"
      confirmation-phrase="www.example.com"
      approve-label="Delete"
      :state="state"
      @approve="state = 'approved'"
      @deny="state = 'denied'"
    />
  </div>
</template>

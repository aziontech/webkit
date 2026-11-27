<script setup>
  import ToolApproval from '@aziontech/ui/tool-approval'
  import { ref } from 'vue'

  const status = ref('pending')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ToolApproval
      title="Delete the domain `www.example.com`?"
      description="The domain stops answering at once and its certificate is revoked. This cannot be undone."
      variant="danger"
      confirmation-phrase="www.example.com"
      approve-label="Delete"
      :status="status"
      @approve="status = 'approved'"
      @deny="status = 'denied'"
    />
  </div>
</template>

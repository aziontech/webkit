<script setup lang="ts">
  import AiActionApproval from '../ai-action-approval.vue'
  import { sampleDeleteAction } from '../sample'
</script>

<template>
  <AiActionApproval :action="sampleDeleteAction" />
</template>

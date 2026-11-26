<script setup lang="ts">
  import CreateDeployProgressDialog from '../create-deploy-progress-dialog.vue'
  import { samplePartialItems } from '../sample'
</script>

<template>
  <CreateDeployProgressDialog :items="samplePartialItems" />
</template>

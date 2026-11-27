<script setup lang="ts">
  import CreateDeployProgressDialog from '../create-deploy-progress-dialog.vue'
  import { sampleDeployedItems } from '../sample'
</script>

<template>
  <CreateDeployProgressDialog :items="sampleDeployedItems" />
</template>

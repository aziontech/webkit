<script setup lang="ts">
  import DeployProgressDialog from '../deploy-progress-dialog.vue'
  import { sampleDeployedItems } from '../sample'
</script>

<template>
  <DeployProgressDialog :items="sampleDeployedItems" />
</template>

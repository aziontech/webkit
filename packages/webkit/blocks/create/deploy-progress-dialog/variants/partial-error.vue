<script setup lang="ts">
  import DeployProgressDialog from '../deploy-progress-dialog.vue'
  import { samplePartialItems } from '../sample'
</script>

<template>
  <DeployProgressDialog :items="samplePartialItems" />
</template>

<script setup lang="ts">
  import EditDeleteDialog from '../edit-delete-dialog.vue'
  import { sampleResourceName } from '../sample'
</script>

<template>
  <EditDeleteDialog
    default-open
    :default-confirmation="sampleResourceName"
    :error="`${sampleResourceName} is still used by 2 workloads. Remove it from them and try again.`"
  />
</template>

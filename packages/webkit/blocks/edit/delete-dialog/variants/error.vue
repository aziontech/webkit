<script setup lang="ts">
  import DeleteDialog from '../delete-dialog.vue'
  import { sampleResourceName } from '../sample'
</script>

<template>
  <DeleteDialog
    default-open
    :default-confirmation="sampleResourceName"
    :error="`${sampleResourceName} is still used by 2 workloads. Remove it from them and try again.`"
  />
</template>

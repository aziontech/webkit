<script setup lang="ts">
  import CreateServiceForm, { type CreateServiceProps } from '../parts/create-service-form.vue'

  withDefaults(defineProps<CreateServiceProps>(), { validated: false })
</script>

<template>
  <CreateServiceForm :validated="validated" />
</template>

<script setup lang="ts">
  import DeployForm from '../parts/deploy-form.vue'
  import { sampleImportedRepository } from '../sample'
</script>

<template>
  <DeployForm
    crumb="Import from Git"
    :template="sampleImportedRepository"
    default-scope="acme"
    default-repo-name="acme-web"
    :settings="[]"
    :variables="[]"
    show-preset
    detected-preset="vite"
  />
</template>

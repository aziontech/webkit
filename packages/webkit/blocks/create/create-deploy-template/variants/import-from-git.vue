<script setup lang="ts">
  import { sampleImportedRepository } from '../sample'
  import DeployForm from './form.vue'
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

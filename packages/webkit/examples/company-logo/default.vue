<script setup>
  import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import CompanyLogo from '@aziontech/webkit/company-logo'

  const client = CLIENTS.find((entry) => entry.name === 'Agibank')
</script>

<template>
  <CompanyLogo
    :name="client.name"
    :src="client.logo"
    :src-light="client.logoLight"
    :artwork="client.artwork"
    size="large"
    class="max-w-40"
  />
</template>

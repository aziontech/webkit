<script setup>
  import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import ThirdPartyLogo from '@aziontech/webkit/third-party-logo'

  const client = CLIENTS.find((entry) => entry.name === 'Agibank')
</script>

<template>
  <ThirdPartyLogo
    :name="client.name"
    :src="client.logo"
    :src-light="client.logoLight"
    :artwork="client.artwork"
    size="large"
    class="max-w-40"
  />
</template>

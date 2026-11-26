<script setup>
  import { CLIENTS } from '@aziontech/ui/assets/client-registry'
  import ThirdPartyLogo from '@aziontech/ui/third-party-logo'

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

<script setup>
  import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import Logo from '@aziontech/webkit/logo'

  const client = CLIENTS.find((entry) => entry.name === 'Agibank')
</script>

<template>
  <Logo
    :name="client.name"
    :src="client.logo"
    :src-light="client.logoLight"
    :artwork="client.artwork"
    class="h-8 max-w-40"
  />
</template>

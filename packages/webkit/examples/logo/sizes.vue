<script setup>
  import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import Logo from '@aziontech/webkit/logo'

  const client = CLIENTS.find((entry) => entry.name === 'Agibank')
  const sizes = ['small', 'medium', 'large']
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      v-for="size in sizes"
      :key="size"
      class="flex flex-wrap items-center gap-(--spacing-xl)"
    >
      <span class="w-20 text-label-md text-(--text-muted)">{{ size }}</span>
      <Logo
        :name="client.name"
        :src="client.logo"
        :src-light="client.logoLight"
        :artwork="client.artwork"
        :size="size"
        class="max-w-40"
      />
      <Logo
        name="Acme Inc."
        :size="size"
      />
    </div>
  </div>
</template>

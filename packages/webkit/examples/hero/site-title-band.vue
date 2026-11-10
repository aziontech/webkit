<script setup>
  import HeroBand from '@aziontech/webkit/hero-band'

  const primaryAction = {
    label: 'Start for free',
    href: 'https://console.azion.com/signup/'
  }

  const secondaryAction = {
    label: 'Docs',
    href: 'https://www.azion.com/en/documentation/',
    trailing: true
  }
</script>

<template>
  <HeroBand
    kind="title-band"
    size="large"
    eyebrow="Cache"
    title="Deliver content fast, worldwide"
    description="Serve cached content close to users. Cut origin load and keep applications fast during traffic spikes."
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
  />
</template>

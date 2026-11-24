<script setup>
  import ModuleHeader from '@aziontech/webkit/module-header'

  const DESCRIPTION =
    'We make every application fast and reliable. Deploy your projects instantly on the most reliable global infrastructure, leverage enterprise-grade security, and scale from zero to ' +
    'peak without cold starts.'
</script>

<template>
  <div>
    <ModuleHeader
      align="split"
      description-width="narrow"
      eyebrow="Narrow"
      title="Builders, not spectators"
      :description="DESCRIPTION"
    />
    <ModuleHeader
      align="split"
      description-width="wide"
      eyebrow="Wide"
      title="Builders, not spectators"
      :description="DESCRIPTION"
    />
  </div>
</template>

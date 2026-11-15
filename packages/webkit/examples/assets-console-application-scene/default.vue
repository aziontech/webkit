<script setup>
  import ConsoleApplicationScene from '@aziontech/webkit/assets/console-application-scene'
  import ConsoleShowcase from '@aziontech/webkit/console-showcase'

  const tabs = [
    { value: 'build', title: 'Build' },
    { value: 'device-groups', title: 'Devices' },
    { value: 'rules-engine', title: 'Rules' },
    { value: 'main-settings', title: 'Settings' }
  ]
</script>

<template>
  <ConsoleShowcase
    eyebrow="Azion Console"
    title="The Application, tab by tab"
    description="Every tab owns its own list, its own create drawer and its own save."
    :tabs="tabs"
  >
    <template #scene="{ tab }">
      <ConsoleApplicationScene :tab="tab" />
    </template>
  </ConsoleShowcase>
</template>

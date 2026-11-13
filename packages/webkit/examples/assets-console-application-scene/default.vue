<script setup>
  import ConsoleApplicationScene from '@aziontech/webkit/assets/console-application-scene'
  import ConsolePanel from '@aziontech/webkit/console-panel'

  const tabs = [
    { value: 'build', title: 'Build' },
    { value: 'device-groups', title: 'Devices' },
    { value: 'rules-engine', title: 'Rules' },
    { value: 'main-settings', title: 'Settings' }
  ]
</script>

<template>
  <ConsolePanel
    eyebrow="Azion Console"
    title="The Application, tab by tab"
    description="Every tab owns its own list, its own create drawer and its own save."
    :tabs="tabs"
  >
    <template #scene="{ tab }">
      <ConsoleApplicationScene :tab="tab" />
    </template>
  </ConsolePanel>
</template>

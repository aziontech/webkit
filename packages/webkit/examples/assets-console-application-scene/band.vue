<script setup>
  import ConsoleApplicationScene from '@aziontech/webkit/assets/console-application-scene'
  import MediaTabs from '@aziontech/webkit/media-tabs'

  const tabs = [
    {
      value: 'build',
      title: 'Build',
      description: 'Connect a repository, pick the framework preset, and deploy a branch.'
    },
    {
      value: 'device-groups',
      title: 'Device Groups',
      description: 'Group requests by user-agent, so a rule can treat a phone differently.'
    },
    {
      value: 'cache-settings',
      title: 'Cache Settings',
      description: 'Set browser and edge TTLs per policy, and turn tiered cache on where it pays.'
    },
    {
      value: 'rules-engine',
      title: 'Rules Engine',
      description: 'Order what happens on request and on response, rule by rule.'
    }
  ]
</script>

<template>
  <MediaTabs
    :items="tabs"
    position="right"
    size="small"
    :autoplay-interval="4600"
  >
    <template #media="{ index, active }">
      <ConsoleApplicationScene
        :tab="tabs[index].value"
        :active="active"
        class="size-full"
      />
    </template>
  </MediaTabs>
</template>

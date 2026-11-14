<script setup>
  import ConsoleApplicationScene from '@aziontech/webkit/assets/console-application-scene'
  import ConsolePanel from '@aziontech/webkit/console-panel'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const tabs = [
    {
      value: 'build',
      title: 'Build'
    },
    {
      value: 'device-groups',
      title: 'Device Groups'
    },
    {
      value: 'rules-engine',
      title: 'Rules Engine'
    }
  ]

  const primaryAction = {
    label: 'Start for free',
    href: 'https://console.azion.com/signup/'
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ConsolePanel
      eyebrow="Console"
      title="One console for every workload"
      description="Build, route and secure an application from the same page."
      :tabs="tabs"
      :crop="0.2"
      :primary-action="primaryAction"
    >
      <template #scene="{ tab }">
        <ConsoleApplicationScene
          :tab="tab"
          :width="760"
        />
      </template>
    </ConsolePanel>

    <SectionGap hatch />
  </SectionContainer>
</template>

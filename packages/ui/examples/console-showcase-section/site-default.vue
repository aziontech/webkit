<script setup>
  import ConsoleApplicationScene from '@aziontech/ui/assets/console-application-scene'
  import ConsoleShowcaseSection from '@aziontech/ui/console-showcase-section'
  import Container from '@aziontech/ui/container'
  import Spacer from '@aziontech/ui/spacer'

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
  <Container max-width="site">
    <Spacer hatch />

    <ConsoleShowcaseSection
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
    </ConsoleShowcaseSection>

    <Spacer hatch />
  </Container>
</template>

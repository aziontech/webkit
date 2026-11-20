<script setup>
  import Container from '@aziontech/webkit/container'
  import Spacer from '@aziontech/webkit/spacer'
  import StatsSection from '@aziontech/webkit/stats-section'

  const items = [
    {
      prefix: '+',
      value: '100',
      label: 'Data centers worldwide'
    },
    {
      prefix: '+',
      value: '3k',
      label: 'ASNs directly connected to Azion'
    },
    {
      value: '100',
      suffix: '%',
      label: 'Availability, guaranteed by SLA'
    }
  ]
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <StatsSection :items="items" />

    <Spacer hatch />
  </Container>
</template>

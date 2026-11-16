<script setup>
  import Button from '@aziontech/webkit/button'
  import IntegrationCard from '@aziontech/webkit/integration-card'
</script>

<template>
  <IntegrationCard
    class="w-full max-w-[400px]"
    title="Waiting Room"
    vendor="Tidewater"
    logo="ai ai-hourglass"
    description="Queue visitors during a traffic surge and let them in as capacity frees up."
    :badges="[{ label: 'Application' }]"
    installed
    href="#waiting-room"
  >
    <template #actions>
      <Button
        label="Configure"
        variant="outline"
        size="small"
        icon="ai ai-settings"
      />
    </template>
  </IntegrationCard>
</template>

<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card
    class="w-full max-w-[400px]"
    variant="integration"
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
  </Card>
</template>

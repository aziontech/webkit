<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card
    class="w-full max-w-[400px]"
    kind="integration"
    title="Waiting Room"
    vendor="Tidewater"
    logo="pi pi-hourglass"
    description="Queue visitors during a traffic surge and let them in as capacity frees up."
    :badges="[{ label: 'Application' }]"
    installed
    href="#waiting-room"
  >
    <template #action>
      <Button
        label="Configure"
        kind="outlined"
        size="small"
        icon="pi pi-cog"
      />
    </template>
  </Card>
</template>

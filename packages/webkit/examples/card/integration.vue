<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import { ref } from 'vue'

  const opened = ref('')
</script>

<template>
  <div class="flex w-full max-w-[400px] flex-col gap-(--spacing-sm)">
    <Card
      kind="integration"
      title="Request Signer"
      vendor="Northwind Labs"
      logo="pi pi-key"
      description="Sign every request at the edge with a rotating key, so the origin only answers traffic that passed through."
      :badges="[{ label: 'Firewall' }]"
      @select="opened = 'Request Signer'"
    >
      <template #action>
        <Button
          label="Install"
          kind="outlined"
          size="small"
        />
      </template>
    </Card>
    <p
      class="m-0 text-body-xs text-(--text-muted)"
      role="status"
    >
      {{ opened ? `Opened ${opened}` : '' }}
    </p>
  </div>
</template>

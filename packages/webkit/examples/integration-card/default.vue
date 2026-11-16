<script setup>
  import Button from '@aziontech/webkit/button'
  import IntegrationCard from '@aziontech/webkit/integration-card'
  import { ref } from 'vue'

  const opened = ref('')
</script>

<template>
  <div class="flex w-full max-w-[400px] flex-col gap-(--spacing-sm)">
    <IntegrationCard
      title="Request Signer"
      vendor="Acme Inc."
      logo="ai ai-key"
      description="Sign every request at the edge with a rotating key, so the origin only answers traffic that passed through."
      :badges="[{ label: 'Firewall' }]"
      @select="opened = 'Request Signer'"
    >
      <template #actions>
        <Button
          label="Install"
          variant="outline"
          size="small"
        />
      </template>
    </IntegrationCard>
    <p
      class="m-0 text-body-xs text-(--text-muted)"
      role="status"
    >
      {{ opened ? `Opened ${opened}` : '' }}
    </p>
  </div>
</template>

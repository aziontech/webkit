<script setup>
  import CallToAction from '@aziontech/webkit/call-to-action'
  import Button from '@aziontech/webkit/button'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import Ticker from '@aziontech/webkit/ticker'
</script>

<template>
  <CallToAction
    kind="primary"
    title="Build once. Run everywhere."
    description="Get a faster path to launch, lower latency, and less infrastructure overhead."
  >
    <template #background>
      <TextureMaterial
        kind="pixelate"
        size="small"
        fade="bottom"
      />
    </template>
    <template #actions>
      <Button
        label="Start for free"
        kind="secondary"
        size="large"
      />
      <Button
        label="Docs"
        kind="outlined"
        size="large"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
    <template #bottom>
      <Ticker
        aria-label="Why teams choose Azion"
        :items="[
          { icon: 'ai ai-edge-nodes', label: 'Distributed to 100+ locations automatically' },
          { icon: 'ai ai-edge-functions', label: 'No regions to pick, no servers to manage' },
          { icon: 'ai ai-origin-shield', label: 'Stop attacks before they reach your origin' },
          { icon: 'ai ai-edge-firewall', label: 'DDoS mitigation with no surprise charges' },
          { icon: 'pi pi-dollar', label: 'Usage-based pricing with no hidden fees' },
          { icon: 'pi pi-gift', label: 'Start with $300 in free credits' },
          { icon: 'ai ai-azion-cli', label: 'Deploy from the CLI, the Console or an agent' },
          {
            icon: 'ai ai-real-time-metrics',
            label: 'Real-time events and metrics for every request'
          },
          { icon: 'ai ai-real-time-purge', label: 'Purge the cache everywhere in real time' },
          { icon: 'pi pi-code', label: 'Works with Vue, React, Next.js, Astro and more' }
        ]"
      />
    </template>
  </CallToAction>
</template>

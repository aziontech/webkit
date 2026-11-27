<script setup>
  import Button from '@aziontech/ui/button'
  import CallToAction from '@aziontech/ui/call-to-action'
  import Marquee from '@aziontech/ui/marquee'
  import Texture from '@aziontech/ui/texture'
</script>

<template>
  <CallToAction
    variant="primary"
    title="Build once. Run everywhere."
    description="Get a faster path to launch, lower latency, and less infrastructure overhead."
  >
    <template #background>
      <Texture
        variant="pixelate"
        size="small"
        fade="bottom"
      />
    </template>
    <template #actions>
      <Button
        label="Start for free"
        variant="secondary"
        size="large"
      />
      <Button
        label="Docs"
        variant="outline"
        size="large"
        icon="az az-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
    <template #bottom>
      <Marquee
        aria-label="Why teams choose Azion"
        :items="[
          { icon: 'az az-edge-nodes', label: 'Distributed to 100+ locations automatically' },
          { icon: 'az az-functions', label: 'No regions to pick, no servers to manage' },
          { icon: 'az az-origin-shield', label: 'Stop attacks before they reach your origin' },
          { icon: 'az az-firewall', label: 'DDoS mitigation with no surprise charges' },
          { icon: 'az az-dollar', label: 'Usage-based pricing with no hidden fees' },
          { icon: 'az az-gift', label: 'Start with $300 in free credits' },
          { icon: 'az az-azion-cli', label: 'Deploy from the CLI, the Console or an agent' },
          {
            icon: 'az az-real-time-metrics',
            label: 'Real-time events and metrics for every request'
          },
          { icon: 'az az-real-time-purge', label: 'Purge the cache everywhere in real time' },
          { icon: 'az az-code', label: 'Works with Vue, React, Next.js, Astro and more' }
        ]"
      />
    </template>
  </CallToAction>
</template>

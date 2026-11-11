<script setup>
  import ConsolePanel from '@aziontech/webkit/console-panel'
  import ShellMockup from '@aziontech/webkit/shell-mockup'
  import Tag from '@aziontech/webkit/tag'

  const tabs = [
    { value: 'applications', title: 'Applications' },
    { value: 'metrics', title: 'Metrics' },
    { value: 'logs', title: 'Logs' }
  ]

  const views = {
    applications: { heading: 'Applications', rows: ['storefront', 'checkout-api', 'image-proxy'] },
    metrics: { heading: 'Metrics', rows: ['Requests 1.2M', 'Cache hit 94%', 'Errors 0.02%'] },
    logs: { heading: 'Logs', rows: ['GET /cart 200', 'POST /pay 201', 'GET /img/hero.webp 304'] }
  }
</script>

<template>
  <ConsolePanel
    eyebrow="Console"
    title="One console for every workload"
    description="Deploy, observe and secure from the same place."
    :tabs="tabs"
    :crop="0.2"
  >
    <template #scene="{ tab }">
      <ShellMockup
        :title="views[tab ?? 'applications'].heading"
        rail="workloads"
        fade="bottom"
      >
        <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-lg)">
          <span class="text-heading-sm text-(--text-default)">{{
            views[tab ?? 'applications'].heading
          }}</span>
          <div
            v-for="row in views[tab ?? 'applications'].rows"
            :key="row"
            class="flex items-center justify-between border-b border-(--border-default) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            {{ row }}
            <Tag
              label="Live"
              severity="success"
              size="small"
            />
          </div>
        </div>
      </ShellMockup>
    </template>
  </ConsolePanel>
</template>

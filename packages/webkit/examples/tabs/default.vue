<script setup>
  import Tabs from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const active = ref('overview')
</script>

<template>
  <Tabs
    v-model="active"
    class="w-full max-w-[40rem]"
  >
    <Tabs.List>
      <Tabs.Trigger
        value="overview"
        label="Overview"
      />
      <Tabs.Trigger
        value="metrics"
        label="Metrics"
      />
      <Tabs.Trigger
        value="logs"
        label="Logs"
      />
    </Tabs.List>
    <div class="w-full">
      <Tabs.Content value="overview">
        <div class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)">
          <p class="text-body-sm text-(--text-default)">
            Requests, bandwidth and errors for the last 24 hours.
          </p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="metrics">
        <div class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)">
          <p class="text-body-sm text-(--text-default)">
            Charts of requests per second and cache hit ratio.
          </p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="logs">
        <div class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)">
          <p class="text-body-sm text-(--text-default)">
            The latest events from this application, newest first.
          </p>
        </div>
      </Tabs.Content>
    </div>
  </Tabs>
</template>

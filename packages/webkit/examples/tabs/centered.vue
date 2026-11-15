<script setup>
  import Tabs from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const active = ref('templates')
</script>

<template>
  <Tabs
    v-model="active"
    class="w-full max-w-[40rem]"
  >
    <Tabs.List align="center">
      <Tabs.Trigger
        value="templates"
        label="Templates"
      />
      <Tabs.Trigger
        value="integrations"
        label="Integrations"
      />
    </Tabs.List>
    <div class="mt-(--spacing-lg) w-full">
      <Tabs.Content value="templates">
        <p class="text-center text-body-sm text-(--text-muted)">
          Start a project from a template built for the edge.
        </p>
      </Tabs.Content>
      <Tabs.Content value="integrations">
        <p class="text-center text-body-sm text-(--text-muted)">
          Connect the services your applications already use.
        </p>
      </Tabs.Content>
    </div>
  </Tabs>
</template>

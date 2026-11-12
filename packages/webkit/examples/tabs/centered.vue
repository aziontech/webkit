<script setup>
  import Tabs from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const active = ref('templates')
</script>

<template>
  <Tabs.Root
    v-model="active"
    class="w-full max-w-[40rem]"
  >
    <Tabs.List align="center">
      <Tabs.Item
        value="templates"
        label="Templates"
      />
      <Tabs.Item
        value="integrations"
        label="Integrations"
      />
    </Tabs.List>
    <div class="mt-(--spacing-lg)">
      <Tabs.Content>
        <Tabs.Panel value="templates">
          <p class="text-center text-body-sm text-(--text-muted)">
            Start a project from a template built for the edge.
          </p>
        </Tabs.Panel>
        <Tabs.Panel value="integrations">
          <p class="text-center text-body-sm text-(--text-muted)">
            Connect the services your applications already use.
          </p>
        </Tabs.Panel>
      </Tabs.Content>
    </div>
  </Tabs.Root>
</template>

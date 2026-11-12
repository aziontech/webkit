<script setup>
  import Command from '@aziontech/webkit/command'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import { ref } from 'vue'

  const open = ref(false)
  const pages = ['Workloads', 'Applications', 'Functions', 'Firewall']
</script>

<template>
  <SearchTrigger @click="open = true" />
  <Command
    v-model:open="open"
    shortcut="meta+k"
    @select="open = false"
  >
    <Command.Input placeholder="Search pages" />
    <Command.List>
      <Command.Empty>No results.</Command.Empty>
      <Command.Group heading="Pages">
        <Command.Item
          v-for="page in pages"
          :key="page"
          :value="page"
          >{{ page }}</Command.Item
        >
      </Command.Group>
    </Command.List>
  </Command>
</template>

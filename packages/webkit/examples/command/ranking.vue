<script setup>
  import Button from '@aziontech/webkit/button'
  import CommandEmpty from '@aziontech/webkit/command-empty'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandRoot from '@aziontech/webkit/command-root'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open ranked palette"
    variant="primary"
    @click="open = true"
  />

  <CommandRoot
    v-model:open="open"
    shortcut=""
  >
    <CommandInput placeholder="Try set, dpl or team…" />
    <CommandList>
      <CommandGroup label="Actions">
        <CommandItem value="deploy">Deploy Project</CommandItem>
        <CommandItem value="reset-cache">Purge Cache</CommandItem>
        <CommandItem
          value="invite"
          :keywords="['team', 'member', 'user']"
          >Invite People</CommandItem
        >
      </CommandGroup>
      <CommandGroup label="Navigation">
        <CommandItem value="projects">Go to Projects</CommandItem>
        <CommandItem
          value="settings"
          :keywords="['preferences', 'account']"
          >Go to Settings</CommandItem
        >
        <CommandItem value="usage">Go to Usage</CommandItem>
      </CommandGroup>
      <CommandGroup label="Settings">
        <CommandItem value="settings-domains">Settings: Domains</CommandItem>
        <CommandItem value="settings-team">Settings: Team</CommandItem>
      </CommandGroup>
      <CommandEmpty>No commands found.</CommandEmpty>
    </CommandList>
  </CommandRoot>
</template>

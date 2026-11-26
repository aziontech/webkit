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
        <CommandItem value="deploy">Deploy project</CommandItem>
        <CommandItem value="reset-cache">Purge cache</CommandItem>
        <CommandItem
          value="invite"
          :keywords="['team', 'member', 'user']"
          >Invite people</CommandItem
        >
      </CommandGroup>
      <CommandGroup label="Navigation">
        <CommandItem value="projects">Go to projects</CommandItem>
        <CommandItem
          value="settings"
          :keywords="['preferences', 'account']"
          >Go to settings</CommandItem
        >
        <CommandItem value="usage">Go to usage</CommandItem>
      </CommandGroup>
      <CommandGroup label="Settings">
        <CommandItem value="settings-domains">Settings: domains</CommandItem>
        <CommandItem value="settings-team">Settings: team</CommandItem>
      </CommandGroup>
      <CommandEmpty>No commands found.</CommandEmpty>
    </CommandList>
  </CommandRoot>
</template>

<script setup>
  import { ref } from 'vue'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import CommandMenuInput from '@aziontech/webkit/command-menu-input'
  import CommandMenuList from '@aziontech/webkit/command-menu-list'
  import CommandMenuGroup from '@aziontech/webkit/command-menu-group'
  import CommandMenuItem from '@aziontech/webkit/command-menu-item'
  import CommandMenuSeparator from '@aziontech/webkit/command-menu-separator'
  import InputText from '@aziontech/webkit/input-text'
  import Kbd from '@aziontech/webkit/kbd'

  const open = ref(false)
</script>

<template>
  <InputText
    model-value=""
    placeholder="Search…"
    size="large"
    readonly
    aria-keyshortcuts="Meta+K"
    class="max-w-[360px] cursor-pointer"
    @click="open = true"
    @keydown.enter="open = true"
  >
    <template #iconLeft>
      <span
        class="pi pi-search"
        aria-hidden="true"
      />
    </template>
    <template #iconRight>
      <Kbd
        meta
        size="small"
        >K</Kbd
      >
    </template>
  </InputText>

  <CommandMenu
    v-model:open="open"
    shortcut="meta+k"
  >
    <CommandMenuInput placeholder="Search commands…" />
    <CommandMenuList>
      <CommandMenuGroup heading="Suggestions">
        <CommandMenuItem value="deploy">Deploy Project</CommandMenuItem>
        <CommandMenuItem value="new-app">Create Application</CommandMenuItem>
        <CommandMenuItem value="settings">Go to Settings</CommandMenuItem>
      </CommandMenuGroup>
      <CommandMenuSeparator />
      <CommandMenuGroup heading="Commands">
        <CommandMenuItem
          value="search"
          shortcut="meta+k"
          >Search Everything</CommandMenuItem
        >
        <CommandMenuItem
          value="new-app-cmd"
          shortcut="meta+n"
          >New Application</CommandMenuItem
        >
        <CommandMenuItem
          value="toggle-theme"
          shortcut="meta+shift+l"
          >Toggle Theme</CommandMenuItem
        >
      </CommandMenuGroup>
    </CommandMenuList>
  </CommandMenu>
</template>

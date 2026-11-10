<script setup>
  import DropdownMenu, {
    DropdownMenuGroup,
    DropdownMenuOption,
    DropdownMenuTrigger
  } from '@aziontech/webkit/dropdown-menu'
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenu :open="true">
    <DropdownMenuTrigger>
      <IconButton
        kind="outlined"
        icon="pi pi-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>

    <DropdownMenuGroup label="Account">
      <template #top>
        <span class="text-label-sm text-(--text-muted)">Signed in as jordan.silva@example.com</span>
      </template>

      <DropdownMenuOption
        value="profile"
        label="Profile"
        command="⌘P"
      />
      <DropdownMenuOption
        value="settings"
        label="Settings"
      />

      <template #bottom>
        <Button
          kind="transparent"
          size="small"
          label="Manage account"
          class="w-full"
        />
      </template>
    </DropdownMenuGroup>

    <DropdownMenuGroup label="Workspace">
      <template #top>
        <span class="text-label-sm text-(--text-muted)">Azion · 12 members</span>
      </template>

      <DropdownMenuOption
        value="invite"
        label="Invite members"
      />
      <DropdownMenuOption
        value="logs"
        label="Audit log"
      />

      <template #bottom>
        <Button
          kind="transparent"
          size="small"
          label="Workspace settings"
          class="w-full"
        />
      </template>
    </DropdownMenuGroup>
  </DropdownMenu>
</template>

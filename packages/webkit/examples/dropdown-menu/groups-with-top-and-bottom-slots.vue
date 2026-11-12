<script setup>
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot :open="true">
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
          role="menuitem"
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
          role="menuitem"
          size="small"
          label="Workspace settings"
          class="w-full"
        />
      </template>
    </DropdownMenuGroup>
  </DropdownMenuRoot>
</template>

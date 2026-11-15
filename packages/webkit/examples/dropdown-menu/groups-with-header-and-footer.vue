<script setup>
  import Button from '@aziontech/webkit/button'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot :open="true">
    <DropdownMenuTrigger>
      <IconButton
        variant="outline"
        icon="ai ai-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>

    <DropdownMenuGroup label="Account">
      <template #header>
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

      <template #footer>
        <Button
          variant="ghost"
          role="menuitem"
          size="small"
          label="Manage account"
          class="w-full"
        />
      </template>
    </DropdownMenuGroup>

    <DropdownMenuGroup label="Workspace">
      <template #header>
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

      <template #footer>
        <Button
          variant="ghost"
          role="menuitem"
          size="small"
          label="Workspace settings"
          class="w-full"
        />
      </template>
    </DropdownMenuGroup>
  </DropdownMenuRoot>
</template>

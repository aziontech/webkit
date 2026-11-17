<script setup>
  import Button from '@aziontech/webkit/button'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot :open="true">
    <DropdownMenuTrigger>
      <IconButton
        variant="outline"
        icon="az az-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>

    <DropdownMenuGroup label="Account">
      <template #header>
        <span class="text-label-sm text-(--text-muted)">Signed in as jordan.silva@example.com</span>
      </template>

      <DropdownMenuItem
        value="profile"
        label="Profile"
        command="⌘P"
      />
      <DropdownMenuItem
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

      <DropdownMenuItem
        value="invite"
        label="Invite members"
      />
      <DropdownMenuItem
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

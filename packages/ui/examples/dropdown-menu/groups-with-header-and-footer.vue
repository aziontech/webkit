<script setup>
  import Button from '@aziontech/ui/button'
  import DropdownMenuGroup from '@aziontech/ui/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/ui/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/ui/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/ui/dropdown-menu-trigger'
  import IconButton from '@aziontech/ui/icon-button'
</script>

<template>
  <DropdownMenuRoot>
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
        command="mod+P"
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

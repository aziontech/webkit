<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap gap-(--spacing-lg) items-center">
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <IconButton
          icon="ai ai-ellipsis"
          aria-label="More actions"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuItem
          value="edit"
          label="Edit"
        />
        <DropdownMenuItem
          value="duplicate"
          label="Duplicate"
        />
        <DropdownMenuItem
          value="delete"
          label="Delete"
        />
      </DropdownMenuGroup>
    </DropdownMenuRoot>

    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Avatar
          label="IB"
          aria-label="Account menu"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup label="Account">
        <DropdownMenuItem
          value="profile"
          label="Profile"
        />
        <DropdownMenuItem
          value="settings"
          label="Settings"
        />
        <DropdownMenuItem
          value="signout"
          label="Sign out"
        />
      </DropdownMenuGroup>
    </DropdownMenuRoot>
  </div>
</template>

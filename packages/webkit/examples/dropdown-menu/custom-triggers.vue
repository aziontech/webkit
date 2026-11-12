<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap gap-(--spacing-lg) items-center">
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <IconButton
          icon="pi pi-ellipsis-h"
          aria-label="More actions"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuOption
          value="edit"
          label="Edit"
        />
        <DropdownMenuOption
          value="duplicate"
          label="Duplicate"
        />
        <DropdownMenuOption
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
        <DropdownMenuOption
          value="profile"
          label="Profile"
        />
        <DropdownMenuOption
          value="settings"
          label="Settings"
        />
        <DropdownMenuOption
          value="signout"
          label="Sign out"
        />
      </DropdownMenuGroup>
    </DropdownMenuRoot>
  </div>
</template>

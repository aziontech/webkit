<script setup>
  import Button from '@aziontech/webkit/button'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
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

    <template #top>
      <div class="p-(--spacing-xxs)">
        <Input
          placeholder="Search options…"
          size="small"
        />
      </div>
    </template>

    <DropdownMenuGroup label="Suggestions">
      <DropdownMenuOption
        value="profile"
        label="Profile"
      />
      <DropdownMenuOption
        value="settings"
        label="Settings"
      />
      <DropdownMenuOption
        value="billing"
        label="Billing"
      />
    </DropdownMenuGroup>

    <template #bottom>
      <div class="flex justify-end p-(--spacing-xxs)">
        <Button
          kind="transparent"
          size="small"
          label="View all"
        />
      </div>
    </template>
  </DropdownMenuRoot>
</template>

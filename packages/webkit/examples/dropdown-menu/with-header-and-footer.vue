<script setup>
  import Button from '@aziontech/webkit/button'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
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

    <template #header>
      <div class="p-(--spacing-2xs)">
        <Input
          placeholder="Search options…"
          size="small"
        />
      </div>
    </template>

    <DropdownMenuGroup label="Suggestions">
      <DropdownMenuItem
        value="profile"
        label="Profile"
      />
      <DropdownMenuItem
        value="settings"
        label="Settings"
      />
      <DropdownMenuItem
        value="billing"
        label="Billing"
      />
    </DropdownMenuGroup>

    <template #footer>
      <div class="flex justify-end p-(--spacing-2xs)">
        <Button
          variant="ghost"
          size="small"
          label="View all"
        />
      </div>
    </template>
  </DropdownMenuRoot>
</template>

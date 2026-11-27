<script setup>
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
    <DropdownMenuGroup label="Option states">
      <DropdownMenuItem
        value="default"
        label="Default"
      />
      <DropdownMenuItem
        value="selected"
        label="Selected"
        selected
      />
      <DropdownMenuItem
        value="disabled"
        label="Disabled"
        disabled
      />
    </DropdownMenuGroup>
  </DropdownMenuRoot>
</template>

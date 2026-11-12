<script setup>
  import DropdownMenu, {
    DropdownMenuGroup,
    DropdownMenuOption,
    DropdownMenuTrigger
  } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
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
    <DropdownMenuGroup label="Affordances">
      <DropdownMenuOption
        value="plain"
        label="Plain label"
      />
      <DropdownMenuOption
        value="command"
        label="With command hint"
        command="⌘P"
      />
      <DropdownMenuOption value="left">
        <template #left>
          <i
            class="pi pi-user"
            aria-hidden="true"
          />
        </template>
        Left icon
      </DropdownMenuOption>
      <DropdownMenuOption
        value="right"
        label="Right slot"
      >
        <template #right>
          <Tag label="New" />
        </template>
      </DropdownMenuOption>
      <DropdownMenuOption
        value="selected"
        label="Selected"
        selected
      />
      <DropdownMenuOption
        value="disabled"
        label="Disabled"
        disabled
      />
    </DropdownMenuGroup>
  </DropdownMenu>
</template>

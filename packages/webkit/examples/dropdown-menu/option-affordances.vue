<script setup>
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
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
    <DropdownMenuGroup label="Affordances">
      <DropdownMenuItem
        value="plain"
        label="Plain label"
      />
      <DropdownMenuItem
        value="command"
        label="With command hint"
        command="mod+P"
      />
      <DropdownMenuItem value="leading">
        <template #leading>
          <i
            class="az az-user"
            aria-hidden="true"
          />
        </template>
        Leading icon
      </DropdownMenuItem>
      <DropdownMenuItem
        value="trailing"
        label="Trailing slot"
      >
        <template #trailing>
          <Tag label="New" />
        </template>
      </DropdownMenuItem>
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

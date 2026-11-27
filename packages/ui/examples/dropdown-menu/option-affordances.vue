<script setup>
  import DropdownMenuGroup from '@aziontech/ui/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/ui/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/ui/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/ui/dropdown-menu-trigger'
  import IconButton from '@aziontech/ui/icon-button'
  import Tag from '@aziontech/ui/tag'
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

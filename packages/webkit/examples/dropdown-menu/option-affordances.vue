<script setup>
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <DropdownMenuRoot :open="true">
    <DropdownMenuTrigger>
      <IconButton
        variant="outline"
        icon="ai ai-plus"
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
      <DropdownMenuOption value="leading">
        <template #leading>
          <i
            class="ai ai-user"
            aria-hidden="true"
          />
        </template>
        Leading icon
      </DropdownMenuOption>
      <DropdownMenuOption
        value="trailing"
        label="Trailing slot"
      >
        <template #trailing>
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
  </DropdownMenuRoot>
</template>

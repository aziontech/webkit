<script setup>
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="grid grid-cols-2 gap-(--spacing-xl) place-items-center min-h-[24rem]">
    <DropdownMenuRoot placement="bottom-start">
      <DropdownMenuTrigger>
        <Button
          kind="outlined"
          label="bottom-start"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuOption
          value="a"
          label="Option A"
        />
        <DropdownMenuOption
          value="b"
          label="Option B"
        />
      </DropdownMenuGroup>
    </DropdownMenuRoot>

    <DropdownMenuRoot placement="bottom-end">
      <DropdownMenuTrigger>
        <Button
          kind="outlined"
          label="bottom-end"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuOption
          value="a"
          label="Option A"
        />
        <DropdownMenuOption
          value="b"
          label="Option B"
        />
      </DropdownMenuGroup>
    </DropdownMenuRoot>

    <DropdownMenuRoot placement="top-start">
      <DropdownMenuTrigger>
        <Button
          kind="outlined"
          label="top-start"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuOption
          value="a"
          label="Option A"
        />
        <DropdownMenuOption
          value="b"
          label="Option B"
        />
      </DropdownMenuGroup>
    </DropdownMenuRoot>

    <DropdownMenuRoot placement="top-end">
      <DropdownMenuTrigger>
        <Button
          kind="outlined"
          label="top-end"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuOption
          value="a"
          label="Option A"
        />
        <DropdownMenuOption
          value="b"
          label="Option B"
        />
      </DropdownMenuGroup>
    </DropdownMenuRoot>
  </div>
</template>

<script setup>
  import DropdownMenu, {
    DropdownMenuGroup,
    DropdownMenuOption,
    DropdownMenuTrigger
  } from '@aziontech/webkit/dropdown-menu'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="grid grid-cols-2 gap-(--spacing-xl) place-items-center min-h-[24rem]">
    <DropdownMenu placement="bottom-start">
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
    </DropdownMenu>

    <DropdownMenu placement="bottom-end">
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
    </DropdownMenu>

    <DropdownMenu placement="top-start">
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
    </DropdownMenu>

    <DropdownMenu placement="top-end">
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
    </DropdownMenu>
  </div>
</template>

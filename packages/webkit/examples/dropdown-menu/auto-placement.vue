<script setup>
  import DropdownMenu, {
    DropdownMenuGroup,
    DropdownMenuOption,
    DropdownMenuTrigger
  } from '@aziontech/webkit/dropdown-menu'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="relative h-[28rem] w-full border border-dashed border-(--border-muted)">
    <p
      class="absolute top-(--spacing-md) left-1/2 -translate-x-1/2 text-body-sm text-(--text-muted) text-center max-w-md"
    >
      All four triggers use <code>placement="auto"</code>.<br />
      Each panel resolves to the best-fitting corner based on its position in the viewport.
    </p>

    <div class="absolute top-(--spacing-md) start-(--spacing-md)">
      <DropdownMenu placement="auto">
        <DropdownMenuTrigger>
          <Button
            kind="outlined"
            label="top-left trigger"
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

    <div class="absolute top-(--spacing-md) end-(--spacing-md)">
      <DropdownMenu placement="auto">
        <DropdownMenuTrigger>
          <Button
            kind="outlined"
            label="top-right trigger"
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

    <div class="absolute bottom-(--spacing-md) start-(--spacing-md)">
      <DropdownMenu placement="auto">
        <DropdownMenuTrigger>
          <Button
            kind="outlined"
            label="bottom-left trigger"
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

    <div class="absolute bottom-(--spacing-md) end-(--spacing-md)">
      <DropdownMenu placement="auto">
        <DropdownMenuTrigger>
          <Button
            kind="outlined"
            label="bottom-right trigger"
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
  </div>
</template>

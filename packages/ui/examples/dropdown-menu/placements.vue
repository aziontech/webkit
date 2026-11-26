<script setup>
  import Button from '@aziontech/ui/button'
  import DropdownMenuGroup from '@aziontech/ui/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/ui/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/ui/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/ui/dropdown-menu-trigger'
</script>

<template>
  <div class="grid grid-cols-2 gap-(--spacing-xl) place-items-center min-h-[24rem]">
    <DropdownMenuRoot
      side="bottom"
      align="start"
    >
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          label="bottom · start"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuItem
          value="duplicate"
          label="Duplicate"
        />
        <DropdownMenuItem
          value="rename"
          label="Rename"
        />
      </DropdownMenuGroup>
    </DropdownMenuRoot>

    <DropdownMenuRoot
      side="bottom"
      align="end"
    >
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          label="bottom · end"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuItem
          value="duplicate"
          label="Duplicate"
        />
        <DropdownMenuItem
          value="rename"
          label="Rename"
        />
      </DropdownMenuGroup>
    </DropdownMenuRoot>

    <DropdownMenuRoot
      side="top"
      align="start"
    >
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          label="top · start"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuItem
          value="duplicate"
          label="Duplicate"
        />
        <DropdownMenuItem
          value="rename"
          label="Rename"
        />
      </DropdownMenuGroup>
    </DropdownMenuRoot>

    <DropdownMenuRoot
      side="top"
      align="end"
    >
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          label="top · end"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuItem
          value="duplicate"
          label="Duplicate"
        />
        <DropdownMenuItem
          value="rename"
          label="Rename"
        />
      </DropdownMenuGroup>
    </DropdownMenuRoot>
  </div>
</template>

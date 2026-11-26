<script setup>
  import Button from '@aziontech/webkit/button'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <Button
        variant="outline"
        label="Resources"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup label="Documentation">
      <DropdownMenuItem
        value="purge"
        label="Real-Time Purge"
        description="docs.example.com · Mar 2, 2026"
        href="https://docs.example.com/purge"
        target="_blank"
      >
        <template #leading>
          <i
            class="az az-book"
            aria-hidden="true"
          />
        </template>
      </DropdownMenuItem>
      <DropdownMenuItem
        value="cache"
        label="Cache settings"
        description="How long each response stays at the edge"
        href="/cache"
      >
        <template #leading>
          <i
            class="az az-settings"
            aria-hidden="true"
          />
        </template>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuRoot>
</template>

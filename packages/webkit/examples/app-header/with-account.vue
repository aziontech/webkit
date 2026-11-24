<script setup>
  import AppHeader from '@aziontech/webkit/app-header'
  import AppHeaderAccount from '@aziontech/webkit/app-header-account'
  import Brand from '@aziontech/webkit/brand'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
</script>

<template>
  <AppHeader aria-label="Global header">
    <AppHeader.Start>
      <AppHeader.Brand
        href="/"
        aria-label="Azion home"
      >
        <Brand size="small" />
      </AppHeader.Brand>
    </AppHeader.Start>
    <AppHeader.Center />
    <AppHeader.End>
      <DropdownMenu
        side="bottom"
        align="end"
      >
        <DropdownMenu.Trigger>
          <AppHeaderAccount name="Jane Doe" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            value="settings"
            label="Account settings"
          />
          <DropdownMenu.Item
            value="logout"
            label="Log out"
          />
        </DropdownMenu.Group>
      </DropdownMenu>
    </AppHeader.End>
  </AppHeader>
</template>

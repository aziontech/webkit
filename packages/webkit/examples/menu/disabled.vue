<script setup>
  import Menu from '@aziontech/webkit/menu'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuSub from '@aziontech/webkit/menu-sub'
  import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
  import MenuSubContent from '@aziontech/webkit/menu-sub-content'
</script>

<template>
  <div class="w-[264px] overflow-hidden">
    <Menu aria-label="Console navigation">
      <MenuGroup label="Azion platform">
        <MenuItem
          label="Applications"
          icon="pi pi-th-large"
          href="/applications"
        />
        <MenuItem
          label="Real-Time Purge"
          icon="pi pi-refresh"
          disabled
        />
        <MenuSub>
          <MenuSubTrigger
            label="Settings"
            kind="inline"
            disabled
          />
          <MenuSubContent>
            <MenuItem
              label="General"
              icon=""
              href="/settings/general"
            />
          </MenuSubContent>
        </MenuSub>
      </MenuGroup>
    </Menu>
  </div>
</template>

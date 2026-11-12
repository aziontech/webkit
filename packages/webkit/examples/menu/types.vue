<script setup>
  import MenuBack from '@aziontech/webkit/menu-back'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import MenuSub from '@aziontech/webkit/menu-sub'
  import MenuSubContent from '@aziontech/webkit/menu-sub-content'
  import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
</script>

<template>
  <div class="flex flex-wrap items-start gap-(--spacing-md)">
    <div class="w-[264px] overflow-hidden">
      <MenuRoot aria-label="Expands in place">
        <MenuGroup label="Expands in place">
          <MenuSub default-open>
            <MenuSubTrigger
              label="Getting started"
              kind="inline"
            />
            <MenuSubContent>
              <MenuItem
                label="Installation"
                icon=""
                href="/docs/install"
              />
              <MenuItem
                label="Quick start"
                icon=""
                href="/docs/quick-start"
              />
            </MenuSubContent>
          </MenuSub>
        </MenuGroup>
      </MenuRoot>
    </div>
    <div class="w-[264px] overflow-hidden">
      <MenuRoot aria-label="Replaces the menu">
        <MenuBack />
        <MenuGroup label="Replaces the menu">
          <MenuSub>
            <MenuSubTrigger
              label="Settings"
              kind="drill"
              icon="pi pi-cog"
            />
            <MenuSubContent>
              <MenuItem
                label="General"
                icon=""
                href="/settings/general"
              />
              <MenuItem
                label="Members"
                icon=""
                href="/settings/members"
              />
            </MenuSubContent>
          </MenuSub>
        </MenuGroup>
      </MenuRoot>
    </div>
  </div>
</template>

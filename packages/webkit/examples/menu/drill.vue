<script setup>
  import MenuRoot from '@aziontech/webkit/menu-root'
  import MenuBack from '@aziontech/webkit/menu-back'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuSub from '@aziontech/webkit/menu-sub'
  import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
  import MenuSubContent from '@aziontech/webkit/menu-sub-content'
</script>

<template>
  <div class="w-[264px] overflow-hidden">
    <MenuRoot aria-label="Console navigation">
      <MenuBack />
      <MenuGroup label="Account">
        <MenuItem
          label="Overview"
          icon="pi pi-home"
          href="/overview"
          selected
        />
        <MenuSub>
          <MenuSubTrigger
            label="Settings"
            kind="drill"
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
            <MenuItem
              label="Billing"
              icon=""
              href="/settings/billing"
            />
          </MenuSubContent>
        </MenuSub>
      </MenuGroup>
    </MenuRoot>
  </div>
</template>

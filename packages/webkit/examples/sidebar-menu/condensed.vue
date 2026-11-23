<script setup>
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'
  import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'
  import SidebarMenuSub from '@aziontech/webkit/sidebar-menu-sub'
  import SidebarMenuSubContent from '@aziontech/webkit/sidebar-menu-sub-content'
  import SidebarMenuSubTrigger from '@aziontech/webkit/sidebar-menu-sub-trigger'
</script>

<template>
  <div class="w-[264px] overflow-hidden">
    <SidebarMenuRoot aria-label="Docs">
      <SidebarMenuGroup label="Docs">
        <SidebarMenuSub default-open>
          <SidebarMenuSubTrigger
            label="Build"
            type="inline"
          />
          <SidebarMenuSubContent>
            <SidebarMenuItem
              label="Overview"
              icon=""
              href="/build"
            />
            <SidebarMenuSub default-open>
              <SidebarMenuSubTrigger
                label="Applications"
                type="inline"
              />
              <SidebarMenuSubContent>
                <SidebarMenuItem
                  label="Rules Engine"
                  icon=""
                  href="/build/rules-engine"
                />
                <SidebarMenuItem
                  label="Cache Settings"
                  icon=""
                  href="/build/cache-settings"
                />
              </SidebarMenuSubContent>
            </SidebarMenuSub>
            <SidebarMenuSub>
              <SidebarMenuSubTrigger
                label="Functions"
                type="inline"
              />
              <SidebarMenuSubContent>
                <SidebarMenuItem
                  label="Runtime APIs"
                  icon=""
                  href="/build/runtime-apis"
                />
              </SidebarMenuSubContent>
            </SidebarMenuSub>
          </SidebarMenuSubContent>
        </SidebarMenuSub>
      </SidebarMenuGroup>
    </SidebarMenuRoot>
  </div>
</template>

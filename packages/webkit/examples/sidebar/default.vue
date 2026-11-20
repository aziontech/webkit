<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import CommandEmpty from '@aziontech/webkit/command-empty'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import Command from '@aziontech/webkit/command-root'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import SidebarFooter from '@aziontech/webkit/sidebar-footer'
  import SidebarHeader from '@aziontech/webkit/sidebar-header'
  import SidebarMenuBack from '@aziontech/webkit/sidebar-menu-back'
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'
  import SidebarMenu from '@aziontech/webkit/sidebar-menu-root'
  import SidebarMenuSub from '@aziontech/webkit/sidebar-menu-sub'
  import SidebarMenuSubContent from '@aziontech/webkit/sidebar-menu-sub-content'
  import SidebarMenuSubTrigger from '@aziontech/webkit/sidebar-menu-sub-trigger'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import { ref } from 'vue'

  const accountMenuOpen = ref(false)
  const paletteOpen = ref(false)
</script>

<template>
  <div class="h-screen w-[280px]">
    <Sidebar aria-label="Console">
      <template #header>
        <SidebarHeader>
          <SearchTrigger
            class="w-full"
            @open="paletteOpen = true"
          />

          <Command v-model:open="paletteOpen">
            <CommandInput placeholder="Search navigation and commands" />
            <CommandList>
              <CommandGroup label="Build">
                <CommandItem value="nav:applications">
                  <template #leading
                    ><i
                      class="az az-applications"
                      aria-hidden="true"
                  /></template>
                  Applications
                </CommandItem>
                <CommandItem value="nav:variables">
                  <template #leading
                    ><i
                      class="az az-variables"
                      aria-hidden="true"
                  /></template>
                  Variables
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup label="Account">
                <CommandItem value="cmd:settings">
                  <template #leading
                    ><i
                      class="az az-settings"
                      aria-hidden="true"
                  /></template>
                  Account Settings
                </CommandItem>
              </CommandGroup>

              <CommandEmpty>No navigation or command matches your search.</CommandEmpty>
            </CommandList>
          </Command>
        </SidebarHeader>
      </template>
      <SidebarMenu role="presentation">
        <SidebarMenuBack />
        <SidebarMenuGroup>
          <SidebarMenuItem
            label="Home"
            icon="az az-home"
            href="/"
            active
          />
          <SidebarMenuItem
            label="Marketplace"
            icon="az az-marketplace"
            href="/marketplace"
          />
        </SidebarMenuGroup>
        <SidebarMenuGroup label="Build">
          <SidebarMenuItem
            label="Applications"
            icon="az az-applications"
            href="/applications"
          />
          <SidebarMenuSub default-open>
            <SidebarMenuSubTrigger
              label="Edge Functions"
              type="inline"
            />
            <SidebarMenuSubContent>
              <SidebarMenuItem
                label="Runtime APIs"
                href="/functions/runtime-apis"
              />
              <SidebarMenuItem
                label="Bundlers"
                href="/functions/bundlers"
              />
            </SidebarMenuSubContent>
          </SidebarMenuSub>
          <SidebarMenuItem
            label="Variables"
            icon="az az-variables"
            href="/variables"
          />
        </SidebarMenuGroup>
        <SidebarMenuGroup label="Store">
          <SidebarMenuItem
            label="Object Storage"
            icon="az az-object-storage"
            href="/object-storage"
          />
          <SidebarMenuItem
            label="SQL Database"
            icon="az az-sql-database"
            href="/sql-database"
            tag-value="Preview"
            tag-variant="primary"
          />
        </SidebarMenuGroup>
        <SidebarMenuGroup label="Account">
          <SidebarMenuSub>
            <SidebarMenuSubTrigger
              label="Settings"
              icon="az az-settings"
              type="drill"
            />
            <SidebarMenuSubContent>
              <SidebarMenuGroup label="Organization">
                <SidebarMenuItem
                  label="General"
                  href="/settings/general"
                />
                <SidebarMenuItem
                  label="Members"
                  href="/settings/members"
                />
                <SidebarMenuItem
                  label="Billing"
                  href="/settings/billing"
                />
              </SidebarMenuGroup>
            </SidebarMenuSubContent>
          </SidebarMenuSub>
        </SidebarMenuGroup>
      </SidebarMenu>
      <template #footer>
        <SidebarFooter>
          <div class="flex items-center gap-(--spacing-xs)">
            <Avatar
              variant="square"
              size="small"
              label="AM"
              alt="Alex Morgan"
            />
            <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
              >Alex Morgan</span
            >
            <DropdownMenu
              v-model:open="accountMenuOpen"
              side="top"
              align="end"
            >
              <DropdownMenuTrigger>
                <IconButton
                  icon="az az-ellipsis-vertical"
                  aria-label="Account menu"
                  variant="outline"
                  size="small"
                />
              </DropdownMenuTrigger>
              <DropdownMenuGroup>
                <template #header>
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate text-label-md text-(--text-default)">Alex Morgan</span>
                    <span class="truncate text-body-xs text-(--text-muted)"
                      >rafael.umman@example.com</span
                    >
                  </div>
                </template>
                <DropdownMenuItem
                  value="settings"
                  label="Account Settings"
                />
                <DropdownMenuItem
                  value="personal-tokens"
                  label="Personal Tokens"
                />
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  value="logout"
                  label="Log Out"
                >
                  <template #trailing
                    ><i
                      class="az az-log-out"
                      aria-hidden="true"
                  /></template>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </template>
    </Sidebar>
  </div>
</template>

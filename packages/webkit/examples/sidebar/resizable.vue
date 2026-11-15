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
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
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

  const open = ref(true)
  const width = ref(null)

  const accountMenuOpen = ref(false)
  const paletteOpen = ref(false)
</script>

<template>
  <div class="relative flex h-screen min-h-0">
    <div class="flex min-h-0 shrink-0 max-md:hidden">
      <Sidebar
        v-model:open="open"
        v-model:width="width"
        resizable
        collapsible
        aria-label="Console"
      >
        <template #header>
          <SidebarHeader>
            <SearchTrigger
              class="w-full"
              @open="paletteOpen = true"
            />

            <Command v-model:open="paletteOpen">
              <CommandInput placeholder="Search navigation and commands" />
              <CommandList>
                <CommandGroup heading="Build">
                  <CommandItem value="nav:applications">
                    <template #prefix
                      ><i
                        class="ai ai-edge-application"
                        aria-hidden="true"
                    /></template>
                    Applications
                  </CommandItem>
                  <CommandItem value="nav:variables">
                    <template #prefix
                      ><i
                        class="ai ai-variables"
                        aria-hidden="true"
                    /></template>
                    Variables
                  </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Account">
                  <CommandItem value="cmd:settings">
                    <template #prefix
                      ><i
                        class="ai ai-settings"
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
              icon="ai ai-home"
              href="/"
              selected
            />
            <SidebarMenuItem
              label="Marketplace"
              icon="ai ai-marketplace"
              href="/marketplace"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Build">
            <SidebarMenuItem
              label="Applications"
              icon="ai ai-edge-application"
              href="/applications"
            />
            <SidebarMenuSub default-open>
              <SidebarMenuSubTrigger
                label="Edge Functions"
                kind="inline"
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
              icon="ai ai-variables"
              href="/variables"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Store">
            <SidebarMenuItem
              label="Object Storage"
              icon="ai ai-edge-storage"
              href="/object-storage"
            />
            <SidebarMenuItem
              label="SQL Database"
              icon="ai ai-edge-sql"
              href="/sql-database"
              tag-value="Preview"
              tag-variant="primary"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Account">
            <SidebarMenuSub>
              <SidebarMenuSubTrigger
                label="Settings"
                icon="ai ai-settings"
                kind="drill"
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
                kind="square"
                size="small"
                label="AM"
                alt="Alex Morgan"
              />
              <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
                >Alex Morgan</span
              >
              <DropdownMenu
                v-model:open="accountMenuOpen"
                placement="top-end"
              >
                <DropdownMenuTrigger>
                  <IconButton
                    icon="ai ai-ellipsis-vertical"
                    aria-label="Account menu"
                    kind="outlined"
                    size="small"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuGroup>
                  <template #top>
                    <div class="flex min-w-0 flex-col">
                      <span class="truncate text-label-md text-(--text-default)">Alex Morgan</span>
                      <span class="truncate text-body-xs text-(--text-muted)"
                        >rafael.umman@example.com</span
                      >
                    </div>
                  </template>
                  <DropdownMenuOption
                    value="settings"
                    label="Account Settings"
                  />
                  <DropdownMenuOption
                    value="personal-tokens"
                    label="Personal Tokens"
                  />
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <DropdownMenuOption
                    value="logout"
                    label="Log Out"
                  >
                    <template #trailing
                      ><i
                        class="ai ai-log-out"
                        aria-hidden="true"
                    /></template>
                  </DropdownMenuOption>
                </DropdownMenuGroup>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </template>
      </Sidebar>
    </div>

    <main class="min-w-0 flex-1 p-(--spacing-lg)">
      <p class="text-body-sm text-(--text-muted)">
        The page morphs as the rail animates — it is a flex sibling, so it fills the freed space on
        the same frames.
      </p>
    </main>
  </div>
</template>

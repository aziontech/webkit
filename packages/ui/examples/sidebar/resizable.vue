<script setup>
  import AppLayout from '@aziontech/ui/app-layout'
  import Avatar from '@aziontech/ui/avatar'
  import CommandEmpty from '@aziontech/ui/command-empty'
  import CommandGroup from '@aziontech/ui/command-group'
  import CommandInput from '@aziontech/ui/command-input'
  import CommandItem from '@aziontech/ui/command-item'
  import CommandList from '@aziontech/ui/command-list'
  import Command from '@aziontech/ui/command-root'
  import CommandSeparator from '@aziontech/ui/command-separator'
  import DropdownMenuGroup from '@aziontech/ui/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/ui/dropdown-menu-item'
  import DropdownMenu from '@aziontech/ui/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/ui/dropdown-menu-trigger'
  import IconButton from '@aziontech/ui/icon-button'
  import SearchTrigger from '@aziontech/ui/search-trigger'
  import SidebarFooter from '@aziontech/ui/sidebar-footer'
  import SidebarHeader from '@aziontech/ui/sidebar-header'
  import SidebarMenuBack from '@aziontech/ui/sidebar-menu-back'
  import SidebarMenuGroup from '@aziontech/ui/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/ui/sidebar-menu-item'
  import SidebarMenu from '@aziontech/ui/sidebar-menu-root'
  import SidebarMenuSub from '@aziontech/ui/sidebar-menu-sub'
  import SidebarMenuSubContent from '@aziontech/ui/sidebar-menu-sub-content'
  import SidebarMenuSubTrigger from '@aziontech/ui/sidebar-menu-sub-trigger'
  import Sidebar from '@aziontech/ui/sidebar-root'
  import { ref } from 'vue'

  const open = ref(true)
  const width = ref(null)

  const accountMenuOpen = ref(false)
  const paletteOpen = ref(false)
</script>

<template>
  <div class="h-screen">
    <AppLayout>
      <template #navigation="{ drawer }">
        <Sidebar
          :open="drawer || open"
          @update:open="open = $event"
          v-model:width="width"
          :resizable="!drawer"
          :collapsible="!drawer"
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
              <SidebarMenuSub>
                <SidebarMenuSubTrigger
                  label="Functions"
                  icon="az az-functions"
                  type="drill"
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
                        <span class="truncate text-label-md text-(--text-default)"
                          >Alex Morgan</span
                        >
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
                      label="Log out"
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
      </template>

      <template #header="{ compact, openNavigation }">
        <div
          v-if="compact"
          class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
        >
          <IconButton
            icon="az az-menu"
            aria-label="Open navigation"
            variant="outline"
            size="medium"
            @click="openNavigation"
          />
        </div>
      </template>

      <main class="min-w-0 p-(--spacing-lg)">
        <p class="text-body-sm text-(--text-muted)">
          The page morphs as the rail animates — it is a flex sibling, so it fills the freed space
          on the same frames.
        </p>
      </main>
    </AppLayout>
  </div>
</template>

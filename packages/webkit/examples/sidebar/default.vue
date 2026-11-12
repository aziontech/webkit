<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import CommandRoot from '@aziontech/webkit/command-root'
  import CommandEmpty from '@aziontech/webkit/command-empty'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import MenuBack from '@aziontech/webkit/menu-back'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuSub from '@aziontech/webkit/menu-sub'
  import MenuSubContent from '@aziontech/webkit/menu-sub-content'
  import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
  import SidebarFooter from '@aziontech/webkit/sidebar-footer'
  import SidebarHeader from '@aziontech/webkit/sidebar-header'
  import { ref } from 'vue'

  const accountMenuOpen = ref(false)
  const paletteOpen = ref(false)
</script>

<template>
  <Sidebar
    aria-label="Console"
    class="h-screen w-[280px]"
  >
    <template #header>
      <SidebarHeader>
        <SearchTrigger
          class="w-full"
          @open="paletteOpen = true"
        />

        <CommandRoot v-model:open="paletteOpen">
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
                    class="pi pi-cog"
                    aria-hidden="true"
                /></template>
                Account Settings
              </CommandItem>
            </CommandGroup>

            <CommandEmpty>No navigation or command matches your search.</CommandEmpty>
          </CommandList>
        </CommandRoot>
      </SidebarHeader>
    </template>
    <MenuRoot role="presentation">
      <MenuBack />
      <MenuGroup>
        <MenuItem
          label="Home"
          icon="ai ai-home"
          href="/"
          selected
        />
        <MenuItem
          label="Marketplace"
          icon="ai ai-marketplace"
          href="/marketplace"
        />
      </MenuGroup>
      <MenuGroup label="Build">
        <MenuItem
          label="Applications"
          icon="ai ai-edge-application"
          href="/applications"
        />
        <MenuSub default-open>
          <MenuSubTrigger
            label="Edge Functions"
            kind="inline"
          />
          <MenuSubContent>
            <MenuItem
              label="Runtime APIs"
              href="/functions/runtime-apis"
            />
            <MenuItem
              label="Bundlers"
              href="/functions/bundlers"
            />
          </MenuSubContent>
        </MenuSub>
        <MenuItem
          label="Variables"
          icon="ai ai-variables"
          href="/variables"
        />
      </MenuGroup>
      <MenuGroup label="Store">
        <MenuItem
          label="Object Storage"
          icon="ai ai-edge-storage"
          href="/object-storage"
        />
        <MenuItem
          label="SQL Database"
          icon="ai ai-edge-sql"
          href="/sql-database"
          tag-value="Preview"
          tag-severity="primary"
        />
      </MenuGroup>
      <MenuGroup label="Account">
        <MenuSub>
          <MenuSubTrigger
            label="Settings"
            icon="pi pi-cog"
            kind="drill"
          />
          <MenuSubContent>
            <MenuGroup label="Organization">
              <MenuItem
                label="General"
                href="/settings/general"
              />
              <MenuItem
                label="Members"
                href="/settings/members"
              />
              <MenuItem
                label="Billing"
                href="/settings/billing"
              />
            </MenuGroup>
          </MenuSubContent>
        </MenuSub>
      </MenuGroup>
    </MenuRoot>
    <template #footer>
      <SidebarFooter>
        <div class="flex items-center gap-(--spacing-xs)">
          <Avatar
            kind="square"
            size="small"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
            alt="Alex Moreira"
          />
          <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
            >Alex Moreira</span
          >
          <DropdownMenuRoot
            v-model:open="accountMenuOpen"
            placement="top-end"
          >
            <DropdownMenuTrigger>
              <IconButton
                icon="pi pi-ellipsis-v"
                aria-label="Account menu"
                kind="outlined"
                size="small"
              />
            </DropdownMenuTrigger>
            <DropdownMenuGroup>
              <template #top>
                <div class="flex min-w-0 flex-col">
                  <span class="truncate text-label-md text-(--text-default)">Alex Moreira</span>
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
                <template #right
                  ><i
                    class="pi pi-sign-out"
                    aria-hidden="true"
                /></template>
              </DropdownMenuOption>
            </DropdownMenuGroup>
          </DropdownMenuRoot>
        </div>
      </SidebarFooter>
    </template>
  </Sidebar>
</template>

<script setup>
  import Sidebar from '@aziontech/webkit/sidebar'
  import SidebarHeader from '@aziontech/webkit/sidebar-header'
  import SidebarFooter from '@aziontech/webkit/sidebar-footer'
  import InputText from '@aziontech/webkit/input-text'
  import Kbd from '@aziontech/webkit/kbd'
  import Avatar from '@aziontech/webkit/avatar'
  import IconButton from '@aziontech/webkit/icon-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
  import DropdownGroup from '@aziontech/webkit/dropdown-group'
  import DropdownOption from '@aziontech/webkit/dropdown-option'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import CommandMenuInput from '@aziontech/webkit/command-menu-input'
  import CommandMenuList from '@aziontech/webkit/command-menu-list'
  import CommandMenuGroup from '@aziontech/webkit/command-menu-group'
  import CommandMenuItem from '@aziontech/webkit/command-menu-item'
  import CommandMenuSeparator from '@aziontech/webkit/command-menu-separator'
  import CommandMenuEmpty from '@aziontech/webkit/command-menu-empty'
  import Menu from '@aziontech/webkit/menu'
  import MenuBack from '@aziontech/webkit/menu-back'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuSub from '@aziontech/webkit/menu-sub'
  import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
  import MenuSubContent from '@aziontech/webkit/menu-sub-content'
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
        <div
          class="cursor-pointer [&_input]:cursor-pointer"
          @click="paletteOpen = true"
          @keydown.enter="paletteOpen = true"
        >
          <InputText
            model-value=""
            placeholder="Search"
            size="large"
            readonly
            aria-label="Search navigation and commands"
            aria-keyshortcuts="Meta+K"
          >
            <template #iconLeft
              ><i
                class="pi pi-search"
                aria-hidden="true"
            /></template>
            <template #iconRight
              ><Kbd
                meta
                size="small"
                >K</Kbd
              ></template
            >
          </InputText>
        </div>

        <CommandMenu v-model:open="paletteOpen">
          <CommandMenuInput placeholder="Search navigation and commands" />
          <CommandMenuList>
            <CommandMenuGroup heading="Build">
              <CommandMenuItem value="nav:applications">
                <template #prefix
                  ><i
                    class="ai ai-edge-application"
                    aria-hidden="true"
                /></template>
                Applications
              </CommandMenuItem>
              <CommandMenuItem value="nav:variables">
                <template #prefix
                  ><i
                    class="ai ai-variables"
                    aria-hidden="true"
                /></template>
                Variables
              </CommandMenuItem>
            </CommandMenuGroup>

            <CommandMenuSeparator />

            <CommandMenuGroup heading="Account">
              <CommandMenuItem value="cmd:settings">
                <template #prefix
                  ><i
                    class="pi pi-cog"
                    aria-hidden="true"
                /></template>
                Account Settings
              </CommandMenuItem>
            </CommandMenuGroup>

            <CommandMenuEmpty>No navigation or command matches your search.</CommandMenuEmpty>
          </CommandMenuList>
        </CommandMenu>
      </SidebarHeader>
    </template>
    <Menu role="presentation">
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
    </Menu>
    <template #footer>
      <SidebarFooter class="flex items-center gap-(--spacing-xs)">
        <Avatar
          kind="square"
          size="small"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
          alt="Alex Moreira"
        />
        <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
          >Alex Moreira</span
        >
        <Dropdown
          v-model:open="accountMenuOpen"
          placement="top-end"
        >
          <DropdownTrigger>
            <IconButton
              icon="pi pi-ellipsis-v"
              aria-label="Account menu"
              kind="outlined"
              size="small"
            />
          </DropdownTrigger>
          <DropdownGroup>
            <template #top>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-label-md text-(--text-default)">Alex Moreira</span>
                <span class="truncate text-body-xs text-(--text-muted)"
                  >rafael.umman@example.com</span
                >
              </div>
            </template>
            <DropdownOption
              value="settings"
              label="Account Settings"
            />
            <DropdownOption
              value="personal-tokens"
              label="Personal Tokens"
            />
          </DropdownGroup>
          <DropdownGroup>
            <DropdownOption
              value="logout"
              label="Log Out"
            >
              <template #right
                ><i
                  class="pi pi-sign-out"
                  aria-hidden="true"
              /></template>
            </DropdownOption>
          </DropdownGroup>
        </Dropdown>
      </SidebarFooter>
    </template>
  </Sidebar>
</template>

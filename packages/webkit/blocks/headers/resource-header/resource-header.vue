<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Command from '@aziontech/webkit/command'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const account = { name: 'Amy Chen', email: 'amy.chen@example.com' }
  const searchPages = ['Home', 'Applications', 'Functions', 'Firewall', 'Settings']
  const searchOpen = ref(false)
</script>

<template>
  <div class="@container w-full bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Start>
        <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
          <span class="contents md:hidden">
            <Tooltip
              text="Open navigation"
              placement="bottom"
            >
              <IconButton
                icon="pi pi-bars"
                kind="outlined"
                size="medium"
                aria-label="Open navigation"
              />
            </Tooltip>
          </span>
          <GlobalHeader.Brand>
            <a
              href="/home"
              aria-label="Azion home"
              class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            >
              <Brand
                kind="default"
                size="small"
              />
            </a>
          </GlobalHeader.Brand>
        </div>
      </GlobalHeader.Start>
      <GlobalHeader.Center />
      <GlobalHeader.End>
        <SearchTrigger
          collapsible
          @open="searchOpen = true"
        />
        <span class="contents md:hidden">
          <Tooltip
            text="Create"
            placement="bottom"
          >
            <IconButton
              icon="pi pi-plus-circle"
              kind="primary"
              size="medium"
              aria-label="Create"
            />
          </Tooltip>
          <Tooltip
            text="Agent"
            placement="bottom"
          >
            <IconButton
              icon="ai ai-ask-azion"
              kind="outlined"
              size="medium"
              aria-label="Agent"
            />
          </Tooltip>
        </span>
        <span class="hidden md:contents">
          <Button
            label="Create"
            kind="primary"
            size="medium"
            icon="pi pi-plus-circle"
          />
          <ButtonHighlight
            label="Agent"
            size="medium"
            icon="ai ai-ask-azion"
          />
        </span>
        <DropdownMenu placement="bottom-end">
          <DropdownMenu.Trigger>
            <button
              type="button"
              aria-label="Account menu"
              class="rounded-(--shape-button) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            >
              <Avatar
                :label="account.name"
                size="medium"
                kind="square"
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <template #top>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-label-md text-(--text-default)">{{ account.name }}</span>
                <span class="truncate text-body-xs text-(--text-muted)">{{ account.email }}</span>
              </div>
            </template>
            <DropdownMenu.Item
              value="settings"
              label="Account settings"
            >
              <template #trailing>
                <i
                  class="pi pi-cog"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              value="personal-tokens"
              label="Personal tokens"
            >
              <template #trailing>
                <i
                  class="pi pi-key"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="docs"
              label="Docs"
            >
              <template #trailing>
                <i
                  class="pi pi-book"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              value="logout"
              label="Log out"
            >
              <template #trailing>
                <i
                  class="pi pi-sign-out"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu>
      </GlobalHeader.End>
    </GlobalHeader>
    <Command v-model:open="searchOpen">
      <Command.Input placeholder="Search" />
      <Command.List>
        <Command.Empty>No page matches your search.</Command.Empty>
        <Command.Group heading="Pages">
          <Command.Item
            v-for="page in searchPages"
            :key="page"
            :value="page"
            >{{ page }}</Command.Item
          >
        </Command.Group>
      </Command.List>
    </Command>
  </div>
</template>

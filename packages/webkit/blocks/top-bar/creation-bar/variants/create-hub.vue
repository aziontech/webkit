<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  const breadcrumb = [{ label: 'Creation Center', active: true }]

  const account = { name: 'Amy Chen', email: 'amy.chen@example.com' }
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <Tooltip
          content="Back to Home"
          placement="bottom"
        >
          <IconButton
            icon="ai ai-chevron-left"
            aria-label="Back to Home"
            variant="outline"
            size="small"
            href="/home"
          />
        </Tooltip>
        <AppHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              variant="default"
              size="small"
            />
          </a>
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
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
                variant="square"
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <template #header>
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
                  class="ai ai-settings"
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
                  class="ai ai-book"
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
                  class="ai ai-log-out"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu>
      </AppHeader.End>
    </AppHeader>
  </div>
</template>

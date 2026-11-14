<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  const breadcrumb = [{ label: 'Creation Center', current: true }]

  const account = { name: 'Amy Chen', email: 'amy.chen@example.com' }
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <Tooltip
          text="Back to Home"
          placement="bottom"
        >
          <IconButton
            icon="pi pi-chevron-left"
            aria-label="Back to Home"
            kind="outlined"
            size="small"
            href="/home"
          />
        </Tooltip>
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
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
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
            <DropdownMenu.Option
              value="settings"
              label="Account settings"
            >
              <template #right>
                <i
                  class="pi pi-cog"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Option>
          </DropdownMenu.Group>
          <DropdownMenu.Group>
            <DropdownMenu.Option
              value="docs"
              label="Docs"
            >
              <template #right>
                <i
                  class="pi pi-book"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Option>
            <DropdownMenu.Option
              value="logout"
              label="Log out"
            >
              <template #right>
                <i
                  class="pi pi-sign-out"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Option>
          </DropdownMenu.Group>
        </DropdownMenu>
      </GlobalHeader.Right>
    </GlobalHeader>
  </div>
</template>

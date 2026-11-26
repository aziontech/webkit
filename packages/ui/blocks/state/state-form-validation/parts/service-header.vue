<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import AppHeaderAccount from '@aziontech/webkit/app-header-account'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  const breadcrumb = [{ label: 'Services', href: '/services' }, { label: 'Create Service' }]

  const account = { name: 'Amy Chen', email: 'amy.chen@example.com' }
</script>

<template>
  <AppHeader aria-label="Console">
    <AppHeader.Start>
      <Tooltip
        content="Back to Services"
        side="bottom"
      >
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Services"
          variant="outline"
          size="small"
          href="/services"
        />
      </Tooltip>
      <AppHeader.Brand
        href="/home"
        aria-label="Azion home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <Breadcrumb :items="breadcrumb" />
    </AppHeader.Start>
    <AppHeader.Center />
    <AppHeader.End>
      <DropdownMenu
        side="bottom"
        align="end"
      >
        <DropdownMenu.Trigger>
          <AppHeaderAccount
            :name="account.name"
            aria-label="Account menu"
          />
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
                class="az az-settings"
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
                class="az az-book"
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
                class="az az-log-out"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu>
    </AppHeader.End>
  </AppHeader>
</template>

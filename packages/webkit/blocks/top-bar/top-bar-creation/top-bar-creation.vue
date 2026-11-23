<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import AppHeaderAccount from '@aziontech/webkit/app-header-account'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb, { type BreadcrumbItemData } from '@aziontech/webkit/breadcrumb-root'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import { sampleAccount } from './sample'

  /** The signed-in user shown on the avatar and in the account menu. */
  export interface CreationBarAccount {
    /** Full name; the avatar shows its initials. */
    name: string
    /** Email shown under the name in the menu. */
    email: string
  }

  /** One crumb of the trail beside the brand. */
  export type CreationBarCrumb = BreadcrumbItemData

  export interface CreationBarProps {
    /** The signed-in user. Left out, the sample renders. */
    account?: CreationBarAccount
    /** Where the back control goes; empty hides it, as on the terminal screens. */
    backHref?: string
    /** Name of the back control, read by its tooltip and by screen readers. */
    backLabel?: string
    /** Where the brand goes. */
    homeHref?: string
    /** The trail beside the brand; empty hides it. */
    breadcrumb?: CreationBarCrumb[]
  }

  const props = withDefaults(defineProps<CreationBarProps>(), {
    account: undefined,
    backHref: '/resources',
    backLabel: 'Back to Resources',
    homeHref: '/home',
    breadcrumb: () => [{ label: 'Resources', href: '/resources' }, { label: 'Create Resource' }]
  })

  const emit = defineEmits<{
    'account-select': [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
    navigate: [event: MouseEvent, href: string]
  }>()

  const account = computed(() => props.account ?? sampleAccount)
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <Tooltip
          v-if="backHref"
          :content="backLabel"
          side="bottom"
        >
          <IconButton
            icon="az az-chevron-left"
            :aria-label="backLabel"
            variant="outline"
            size="small"
            :href="backHref"
          />
        </Tooltip>
        <AppHeader.Brand
          :href="homeHref"
          aria-label="Azion home"
        >
          <span class="flex max-sm:hidden">
            <Brand
              variant="default"
              size="small"
            />
          </span>
          <span class="flex sm:hidden">
            <Brand
              variant="reduced"
              size="small"
            />
          </span>
        </AppHeader.Brand>
        <div
          v-if="breadcrumb.length > 0"
          class="min-w-0 max-sm:hidden"
        >
          <Breadcrumb
            :items="breadcrumb"
            @navigate="(event, href) => emit('navigate', event, href)"
          />
        </div>
        <div
          v-if="breadcrumb.length > 0"
          class="min-w-0 sm:hidden"
        >
          <Breadcrumb
            :items="breadcrumb.slice(-1)"
            @navigate="(event, href) => emit('navigate', event, href)"
          />
        </div>
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <DropdownMenu
          side="bottom"
          align="end"
          @select="(event, value) => emit('account-select', event, value)"
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
  </div>
</template>

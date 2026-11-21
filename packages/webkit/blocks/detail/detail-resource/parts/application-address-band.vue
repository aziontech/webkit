<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  export interface ApplicationAddressBandProps {
    /** The live address, without the scheme; the link and Visit open it. */
    host: string
    /** The glyph before the address. */
    icon: string
    /** Whether the items of the actions menu carry their glyph. */
    showMenuIcons?: boolean
  }

  withDefaults(defineProps<ApplicationAddressBandProps>(), {
    showMenuIcons: false
  })

  const menuItems = [
    { value: 'copy-url', label: 'Copy URL', icon: 'az az-copy' },
    { value: 'settings', label: 'Settings', icon: 'az az-settings' }
  ]

  const DETAIL_LINK_CLASS =
    'group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)'
</script>

<template>
  <div
    class="flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
  >
    <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
      <i
        :class="icon"
        class="shrink-0 text-body-lg text-(--text-muted)"
        aria-hidden="true"
      />
      <div class="flex min-w-0">
        <Tooltip
          :content="`Open ${host} in a new tab`"
          class="w-full"
        >
          <a
            :href="`https://${host}`"
            target="_blank"
            rel="noopener noreferrer"
            :class="DETAIL_LINK_CLASS"
          >
            <span class="truncate underline-offset-2 group-hover/link:underline">{{ host }}</span>
            <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
            <i
              class="az az-external-link shrink-0 text-body-xs leading-none"
              aria-hidden="true"
            />
          </a>
        </Tooltip>
      </div>
    </div>
    <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
      <Button
        label="Visit"
        :href="`https://${host}`"
        target="_blank"
        variant="secondary"
        size="medium"
        icon="az az-external-link"
      />
      <DropdownMenu
        side="bottom"
        align="end"
      >
        <DropdownMenu.Trigger>
          <Tooltip content="Application actions">
            <IconButton
              icon="az az-ellipsis"
              variant="outline"
              size="medium"
              aria-label="Application actions"
            />
          </Tooltip>
        </DropdownMenu.Trigger>
        <DropdownMenu.Group
          v-for="item in menuItems"
          :key="item.value"
        >
          <DropdownMenu.Item
            :value="item.value"
            :label="item.label"
          >
            <template
              v-if="showMenuIcons"
              #leading
            >
              <i
                :class="item.icon"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu>
    </div>
  </div>
</template>

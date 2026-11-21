<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb, { type BreadcrumbItemData } from '@aziontech/webkit/breadcrumb-root'
  import IconButton from '@aziontech/webkit/icon-button'

  export interface CreationHeaderProps {
    /** Name of the back control, read by screen readers. */
    backLabel: string
    /** The trail beside the brand: the module, then the page title. */
    breadcrumb: BreadcrumbItemData[]
    /** The signed-in account, the avatar label. */
    accountLabel?: string
    /** The accessible name of the avatar when its label is initials. */
    accountAlt?: string
  }

  withDefaults(defineProps<CreationHeaderProps>(), {
    accountLabel: 'name@example.com',
    accountAlt: ''
  })

  const emit = defineEmits<{
    back: [event: MouseEvent]
  }>()

  const ACCOUNT_BUTTON_CLASS =
    'rounded-full transition-opacity duration-fast-02 ease-productive-entrance ' +
    'hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) ' +
    'motion-reduce:transition-none'
</script>

<template>
  <AppHeader aria-label="Console">
    <AppHeader.Start>
      <IconButton
        icon="az az-chevron-left"
        :aria-label="backLabel"
        variant="outline"
        size="small"
        @click="(event: MouseEvent) => emit('back', event)"
      />
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
      <button
        type="button"
        aria-label="Account settings"
        :class="ACCOUNT_BUTTON_CLASS"
      >
        <Avatar
          :label="accountLabel"
          :alt="accountAlt"
          size="medium"
          variant="square"
        />
      </button>
    </AppHeader.End>
  </AppHeader>
</template>

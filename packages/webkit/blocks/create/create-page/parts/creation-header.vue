<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import AppHeaderAccount from '@aziontech/webkit/app-header-account'
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
  }

  withDefaults(defineProps<CreationHeaderProps>(), {
    accountLabel: 'name@example.com'
  })

  const emit = defineEmits<{
    back: [event: MouseEvent]
  }>()
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
      <AppHeaderAccount
        :name="accountLabel"
        aria-label="Account settings"
      />
    </AppHeader.End>
  </AppHeader>
</template>

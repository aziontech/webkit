<script setup lang="ts">
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout-root'
  import Resizable from '@aziontech/webkit/resizable'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', href: '/' },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', href: '/functions' }
      ]
    }
  ]

  const lines = Array.from({ length: 80 }, (_, index) => `${index + 1}`)
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    :breadcrumbs="[{ label: 'Functions', href: '/functions' }, { label: 'edge-auth' }]"
    active-id="functions"
  >
    <div
      data-layout-fill
      class="flex min-h-0 flex-col"
    >
      <div
        class="flex h-(--spacing-xxl) shrink-0 items-center border-b border-(--border-default) px-(--spacing-md) text-label-md text-(--text-default)"
      >
        Code
      </div>
      <div class="grid min-h-0 flex-1">
        <Resizable aria-label="Editor workspace">
          <Resizable.Pane aria-label="Source">
            <div
              tabindex="0"
              role="group"
              aria-label="Source lines"
              class="h-full overflow-auto p-(--spacing-md) text-body-sm text-(--text-muted) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
            >
              <p
                v-for="line in lines"
                :key="line"
                class="m-0"
              >
                Line {{ line }}
              </p>
            </div>
          </Resizable.Pane>
          <Resizable.Handle aria-label="Resize the preview" />
          <Resizable.Pane
            :basis="320"
            aria-label="Preview"
          >
            <div
              tabindex="0"
              role="group"
              aria-label="Preview output"
              class="h-full overflow-auto p-(--spacing-md) text-body-sm text-(--text-muted) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
            >
              The panes scroll on their own; the page does not.
            </div>
          </Resizable.Pane>
        </Resizable>
      </div>
    </div>
  </ConsoleLayout>
</template>

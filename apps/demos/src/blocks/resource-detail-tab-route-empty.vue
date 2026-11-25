<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'

  export interface TabRouteEmptyProps {
    /** The tab label. */
    label: string
    /** The route the tab opens on. */
    href: string
  }

  defineProps<TabRouteEmptyProps>()
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <div class="layout-section-start">
      <EmptyState
        size="medium"
        icon="az az-external-link"
        :title="label"
        :description="`${label} opens on its own page.`"
      >
        <template #actions>
          <Button
            :label="`Open ${label}`"
            variant="outline"
            size="small"
            :href="href"
          />
        </template>
      </EmptyState>
    </div>
  </div>
</template>

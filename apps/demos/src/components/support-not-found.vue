<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import { useRouter } from 'vue-router'

  defineOptions({ name: 'SupportNotFound' })

  export interface SupportNotFoundProps {
    /** What the link pointed at, such as Ticket or Customer. */
    label?: string
    /** The id from the link that matched nothing. */
    id?: string
  }

  withDefaults(defineProps<SupportNotFoundProps>(), { label: 'Ticket', id: '' })

  const router = useRouter()
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <section class="layout-section-start pb-(--layout-section-gap)">
        <EmptyState
          bordered
          icon="az az-search"
          :title="id ? `${label} ${id} not found` : `${label} not found`"
          description="It may have been deleted or merged, or the link may be out of date."
        >
          <template #actions>
            <Button
              label="Back to tickets"
              variant="primary"
              size="medium"
              icon="az az-arrow-left"
              @click="router.push('/support')"
            />
          </template>
        </EmptyState>
      </section>
    </div>
  </div>
</template>

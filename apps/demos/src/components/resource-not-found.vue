<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import { useRouter } from 'vue-router'

  defineOptions({ name: 'ResourceNotFound' })

  export interface ResourceNotFoundProps {
    /** The id from the link that matched no resource. */
    id?: string
  }

  withDefaults(defineProps<ResourceNotFoundProps>(), { id: '' })

  const router = useRouter()
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <section class="layout-section-start pb-(--layout-section-gap)">
        <EmptyState
          bordered
          icon="az az-search"
          :title="id ? `Resource ${id} not found` : 'Resource not found'"
          description="No resource with this ID exists in the account. It may have been deleted, or the link may be out of date."
        >
          <template #actions>
            <Button
              label="Back to resources"
              variant="primary"
              size="medium"
              icon="az az-arrow-left"
              @click="router.push('/resources')"
            />
          </template>
        </EmptyState>
      </section>
    </div>
  </div>
</template>

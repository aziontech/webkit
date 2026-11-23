<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const path = computed(() => route.fullPath)
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Page not found"
        description="This address does not match a page in the console."
      />
      <section class="layout-section-start pb-(--layout-section-gap)">
        <EmptyState
          bordered
          icon="az az-search"
          title="Nothing lives at this address"
          :description="`No page answers ${path}. Check the address, or go back to your resources.`"
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

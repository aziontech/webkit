<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const { propertyFilterProps } = useCollection({
    items: [],
    filtering: { fields: ['title', 'description'] },
    propertyFiltering: { properties: [{ key: 'title', label: 'Name' }] }
  })

  const emit = defineEmits(['retry'])
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Templates"
        description="Start a project from a template and deploy it in a few steps."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/templates"
            target="_blank"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <PropertyFilter
          v-bind="propertyFilterProps"
          placeholder="Search templates"
          aria-label="Search templates"
          disabled
        />
        <Alert
          severity="danger"
          label="Couldn't load templates. Check your connection and retry."
          action-label="Retry"
          @action="emit('retry')"
        />
        <EmptyState
          size="medium"
          icon="pi pi-th-large"
          title="Templates are unavailable"
          description="The catalog shows here once it loads. You can still deploy from your own repository."
        >
          <template #actions>
            <Button
              label="Import from Git"
              icon="ai ai-github"
              kind="secondary"
              size="small"
              href="/create/import"
            />
          </template>
        </EmptyState>
      </section>
    </main>
  </div>
</template>

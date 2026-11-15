<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  const PAGE_DESCRIPTION =
    'Rules run top to bottom within each phase, so their order is their behavior. Turn a rule off to skip it without losing its place.'
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Rules"
        :description="PAGE_DESCRIPTION"
        size="small"
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="ai ai-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/rules"
            target="_blank"
          />
          <Button
            label="Add Rule"
            icon="ai ai-plus"
            kind="outlined"
            size="medium"
            disabled
          />
        </template>
      </PageHeader>

      <section
        class="layout-section-start flex min-w-0 flex-1 flex-col gap-(--layout-group-gap) pb-(--layout-boundary-end)"
        aria-label="Rules by phase"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
          <div class="min-w-36 grow basis-(--container-2xs)">
            <Input
              size="medium"
              placeholder="Search rules"
              aria-label="Search rules"
              class="w-full"
              disabled
            >
              <template #prefix>
                <i
                  class="ai ai-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
        </div>

        <Alert
          severity="danger"
          label="Couldn't load the rules. Check your connection and retry."
          action-label="Retry"
          @action="(event) => emit('retry', event)"
        />
      </section>
    </div>
  </div>
</template>

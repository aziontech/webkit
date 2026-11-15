<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Card from '@aziontech/webkit/card'
  import IconButton from '@aziontech/webkit/icon-button'
  import SplitButton from '@aziontech/webkit/split-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  const rootName = 'acme-assets'
  const pathCrumbs = [{ label: rootName, href: '0' }]
  const addToFilesActions = [
    { label: 'Upload file', value: 'upload', icon: 'ai ai-upload' },
    { label: 'Add folder', value: 'folder', icon: 'ai ai-folder-plus' }
  ]
</script>

<template>
  <div class="layout-boundary">
    <div class="flex h-full min-h-0 flex-col">
      <section class="flex min-h-0 flex-col">
        <Card>
          <template #content>
            <div class="flex w-full flex-col gap-(--spacing-sm)">
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i
                  class="ai ai-database shrink-0 text-body-lg text-(--text-muted)"
                  aria-hidden="true"
                />
                <h1 class="min-w-0 truncate text-heading-xxs text-(--text-default)">
                  {{ rootName }}
                </h1>
              </div>
              <div class="flex w-full items-center justify-between gap-(--spacing-xs)">
                <div class="min-w-0">
                  <Breadcrumb
                    :items="pathCrumbs"
                    class="w-full"
                  />
                </div>
                <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                  <Tooltip text="Refresh">
                    <IconButton
                      icon="ai ai-refresh"
                      kind="outlined"
                      size="medium"
                      aria-label="Refresh"
                      @click="(event: MouseEvent) => emit('retry', event)"
                    />
                  </Tooltip>
                  <SplitButton
                    label="Add to files"
                    icon="ai ai-plus"
                    kind="primary"
                    size="medium"
                    :items="addToFilesActions"
                    disabled
                  />
                </div>
              </div>
              <Alert
                severity="danger"
                label="Couldn't load the files in this folder. Check your connection and retry."
                action-label="Retry"
                @action="(event) => emit('retry', event)"
              />
            </div>
          </template>
        </Card>
      </section>
    </div>
  </div>
</template>

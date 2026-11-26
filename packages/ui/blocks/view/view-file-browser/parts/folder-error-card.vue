<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Breadcrumb from '@aziontech/ui/breadcrumb-root'
  import Card from '@aziontech/ui/card'
  import SplitButton from '@aziontech/ui/split-button'

  import { addToFilesActions } from '../lib/file-rows'
  import FolderSearchRow from './folder-search-row.vue'
  import StorageTitle from './storage-title.vue'

  defineProps<{
    rootName: string
    crumbs: { label: string; href: string }[]
    error: string
  }>()

  const emit = defineEmits<{
    navigate: [event: MouseEvent, href: string]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
  }>()
</script>

<template>
  <Card>
    <template #default>
      <div class="flex w-full flex-col gap-(--spacing-sm)">
        <StorageTitle :name="rootName" />
        <FolderSearchRow
          :loading="false"
          :exportable="false"
          disabled
          @refresh="(event: MouseEvent) => emit('refresh', event)"
        />
        <div class="flex w-full items-center justify-between gap-(--spacing-xs)">
          <div class="min-w-0 flex-1">
            <Breadcrumb
              :items="crumbs"
              class="w-full"
              @navigate="(event: MouseEvent, href: string) => emit('navigate', event, href)"
            />
          </div>
          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <SplitButton
              label="Add to files"
              icon="az az-plus"
              variant="primary"
              size="medium"
              :items="addToFilesActions"
              disabled
            />
          </div>
        </div>
        <Alert
          severity="danger"
          :label="error"
          action-label="Retry"
          @action="(event) => emit('retry', event)"
        />
      </div>
    </template>
  </Card>
</template>

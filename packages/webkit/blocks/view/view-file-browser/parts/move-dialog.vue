<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Combobox from '@aziontech/webkit/combobox'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Field from '@aziontech/webkit/field'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { computed, ref, watch } from 'vue'

  import {
    destinationProblem,
    type FileRow,
    formatBytes,
    normalizeDestination
  } from '../lib/file-rows'

  const props = defineProps<{
    moving: FileRow[]
    path: string
    rootName: string
    destinationOptions: { value: string; label?: string; description?: string }[]
  }>()

  const emit = defineEmits<{
    move: [event: Event, destination: string]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const destination = ref('')
  const destinationError = ref('')

  const moveTitle = computed(() =>
    props.moving.length === 1 ? `Move ${props.moving[0].name}` : `Move ${props.moving.length} files`
  )
  const movingSize = computed(() =>
    formatBytes(props.moving.reduce((sum, item) => sum + item.bytes, 0))
  )

  watch(open, (now) => {
    if (!now) return
    destination.value = ''
    destinationError.value = ''
  })

  const confirmMove = (event: Event) => {
    destinationError.value = destinationProblem(destination.value, props.path)
    if (destinationError.value) return
    emit('move', event, normalizeDestination(destination.value))
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DialogTitle>{{ moveTitle }}</DialogTitle>
          <DialogDescription>
            {{ moving.length === 1 ? '1 file' : `${moving.length} files` }}, {{ movingSize }}, from
            {{ path || rootName }}. Pick a folder or type a new path; leave it empty for the storage
            root.
          </DialogDescription>
        </div>
      </PanelHeader>
      <PanelBody>
        <form
          class="flex flex-col gap-(--spacing-md)"
          novalidate
          @submit.prevent="confirmMove"
        >
          <ul
            aria-label="Files to move"
            class="m-0 flex list-none flex-col gap-(--spacing-2xs) p-0"
          >
            <li
              v-for="item in moving"
              :key="item.name"
              class="flex min-w-0 items-center gap-(--spacing-xs) text-body-sm text-(--text-default)"
            >
              <i
                class="az az-file shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="min-w-0 truncate">{{ item.name }}</span>
              <span class="ms-auto shrink-0 text-(--text-muted)">{{ item.size }}</span>
            </li>
          </ul>
          <Field :invalid="!!destinationError">
            <Field.Label>Destination folder</Field.Label>
            <Combobox
              v-model="destination"
              :options="destinationOptions"
              placeholder="/ (storage root)"
              size="large"
              clearable
              @update:model-value="destinationError = ''"
            />
            <Field.Description
              >A folder that does not exist yet is created with the move.</Field.Description
            >
            <Field.Error v-if="destinationError">{{ destinationError }}</Field.Error>
          </Field>
        </form>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full justify-end gap-(--spacing-xs)">
          <Button
            label="Cancel"
            variant="outline"
            size="medium"
            @click="open = false"
          />
          <Button
            :label="moving.length === 1 ? 'Move file' : `Move ${moving.length} files`"
            variant="primary"
            size="medium"
            @click="confirmMove"
          />
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import Field from '@aziontech/ui/field'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import Select from '@aziontech/ui/select'

  import type {
    AccountHierarchyResource,
    AccountHierarchyResourceType
  } from '../account-hierarchy.vue'
  import { plural, types } from '../hierarchy-model'

  export interface HierarchyMoveDialogProps {
    /** The resources being moved. */
    moving: AccountHierarchyResource[]
    /** Where they can go: organizations and groups outside them. */
    destinationOptions: { value: string; label: string; type: AccountHierarchyResourceType }[]
  }

  defineProps<HierarchyMoveDialogProps>()

  const moveOpen = defineModel<boolean>('open', { required: true })
  const destination = defineModel<string>('destination', { required: true })
  const destinationError = defineModel<string>('error', { required: true })

  const emit = defineEmits<{
    confirm: [event: Event]
  }>()

  const confirmMove = (event: Event) => emit('confirm', event)
</script>

<template>
  <Dialog
    v-model:open="moveOpen"
    size="medium"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DialogTitle>{{
            moving.length === 1
              ? `Move ${moving[0].name}`
              : `Move ${plural(moving.length, 'resource', 'resources')}`
          }}</DialogTitle>
          <DialogDescription>
            Everything inside moves with it. Role bindings inherited from the old parent stop
            applying; bindings set on the resource itself stay.
          </DialogDescription>
        </div>
      </PanelHeader>
      <PanelBody>
        <form
          class="flex flex-col gap-(--spacing-md)"
          novalidate
          @submit.prevent="confirmMove"
        >
          <Field :invalid="!!destinationError">
            <Field.Label>New parent</Field.Label>
            <Select
              v-model="destination"
              size="large"
              placeholder="Choose an organization or group"
              @update:model-value="destinationError = ''"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item
                  v-for="option in destinationOptions"
                  :key="option.value"
                  :value="option.value"
                  >{{ option.label }} · {{ types[option.type].label }}</Select.Item
                >
              </Select.Content>
            </Select>
            <Field.Description
              >A resource cannot move into itself or into anything inside it.</Field.Description
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
            @click="moveOpen = false"
          />
          <Button
            label="Move"
            variant="primary"
            size="medium"
            @click="confirmMove"
          />
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>

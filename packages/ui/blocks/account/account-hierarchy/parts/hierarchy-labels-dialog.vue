<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import Field from '@aziontech/ui/field'
  import MultiSelect from '@aziontech/ui/multi-select'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'

  import type { AccountHierarchyResource } from '../account-hierarchy.vue'
  import { plural } from '../hierarchy-model'

  export interface HierarchyLabelsDialogProps {
    /** The resources whose labels change. */
    labelling: AccountHierarchyResource[]
    /** Every label the account uses. */
    knownLabels: string[]
    /** The labels the resources carry. */
    presentLabels: string[]
  }

  defineProps<HierarchyLabelsDialogProps>()

  const labelsOpen = defineModel<boolean>('open', { required: true })
  const addLabels = defineModel<string[]>('add', { required: true })
  const removeLabels = defineModel<string[]>('remove', { required: true })

  const emit = defineEmits<{
    confirm: [event: Event]
  }>()

  const confirmLabels = (event: Event) => emit('confirm', event)
</script>

<template>
  <Dialog
    v-model:open="labelsOpen"
    size="medium"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DialogTitle>{{
            labelling.length === 1
              ? `Labels of ${labelling[0].name}`
              : `Labels of ${plural(labelling.length, 'resource', 'resources')}`
          }}</DialogTitle>
          <DialogDescription>
            Labels group resources for search, billing reports and policies. Changes apply to every
            selected resource.
          </DialogDescription>
        </div>
      </PanelHeader>
      <PanelBody>
        <form
          class="flex flex-col gap-(--spacing-md)"
          novalidate
          @submit.prevent="confirmLabels"
        >
          <Field>
            <Field.Label>Add labels</Field.Label>
            <MultiSelect
              v-model="addLabels"
              placeholder="Choose labels"
            >
              <MultiSelect.Trigger />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="label in knownLabels"
                  :key="label"
                  :value="label"
                  >{{ label }}</MultiSelect.Item
                >
              </MultiSelect.Content>
            </MultiSelect>
          </Field>
          <Field v-if="presentLabels.length">
            <Field.Label>Remove labels</Field.Label>
            <MultiSelect
              v-model="removeLabels"
              placeholder="Choose labels"
            >
              <MultiSelect.Trigger />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="label in presentLabels"
                  :key="label"
                  :value="label"
                  >{{ label }}</MultiSelect.Item
                >
              </MultiSelect.Content>
            </MultiSelect>
          </Field>
        </form>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full justify-end gap-(--spacing-xs)">
          <Button
            label="Cancel"
            variant="outline"
            size="medium"
            @click="labelsOpen = false"
          />
          <Button
            label="Save labels"
            variant="primary"
            size="medium"
            :disabled="!addLabels.length && !removeLabels.length"
            @click="confirmLabels"
          />
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>

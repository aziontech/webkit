<script setup lang="ts">
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelHeader from '@aziontech/ui/panel-header'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/ui/toggle-group'

  export interface ExpandedDialogProps {
    /** Title of the expanded card. */
    title: string
    /** Description of the expanded card. */
    description: string
    /** The chart forms of the toggle; empty hides it. */
    forms?: ToggleGroupOption[]
  }

  withDefaults(defineProps<ExpandedDialogProps>(), { forms: () => [] })

  const open = defineModel<boolean>('open', { default: false })
  const form = defineModel<string>('form', { default: '' })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <Dialog
    v-model:open="open"
    size="large"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogDescription>{{ description }}</DialogDescription>
        </div>
      </PanelHeader>
      <PanelBody>
        <div class="flex min-w-0 flex-col gap-(--spacing-md)">
          <div v-if="forms.length">
            <ToggleGroup
              v-model="form"
              :options="forms"
              size="small"
              :aria-label="`Chart form for ${title}`"
            />
          </div>
          <slot />
        </div>
      </PanelBody>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'

  import type { RuleListPhaseChanges } from '../lib/rule-list'
  import type { RuleListSubject } from '../view-rule-list.vue'

  export interface RuleReviewDialogProps {
    /** The changes per phase. */
    changes: RuleListPhaseChanges[]
    /** What runs the rules. */
    subject: RuleListSubject
    /** The save is in flight. */
    saving: boolean
    /** The last save failed. */
    saveFailed: boolean
    /** Why the save failed. */
    saveError: string
  }

  defineProps<RuleReviewDialogProps>()

  const emit = defineEmits<{
    save: [event: MouseEvent]
  }>()

  const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Dialog
    v-model:open="open"
    :dismissible="!saving"
    :closable="!saving"
    size="medium"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>Review changes</DialogTitle>
      </PanelHeader>
      <PanelBody>
        <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
          <Alert
            v-if="saveFailed"
            severity="danger"
            :label="saveError"
          />
          <DialogDescription>
            Rules run top to bottom within each phase. Saving applies this order to every
            {{ subject === 'firewall' ? 'request' : 'request and response' }} the
            {{ subject }} handles.
          </DialogDescription>
          <section
            v-for="phase in changes"
            :key="phase.value"
            class="flex min-w-0 flex-col gap-(--spacing-xs)"
            :aria-labelledby="`rules-review-${phase.value}`"
          >
            <h3
              :id="`rules-review-${phase.value}`"
              class="m-0 text-label-sm text-(--text-muted)"
            >
              {{ phase.label }} phase
            </h3>
            <ul class="m-0 flex list-none flex-col gap-(--spacing-2xs) p-0">
              <li
                v-for="line in phase.items"
                :key="line.key"
                class="text-body-sm text-(--text-muted)"
              >
                <span class="font-medium text-(--text-default)">{{ line.name }}</span>
                {{ line.text }}.
              </li>
            </ul>
          </section>
        </div>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              type="button"
              label="Cancel"
              variant="outline"
              :disabled="saving"
              @click="open = false"
            />
          </div>
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              type="button"
              :label="saveFailed ? 'Save again' : 'Save'"
              variant="primary"
              :loading="saving"
              @click="(event: MouseEvent) => emit('save', event)"
            />
          </div>
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import type { BreadcrumbItemData } from '@aziontech/ui/breadcrumb-root'
  import Button from '@aziontech/ui/button'
  import Kbd from '@aziontech/ui/kbd'
  import PageHeader from '@aziontech/ui/page-header'
  import SaveBar from '@aziontech/ui/save-bar'
  import type { UseUnsavedChangesReturn } from '@aziontech/ui/use-unsaved-changes'

  import CreationHeader from './creation-header.vue'
  import DiscardDialog from './discard-dialog.vue'

  export interface CreationFrameProps {
    /** Name of the back control, read by screen readers. */
    backLabel: string
    /** The trail beside the brand: the module, then the page title. */
    breadcrumb: BreadcrumbItemData[]
    /** The signed-in account, the avatar label. */
    accountLabel?: string
    /** Page title, fieldset legend and form name. */
    title: string
    /** The line under the title. */
    description: string
    /** Id of the title element, which names the form. */
    titleId: string
    /** Label of the primary button in the save bar. */
    submitLabel: string
    /** The request is in flight: the fieldset locks. */
    submitting: boolean
    /** Why the last request failed, shown inline with Retry under the page title. */
    failure?: string
    /** The title of that inline error. */
    failureTitle?: string
    /** Cancel is disabled while the request runs. */
    lockCancel?: boolean
    /** The submit binding from useCreateForm. */
    submitButton: { type: 'submit'; loading: boolean; 'aria-keyshortcuts': string }
    /** The unsaved-changes guard, for the discard dialog. */
    guard: Pick<
      UseUnsavedChangesReturn<unknown>,
      'dialogProps' | 'labels' | 'keepEditing' | 'discardAndLeave'
    >
    /** Receives the form element, which the submit shortcut belongs to. */
    bindForm: (element: HTMLFormElement | null) => void
  }

  withDefaults(defineProps<CreationFrameProps>(), {
    accountLabel: 'name@example.com',
    failure: '',
    failureTitle: '',
    lockCancel: false
  })

  const emit = defineEmits<{
    leave: [event: MouseEvent]
    submit: [event: Event]
  }>()

  defineSlots<{
    /** The sections of the form. */
    default(): unknown
    /** Content at the start of the save bar. */
    'save-bar-leading'(): unknown
  }>()
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <CreationHeader
      :back-label="backLabel"
      :breadcrumb="breadcrumb"
      :account-label="accountLabel"
      @back="(event: MouseEvent) => emit('leave', event)"
    />

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        :ref="(element) => bindForm(element as HTMLFormElement | null)"
        class="flex min-h-0 flex-1 flex-col"
        :aria-labelledby="titleId"
        novalidate
        @submit.prevent="(event: Event) => emit('submit', event)"
      >
        <div class="flex min-h-0 flex-1 flex-col overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              :title="title"
              :description="description"
              size="small"
              :title-id="titleId"
            />

            <Alert
              v-if="failure"
              class="mt-(--layout-section-gap)"
              severity="danger"
              :title="failureTitle"
              :label="failure"
              action-label="Retry"
              @action="(event: MouseEvent) => emit('submit', event)"
            />
            <fieldset
              :disabled="submitting"
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
            >
              <legend class="sr-only">{{ title }}</legend>
              <slot />
            </fieldset>
          </div>
          <SaveBar variant="centered">
            <template
              v-if="$slots['save-bar-leading']"
              #leading
            >
              <slot name="save-bar-leading" />
            </template>
            <template #actions>
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                :disabled="lockCancel && submitting"
                @click="(event: MouseEvent) => emit('leave', event)"
              />
              <Button
                variant="primary"
                size="medium"
                v-bind="submitButton"
              >
                {{ submitLabel }}
                <Kbd
                  meta
                  key-name="enter"
                  size="small"
                  aria-hidden="true"
                />
              </Button>
            </template>
          </SaveBar>
        </div>
      </form>
    </main>
    <DiscardDialog :guard="guard" />
  </div>
</template>

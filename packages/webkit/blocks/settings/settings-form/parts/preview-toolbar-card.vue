<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Link from '@aziontech/webkit/link'
  import Select from '@aziontech/webkit/select'
  import { reactive } from 'vue'

  import { useCardSave } from '../composables/use-card-save'

  /** The saved Preview Toolbar card, and the values its Save sends. */
  export interface PreviewToolbarValues {
    /** Toolbar setting for pre-production deployments. */
    preprod: string
    /** Toolbar setting for production deployments. */
    prod: string
  }

  export interface PreviewToolbarCardProps {
    /** The saved values; Save stays disabled until the card differs from them. */
    values?: PreviewToolbarValues
    /** Unsaved edits the card opens with, so it starts dirty. */
    defaultDraft?: Partial<PreviewToolbarValues>
    /** The save of this card is in flight: its fields lock and its Save spins. */
    loading?: boolean
    /** Why the save failed, shown in the error toast with Retry; the edits are kept. */
    error?: string
  }

  const props = withDefaults(defineProps<PreviewToolbarCardProps>(), {
    values: () => ({ preprod: 'default', prod: 'default' }),
    defaultDraft: () => ({}),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{ submit: [event: Event, values: PreviewToolbarValues] }>()

  const toolbar = reactive<PreviewToolbarValues>({ ...props.values, ...props.defaultDraft })

  const { dirty, submitting, submit } = useCardSave({
    id: 'preview-toolbar',
    values: toolbar,
    saved: () => props.values,
    loading: () => props.loading,
    error: () => props.error,
    savedMessage: 'Preview Toolbar saved.',
    failedMessage: "The Preview Toolbar settings weren't saved.",
    onSubmit: (event, values) => emit('submit', event, values)
  })

  const toolbarOptions = [
    { label: 'Team default', value: 'default' },
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' }
  ]
  const toolbarLabel = (value: string) =>
    toolbarOptions.find((option) => option.value === value)?.label ?? ''

  const PREVIEW_TOOLBAR_NOTE =
    'Enable the Preview Toolbar on your deployments. To use the toolbar in production, ' +
    'team members need the browser extension or must enable the toolbar for that domain in the toolbar menu.'
</script>

<template>
  <form
    class="layout-section-start"
    aria-label="Preview Toolbar"
    novalidate
    @submit.prevent="submit"
  >
    <Card title="Preview Toolbar">
      <template #default>
        <fieldset
          class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">Preview Toolbar</legend>

          <Alert
            severity="info"
            :label="PREVIEW_TOOLBAR_NOTE"
          />

          <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
            <Field>
              <Field.Label for="tb-preprod">Pre-production deployments</Field.Label>
              <Select
                v-model="toolbar.preprod"
                size="large"
                :disabled="submitting"
                :display-value="toolbarLabel"
              >
                <Select.Trigger id="tb-preprod" />
                <Select.Content>
                  <Select.Item
                    v-for="option in toolbarOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </Field>
            <Field>
              <Field.Label for="tb-prod">Production deployments</Field.Label>
              <Select
                v-model="toolbar.prod"
                size="large"
                :disabled="submitting"
                :display-value="toolbarLabel"
              >
                <Select.Trigger id="tb-prod" />
                <Select.Content>
                  <Select.Item
                    v-for="option in toolbarOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </Field>
          </div>
        </fieldset>
      </template>
      <template #footer>
        <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
          <Link
            href="#"
            label="Learn more about the Preview Toolbar"
            size="medium"
          />
          <Button
            label="Save"
            variant="secondary"
            size="medium"
            type="submit"
            :loading="submitting"
            :disabled="!dirty"
          />
        </div>
      </template>
    </Card>
  </form>
</template>

<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Link from '@aziontech/webkit/link'
  import Select from '@aziontech/webkit/select'
  import { reactive, ref } from 'vue'

  import { saveWithToast } from '../settings-form-save'

  const props = withDefaults(defineProps<{ defaultSaving?: boolean }>(), { defaultSaving: false })

  const toolbarOptions = [
    { label: 'Team default', value: 'default' },
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' }
  ]
  const toolbarLabel = (value: string) =>
    toolbarOptions.find((option) => option.value === value)?.label ?? ''
  const toolbar = reactive({ preprod: 'default', prod: 'default' })
  const savingToolbar = ref(props.defaultSaving)
  const saveToolbar = () => saveWithToast(savingToolbar, 'Preview Toolbar')

  const PREVIEW_TOOLBAR_NOTE =
    'Enable the Preview Toolbar on your deployments. To use the toolbar in production, ' +
    'team members need the browser extension or must enable the toolbar for that domain in the toolbar menu.'
</script>

<template>
  <div class="layout-section-start">
    <Card title="Preview Toolbar">
      <template #default>
        <fieldset
          class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
          :disabled="savingToolbar"
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
                :disabled="savingToolbar"
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
                :disabled="savingToolbar"
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
            :loading="savingToolbar"
            @click="saveToolbar"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

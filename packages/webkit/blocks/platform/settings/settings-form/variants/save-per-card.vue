<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { reactive, ref } from 'vue'

  const toolbarOptions = [
    { label: 'Team default', value: 'default' },
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' }
  ]
  const toolbarLabel = (value) =>
    toolbarOptions.find((option) => option.value === value)?.label ?? ''
  const toolbar = reactive({ preprod: 'default', prod: 'default' })
  const savingToolbar = ref(false)

  const protectionOptions = [
    { label: 'Standard protection', value: 'standard' },
    { label: 'Only preview deployments', value: 'preview' },
    { label: 'All deployments', value: 'all' }
  ]
  const protectionLabel = (value) =>
    protectionOptions.find((option) => option.value === value)?.label ?? ''
  const protection = reactive({ level: 'standard', shareableLinks: true })
  const savingProtection = ref(false)

  const saveCard = (flag) => {
    if (flag.value) return
    flag.value = true
    setTimeout(() => {
      flag.value = false
    }, 900)
  }

  const saveToolbar = () => saveCard(savingToolbar)
  const saveProtection = () => saveCard(savingProtection)
</script>

<template>
  <div class="layout-boundary flex w-full flex-col">
    <PageHeader
      title="Project settings"
      description="Configure how the deployments of this project are previewed and protected."
      size="small"
    />

    <div class="layout-section-start">
      <Card title="Preview Toolbar">
        <template #content>
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            :disabled="savingToolbar"
          >
            <legend class="sr-only">Preview Toolbar</legend>

            <Alert
              severity="info"
              label="Enable the Preview Toolbar on your deployments. To use the toolbar in production, team members need the browser extension or must enable the toolbar for that domain in the toolbar menu."
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
                    <Select.Option
                      v-for="option in toolbarOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
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
                    <Select.Option
                      v-for="option in toolbarOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
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
              kind="secondary"
              size="medium"
              :loading="savingToolbar"
              @click="saveToolbar"
            />
          </div>
        </template>
      </Card>
    </div>

    <div class="layout-section-start">
      <Card title="Deployment Protection">
        <template #content>
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            :disabled="savingProtection"
          >
            <legend class="sr-only">Deployment Protection</legend>

            <Alert
              severity="info"
              label="Control who can access your deployments. Standard protection challenges every visitor before a deployment loads; shareable links let you grant bypass access with a generated URL."
            />

            <Field>
              <Field.Label for="dp-level">Authentication</Field.Label>
              <div class="sm:max-w-(--container-sm)">
                <Select
                  v-model="protection.level"
                  size="large"
                  :disabled="savingProtection"
                  :display-value="protectionLabel"
                >
                  <Select.Trigger id="dp-level" />
                  <Select.Content>
                    <Select.Option
                      v-for="option in protectionOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </div>
            </Field>

            <Field orientation="horizontal">
              <Field.Content>
                <Field.Label>Shareable links</Field.Label>
                <p class="text-body-sm text-(--text-muted)">
                  Allow bypassing protection with a generated link.
                </p>
              </Field.Content>
              <Switch
                v-model="protection.shareableLinks"
                :disabled="savingProtection"
              />
            </Field>
          </fieldset>
        </template>
        <template #footer>
          <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
            <Button
              label="Save"
              kind="secondary"
              size="medium"
              :loading="savingProtection"
              @click="saveProtection"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

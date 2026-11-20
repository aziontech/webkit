<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupInput from '@aziontech/webkit/input-group-input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Kbd from '@aziontech/webkit/kbd'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, onMounted, reactive, ref } from 'vue'

  import CreateDeployTemplate from '../create-deploy-template.vue'

  interface TemplateSetting {
    name: string
    label: string
    placeholder: string
    description: string
    required: boolean
    defaultValue: string
  }

  interface TemplateVariable {
    name: string
    variable: string
    placeholder: string
    required: boolean
    secret: boolean
  }

  const scopes: SelectOptionItem[] = [
    { label: 'jane-doe', value: 'jane-doe' },
    { label: 'acme', value: 'acme' },
    { label: 'acme-templates', value: 'acme-templates' }
  ]

  const presets: SelectOptionItem[] = [
    { label: 'Nuxt', value: 'nuxt' },
    { label: 'Next.js', value: 'next' },
    { label: 'Vite', value: 'vite' },
    { label: 'Astro', value: 'astro' },
    { label: 'Static files', value: 'static' }
  ]

  const settings: TemplateSetting[] = [
    {
      name: 'storeDomain',
      label: 'Store domain',
      placeholder: 'https://shop.example.com',
      description: 'The domain your store answers on.',
      required: false,
      defaultValue: ''
    }
  ]

  const buildSettings: TemplateSetting[] = [
    {
      name: 'rootDirectory',
      label: 'Root directory',
      placeholder: '/',
      description: "The folder that holds the project's package.json.",
      required: true,
      defaultValue: '/'
    },
    {
      name: 'installCommand',
      label: 'Install command',
      placeholder: 'npm install',
      description: "Installs the project's dependencies before the build runs.",
      required: true,
      defaultValue: 'npm install'
    }
  ]

  const variables: TemplateVariable[] = [
    {
      name: 'storeAccessToken',
      variable: 'NUXT_STORE_ACCESS_TOKEN',
      placeholder: 'Access token',
      required: true,
      secret: true
    },
    {
      name: 'storeRevalidationSecret',
      variable: 'NUXT_STORE_REVALIDATION_SECRET',
      placeholder: 'Revalidation secret',
      required: false,
      secret: true
    }
  ]

  const scope = ref('jane-doe')
  const repoName = ref('nuxt-ecommerce')
  const isPublic = ref(true)
  const values = reactive<Record<string, string>>({
    ...Object.fromEntries(settings.map((field) => [field.name, field.defaultValue])),
    ...Object.fromEntries(buildSettings.map((field) => [field.name, field.defaultValue])),
    ...Object.fromEntries(variables.map((field) => [field.name, '']))
  })
  const revealed = reactive<Record<string, boolean>>({})
  const submitted = ref(true)
  const buildOpen = ref<string | null>('build')
  const variablesOpen = ref<string | null>('variables')

  const isMissing = (field: { name: string; required: boolean }) =>
    field.required && !(values[field.name] || '').trim()

  const errorOf = (field: {
    name: string
    required: boolean
    label?: string
    variable?: string
  }) => (submitted.value && isMissing(field) ? `${field.label ?? field.variable} is required.` : '')

  const repoNameError = computed(() =>
    submitted.value && !repoName.value.trim() ? 'Repository name is required.' : ''
  )

  const deploy = () => {
    submitted.value = true
    if (buildSettings.some(isMissing)) buildOpen.value = 'build'
    if (variables.some(isMissing)) variablesOpen.value = 'variables'
  }

  const detectedPreset = 'nuxt'
  const preset = ref(detectedPreset)

  const presetHelper = computed(() => {
    if (!preset.value)
      return 'Nothing here names a framework. Pick one to build the project, or leave it empty to serve the files as they are.'
    if (preset.value === detectedPreset)
      return 'Detected from your project. Change it if it is wrong.'
    return 'The project is built with this preset.'
  })

  const guard = useUnsavedChanges(() => ({
    scope: scope.value,
    repoName: repoName.value,
    isPublic: isPublic.value,
    preset: preset.value,
    values
  }))
  const discardDialog = guard.dialogProps
  const discardLabels = guard.labels

  const onLeave = () => guard.confirmLeave()

  const panelEl = ref<HTMLElement | null>(null)

  useShortcuts({
    keys: 'meta+enter',
    label: 'Deploy',
    group: 'Page',
    element: panelEl,
    handler: deploy
  })

  onMounted(() =>
    panelEl.value
      ?.querySelector<HTMLElement>(
        '[role="combobox"], input:not([type="hidden"]), textarea, select'
      )
      ?.focus()
  )
</script>

<template>
  <CreateDeployTemplate @back="onLeave">
    <div
      ref="panelEl"
      data-phase="form"
      class="flex w-full flex-col items-center gap-(--spacing-xl)"
    >
      <Card class="w-full">
        <template #default>
          <div class="flex flex-col gap-(--spacing-lg)">
            <div class="flex flex-col gap-(--spacing-2xs)">
              <h2 class="text-heading-xs text-(--text-default)">Deploy your project</h2>
              <p class="text-body-sm text-pretty text-(--text-muted)">
                This repository deploys on every push, automatically.
              </p>
            </div>

            <div class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2">
              <Field>
                <Field.Label>Scope</Field.Label>
                <Select
                  v-model="scope"
                  size="large"
                  placeholder="Select a scope"
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item
                      v-for="option in scopes"
                      :key="String(option.value)"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                  </Select.Content>
                </Select>
              </Field>

              <Field
                required
                :invalid="Boolean(repoNameError)"
              >
                <Field.Label for="repoName">
                  {{ isPublic ? 'Public repository name' : 'Private repository name' }}
                </Field.Label>
                <InputGroupRoot size="large">
                  <InputGroupInput
                    id="repoName"
                    v-model="repoName"
                    placeholder="my-repository"
                  />
                  <InputGroupAddon>
                    <Tooltip content="Repository visibility">
                      <Switch
                        v-model="isPublic"
                        variant="privacy"
                        aria-label="Public repository"
                      />
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroupRoot>
                <Field.Error v-if="repoNameError">{{ repoNameError }}</Field.Error>
              </Field>
            </div>

            <h3 class="text-heading-2xs text-(--text-default)">Template settings</h3>
            <div class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2">
              <Field
                v-for="field in settings"
                :key="field.name"
                :required="field.required"
                :invalid="Boolean(errorOf(field))"
              >
                <Field.Label>{{ field.label }}</Field.Label>
                <Input
                  v-model="values[field.name]"
                  size="large"
                  :placeholder="field.placeholder"
                />
                <Field.Error v-if="errorOf(field)">{{ errorOf(field) }}</Field.Error>
                <Field.Description v-else-if="field.description">{{
                  field.description
                }}</Field.Description>
              </Field>
            </div>

            <div class="flex flex-col gap-(--spacing-xs)">
              <div class="overflow-hidden rounded-(--shape-card) border border-(--border-default)">
                <div class="-mb-px">
                  <Accordion
                    v-model="buildOpen"
                    type="single"
                    collapsible
                    size="large"
                    icon-position="leading"
                  >
                    <Accordion.Item value="build">
                      <Accordion.Trigger>
                        <span class="text-label-sm text-(--text-default)"
                          >Build and output settings</span
                        >
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                          <Field>
                            <Field.Label>Build preset</Field.Label>
                            <Select
                              v-model="preset"
                              size="large"
                              placeholder="Select a preset"
                            >
                              <Select.Trigger />
                              <Select.Content>
                                <Select.Item
                                  v-for="option in presets"
                                  :key="String(option.value)"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Item>
                              </Select.Content>
                            </Select>
                            <Field.Description>{{ presetHelper }}</Field.Description>
                          </Field>
                          <div
                            class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2"
                          >
                            <Field
                              v-for="field in buildSettings"
                              :key="field.name"
                              :required="field.required"
                              :invalid="Boolean(errorOf(field))"
                            >
                              <Field.Label>{{ field.label }}</Field.Label>
                              <Input
                                v-model="values[field.name]"
                                size="large"
                                :placeholder="field.placeholder"
                              />
                              <Field.Error v-if="errorOf(field)">{{ errorOf(field) }}</Field.Error>
                              <Field.Description v-else-if="field.description">{{
                                field.description
                              }}</Field.Description>
                            </Field>
                          </div>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
              <div class="overflow-hidden rounded-(--shape-card) border border-(--border-default)">
                <div class="-mb-px">
                  <Accordion
                    v-model="variablesOpen"
                    type="single"
                    collapsible
                    size="large"
                    icon-position="leading"
                  >
                    <Accordion.Item value="variables">
                      <Accordion.Trigger>
                        <span class="text-label-sm text-(--text-default)"
                          >Environment variables</span
                        >
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                          <Field
                            v-for="field in variables"
                            :key="field.name"
                            :required="field.required"
                            :invalid="Boolean(errorOf(field))"
                          >
                            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                              <InputGroupRoot
                                size="large"
                                disabled
                              >
                                <InputGroupAddon>
                                  <label
                                    :for="`${field.name}-key`"
                                    class="w-20"
                                  >
                                    Key
                                  </label>
                                </InputGroupAddon>
                                <InputGroupInput
                                  :id="`${field.name}-key`"
                                  :model-value="field.variable"
                                  readonly
                                  disabled
                                />
                              </InputGroupRoot>
                              <InputGroupRoot size="large">
                                <InputGroupAddon>
                                  <span class="w-20">
                                    <Field.Label>Value</Field.Label>
                                  </span>
                                </InputGroupAddon>
                                <InputGroupInput
                                  v-model="values[field.name]"
                                  :type="
                                    field.secret && !revealed[field.name] ? 'password' : 'text'
                                  "
                                  :placeholder="field.placeholder"
                                  autocomplete="off"
                                  spellcheck="false"
                                />
                                <Tooltip
                                  v-if="field.secret"
                                  :content="revealed[field.name] ? 'Hide value' : 'Show value'"
                                >
                                  <IconButton
                                    :icon="revealed[field.name] ? 'az az-eye-off' : 'az az-eye'"
                                    variant="outline"
                                    size="large"
                                    :aria-label="revealed[field.name] ? 'Hide value' : 'Show value'"
                                    :aria-pressed="Boolean(revealed[field.name])"
                                    @click="revealed[field.name] = !revealed[field.name]"
                                  />
                                </Tooltip>
                                <div class="hidden self-stretch sm:flex">
                                  <InputGroupAddon>
                                    <Tooltip
                                      :content="
                                        field.secret
                                          ? 'The template keeps this value secret.'
                                          : 'The template stores this value as plain text.'
                                      "
                                    >
                                      <span class="flex items-center gap-(--spacing-xs)">
                                        <label :for="`${field.name}-secret`">Secret</label>
                                        <Checkbox
                                          :model-value="field.secret"
                                          disabled
                                          :id="`${field.name}-secret`"
                                        />
                                        <i
                                          class="az az-lock text-body-xs"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Tooltip>
                                  </InputGroupAddon>
                                </div>
                              </InputGroupRoot>
                              <p class="text-body-xs text-(--text-muted) sm:hidden">
                                {{
                                  field.secret
                                    ? 'The template keeps this value secret.'
                                    : 'The template stores this value as plain text.'
                                }}
                              </p>
                            </div>
                            <Field.Error v-if="errorOf(field)">{{ errorOf(field) }}</Field.Error>
                          </Field>
                          <p class="text-body-xs text-(--text-muted)">
                            These values are passed to the build of Nuxt E-commerce.
                          </p>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <Button
            class="w-full"
            variant="primary"
            size="large"
            :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
            @click="deploy"
          >
            Deploy
            <Kbd
              meta
              key-name="enter"
              size="small"
              aria-hidden="true"
            />
          </Button>
        </template>
      </Card>

      <Button
        label="Browse templates"
        variant="outline"
        size="medium"
      />
    </div>
  </CreateDeployTemplate>
  <ConfirmDialog
    v-bind="discardDialog"
    data-testid="unsaved-changes-dialog"
  >
    <template #actions>
      <Button
        :label="discardLabels.keepEditing"
        variant="ghost"
        size="medium"
        data-autofocus
        @click="guard.keepEditing"
      />
      <Button
        :label="discardLabels.discard"
        variant="danger"
        size="medium"
        @click="guard.discardAndLeave"
      />
    </template>
  </ConfirmDialog>
</template>

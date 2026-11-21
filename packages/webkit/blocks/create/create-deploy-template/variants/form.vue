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
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, onMounted, reactive, ref } from 'vue'

  import CreateDeployTemplate, { type DeployTemplateTemplate } from '../create-deploy-template.vue'
  import BuildPresetField from '../parts/build-preset-field.vue'
  import DeployHeading from '../parts/deploy-heading.vue'
  import {
    type DeployFormSetting,
    type DeployFormVariable,
    sampleBuildSettings,
    sampleScopes,
    sampleSettings,
    sampleTemplate,
    sampleVariables
  } from '../sample'

  export interface DeployFormProps {
    /** The way the page was reached, the first crumb. Left out, the page's own. */
    crumb?: string
    /** The template or repository to deploy. Left out, the sample template renders. */
    template?: DeployTemplateTemplate
    /** The scope the Scope select starts on. */
    defaultScope?: string
    /** The repository name the field starts with. */
    defaultRepoName?: string
    /** The template's own settings; an empty list hides the Template settings group. Left out, the sample renders. */
    settings?: DeployFormSetting[]
    /** The environment variables the template asks for; an empty list hides their group. Left out, the sample renders. */
    variables?: DeployFormVariable[]
    /** Shows the Build preset select in Build and output settings. */
    showPreset?: boolean
    /** The preset found in the project, the one the select starts on. */
    detectedPreset?: string
    /** Starts as the form looks after Deploy was pressed: each missing value is flagged. */
    defaultSubmitted?: boolean
    /** Opens Build and output settings from the start. */
    defaultBuildOpen?: boolean
    /** The template settings are loading: Skeleton bands stand in for them and Deploy is disabled. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<DeployFormProps>(), {
    crumb: undefined,
    template: undefined,
    defaultScope: 'jane-doe',
    defaultRepoName: 'nuxt-ecommerce',
    settings: undefined,
    variables: undefined,
    showPreset: false,
    detectedPreset: '',
    defaultSubmitted: false,
    defaultBuildOpen: false,
    loading: false
  })

  const settings = computed(() => props.settings ?? sampleSettings)
  const variables = computed(() => props.variables ?? sampleVariables)
  const templateName = computed(() => (props.template ?? sampleTemplate).name)

  const scope = ref(props.defaultScope)
  const repoName = ref(props.defaultRepoName)
  const isPublic = ref(true)
  const preset = ref(props.detectedPreset)
  const values = reactive<Record<string, string>>({
    ...Object.fromEntries(settings.value.map((field) => [field.name, field.defaultValue])),
    ...Object.fromEntries(sampleBuildSettings.map((field) => [field.name, field.defaultValue])),
    ...Object.fromEntries(variables.value.map((field) => [field.name, '']))
  })
  const revealed = reactive<Record<string, boolean>>({})
  const submitted = ref(props.defaultSubmitted)
  const buildOpen = ref<string | null>(props.defaultBuildOpen ? 'build' : null)
  const variablesOpen = ref<string | null>('variables')

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
    if (sampleBuildSettings.some(isMissing)) buildOpen.value = 'build'
    if (variables.value.some(isMissing)) variablesOpen.value = 'variables'
  }

  const panelEl = ref<HTMLElement | null>(null)

  useShortcuts({
    keys: 'meta+enter',
    label: 'Deploy',
    group: 'Page',
    element: panelEl,
    when: () => !props.loading,
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
  <CreateDeployTemplate
    :crumb="crumb"
    :template="template"
    @back="onLeave"
  >
    <div
      ref="panelEl"
      data-phase="form"
      class="flex w-full flex-col items-center gap-(--spacing-xl)"
    >
      <Card class="w-full">
        <template #default>
          <div class="flex flex-col gap-(--spacing-lg)">
            <DeployHeading />

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
                      v-for="option in sampleScopes"
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

            <div
              v-if="loading"
              class="flex flex-col gap-(--spacing-lg)"
              aria-busy="true"
            >
              <div
                v-for="row in 3"
                :key="row"
                class="flex flex-col gap-(--spacing-xs)"
                aria-hidden="true"
              >
                <Skeleton
                  width="30%"
                  height="var(--size-4)"
                />
                <Skeleton height="var(--size-10)" />
                <Skeleton
                  width="55%"
                  height="var(--size-3)"
                />
              </div>
              <span
                class="sr-only"
                role="status"
              >
                Loading the template settings.
              </span>
            </div>
            <template v-else>
              <template v-if="settings.length">
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
              </template>

              <div class="flex flex-col gap-(--spacing-xs)">
                <div
                  class="overflow-hidden rounded-(--shape-card) border border-(--border-default)"
                >
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
                            <BuildPresetField
                              v-if="showPreset"
                              v-model="preset"
                              :detected-preset="detectedPreset"
                            />
                            <div
                              class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2"
                            >
                              <Field
                                v-for="field in sampleBuildSettings"
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
                                <Field.Error v-if="errorOf(field)">{{
                                  errorOf(field)
                                }}</Field.Error>
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
                <div
                  v-if="variables.length"
                  class="overflow-hidden rounded-(--shape-card) border border-(--border-default)"
                >
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
                                      :aria-label="
                                        revealed[field.name] ? 'Hide value' : 'Show value'
                                      "
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
                              These values are passed to the build of {{ templateName }}.
                            </p>
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>

        <template #footer>
          <Button
            v-if="loading"
            key="loading"
            class="w-full"
            label="Deploy"
            variant="primary"
            size="large"
            disabled
          />
          <Button
            v-else
            key="ready"
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

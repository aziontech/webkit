<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupInput from '@aziontech/webkit/input-group-input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'

  interface TemplateSetting {
    name: string
    label: string
    placeholder: string
    description: string
    required: boolean
    defaultValue: string
  }

  const breadcrumb = [{ label: 'Import from Git' }, { label: 'acme-web', active: true }]

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

  const scope = ref('acme')
  const repoName = ref('acme-web')
  const isPublic = ref(true)
  const values = reactive<Record<string, string>>(
    Object.fromEntries(buildSettings.map((field) => [field.name, field.defaultValue]))
  )
  const submitted = ref(false)
  const buildOpen = ref<string | null>(null)

  const isMissing = (field: { name: string; required: boolean }) =>
    field.required && !(values[field.name] || '').trim()

  const errorOf = (field: TemplateSetting) =>
    submitted.value && isMissing(field) ? `${field.label} is required.` : ''

  const repoNameError = computed(() =>
    submitted.value && !repoName.value.trim() ? 'Repository name is required.' : ''
  )

  const deploy = () => {
    submitted.value = true
    if (buildSettings.some(isMissing)) buildOpen.value = 'build'
  }

  const detectedPreset = 'vite'
  const preset = ref(detectedPreset)

  const presetHelper = computed(() => {
    if (!preset.value)
      return 'Nothing here names a framework. Pick one to build the project, or leave it empty to serve the files as they are.'
    if (preset.value === detectedPreset)
      return 'Detected from your project. Change it if it is wrong.'
    return 'The project is built with this preset.'
  })
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Start>
        <IconButton
          icon="ai ai-chevron-left"
          aria-label="Back to Creation Center"
          variant="outline"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              variant="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Start>
      <GlobalHeader.Center />
      <GlobalHeader.End>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            variant="square"
          />
        </button>
      </GlobalHeader.End>
    </GlobalHeader>

    <main
      class="animate-page-enter motion-reduce:animate-none relative min-w-0 flex-1 overflow-auto"
    >
      <div
        class="layout-column-focused relative flex min-h-full flex-col items-center gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-2xl)"
      >
        <Card class="w-full">
          <template #default>
            <div class="flex w-full items-start gap-(--spacing-md)">
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai ai-github text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>

              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
                <div class="flex w-full min-w-0 flex-col overflow-hidden">
                  <span class="flex items-center gap-(--spacing-xs)">
                    <span class="truncate text-heading-2xs text-(--text-default)">acme-web</span>
                  </span>
                  <span class="text-body-xs text-(--text-muted)">
                    Import and deploy the acme-web repository from GitHub.
                  </span>
                </div>

                <div class="flex w-full flex-col gap-(--spacing-2xs)">
                  <span class="truncate text-body-2xs text-(--text-muted)"
                    >Importing from GitHub</span
                  >
                  <div class="flex items-center gap-(--spacing-md)">
                    <span
                      class="flex h-5 items-center gap-(--spacing-2xs) text-label-sm text-(--text-default)"
                    >
                      <i
                        class="ai ai-github text-[length:inherit] leading-none"
                        aria-hidden="true"
                      />
                      acme
                    </span>
                    <span
                      class="flex h-5 items-center gap-(--spacing-2xs) text-label-sm text-(--text-muted)"
                    >
                      <i
                        class="ai ai-folder text-[length:inherit] leading-none"
                        aria-hidden="true"
                      />
                      acme-web
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <div
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
                            <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-md)">
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
                </div>
              </div>
            </template>

            <template #footer>
              <Button
                class="w-full"
                label="Deploy"
                variant="primary"
                size="large"
                @click="deploy"
              />
            </template>
          </Card>

          <Button
            label="Browse templates"
            variant="outline"
            size="medium"
          />
        </div>
      </div>
    </main>
  </div>
</template>

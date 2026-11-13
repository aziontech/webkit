<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
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

  const breadcrumb = [
    { label: 'Start from a template' },
    { label: 'Nuxt E-commerce', current: true }
  ]

  const scopes: SelectOptionItem[] = [
    { label: 'riley-carter', value: 'riley-carter' },
    { label: 'acme', value: 'acme' },
    { label: 'acme-templates', value: 'acme-templates' }
  ]

  const settings = [
    {
      name: 'storeAccessToken',
      label: 'Store access token',
      placeholder: 'Access token',
      description: 'You can find this token in the API credentials of your store.',
      required: true
    },
    {
      name: 'storeRevalidationSecret',
      label: 'Store revalidation secret',
      placeholder: 'Revalidation secret',
      description: 'You can find this secret in the API credentials of your store.',
      required: false
    },
    {
      name: 'storeDomain',
      label: 'Store domain',
      placeholder: 'https://shop.example.com',
      description: 'The domain your store answers on',
      required: false
    }
  ]

  const scope = ref('riley-carter')
  const repoName = ref('nuxt-ecommerce')
  const isPublic = ref(true)
  const values = reactive(Object.fromEntries(settings.map((field) => [field.name, ''])))

  const canDeploy = computed(
    () =>
      Boolean(repoName.value.trim()) &&
      settings.filter((field) => field.required).every((field) => (values[field.name] || '').trim())
  )
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Creation Center"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

    <main
      class="animate-page-enter motion-reduce:animate-none relative min-w-0 flex-1 overflow-auto"
    >
      <div
        class="layout-column-focused relative flex min-h-full flex-col items-center gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-xxl)"
      >
        <div
          class="flex w-full items-start gap-(--spacing-md) overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas) max-w-none! motion-reduce:transition-none! motion-reduce:transform-none!"
        >
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
          >
            <i
              class="ai-cor ai-nuxt text-body-lg leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </span>

          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
            <div class="flex w-full min-w-0 flex-col overflow-hidden">
              <span class="flex items-center gap-(--spacing-xs)">
                <span class="truncate text-heading-xxs text-(--text-default)">Nuxt E-commerce</span>
              </span>
              <span class="text-body-xs text-(--text-muted)">
                Launch a Nuxt e-commerce or content app in a few steps.
              </span>
            </div>

            <div class="flex w-full flex-col gap-(--spacing-xxs)">
              <span class="truncate text-body-xxs text-(--text-muted)">Cloning from GitHub</span>
              <div class="flex items-center gap-(--spacing-md)">
                <span
                  class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-default)"
                >
                  <i
                    class="ai ai-github text-[length:inherit] leading-none"
                    aria-hidden="true"
                  />
                  acme
                </span>
                <span
                  class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)"
                >
                  <i
                    class="pi pi-folder text-[length:inherit] leading-none"
                    aria-hidden="true"
                  />
                  templates/nuxt-ecommerce
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          data-phase="form"
          class="flex w-full flex-col items-center gap-(--spacing-xl) data-[phase=success]:my-auto motion-reduce:transition-none! motion-reduce:transform-none!"
        >
          <Card class="w-full">
            <template #content>
              <div class="flex flex-col gap-(--spacing-lg)">
                <div class="flex flex-col gap-(--spacing-xxs)">
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
                        <Select.Option
                          v-for="option in scopes"
                          :key="String(option.value)"
                          :value="option.value"
                          :disabled="option.disabled"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </Field>

                  <Field required>
                    <Field.Label for="repoName">
                      {{ isPublic ? 'Public repository name' : 'Private repository name' }}
                    </Field.Label>
                    <InputGroupRoot size="large">
                      <InputGroupInput
                        id="repoName"
                        v-model="repoName"
                        placeholder="my-repository"
                        required
                      />
                      <InputGroupAddon>
                        <Tooltip text="Repository visibility">
                          <Switch
                            v-model="isPublic"
                            kind="privacy"
                            aria-label="Public repository"
                          />
                        </Tooltip>
                      </InputGroupAddon>
                    </InputGroupRoot>
                  </Field>
                </div>

                <h3 class="text-heading-xxs text-(--text-default)">Template settings</h3>
                <div class="flex flex-col gap-(--spacing-lg)">
                  <Field
                    v-for="field in settings"
                    :key="field.name"
                  >
                    <Field.Label>{{ field.label }}</Field.Label>
                    <Input
                      v-model="values[field.name]"
                      size="large"
                      :placeholder="field.placeholder"
                    />
                    <Field.Description v-if="field.description">{{
                      field.description
                    }}</Field.Description>
                  </Field>
                </div>
              </div>
            </template>

            <template #footer>
              <Button
                class="w-full"
                label="Deploy"
                kind="primary"
                size="large"
                :disabled="!canDeploy"
              />
            </template>
          </Card>

          <Button
            label="Browse templates"
            kind="outlined"
            size="medium"
          />
        </div>
      </div>
    </main>
  </div>
</template>

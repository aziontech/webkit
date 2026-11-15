<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupInput from '@aziontech/webkit/input-group-input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const breadcrumb = [
    { label: 'Start from a template' },
    { label: 'Nuxt E-commerce', active: true }
  ]

  const scopes: SelectOptionItem[] = [
    { label: 'jane-doe', value: 'jane-doe' },
    { label: 'acme', value: 'acme' },
    { label: 'acme-templates', value: 'acme-templates' }
  ]

  const scope = ref('jane-doe')
  const repoName = ref('nuxt-ecommerce')
  const isPublic = ref(true)
  const repoNameError = ''
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Start>
        <IconButton
          icon="ai ai-chevron-left"
          aria-label="Back to Creation Center"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
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
            kind="square"
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
                  class="ai-color ai-nuxt text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>

              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
                <div class="flex w-full min-w-0 flex-col overflow-hidden">
                  <span class="flex items-center gap-(--spacing-xs)">
                    <span class="truncate text-heading-2xs text-(--text-default)"
                      >Nuxt E-commerce</span
                    >
                  </span>
                  <span class="text-body-xs text-(--text-muted)">
                    Launch a Nuxt e-commerce or content app in a few steps.
                  </span>
                </div>

                <div class="flex w-full flex-col gap-(--spacing-2xs)">
                  <span class="truncate text-body-2xs text-(--text-muted)"
                    >Cloning from GitHub</span
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
                      templates/nuxt-ecommerce
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
                        <Select.Option
                          v-for="option in scopes"
                          :key="String(option.value)"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
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
                            kind="privacy"
                            aria-label="Public repository"
                          />
                        </Tooltip>
                      </InputGroupAddon>
                    </InputGroupRoot>
                    <Field.Error v-if="repoNameError">{{ repoNameError }}</Field.Error>
                  </Field>
                </div>

                <div
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
              </div>
            </template>

            <template #footer>
              <Button
                class="w-full"
                label="Deploy"
                kind="primary"
                size="large"
                disabled
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

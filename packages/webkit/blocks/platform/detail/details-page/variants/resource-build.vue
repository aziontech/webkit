<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Tabs from '@aziontech/webkit/tabs'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'versions', label: 'Versions' },
    { value: 'build', label: 'Build' },
    { value: 'deployments', label: 'Deployments' }
  ]

  const activeTab = ref('build')

  const buildDefaults = { buildCommand: 'platform build', deployCommand: 'platform deploy --local' }

  const buildConfig = reactive({ ...buildDefaults })
  const saving = ref(false)
  const baseline = ref(JSON.stringify(buildConfig))
  const dirty = computed(() => JSON.stringify(buildConfig) !== baseline.value)

  const save = () => {
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(buildConfig)
      saving.value = false
    }, 800)
  }

  const discard = () => {
    Object.assign(buildConfig, JSON.parse(baseline.value))
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <div class="relative flex min-h-0 flex-1 flex-col">
      <section class="min-h-0 flex-1">
        <div class="flex min-h-full flex-col">
          <div class="flex min-w-0 flex-col">
            <div
              class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
            >
              <PageHeader
                title="Build"
                description="This resource has no repository. Connect one here, or keep deploying from your terminal."
                size="small"
              >
                <template #actions>
                  <Button
                    label="Deploy"
                    icon="pi pi-cloud-upload"
                    kind="outlined"
                    size="medium"
                  />
                </template>
              </PageHeader>

              <div class="mt-(--layout-section-gap) flex min-w-0 flex-col">
                <SettingsSection
                  title="Git repository"
                  hint="Connect a provider to build this resource from a repository."
                  anchor="git-repository"
                >
                  <Card>
                    <template #content>
                      <div
                        class="flex rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) lg:min-h-0 lg:flex-1"
                      >
                        <EmptyState
                          size="medium"
                          title="Connect your repository"
                          description="Select a Git provider, then select the repository this resource builds from. Until then, new code reaches it from the CLI only."
                          class="w-full"
                        >
                          <template #icon>
                            <span class="relative flex size-10 items-center justify-center">
                              <span
                                aria-hidden="true"
                                class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                              />
                              <span
                                aria-hidden="true"
                                class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                              />
                              <span
                                class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                              >
                                <i
                                  class="ai ai-github text-body-md leading-none text-(--text-default)"
                                  aria-hidden="true"
                                />
                              </span>
                            </span>
                          </template>
                          <template #actions>
                            <Button
                              label="Continue with GitHub"
                              icon="ai ai-github"
                              kind="secondary"
                              size="large"
                            />
                            <Link
                              label="Manage connected providers"
                              href="#"
                              size="large"
                            />
                          </template>
                        </EmptyState>
                      </div>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="Build configuration"
                  hint="How the CLI builds this resource."
                  anchor="build-configuration"
                >
                  <form
                    aria-label="Build configuration"
                    novalidate
                    @submit.prevent="save"
                  >
                    <Card :padded="false">
                      <template #content>
                        <fieldset
                          class="m-0 flex min-w-0 flex-col border-0 p-0"
                          :disabled="saving"
                        >
                          <legend class="sr-only">Build configuration</legend>
                          <Item.List>
                            <SettingRow
                              title="Framework preset"
                              description="The preset the CLI builds with."
                            >
                              <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                                <div class="flex flex-1 cursor-not-allowed">
                                  <Tooltip
                                    text="Detected from platform.config and can't be changed here."
                                    class="w-full"
                                  >
                                    <div class="pointer-events-none">
                                      <Input
                                        model-value="Next.js"
                                        size="large"
                                        disabled
                                        aria-label="Framework preset"
                                      />
                                    </div>
                                  </Tooltip>
                                </div>
                              </div>
                            </SettingRow>

                            <SettingRow
                              title="Build command"
                              description="The command that builds the resource."
                              stackable
                            >
                              <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                                <Input
                                  v-model="buildConfig.buildCommand"
                                  size="large"
                                  :disabled="saving"
                                  class="w-full"
                                  aria-label="Build command"
                                  monospace
                                  :spellcheck="false"
                                />
                              </div>
                            </SettingRow>

                            <SettingRow
                              title="Deploy command"
                              description="The command that deploys the build."
                              stackable
                            >
                              <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                                <Input
                                  v-model="buildConfig.deployCommand"
                                  size="large"
                                  :disabled="saving"
                                  class="w-full"
                                  aria-label="Deploy command"
                                  monospace
                                  :spellcheck="false"
                                />
                              </div>
                            </SettingRow>
                          </Item.List>
                        </fieldset>
                      </template>
                    </Card>
                  </form>
                </SettingsSection>

                <SettingsSection
                  title="Deployment"
                  hint="The personal token the workflow authenticates with, kept as a repository secret."
                  anchor="deployment"
                >
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
                          title="API token"
                          description="Stored as the PLATFORM_TOKEN GitHub secret."
                          stackable
                        >
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <InputGroupRoot class="w-full">
                              <div class="flex flex-1">
                                <Input
                                  model-value="analytics-app build token"
                                  size="large"
                                  class="w-full"
                                  aria-label="API token"
                                  monospace
                                  readonly
                                />
                              </div>
                              <CopyButton
                                kind="transparent"
                                value="analytics-app build token"
                                aria-label="Copy API token"
                              />
                            </InputGroupRoot>
                          </div>
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsSection>
              </div>
            </div>

            <Transition
              enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
              enter-from-class="translate-y-2 opacity-0"
              leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
              leave-to-class="translate-y-2 opacity-0"
            >
              <SaveBar v-if="dirty || saving">
                Build configuration changed.
                <span class="text-(--text-muted)"
                  >Saving applies it to the next build of this resource.</span
                >
                <template #actions>
                  <Button
                    type="button"
                    label="Discard"
                    kind="outlined"
                    size="medium"
                    :disabled="saving"
                    @click="discard"
                  />
                  <Button
                    label="Save"
                    kind="primary"
                    size="medium"
                    :loading="saving"
                    @click="save"
                  />
                </template>
              </SaveBar>
            </Transition>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

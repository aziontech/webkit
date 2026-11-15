<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Item from '@aziontech/webkit/item'
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
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')

  const buildDefaults = { buildCommand: 'platform build', deployCommand: 'platform deploy --local' }

  const repository = 'acme/analytics-app'

  const settings = reactive({
    ...buildDefaults,
    productionBranch: 'main',
    previewBranch: 'develop'
  })
  const saving = ref(false)
  const baseline = ref(JSON.stringify(settings))
  const dirty = computed(() => JSON.stringify(settings) !== baseline.value)

  const save = () => {
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(settings)
      saving.value = false
    }, 800)
  }

  const discard = () => {
    Object.assign(settings, JSON.parse(baseline.value) as typeof settings)
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

    <div
      v-if="activeTab === 'build'"
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <section class="min-h-0 flex-1">
        <div class="flex min-h-full flex-col">
          <div class="flex min-w-0 flex-col">
            <div
              class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
            >
              <PageHeader
                title="Build"
                description="How code reaches this resource, and what the CLI builds it with."
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
                  hint="The repository this resource builds from, and the branches a push deploys."
                  anchor="git-repository"
                >
                  <Card :padded="false">
                    <template #content>
                      <fieldset
                        class="m-0 flex min-w-0 flex-col border-0 p-0"
                        :disabled="saving"
                      >
                        <legend class="sr-only">Git repository</legend>
                        <Item.List>
                          <SettingRow
                            title="Connected repository"
                            kind="compact"
                          >
                            <template #description>
                              <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
                                <i
                                  class="ai ai-github shrink-0"
                                  aria-hidden="true"
                                />
                                <Tooltip :text="`Open ${repository} on GitHub`">
                                  <a
                                    :href="`https://github.com/${repository}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                  >
                                    <span
                                      class="truncate underline-offset-2 group-hover/link:underline"
                                    >
                                      {{ repository }}
                                    </span>
                                    <i
                                      class="pi pi-external-link shrink-0 text-body-xs leading-none"
                                      aria-hidden="true"
                                    />
                                  </a>
                                </Tooltip>
                              </span>
                            </template>
                            <Button
                              type="button"
                              label="Disconnect"
                              kind="danger"
                              size="small"
                            />
                          </SettingRow>

                          <SettingRow
                            title="Production branch"
                            description="Pushes to this branch build and deploy to Production."
                            stackable
                          >
                            <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                              <Input
                                v-model="settings.productionBranch"
                                size="large"
                                :disabled="saving"
                                class="w-full"
                                aria-label="Production branch"
                                monospace
                                :spellcheck="false"
                              />
                            </div>
                          </SettingRow>

                          <SettingRow
                            title="Preview branch"
                            description="Pushes to this branch deploy a preview with its own URL. Production is untouched."
                            stackable
                          >
                            <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                              <Input
                                v-model="settings.previewBranch"
                                size="large"
                                :disabled="saving"
                                class="w-full"
                                aria-label="Preview branch"
                                monospace
                                :spellcheck="false"
                              />
                            </div>
                          </SettingRow>
                        </Item.List>
                      </fieldset>
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
                                  v-model="settings.buildCommand"
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
                                  v-model="settings.deployCommand"
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
                                size="small"
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
                Build settings changed.
                <span class="text-(--text-muted)"
                  >Saving applies them to the next push and build of this resource.</span
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
    <div
      v-else
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <div class="layout-section-start">
          <EmptyState
            size="medium"
            icon="pi pi-external-link"
            :title="tabLabel"
            :description="`${tabLabel} opens on its own page.`"
          >
            <template #actions>
              <Button
                :label="`Open ${tabLabel}`"
                kind="outlined"
                size="small"
                :href="`/resources/analytics-app/${activeTab}`"
              />
            </template>
          </EmptyState>
        </div>
      </div>
    </div>
  </div>
</template>

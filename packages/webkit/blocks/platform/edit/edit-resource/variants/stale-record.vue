<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { nextTick, reactive, ref, watch } from 'vue'

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'build', label: 'Build' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'variables', label: 'Variables' },
    { value: 'caching', label: 'Caching' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'rules', label: 'Rules' },
    { value: 'main-settings', label: 'Settings' }
  ]

  const activeTab = ref('main-settings')

  const defaultModules = [
    {
      key: 'compression',
      title: 'Compression',
      description: 'Compress responses with gzip and Brotli before they are sent.'
    },
    { key: 'caching', title: 'Caching', description: 'Customize advanced cache settings.' },
    {
      key: 'device_detection',
      title: 'Device Detection',
      description: 'Expose device variables to build responsive rules.'
    },
    {
      key: 'custom_code',
      title: 'Custom Code',
      description: 'Run your own code on each request, close to the user.'
    },
    {
      key: 'image_optimization',
      title: 'Image Optimization',
      description: 'Resize and convert images on the fly.'
    },
    {
      key: 'load_balancing',
      title: 'Load Balancing',
      description:
        'Balance traffic across your upstreams for reliability and network congestion control.'
    }
  ]

  const subscriptionModules = [
    {
      key: 'web_socket_proxy',
      title: 'WebSocket Proxy',
      description:
        'Enhance real-time data exchange between your project and its backends using the WebSocket protocol.'
    }
  ]

  const record = {
    name: 'web-app',
    active: true,
    modules: {
      compression: true,
      caching: true,
      device_detection: false,
      custom_code: true,
      image_optimization: false,
      load_balancing: false,
      web_socket_proxy: false
    }
  }

  const savedElsewhere = {
    ...structuredClone(record),
    modules: { ...record.modules, image_optimization: true }
  }

  const form = reactive({
    ...structuredClone(record),
    modules: { ...record.modules, device_detection: true }
  })
  const saving = ref(false)
  const freshness = ref('conflict')
  const overwriteOpen = ref(false)
  const noticeRef = ref(null)
  let editsBeforeReload = null

  const { isDirty: dirty, commit } = useUnsavedChanges(() => form, {
    onDiscard: (baseline) => Object.assign(form, baseline)
  })
  commit(record)

  const nameError = ref(false)
  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )

  const commitSave = () => {
    saving.value = true
    setTimeout(() => {
      commit()
      saving.value = false
      freshness.value = null
    }, 900)
  }

  const save = () => {
    if (!form.name.trim()) {
      nameError.value = true
      nextTick(() => document.getElementById('resource-name')?.focus())
      return
    }
    if (freshness.value === 'conflict') {
      overwriteOpen.value = true
      return
    }
    commitSave()
  }

  const overwrite = () => {
    overwriteOpen.value = false
    commitSave()
  }

  const reload = () => {
    editsBeforeReload = structuredClone({ ...form, modules: { ...form.modules } })
    commit(savedElsewhere)
    Object.assign(form, structuredClone(savedElsewhere))
    freshness.value = 'reloaded'
    nextTick(() => noticeRef.value?.$el?.focus?.())
  }

  const undoReload = () => {
    if (editsBeforeReload) Object.assign(form, editsBeforeReload)
    editsBeforeReload = null
    freshness.value = 'conflict'
  }

  const discard = () => {
    if (freshness.value === 'conflict') {
      reload()
      return
    }
    Object.assign(form, structuredClone(savedElsewhere))
    freshness.value = null
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
          <form
            class="flex min-h-full flex-col"
            aria-label="Main settings"
            novalidate
            @submit.prevent="save"
          >
            <div
              class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
            >
              <PageHeader
                title="Settings"
                description="Core configuration for this project."
                size="small"
              />

              <div
                class="mt-(--layout-section-gap)"
                aria-live="polite"
              >
                <Alert
                  v-if="freshness === 'conflict'"
                  key="conflict"
                  ref="noticeRef"
                  severity="warning"
                  data-testid="stale-record-notice"
                >
                  <strong class="font-medium">Changed elsewhere.</strong>
                  This project was saved by someone else after you opened it. Reload to see their
                  values, or keep editing and confirm the overwrite when you save.
                  <template #action>
                    <Button
                      type="button"
                      label="Reload"
                      kind="secondary"
                      size="medium"
                      icon="pi pi-refresh"
                      :disabled="saving"
                      @click="reload"
                    />
                  </template>
                </Alert>
                <Alert
                  v-else-if="freshness === 'reloaded'"
                  key="reloaded"
                  ref="noticeRef"
                  severity="info"
                  data-testid="stale-record-reloaded"
                >
                  <strong class="font-medium">Edits discarded.</strong>
                  The form now shows the values saved elsewhere. Undo brings your edits back.
                  <template #action>
                    <Button
                      type="button"
                      label="Undo"
                      kind="secondary"
                      size="medium"
                      @click="undoReload"
                    />
                  </template>
                </Alert>
              </div>

              <fieldset
                class="mx-0 mt-(--spacing-lg) flex min-w-0 flex-col border-0 p-0"
                :disabled="saving"
              >
                <legend class="sr-only">Main settings</legend>

                <SettingsSection
                  title="General"
                  hint="How this project is identified across the platform, and whether it is serving traffic."
                  anchor="general"
                >
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
                          title="Name"
                          description="A unique and descriptive name to identify the project."
                        >
                          <div class="flex w-full flex-col gap-(--spacing-xs)">
                            <Input
                              id="resource-name"
                              v-model="form.name"
                              size="large"
                              :disabled="saving"
                              class="w-full"
                              aria-label="Name"
                              :required="nameError"
                              :aria-describedby="nameError ? 'resource-name-message' : undefined"
                            />
                            <HelperText
                              v-if="nameError"
                              id="resource-name-message"
                              kind="required"
                              label="This field is required."
                            />
                          </div>
                        </SettingRow>
                        <SettingRow
                          title="Active"
                          description="When disabled, the project stops serving traffic."
                          kind="compact"
                        >
                          <Switch
                            v-model="form.active"
                            aria-label="Active"
                            :disabled="saving"
                          />
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="Modules"
                  hint="The capabilities this project runs with, each of which can be toggled here."
                  anchor="modules"
                >
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
                          v-for="mod in defaultModules"
                          :key="mod.key"
                          :title="mod.title"
                          :description="mod.description"
                          kind="compact"
                        >
                          <Switch
                            v-model="form.modules[mod.key]"
                            :aria-label="mod.title"
                            :disabled="saving"
                          />
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="Subscription modules"
                  hint="Paid add-ons that are activated with sales, not from this page."
                  anchor="subscription-modules"
                >
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
                          v-for="mod in subscriptionModules"
                          :key="mod.key"
                          :title="mod.title"
                          kind="compact"
                        >
                          <template #description>
                            {{ mod.description }}
                            <a
                              href="https://example.com/contact-sales"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                            >
                              Contact sales
                              <i
                                class="pi pi-external-link shrink-0 text-body-sm leading-none"
                                aria-hidden="true"
                              />
                            </a>
                          </template>
                          <Tooltip text="Contact sales to activate this module.">
                            <Switch
                              v-model="form.modules[mod.key]"
                              disabled
                              :aria-label="mod.title"
                            />
                          </Tooltip>
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsSection>
              </fieldset>
            </div>

            <Transition
              enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
              enter-from-class="translate-y-2 opacity-0"
              leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
              leave-to-class="translate-y-2 opacity-0"
            >
              <SaveBar v-if="dirty || saving">
                Project settings changed.
                <span
                  v-if="freshness === 'conflict'"
                  class="text-(--text-muted)"
                  >Saving overwrites the version saved elsewhere.</span
                >
                <span
                  v-else
                  class="text-(--text-muted)"
                  >Saving publishes them on the next deployment.</span
                >
                <template #actions>
                  <Button
                    type="button"
                    :label="freshness === 'conflict' ? 'Discard and reload' : 'Discard'"
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
          </form>

          <ConfirmDialog
            v-model:open="overwriteOpen"
            title="Overwrite changes made elsewhere?"
            description="This project was saved elsewhere after you opened it. Saving replaces that change with your edits, and it can't be recovered afterwards."
            confirm-label="Overwrite and save"
            cancel-label="Go back"
            kind="primary"
            @confirm="overwrite"
          />
        </div>
      </section>
    </div>
  </div>
</template>

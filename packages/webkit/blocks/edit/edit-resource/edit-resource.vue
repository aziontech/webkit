<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  import { sampleProject } from './sample'

  /** The saved project settings, and the values a save sends. */
  export interface EditResourceProject {
    /** The project name. */
    name: string
    /** Whether the project serves traffic. */
    active: boolean
    /** Which modules are on, by module key. */
    modules: Record<string, boolean>
  }

  export interface EditResourceProps {
    /** The saved settings; the form opens on them and Discard returns to them. Left out, the sample renders. */
    resource?: EditResourceProject
    /** The save is in flight: the fieldset and Discard lock and Save spins. */
    loading?: boolean
    /** Why the save failed, shown in the error toast with Retry; the edits are kept. */
    error?: string
  }

  const props = withDefaults(defineProps<EditResourceProps>(), {
    resource: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: EditResourceProject]
    discard: [event: MouseEvent]
  }>()

  const activeTab = defineModel<string>('tab', { default: 'main-settings' })

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

  const copyOf = (project: EditResourceProject) =>
    JSON.parse(JSON.stringify(project)) as EditResourceProject
  const record = computed<EditResourceProject>(() => props.resource ?? sampleProject)
  const form = reactive<EditResourceProject>(copyOf(record.value))
  const saving = computed(() => props.loading)
  const baseline = ref(JSON.stringify(record.value))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const SAVE_TOAST = 'resource-save'

  watch(
    () => JSON.stringify(record.value),
    (next) => {
      Object.assign(form, copyOf(record.value))
      baseline.value = next
    }
  )

  const nameError = ref(false)
  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )

  const save = async (event: Event) => {
    if (saving.value) return
    if (!form.name.trim()) {
      nameError.value = true
      nextTick(() => document.getElementById('resource-name')?.focus())
      return
    }
    toast.dismiss(SAVE_TOAST)
    emit('submit', event, copyOf(form))
    await nextTick()
    if (!props.loading && !props.error) baseline.value = JSON.stringify(form)
  }

  const showFailure = () => {
    toast.error("The project settings weren't saved.", {
      id: SAVE_TOAST,
      description: props.error,
      action: { label: 'Retry', onClick: (event: MouseEvent) => save(event) }
    })
  }

  onMounted(() => {
    if (props.error) showFailure()
  })

  watch(
    () => props.loading,
    (now, before) => {
      if (!before || now) return
      if (props.error) {
        showFailure()
        return
      }
      baseline.value = JSON.stringify(form)
    }
  )

  const discard = (event: MouseEvent) => {
    Object.assign(form, JSON.parse(baseline.value) as EditResourceProject)
    emit('discard', event)
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
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

              <fieldset
                class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
                :disabled="saving"
              >
                <legend class="sr-only">Main settings</legend>

                <SettingsGroup
                  label="General"
                  hint="How this project is identified across the platform, and whether it is serving traffic."
                  anchor="general"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
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
                              required
                              :invalid="nameError"
                              :aria-describedby="nameError ? 'resource-name-message' : undefined"
                            />
                            <FieldError
                              v-if="nameError"
                              id="resource-name-message"
                              >This field is required.</FieldError
                            >
                          </div>
                        </SettingsRow>
                        <SettingsRow
                          title="Active"
                          description="When disabled, the project stops serving traffic."
                          variant="compact"
                        >
                          <Switch
                            v-model="form.active"
                            aria-label="Active"
                            :disabled="saving"
                          />
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <SettingsGroup
                  label="Modules"
                  hint="The capabilities this project runs with, each of which can be toggled here."
                  anchor="modules"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          v-for="mod in defaultModules"
                          :key="mod.key"
                          :title="mod.title"
                          :description="mod.description"
                          variant="compact"
                        >
                          <Switch
                            v-model="form.modules[mod.key]"
                            :aria-label="mod.title"
                            :disabled="saving"
                          />
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <SettingsGroup
                  label="Subscription modules"
                  hint="Paid add-ons that are activated with sales, not from this page."
                  anchor="subscription-modules"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          v-for="mod in subscriptionModules"
                          :key="mod.key"
                          :title="mod.title"
                          :description="mod.description"
                          variant="compact"
                        >
                          <div class="flex items-center gap-(--spacing-sm)">
                            <Link
                              label="Contact sales"
                              href="https://example.com/contact-sales"
                              target="_blank"
                              size="small"
                              :aria-label="`Contact sales about ${mod.title}`"
                            />
                            <Tooltip content="Contact sales to activate this module.">
                              <Switch
                                v-model="form.modules[mod.key]"
                                disabled
                                :aria-label="mod.title"
                              />
                            </Tooltip>
                          </div>
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>
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
                <span class="text-(--text-muted)"
                  >Saving publishes them on the next deployment.</span
                >
                <template #actions>
                  <Button
                    type="button"
                    label="Discard"
                    variant="outline"
                    size="medium"
                    :disabled="saving"
                    @click="discard"
                  />
                  <Button
                    label="Save"
                    variant="primary"
                    size="medium"
                    :loading="saving"
                    @click="save"
                  />
                </template>
              </SaveBar>
            </Transition>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

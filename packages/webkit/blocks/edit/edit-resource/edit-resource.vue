<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  import SettingsSaveBar from './parts/settings-save-bar.vue'
  import {
    sampleProject,
    sampleProjectModules,
    sampleProjectTabs,
    sampleSubscriptionModules
  } from './sample'

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
    /** Unsaved edits the form opens with on top of the resource, so it starts dirty. */
    defaultDraft?: Partial<EditResourceProject>
    /** The version saved elsewhere after the form opened: a notice offers Reload, and Save asks before it overwrites. */
    stale?: EditResourceProject
    /** The save is in flight: the fieldset and Discard lock and Save spins. */
    loading?: boolean
    /** Why the save failed, shown in the error toast with Retry; the edits are kept. */
    error?: string
  }

  const props = withDefaults(defineProps<EditResourceProps>(), {
    resource: undefined,
    defaultDraft: () => ({}),
    stale: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: EditResourceProject]
    discard: [event: MouseEvent]
  }>()

  const activeTab = defineModel<string>('tab', { default: 'main-settings' })

  defineSlots<{
    /** Sections after Subscription modules, inside the form, such as the Danger zone. */
    sections(): unknown
  }>()

  const copyOf = (project: EditResourceProject) =>
    JSON.parse(JSON.stringify(project)) as EditResourceProject
  const record = computed<EditResourceProject>(() => props.resource ?? sampleProject)
  const form = reactive<EditResourceProject>(copyOf(record.value))
  const saving = computed(() => props.loading)
  const baseline = ref(JSON.stringify(record.value))
  Object.assign(form, copyOf({ ...record.value, ...props.defaultDraft }))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const SAVE_TOAST = 'resource-save'

  const freshness = ref<'conflict' | 'reloaded' | null>(props.stale ? 'conflict' : null)
  const overwriteOpen = ref(false)
  const noticeEl = ref<{ $el?: HTMLElement } | null>(null)
  let editsBeforeReload: EditResourceProject | null = null

  watch(
    () => props.stale,
    (next) => {
      freshness.value = next ? 'conflict' : null
      editsBeforeReload = null
    }
  )

  const reload = () => {
    if (!props.stale) return
    editsBeforeReload = copyOf(form)
    baseline.value = JSON.stringify(props.stale)
    Object.assign(form, copyOf(props.stale))
    freshness.value = 'reloaded'
    nextTick(() => noticeEl.value?.$el?.focus?.())
  }

  const undoReload = () => {
    if (editsBeforeReload) Object.assign(form, editsBeforeReload)
    editsBeforeReload = null
    freshness.value = 'conflict'
  }

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
    if (freshness.value === 'conflict') {
      overwriteOpen.value = true
      return
    }
    submit(event)
  }

  const submit = async (event: Event) => {
    toast.dismiss(SAVE_TOAST)
    emit('submit', event, copyOf(form))
    await nextTick()
    if (props.loading || props.error) return
    baseline.value = JSON.stringify(form)
    freshness.value = null
  }

  const overwrite = (event: MouseEvent) => {
    overwriteOpen.value = false
    submit(event)
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
      freshness.value = null
    }
  )

  const discard = (event: MouseEvent) => {
    if (freshness.value === 'conflict') {
      reload()
      return
    }
    Object.assign(form, JSON.parse(baseline.value) as EditResourceProject)
    freshness.value = null
    emit('discard', event)
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in sampleProjectTabs"
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
                v-if="stale"
                class="mt-(--layout-section-gap)"
                aria-live="polite"
              >
                <Alert
                  v-if="freshness === 'conflict'"
                  key="conflict"
                  ref="noticeEl"
                  severity="warning"
                  data-testid="stale-record-notice"
                >
                  <strong class="font-medium">Changed elsewhere.</strong>
                  This project was saved by someone else after you opened it. Reload to see their
                  values, or keep editing and confirm the overwrite when you save.
                  <template #actions>
                    <Button
                      type="button"
                      label="Reload"
                      variant="secondary"
                      size="medium"
                      icon="az az-refresh"
                      :disabled="saving"
                      @click="reload"
                    />
                  </template>
                </Alert>
                <Alert
                  v-else-if="freshness === 'reloaded'"
                  key="reloaded"
                  ref="noticeEl"
                  severity="info"
                  data-testid="stale-record-reloaded"
                >
                  <strong class="font-medium">Edits discarded.</strong>
                  The form now shows the values saved elsewhere. Undo brings your edits back.
                  <template #actions>
                    <Button
                      type="button"
                      label="Undo"
                      variant="secondary"
                      size="medium"
                      @click="undoReload"
                    />
                  </template>
                </Alert>
              </div>

              <fieldset
                :data-stale="stale ? '' : null"
                class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0 data-[stale]:mt-(--spacing-lg)"
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
                          v-for="mod in sampleProjectModules"
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
                          v-for="mod in sampleSubscriptionModules"
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

                <slot name="sections" />
              </fieldset>
            </div>

            <SettingsSaveBar
              :visible="dirty || saving"
              :saving="saving"
              :discard-label="freshness === 'conflict' ? 'Discard and reload' : 'Discard'"
              @save="save"
              @discard="discard"
            >
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
            </SettingsSaveBar>
          </form>

          <ConfirmDialog
            v-model:open="overwriteOpen"
            title="Overwrite changes made elsewhere?"
            description="This project was saved elsewhere after you opened it. Saving replaces that change with your edits, and it can't be recovered afterwards."
            confirm-label="Overwrite and save"
            cancel-label="Go back"
            variant="primary"
            size="small"
            @confirm="overwrite"
          />
        </div>
      </section>
    </div>
  </div>
</template>

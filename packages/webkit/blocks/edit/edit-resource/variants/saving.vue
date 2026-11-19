<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'rules', label: 'Rules' },
    { value: 'main-settings', label: 'Settings' }
  ]

  const activeTab = ref('main-settings')

  const moduleFields = [
    {
      key: 'ddos',
      title: 'DDoS Protection',
      description: 'Absorbs volumetric attacks at the network layer.',
      locked: true
    },
    {
      key: 'request-inspection',
      title: 'Request Inspection',
      description: 'Inspects each request and blocks the OWASP Top 10 attack classes.'
    },
    {
      key: 'ip-blocking',
      title: 'IP Blocking',
      description: 'Blocks traffic by country, ASN or IP range using access lists.'
    },
    {
      key: 'bot-protection',
      title: 'Bot Protection',
      description: 'Scores automated traffic and challenges the requests that fail.'
    },
    {
      key: 'custom-code',
      title: 'Custom Code',
      description: 'Runs your own code inside the policy, before the request is served.'
    }
  ]

  type ResourceRecord = {
    name: string
    active: boolean
    debugRules: boolean
    modules: Record<string, boolean>
  }

  const record: ResourceRecord = {
    name: 'production-policy',
    active: true,
    debugRules: false,
    modules: {
      ddos: true,
      'request-inspection': true,
      'ip-blocking': true,
      'bot-protection': true,
      'custom-code': false
    }
  }

  const form = reactive({ ...structuredClone(record), debugRules: true })
  const saving = ref(true)
  const baseline = ref(JSON.stringify(record))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)

  const nameError = ref(false)
  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )

  const save = () => {
    if (!form.name.trim()) {
      nameError.value = true
      nextTick(() => document.getElementById('resource-name')?.focus())
      return
    }
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
    }, 900)
  }

  const discard = () => Object.assign(form, JSON.parse(baseline.value) as ResourceRecord)
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

    <section class="min-h-0 flex-1">
      <div class="flex min-h-full flex-col">
        <div class="flex min-w-0 flex-1 flex-col">
          <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col pb-0">
            <PageHeader
              title="Settings"
              description="Core configuration for this policy."
              size="small"
            >
              <template #actions>
                <Button
                  label="Documentation"
                  icon="az az-book"
                  variant="outline"
                  href="https://example.com/docs/security-policies"
                  target="_blank"
                  size="medium"
                />
              </template>
            </PageHeader>

            <section
              class="layout-section-start flex min-w-0 flex-1 flex-col pb-(--layout-boundary-end)"
            >
              <fieldset
                class="m-0 flex min-w-0 flex-col border-0 p-0"
                :disabled="saving"
              >
                <legend class="sr-only">Settings</legend>
                <SettingsGroup label="General">
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          title="Name"
                          description="Give a unique and descriptive name to identify this policy."
                        >
                          <div class="flex w-full flex-col gap-(--spacing-xs)">
                            <Input
                              id="resource-name"
                              v-model="form.name"
                              size="large"
                              :disabled="saving"
                              class="w-full"
                              aria-label="Name"
                              autocomplete="off"
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
                          title="Project"
                          description="The project this policy runs in front of."
                          variant="compact"
                        >
                          <span class="text-body-md text-(--text-default)">web-app</span>
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <SettingsGroup
                  label="Modules"
                  hint="A module is what makes a rule act: a rule can only apply a capability that is switched on here."
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          v-for="field in moduleFields"
                          :key="field.key"
                          :title="field.title"
                          :description="field.description"
                          variant="compact"
                        >
                          <Tooltip
                            v-if="field.locked"
                            content="DDoS Protection is always on, on every policy."
                          >
                            <span class="flex">
                              <Switch
                                :model-value="true"
                                :aria-label="field.title"
                                disabled
                              />
                            </span>
                          </Tooltip>
                          <Switch
                            v-else
                            v-model="form.modules[field.key]"
                            :aria-label="field.title"
                          />
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <SettingsGroup
                  label="Debug rules"
                  hint="Query the logged executions from the event log or the logs API."
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          title="Active"
                          description="Logs which rules ran for a request, under the trace field of each logged event."
                          variant="compact"
                        >
                          <Switch
                            v-model="form.debugRules"
                            aria-label="Debug rules"
                          />
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <SettingsGroup label="Status">
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          title="Active"
                          description="An inactive policy stops evaluating rules."
                          variant="compact"
                        >
                          <Switch
                            v-model="form.active"
                            aria-label="Active"
                          />
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>
              </fieldset>
            </section>
          </div>

          <Transition
            enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
            enter-from-class="translate-y-2 opacity-0"
            leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
            leave-to-class="translate-y-2 opacity-0"
          >
            <SaveBar v-if="dirty || saving">
              You have unsaved changes.

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
        </div>
      </div>
    </section>
  </div>
</template>

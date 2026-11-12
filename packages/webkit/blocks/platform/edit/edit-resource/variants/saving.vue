<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
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

  const record = {
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

  const discard = () => Object.assign(form, JSON.parse(baseline.value))
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
                  icon="pi pi-book"
                  kind="outlined"
                  href="https://example.com/docs/security-policies"
                  target="_blank"
                  size="medium"
                />
              </template>
            </PageHeader>

            <section
              class="layout-section-start flex min-w-0 flex-1 flex-col pb-(--layout-boundary-end)"
            >
              <SettingsSection title="General">
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Name"
                        description="Give a unique and descriptive name to identify this policy."
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Input
                            id="resource-name"
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            autocomplete="off"
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
                        title="Project"
                        description="The project this policy runs in front of."
                        kind="compact"
                      >
                        <span class="text-body-md text-(--text-default)">web-app</span>
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Modules"
                hint="A module is what makes a rule act: a rule can only apply a capability that is switched on here."
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        v-for="field in moduleFields"
                        :key="field.key"
                        :title="field.title"
                        :description="field.description"
                        kind="compact"
                      >
                        <Tooltip
                          v-if="field.locked"
                          text="DDoS Protection is always on, on every policy."
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
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Debug rules"
                hint="Query the logged executions from the event log or the logs API."
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Active"
                        description="Logs which rules ran for a request, under the trace field of each logged event."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.debugRules"
                          aria-label="Debug rules"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection title="Status">
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <SettingRow
                        title="Active"
                        description="An inactive policy stops evaluating rules."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                        />
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>
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
</template>

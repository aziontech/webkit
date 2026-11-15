<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  type WafMode = 'blocking' | 'learning'
  type Sensitivity = 'highest' | 'high' | 'medium' | 'low' | 'lowest'

  interface Threat {
    id: string
    label: string
    hint: string
    enabled: boolean
    sensitivity: Sensitivity
  }

  interface RuleSet {
    name: string
    active: boolean
    mode: WafMode
    threats: Threat[]
  }

  const tabs = [
    { value: 'main-settings', label: 'Main Settings' },
    { value: 'tuning', label: 'Tuning' },
    { value: 'allowed-rules', label: 'Allowed Rules' }
  ]
  const activeTab = ref('main-settings')

  const MODES: { value: WafMode; label: string }[] = [
    { value: 'blocking', label: 'Blocking' },
    { value: 'learning', label: 'Learning' }
  ]
  const SENSITIVITIES: { value: Sensitivity; label: string }[] = [
    { value: 'highest', label: 'Highest' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
    { value: 'lowest', label: 'Lowest' }
  ]
  const modeLabel = (value: string) => MODES.find((mode) => mode.value === value)?.label ?? ''
  const sensitivityLabel = (value: string) =>
    SENSITIVITIES.find((level) => level.value === value)?.label ?? ''

  const threat = (
    id: string,
    label: string,
    hint: string,
    enabled: boolean,
    sensitivity: Sensitivity = 'medium'
  ): Threat => ({ id, label, hint, enabled, sensitivity })

  const record: RuleSet = {
    name: 'Core protection',
    active: true,
    mode: 'blocking',
    threats: [
      threat(
        'sql-injection',
        'SQL injection',
        'Detects attempts to inject SQL statements through the request to read or change the database behind it.',
        true,
        'high'
      ),
      threat(
        'remote-file-inclusion',
        'Remote file inclusion',
        'Detects attempts to make the application load and run a file hosted somewhere else.',
        true,
        'high'
      ),
      threat(
        'directory-traversal',
        'Directory traversal',
        'Detects attempts to reach files outside the intended directory by walking the path.',
        true,
        'high'
      ),
      threat(
        'cross-site-scripting',
        'Cross-site scripting',
        'Stops client-side scripts from being injected into the pages visitors see.',
        true,
        'high'
      ),
      threat('file-upload', 'File upload', 'Detects attempts to upload files.', false),
      threat(
        'evading-tricks',
        'Evading tricks',
        'Stops encoding tricks meant to slip past the other checks.',
        false
      ),
      threat(
        'unwanted-access',
        'Unwanted access',
        'Detects requests aimed at administrative pages, vulnerable files or applications that are not meant to be public.',
        false
      ),
      threat(
        'identified-attack',
        'Identified attack',
        'Detects requests that carry the signature of known attacks and exploit kits.',
        true,
        'high'
      )
    ]
  }

  const form = reactive<RuleSet>(structuredClone(record))
  const saving = ref(false)
  const baseline = ref(JSON.stringify(record))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const enabledCount = computed(() => form.threats.filter((item) => item.enabled).length)

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
      nextTick(() => document.getElementById('waf-name')?.focus())
      return
    }
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
      toast.success('Rule set saved.', {
        description: 'The new posture applies to traffic on the next deployment.'
      })
    }, 900)
  }

  const discard = () => Object.assign(form, JSON.parse(baseline.value) as RuleSet)
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
              title="Main Settings"
              description="How this rule set is identified, and what it inspects requests for."
              size="small"
            >
              <template #actions>
                <Button
                  label="Documentation"
                  icon="ai ai-book"
                  variant="outline"
                  href="https://example.com/docs/waf-rule-sets"
                  target="_blank"
                  size="medium"
                />
              </template>
            </PageHeader>

            <section
              class="layout-section-start flex min-w-0 flex-1 flex-col pb-(--layout-boundary-end)"
            >
              <SettingsSection
                title="General"
                hint="How this rule set is identified across the console."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingRow
                        title="Name"
                        description="A unique and descriptive name to identify the rule set."
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Input
                            id="waf-name"
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            autocomplete="off"
                            :disabled="saving"
                            :required="nameError"
                            :aria-describedby="nameError ? 'waf-name-message' : undefined"
                          />
                          <HelperText
                            v-if="nameError"
                            id="waf-name-message"
                            type="required"
                            label="This field is required."
                          />
                        </div>
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Status"
                hint="Whether the rule set inspects traffic, and what it does with what it matches."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingRow
                        title="Active"
                        description="When off, the rule set stops inspecting requests entirely."
                        variant="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                          :disabled="saving"
                        />
                      </SettingRow>
                      <SettingRow
                        title="Mode"
                        description="Blocking rejects a matched request. Learning lets it through and records the match on the Tuning tab."
                      >
                        <Select
                          v-model="form.mode"
                          size="large"
                          class="w-full"
                          placeholder="Select a mode"
                          :disabled="saving"
                          :display-value="modeLabel"
                        >
                          <Select.Trigger aria-label="Mode" />
                          <Select.Content>
                            <Select.Option
                              v-for="mode in MODES"
                              :key="mode.value"
                              :value="mode.value"
                            >
                              {{ mode.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </SettingRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Threats"
                hint="The threat families this rule set inspects for, and how strictly each one is applied. Higher sensitivity catches more attacks and more legitimate requests."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List
                      :aria-label="`Threats, ${enabledCount} of ${form.threats.length} on`"
                    >
                      <SettingRow
                        v-for="item in form.threats"
                        :key="item.id"
                        :title="item.label"
                        :description="item.hint"
                        :data-threat="item.id"
                      >
                        <div
                          class="flex w-full min-w-0 items-center justify-end gap-(--spacing-sm)"
                        >
                          <Select
                            v-model="item.sensitivity"
                            size="medium"
                            class="w-full max-w-(--container-3xs)"
                            :disabled="saving || !item.enabled"
                            :display-value="sensitivityLabel"
                          >
                            <Select.Trigger :aria-label="`${item.label} sensitivity`" />
                            <Select.Content>
                              <Select.Option
                                v-for="level in SENSITIVITIES"
                                :key="level.value"
                                :value="level.value"
                              >
                                {{ level.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                          <Switch
                            v-model="item.enabled"
                            :aria-label="item.label"
                            :disabled="saving"
                          />
                        </div>
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
              Rule set changed. Saving applies it on the next deployment.

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

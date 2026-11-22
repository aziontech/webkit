<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, ref, watch } from 'vue'

  import { useSettingsDraft } from '../use-settings-draft'
  import SettingsTabPage from './settings-tab-page.vue'

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

  const nameError = ref(false)

  const validate = () => {
    if (form.name.trim()) return true
    nameError.value = true
    nextTick(() => document.getElementById('waf-name')?.focus())
    return false
  }

  const { form, saving, dirty, save, discard } = useSettingsDraft(record, {
    validate,
    onSaved: () =>
      toast.success('Rule set saved.', {
        description: 'The new posture applies to traffic on the next deployment.'
      })
  })
  const enabledCount = computed(() => form.threats.filter((item) => item.enabled).length)

  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )
</script>

<template>
  <SettingsTabPage
    v-model:tab="activeTab"
    :tabs="tabs"
    title="Main Settings"
    description="How this rule set is identified, and what it inspects requests for."
    docs-href="https://example.com/docs/waf-rule-sets"
    :dirty="dirty"
    :saving="saving"
    @save="save"
    @discard="discard"
  >
    <SettingsGroup
      label="General"
      hint="How this rule set is identified across the console."
    >
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
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
                  required
                  :invalid="nameError"
                  :aria-describedby="nameError ? 'waf-name-message' : undefined"
                />
                <FieldError
                  v-if="nameError"
                  id="waf-name-message"
                  >This field is required.</FieldError
                >
              </div>
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Status"
      hint="Whether the rule set inspects traffic, and what it does with what it matches."
    >
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
              title="Active"
              description="When off, the rule set stops inspecting requests entirely."
              variant="compact"
            >
              <Switch
                v-model="form.active"
                aria-label="Active"
                :disabled="saving"
              />
            </SettingsRow>
            <SettingsRow
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
                  <Select.Item
                    v-for="mode in MODES"
                    :key="mode.value"
                    :value="mode.value"
                  >
                    {{ mode.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Threats"
      hint="The threat families this rule set inspects for, and how strictly each one is applied. Higher sensitivity catches more attacks and more legitimate requests."
    >
      <Card :padded="false">
        <template #default>
          <Item.List :aria-label="`Threats, ${enabledCount} of ${form.threats.length} on`">
            <SettingsRow
              v-for="item in form.threats"
              :key="item.id"
              :title="item.label"
              :description="item.hint"
              :data-threat="item.id"
            >
              <div class="flex w-full min-w-0 items-center justify-end gap-(--spacing-sm)">
                <Select
                  v-model="item.sensitivity"
                  size="medium"
                  class="w-full max-w-(--container-3xs)"
                  :disabled="saving || !item.enabled"
                  :display-value="sensitivityLabel"
                >
                  <Select.Trigger :aria-label="`${item.label} sensitivity`" />
                  <Select.Content>
                    <Select.Item
                      v-for="level in SENSITIVITIES"
                      :key="level.value"
                      :value="level.value"
                    >
                      {{ level.label }}
                    </Select.Item>
                  </Select.Content>
                </Select>
                <Switch
                  v-model="item.enabled"
                  :aria-label="item.label"
                  :disabled="saving"
                />
              </div>
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>
    <template #message> Rule set changed. Saving applies it on the next deployment. </template>
  </SettingsTabPage>
</template>

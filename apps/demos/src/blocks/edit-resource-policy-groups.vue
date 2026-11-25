<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'

  /** The saved settings of a security policy. */
  export interface PolicySettingsRecord {
    /** The policy name. */
    name: string
    /** Whether the policy evaluates rules. */
    active: boolean
    /** Whether the rules that ran are logged for each request. */
    debugRules: boolean
    /** The keys of the modules that are on, in module order. */
    modules: string[]
  }

  /** One module row of the policy. */
  export interface PolicyModuleField {
    /** The key in the record's modules. */
    key: string
    /** The row title. */
    title: string
    /** The sentence under the title. */
    description: string
    /** Always on: the switch is locked and explains why. */
    locked?: boolean
  }

  export interface PolicyGroupsProps {
    /** The module rows. */
    modules: PolicyModuleField[]
    /** The name failed validation: the field is marked and the message shows. */
    nameInvalid?: boolean
    /** Locks the name field while a save is in flight. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<PolicyGroupsProps>(), {
    nameInvalid: false,
    disabled: false
  })

  const name = defineModel<string>('name', { required: true })
  const active = defineModel<boolean>('active', { required: true })
  const debugRules = defineModel<boolean>('debugRules', { required: true })
  const selectedKeys = defineModel<string[]>('selectedKeys', { required: true })

  const setModule = (key: string, on: boolean) => {
    selectedKeys.value = props.modules
      .map((field) => field.key)
      .filter((fieldKey) => (fieldKey === key ? on : selectedKeys.value.includes(fieldKey)))
  }
</script>

<template>
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
                v-model="name"
                size="large"
                :disabled="disabled"
                class="w-full"
                aria-label="Name"
                autocomplete="off"
                required
                :invalid="nameInvalid"
                :aria-describedby="nameInvalid ? 'resource-name-message' : undefined"
              />
              <FieldError
                v-if="nameInvalid"
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
            v-for="field in modules"
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
              :model-value="selectedKeys.includes(field.key)"
              @update:model-value="(on) => setModule(field.key, on)"
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
              v-model="debugRules"
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
              v-model="active"
              aria-label="Active"
            />
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>

<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import RadioGroup from '@aziontech/ui/radio-group'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'

  import type { FunctionEditorService } from '../edit-function.vue'
  import { runtimeLabel } from '../lib/function-editor'

  export interface FunctionSettingsTabProps {
    /** The save is in flight: the fields lock. */
    saving: boolean
    /** Id of the name error message. */
    nameMessageId: string
    /** Name of the execution environment radio group. */
    groupName: string
  }

  defineProps<FunctionSettingsTabProps>()

  const form = defineModel<FunctionEditorService>('form', { required: true })
  const nameError = defineModel<string>('nameError', { required: true })
</script>

<template>
  <div class="layout-column-form layout-boundary flex min-w-0 flex-col">
    <fieldset
      class="layout-section-start m-0 flex min-w-0 flex-col border-0 p-0"
      :disabled="saving"
    >
      <SettingsGroup label="General">
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                stackable
                title="Name"
                description="Give a unique and descriptive name to identify your service."
              >
                <Input
                  id="service-name"
                  v-model="form.name"
                  size="large"
                  class="w-full"
                  aria-label="Name"
                  autocomplete="off"
                  required
                  :invalid="!!nameError"
                  :aria-describedby="nameError ? nameMessageId : undefined"
                  @update:model-value="nameError = ''"
                />
                <FieldError
                  v-if="nameError"
                  :id="nameMessageId"
                  >{{ nameError }}</FieldError
                >
              </SettingsRow>
            </Item.List>
          </template>
        </Card>
      </SettingsGroup>

      <SettingsGroup label="Runtime">
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                stackable
                title="Runtime"
                description="The runtime isn't editable after the service is created."
              >
                <Input
                  :model-value="runtimeLabel"
                  size="large"
                  class="w-full"
                  aria-label="Runtime"
                  readonly
                  disabled
                >
                  <template #trailing>
                    <i
                      class="az az-lock"
                      aria-hidden="true"
                    />
                  </template>
                </Input>
              </SettingsRow>
            </Item.List>
          </template>
        </Card>
      </SettingsGroup>

      <SettingsGroup
        label="Execution environment"
        hint="Where in the request path the service runs, each stage handing the code a different request."
      >
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                title="Runs on"
                variant="stacked"
              >
                <RadioGroup
                  v-model="form.executionEnvironment"
                  variant="card"
                  :name="groupName"
                  aria-label="Execution environment"
                >
                  <RadioGroup.Item
                    value="request"
                    description="Runs on each request the service handles, after routing."
                    >On request</RadioGroup.Item
                  >
                  <RadioGroup.Item
                    value="gateway"
                    description="Runs at the gateway, before routing, where a request can still be refused."
                    >At the gateway</RadioGroup.Item
                  >
                </RadioGroup>
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
                description="An inactive service keeps its code and stops running."
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
  </div>
</template>

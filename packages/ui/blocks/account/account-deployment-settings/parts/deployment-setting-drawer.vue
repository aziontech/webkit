<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import RadioGroup from '@aziontech/ui/radio-group'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import Switch from '@aziontech/ui/switch'
  import Textarea from '@aziontech/ui/textarea'
  import { computed, nextTick, reactive, ref } from 'vue'

  import type {
    DeploymentSettingsDefaults,
    DeploymentSettingsSetting,
    DeploymentSettingsStatus
  } from '../account-deployment-settings.vue'
  import { BINDING_POLICIES, DEPLOYMENT_POLICIES } from '../deployment-policies'

  /** What a valid submit of the drawer sends. */
  export type DeploymentSettingDraftValues = Pick<
    DeploymentSettingsSetting,
    'name' | 'description' | 'bindingPolicy' | 'deploymentPolicy' | 'status'
  >

  export interface DeploymentSettingDrawerProps {
    /** Every Deployment Setting of the account; a name must be unique among them. */
    settingList: DeploymentSettingsSetting[]
    /** The policies a new setting starts with. */
    defaults: DeploymentSettingsDefaults
  }

  const props = defineProps<DeploymentSettingDrawerProps>()

  const emit = defineEmits<{
    submit: [event: Event, editingId: string, values: DeploymentSettingDraftValues]
  }>()

  const blankDraft = () => ({
    name: '',
    description: '',
    active: true,
    bindingPolicy: props.defaults.bindingPolicy,
    deploymentPolicy: props.defaults.deploymentPolicy
  })
  const drawerOpen = ref(false)
  const editingId = ref('')
  const draft = reactive(blankDraft())
  const nameError = ref('')
  const formEl = ref<HTMLFormElement | null>(null)
  const drawerTitle = computed(() =>
    editingId.value ? 'Edit Deployment Setting' : 'Create Deployment Setting'
  )

  const openCreate = () => {
    editingId.value = ''
    Object.assign(draft, blankDraft())
    nameError.value = ''
    drawerOpen.value = true
  }
  const openEdit = (setting: DeploymentSettingsSetting) => {
    editingId.value = setting.id
    Object.assign(draft, {
      name: setting.name,
      description: setting.description,
      active: setting.status === 'Active',
      bindingPolicy: setting.bindingPolicy,
      deploymentPolicy: setting.deploymentPolicy
    })
    nameError.value = ''
    drawerOpen.value = true
  }

  const submit = (event: Event) => {
    const name = draft.name.trim()
    nameError.value = !name
      ? 'This field is required.'
      : props.settingList.some((setting) => setting.name === name && setting.id !== editingId.value)
        ? 'A Deployment Setting with this name already exists.'
        : ''
    if (nameError.value) {
      nextTick(() => formEl.value?.querySelector<HTMLElement>('#deployment-settings-name')?.focus())
      return
    }
    emit('submit', event, editingId.value, {
      name,
      description: draft.description.trim(),
      bindingPolicy: draft.bindingPolicy,
      deploymentPolicy: draft.deploymentPolicy,
      status: (draft.active ? 'Active' : 'Inactive') as DeploymentSettingsStatus
    })
    drawerOpen.value = false
  }

  defineExpose({
    /** Opens the drawer on a blank setting. */
    openCreate,
    /** Opens the drawer on a setting to edit. */
    openEdit
  })
</script>

<template>
  <Drawer
    v-model:open="drawerOpen"
    size="large"
    side="end"
    dismissible
    closable
  >
    <DrawerContent>
      <form
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="drawerTitle"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ drawerTitle }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              A Deployment Setting says how a deploy routes: whether versions lock the resource IDs
              they shipped with, and how many of them take traffic. An environment publishes with
              exactly one.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
            <legend class="sr-only">{{ drawerTitle }}</legend>
            <SettingsGroup
              label="General"
              hint="How this setting reads in this list and in the field that applies it."
            >
              <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <Field
                  required
                  :invalid="Boolean(nameError)"
                >
                  <Field.Label for="deployment-settings-name">Name</Field.Label>
                  <Input
                    id="deployment-settings-name"
                    v-model="draft.name"
                    size="large"
                    placeholder="production-hardened"
                    autocomplete="off"
                    @update:model-value="nameError = ''"
                  />
                  <Field.Description>{{
                    nameError || 'Name it after the services or the traffic it serves.'
                  }}</Field.Description>
                </Field>
                <Field>
                  <Field.Label for="deployment-settings-description">Description</Field.Label>
                  <Textarea
                    id="deployment-settings-description"
                    v-model="draft.description"
                    :rows="3"
                  />
                  <Field.Description>Optional. Used for internal identification.</Field.Description>
                </Field>
                <Field orientation="horizontal">
                  <Switch
                    id="deployment-settings-active"
                    v-model="draft.active"
                  />
                  <Field.Content>
                    <Field.Label for="deployment-settings-active">Active</Field.Label>
                    <Field.Description
                      >When off, the setting stays in the list but no environment can choose
                      it.</Field.Description
                    >
                  </Field.Content>
                </Field>
              </div>
            </SettingsGroup>

            <SettingsGroup
              label="Routing and policy"
              hint="How versions bind to the resources they ship with, and how traffic reaches them."
            >
              <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <fieldset class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
                  <Field.Legend type="label">Binding policy</Field.Legend>
                  <RadioGroup
                    v-model="draft.bindingPolicy"
                    name="deployment-settings-binding"
                    aria-label="Binding policy"
                  >
                    <RadioGroup.Item
                      v-for="policy in BINDING_POLICIES"
                      :key="policy.value"
                      :value="policy.value"
                      :description="policy.description"
                      >{{ policy.label }}</RadioGroup.Item
                    >
                  </RadioGroup>
                </fieldset>
                <fieldset class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
                  <Field.Legend type="label">Deployment policy</Field.Legend>
                  <RadioGroup
                    v-model="draft.deploymentPolicy"
                    name="deployment-settings-policy"
                    aria-label="Deployment policy"
                    :disabled="Boolean(editingId)"
                  >
                    <RadioGroup.Item
                      v-for="policy in DEPLOYMENT_POLICIES"
                      :key="policy.value"
                      :value="policy.value"
                      :description="policy.description"
                      >{{ policy.label }}</RadioGroup.Item
                    >
                  </RadioGroup>
                  <Field.Description
                    >Cannot be changed after the setting is created.</Field.Description
                  >
                </fieldset>
              </div>
            </SettingsGroup>
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              type="button"
              label="Cancel"
              variant="outline"
              size="medium"
              @click="drawerOpen = false"
            />
            <Button
              type="submit"
              :label="editingId ? 'Save changes' : 'Create Deployment Setting'"
              variant="primary"
              size="medium"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>

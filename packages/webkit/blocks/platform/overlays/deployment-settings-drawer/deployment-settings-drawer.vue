<script setup>
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import FieldRadio from '@aziontech/webkit/field-radio'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import { reactive, ref, watch } from 'vue'

  const bindingPolicies = [
    {
      value: 'STRICT',
      label: 'Strict',
      description: 'Lock resource IDs to each version. Promoted versions stay Strict.'
    },
    {
      value: 'FLEXIBLE',
      label: 'Flexible',
      description: 'Allow resource IDs to change across versions.'
    }
  ]

  const deploymentPolicies = [
    {
      value: 'single_version',
      label: 'Single',
      description: 'One version serves the environment. Deploying replaces what is live.'
    },
    {
      value: 'versioned_urls',
      label: 'Versioned',
      description: 'Each version keeps its own URL, so several are reachable at once.'
    }
  ]

  const blankForm = () => ({
    name: '',
    description: '',
    active: true,
    bindingPolicy: 'STRICT',
    deploymentPolicy: 'single_version',
    shared: true
  })

  const open = ref(false)
  const form = reactive(blankForm())
  const errors = reactive({ name: '' })
  const submitting = ref(false)

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(form, blankForm())
    errors.name = ''
    submitting.value = false
  })

  const submit = async () => {
    if (submitting.value) return
    errors.name = form.name.trim() ? '' : 'This field is required.'
    if (errors.name) return
    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 500))
    submitting.value = false
    open.value = false
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="medium"
    side="right"
  >
    <DrawerTrigger>
      <div class="w-full md:w-fit">
        <Button
          label="Create Deployment Settings"
          icon="pi pi-plus"
          kind="outlined"
          size="medium"
          class="w-full"
        />
      </div>
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Create Deployment Settings"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Create Deployment Settings</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                A Deployment Setting says how a deploy routes: whether versions lock the resource
                IDs they shipped with, and how many of them take traffic. An environment publishes
                with exactly one.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create Deployment Settings</legend>

              <SettingsSection
                title="General"
                hint="How this strategy is identified in the Deployment Settings list and in the field that applies it."
              >
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <FieldText
                    input-id="deployment-settings-name"
                    v-model="form.name"
                    label="Name"
                    size="large"
                    placeholder="production-hardened"
                    :disabled="submitting"
                    :required="Boolean(errors.name)"
                    :helper-text="
                      errors.name || 'How this strategy reads in the Deployment Settings field.'
                    "
                    @update:model-value="errors.name = ''"
                  />

                  <FieldTextarea
                    input-id="deployment-settings-description"
                    v-model="form.description"
                    label="Description"
                    placeholder="Storefront traffic for production"
                    :disabled="submitting"
                    helper-text="Optional. Used for internal identification."
                  />

                  <FieldSwitchBlock
                    v-model="form.active"
                    label="Active"
                    description="When disabled, the strategy stays in the list but no deployment can apply it."
                    :disabled="submitting"
                  />
                </div>
              </SettingsSection>

              <SettingsSection
                title="Routing and policy"
                hint="How versions bind to the resources they ship with, and how traffic reaches them."
              >
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <fieldset
                    class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                  >
                    <legend class="mb-(--spacing-xs) p-0">
                      <Label
                        required
                        hint="Defines whether each version locks its resource IDs or allows them to change."
                      >
                        Binding policy
                      </Label>
                    </legend>
                    <div class="flex flex-col gap-(--spacing-sm)">
                      <FieldRadio
                        v-for="policy in bindingPolicies"
                        :key="policy.value"
                        v-model="form.bindingPolicy"
                        :value="policy.value"
                        name="binding-policy"
                        :input-id="`deployment-settings-binding-${policy.value}`"
                        :label="policy.label"
                        :description="policy.description"
                        :disabled="submitting"
                      />
                    </div>
                  </fieldset>

                  <fieldset
                    class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                  >
                    <legend class="mb-(--spacing-xs) p-0">
                      <Label
                        required
                        hint="Defines how many versions can receive traffic."
                      >
                        Deployment version policy
                      </Label>
                    </legend>
                    <div class="flex flex-col gap-(--spacing-sm)">
                      <FieldRadio
                        v-for="policy in deploymentPolicies"
                        :key="policy.value"
                        v-model="form.deploymentPolicy"
                        :value="policy.value"
                        name="version-policy"
                        :input-id="`deployment-settings-version-${policy.value}`"
                        :label="policy.label"
                        :description="policy.description"
                        :disabled="submitting"
                      />
                    </div>
                    <HelperText label="Cannot be changed after the deployment is created." />
                  </fieldset>

                  <FieldSwitchBlock
                    v-model="form.shared"
                    label="Share across services"
                    description="Let more than one service publish with this configuration, so a single deploy reaches every environment bound to it. Turn it off to keep the setting to one service."
                    :disabled="submitting"
                  />
                </div>
              </SettingsSection>
            </fieldset>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)" />
              <Button
                label="Create Deployment Settings"
                kind="primary"
                size="medium"
                :loading="submitting"
                type="submit"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>

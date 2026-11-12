<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import Hint from '@aziontech/webkit/hint'
  import Input from '@aziontech/webkit/input'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioButton from '@aziontech/webkit/radio-button'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
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
                  <Field
                    :disabled="submitting"
                    :required="Boolean(errors.name)"
                  >
                    <Field.Label for="deployment-settings-name"> Name </Field.Label>
                    <Input
                      v-model="form.name"
                      size="large"
                      placeholder="production-hardened"
                      @update:model-value="errors.name = ''"
                      id="deployment-settings-name"
                    />
                    <Field.Description>
                      {{
                        errors.name || 'How this strategy reads in the Deployment Settings field.'
                      }}
                    </Field.Description>
                  </Field>

                  <Field :disabled="submitting">
                    <Field.Label for="deployment-settings-description"> Description </Field.Label>
                    <Textarea
                      v-model="form.description"
                      placeholder="Storefront traffic for production"
                      id="deployment-settings-description"
                    />
                    <Field.Description>
                      Optional. Used for internal identification.
                    </Field.Description>
                  </Field>

                  <Field.Label>
                    <Field
                      orientation="horizontal"
                      :disabled="submitting"
                    >
                      <Switch v-model="form.active" />
                      <Field.Content>
                        <Field.Title> Active </Field.Title>
                        <Field.Description>
                          When disabled, the strategy stays in the list but no deployment can apply
                          it.
                        </Field.Description>
                      </Field.Content>
                    </Field>
                  </Field.Label>
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
                    <Field.Legend kind="label">
                      <span class="inline-flex items-center gap-(--spacing-xxs)">
                        Binding policy
                        <Hint
                          text="Defines whether each version locks its resource IDs or allows them to change."
                        />
                      </span>
                    </Field.Legend>
                    <div class="flex flex-col gap-(--spacing-sm)">
                      <Field
                        v-for="policy in bindingPolicies"
                        :key="policy.value"
                        orientation="horizontal"
                        :disabled="submitting"
                      >
                        <RadioButton
                          v-model="form.bindingPolicy"
                          :value="policy.value"
                          name="binding-policy"
                          :input-id="`deployment-settings-binding-${policy.value}`"
                        />
                        <Field.Content>
                          <Field.Label :for="`deployment-settings-binding-${policy.value}`">
                            {{ policy.label }}
                          </Field.Label>
                          <Field.Description v-if="policy.description">
                            {{ policy.description }}
                          </Field.Description>
                        </Field.Content>
                      </Field>
                    </div>
                  </fieldset>

                  <fieldset
                    class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                  >
                    <Field.Legend kind="label">
                      <span class="inline-flex items-center gap-(--spacing-xxs)">
                        Deployment version policy
                        <Hint text="Defines how many versions can receive traffic." />
                      </span>
                    </Field.Legend>
                    <div class="flex flex-col gap-(--spacing-sm)">
                      <Field
                        v-for="policy in deploymentPolicies"
                        :key="policy.value"
                        orientation="horizontal"
                        :disabled="submitting"
                      >
                        <RadioButton
                          v-model="form.deploymentPolicy"
                          :value="policy.value"
                          name="version-policy"
                          :input-id="`deployment-settings-version-${policy.value}`"
                        />
                        <Field.Content>
                          <Field.Label :for="`deployment-settings-version-${policy.value}`">
                            {{ policy.label }}
                          </Field.Label>
                          <Field.Description v-if="policy.description">
                            {{ policy.description }}
                          </Field.Description>
                        </Field.Content>
                      </Field>
                    </div>
                    <HelperText label="Cannot be changed after the deployment is created." />
                  </fieldset>

                  <Field.Label>
                    <Field
                      orientation="horizontal"
                      :disabled="submitting"
                    >
                      <Switch v-model="form.shared" />
                      <Field.Content>
                        <Field.Title> Share across services </Field.Title>
                        <Field.Description>
                          Let more than one service publish with this configuration, so a single
                          deploy reaches every environment bound to it. Turn it off to keep the
                          setting to one service.
                        </Field.Description>
                      </Field.Content>
                    </Field>
                  </Field.Label>
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

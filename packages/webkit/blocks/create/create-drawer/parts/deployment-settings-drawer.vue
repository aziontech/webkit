<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import Hint from '@aziontech/webkit/hint'
  import Input from '@aziontech/webkit/input'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { nextTick, reactive, ref, watch } from 'vue'

  import { useDrawerGuard } from '../composables/use-drawer-guard'
  import FormDrawer from './form-drawer.vue'
  import SubmitButton from './submit-button.vue'
  import UnsavedChangesDialog from './unsaved-changes-dialog.vue'

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
    nextTick(() => guard.commit())
  })

  const submit = async () => {
    if (submitting.value) return
    errors.name = form.name.trim() ? '' : 'This field is required.'
    if (errors.name) return
    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 500))
    submitting.value = false
    open.value = false
    toast.success(`${form.name.trim()} created.`)
  }

  const { guard, onOpenChange } = useDrawerGuard({
    open,
    busy: () => submitting.value,
    source: () => form,
    onDiscard: (baseline) => Object.assign(form, baseline)
  })
</script>

<template>
  <FormDrawer
    :open="open"
    title="Create Deployment Settings"
    description="A Deployment Setting says how a deploy routes: whether versions lock the resource IDs they shipped with, and how many of them take traffic. An environment publishes with exactly one."
    shortcut-label="Create deployment settings"
    :busy="submitting"
    @update:open="onOpenChange"
    @submit="submit"
  >
    <template #trigger>
      <DrawerTrigger>
        <div class="w-full md:w-fit">
          <Button
            label="Create Deployment Settings"
            icon="az az-plus"
            variant="outline"
            size="medium"
            class="w-full"
          />
        </div>
      </DrawerTrigger>
    </template>

    <SettingsGroup
      label="General"
      hint="How this strategy is identified in the Deployment Settings list and in the field that applies it."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <Field
          :disabled="submitting"
          required
          :invalid="Boolean(errors.name)"
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
            {{ errors.name || 'How this strategy reads in the Deployment Settings field.' }}
          </Field.Description>
        </Field>

        <Field :disabled="submitting">
          <Field.Label for="deployment-settings-description"> Description </Field.Label>
          <Textarea
            v-model="form.description"
            placeholder="Storefront traffic for production"
            id="deployment-settings-description"
          />
          <Field.Description> Optional. Used for internal identification. </Field.Description>
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
                When disabled, the strategy stays in the list but no deployment can apply it.
              </Field.Description>
            </Field.Content>
          </Field>
        </Field.Label>
      </div>
    </SettingsGroup>

    <SettingsGroup
      label="Routing and policy"
      hint="How versions bind to the resources they ship with, and how traffic reaches them."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <fieldset class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
          <Field.Legend type="label">
            <span class="inline-flex items-center gap-(--spacing-2xs)">
              Binding policy
              <Hint
                content="Defines whether each version locks its resource IDs or allows them to change."
              />
            </span>
          </Field.Legend>
          <RadioGroup
            v-model="form.bindingPolicy"
            name="binding-policy"
            aria-label="Binding policy"
            :disabled="submitting"
          >
            <RadioGroup.Item
              v-for="policy in bindingPolicies"
              :key="policy.value"
              :value="policy.value"
              :description="policy.description"
              >{{ policy.label }}</RadioGroup.Item
            >
          </RadioGroup>
        </fieldset>

        <fieldset class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
          <Field.Legend type="label">
            <span class="inline-flex items-center gap-(--spacing-2xs)">
              Deployment version policy
              <Hint content="Defines how many versions can receive traffic." />
            </span>
          </Field.Legend>
          <RadioGroup
            v-model="form.deploymentPolicy"
            name="version-policy"
            aria-label="Deployment version policy"
            :disabled="submitting"
          >
            <RadioGroup.Item
              v-for="policy in deploymentPolicies"
              :key="policy.value"
              :value="policy.value"
              :description="policy.description"
              >{{ policy.label }}</RadioGroup.Item
            >
          </RadioGroup>
          <FieldDescription>Cannot be changed after the deployment is created.</FieldDescription>
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
                Let more than one service publish with this configuration, so a single deploy
                reaches every environment bound to it. Turn it off to keep the setting to one
                service.
              </Field.Description>
            </Field.Content>
          </Field>
        </Field.Label>
      </div>
    </SettingsGroup>
    <template #footer>
      <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
        <div class="flex min-w-0 items-center gap-(--spacing-sm)" />
        <SubmitButton :loading="submitting">Create Deployment Settings</SubmitButton>
      </div>
    </template>
  </FormDrawer>

  <UnsavedChangesDialog
    :guard="guard"
    data-testid="unsaved-changes-dialog"
  />
</template>

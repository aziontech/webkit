<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Field from '@aziontech/ui/field'
  import FieldDescription from '@aziontech/ui/field-description'
  import Input from '@aziontech/ui/input'
  import Select from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import Switch from '@aziontech/ui/switch'
  import Textarea from '@aziontech/ui/textarea'
  import { toast } from '@aziontech/ui/toast'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import { useDrawerGuard } from '../composables/use-drawer-guard'
  import CreateDrawer, {
    type CreateDrawerDeploymentPolicy,
    type CreateDrawerEnvironment,
    type CreateDrawerSubmission
  } from '../create-drawer.vue'
  import {
    BRANCH_MODES,
    type BranchMode,
    DEPLOYMENT_POLICIES,
    isIpOrCidr,
    ROBOTS_POLICIES,
    type RobotsPolicy
  } from '../lib/environment-options'
  import { sampleEnvironments } from '../sample'
  import FormDrawer from './form-drawer.vue'
  import UnsavedChangesDialog from './unsaved-changes-dialog.vue'

  const open = ref(false)
  const submitting = ref(false)
  const environmentOptions = ref<CreateDrawerEnvironment[]>([...sampleEnvironments])

  const onSubmit = (_event: Event, values: CreateDrawerSubmission) => {
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      open.value = false
      toast.success(`${values.host} added.`)
    }, 600)
  }

  const environmentOpen = ref(false)
  const environmentSubmitting = ref(false)
  const blankEnvironment = () => ({
    name: '',
    description: '',
    deploymentPolicy: 'single_version' as CreateDrawerDeploymentPolicy,
    robotsPolicy: 'preserve_origin' as RobotsPolicy,
    allowlist: false,
    cidrs: '',
    branchTracking: false,
    branchMode: 'branch_is' as BranchMode,
    branchMatch: 'main'
  })
  const environment = reactive(blankEnvironment())
  const environmentErrors = reactive({ name: '', cidrs: '', branchMatch: '' })

  watch(environmentOpen, (isOpen) => {
    if (!isOpen) return
    Object.assign(environment, blankEnvironment())
    Object.assign(environmentErrors, { name: '', cidrs: '', branchMatch: '' })
    environmentSubmitting.value = false
    nextTick(() => environmentGuard.commit())
  })

  const labelIn =
    <T extends { value: string; label: string }>(list: T[]) =>
    (value: string) =>
      list.find((option) => option.value === value)?.label ?? ''
  const deploymentPolicyLabel = labelIn(DEPLOYMENT_POLICIES)
  const robotsPolicyLabel = labelIn(ROBOTS_POLICIES)
  const branchModeLabel = labelIn(BRANCH_MODES)
  const policyHint = computed(
    () =>
      DEPLOYMENT_POLICIES.find((option) => option.value === environment.deploymentPolicy)
        ?.description ?? ''
  )
  const robotsHint = computed(
    () =>
      ROBOTS_POLICIES.find((option) => option.value === environment.robotsPolicy)?.description ?? ''
  )

  const allowlistEntries = () =>
    environment.cidrs
      .split(/[\s,]+/)
      .map((entry) => entry.trim())
      .filter(Boolean)

  const validateEnvironment = () => {
    const name = environment.name.trim()
    environmentErrors.name = !name
      ? 'This field is required.'
      : environmentOptions.value.some((option) => option.label.toLowerCase() === name.toLowerCase())
        ? 'An environment with this name already exists.'
        : ''
    environmentErrors.cidrs = ''
    if (environment.allowlist) {
      const entries = allowlistEntries()
      const invalid = entries.filter((entry) => !isIpOrCidr(entry))
      if (!entries.length) environmentErrors.cidrs = 'Add at least one IPv4 address or CIDR range.'
      else if (invalid.length)
        environmentErrors.cidrs = `Invalid IPv4 address or CIDR range: ${invalid.join(', ')}.`
    }
    environmentErrors.branchMatch =
      environment.branchTracking && !environment.branchMatch.trim() ? 'This field is required.' : ''
    return !environmentErrors.name && !environmentErrors.cidrs && !environmentErrors.branchMatch
  }

  const submitEnvironment = () => {
    if (environmentSubmitting.value || !validateEnvironment()) return
    environmentSubmitting.value = true
    setTimeout(() => {
      const name = environment.name.trim()
      environmentOptions.value = [
        ...environmentOptions.value,
        { value: name, label: name, deploymentPolicy: environment.deploymentPolicy }
      ]
      environmentSubmitting.value = false
      environmentOpen.value = false
    }, 500)
  }

  const { guard: environmentGuard, onOpenChange: onEnvironmentOpenChange } = useDrawerGuard({
    open: environmentOpen,
    busy: () => environmentSubmitting.value,
    source: () => environment,
    onDiscard: (baseline) => Object.assign(environment, baseline)
  })
</script>

<template>
  <CreateDrawer
    v-model:open="open"
    v-model:environment-open="environmentOpen"
    :environments="environmentOptions"
    :loading="submitting"
    @submit="onSubmit"
  >
    <template #trigger="{ open: openDrawer }">
      <div class="flex flex-wrap items-center gap-(--spacing-sm)">
        <Button
          type="button"
          label="Create Environment"
          variant="outline"
          size="medium"
          icon="az az-plus"
          @click="environmentOpen = true"
        />
        <Button
          type="button"
          label="Add Domain"
          variant="outline"
          size="medium"
          icon="az az-plus"
          @click="openDrawer"
        />
      </div>
    </template>
  </CreateDrawer>

  <FormDrawer
    :open="environmentOpen"
    title="Create Environment"
    description="An environment is where a deployment lands. Its deployment policy decides which Deployment Settings can serve it."
    shortcut-label="Create environment"
    :busy="environmentSubmitting"
    :size="open ? 'medium' : 'large'"
    @update:open="onEnvironmentOpenChange"
    @submit="submitEnvironment"
  >
    <SettingsGroup
      label="General"
      hint="How this environment is identified across the console."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <Field
          required
          :invalid="!!environmentErrors.name"
        >
          <Field.Label>Name</Field.Label>
          <Input
            v-model="environment.name"
            size="large"
            placeholder="Preview"
            autocomplete="off"
            :disabled="environmentSubmitting"
            @update:model-value="environmentErrors.name = ''"
          />
          <Field.Description>{{
            environmentErrors.name || 'A clear name for this deployment stage.'
          }}</Field.Description>
        </Field>
        <Field>
          <Field.Label>Description</Field.Label>
          <Textarea
            v-model="environment.description"
            :rows="2"
            :disabled="environmentSubmitting"
          />
          <Field.Description>Optional and internal: it never reaches traffic.</Field.Description>
        </Field>
      </div>
    </SettingsGroup>

    <SettingsGroup
      label="Settings"
      hint="How this environment's URLs are organized, and how the edge answers robots.txt for it."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <Field>
          <Field.Label for="environment-deployment-policy">Deployment policy</Field.Label>
          <Select
            v-model="environment.deploymentPolicy"
            size="large"
            class="w-full"
            :disabled="environmentSubmitting"
            :display-value="deploymentPolicyLabel"
          >
            <Select.Trigger
              id="environment-deployment-policy"
              aria-describedby="environment-deployment-policy-helper"
            />
            <Select.Content>
              <Select.Item
                v-for="option in DEPLOYMENT_POLICIES"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Item>
            </Select.Content>
          </Select>
          <FieldDescription id="environment-deployment-policy-helper"
            >{{ policyHint }} Only Deployment Settings set to
            {{ deploymentPolicyLabel(environment.deploymentPolicy) }} can serve this
            environment.</FieldDescription
          >
        </Field>
        <Field>
          <Field.Label for="environment-robots-policy">Robots policy</Field.Label>
          <Select
            v-model="environment.robotsPolicy"
            size="large"
            class="w-full"
            :disabled="environmentSubmitting"
            :display-value="robotsPolicyLabel"
          >
            <Select.Trigger
              id="environment-robots-policy"
              aria-describedby="environment-robots-policy-helper"
            />
            <Select.Content>
              <Select.Item
                v-for="option in ROBOTS_POLICIES"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Item>
            </Select.Content>
          </Select>
          <FieldDescription id="environment-robots-policy-helper">{{
            robotsHint
          }}</FieldDescription>
        </Field>
      </div>
    </SettingsGroup>

    <SettingsGroup
      label="Protection"
      hint="Restrict who can reach this environment."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <Field.Label>
          <Field
            orientation="horizontal"
            :disabled="environmentSubmitting"
          >
            <Switch
              v-model="environment.allowlist"
              @update:model-value="environmentErrors.cidrs = ''"
            />
            <Field.Content>
              <Field.Title>IP allowlist</Field.Title>
              <Field.Description
                >Only allow access from the listed IP addresses or CIDR ranges.</Field.Description
              >
            </Field.Content>
          </Field>
        </Field.Label>
        <Field
          v-if="environment.allowlist"
          :invalid="!!environmentErrors.cidrs"
        >
          <Field.Label>IP addresses and CIDR ranges</Field.Label>
          <Textarea
            v-model="environment.cidrs"
            :rows="3"
            placeholder="203.0.113.0/24"
            :disabled="environmentSubmitting"
            @update:model-value="environmentErrors.cidrs = ''"
          />
          <Field.Error v-if="environmentErrors.cidrs">{{ environmentErrors.cidrs }}</Field.Error>
          <Field.Description v-else>One IPv4 address or CIDR range per line.</Field.Description>
        </Field>
      </div>
    </SettingsGroup>

    <SettingsGroup
      label="Branch tracking"
      hint="Build this environment automatically when a matching Git branch is updated."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <Field.Label>
          <Field
            orientation="horizontal"
            :disabled="environmentSubmitting"
          >
            <Switch
              v-model="environment.branchTracking"
              @update:model-value="environmentErrors.branchMatch = ''"
            />
            <Field.Content>
              <Field.Title>Branch tracking</Field.Title>
              <Field.Description>Track a Git branch pattern to trigger builds.</Field.Description>
            </Field.Content>
          </Field>
        </Field.Label>
        <template v-if="environment.branchTracking">
          <Field>
            <Field.Label for="environment-branch-mode">Mode</Field.Label>
            <Select
              v-model="environment.branchMode"
              size="large"
              class="w-full"
              :disabled="environmentSubmitting"
              :display-value="branchModeLabel"
            >
              <Select.Trigger
                id="environment-branch-mode"
                aria-describedby="environment-branch-mode-helper"
              />
              <Select.Content>
                <Select.Item
                  v-for="option in BRANCH_MODES"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
            <FieldDescription id="environment-branch-mode-helper"
              >How the branch name is matched.</FieldDescription
            >
          </Field>
          <Field
            required
            :invalid="!!environmentErrors.branchMatch"
          >
            <Field.Label>Branch match</Field.Label>
            <Input
              v-model="environment.branchMatch"
              size="large"
              placeholder="main"
              autocomplete="off"
              :spellcheck="false"
              :disabled="environmentSubmitting"
              @update:model-value="environmentErrors.branchMatch = ''"
            />
            <Field.Description>{{
              environmentErrors.branchMatch || 'The branch name or pattern to match.'
            }}</Field.Description>
          </Field>
        </template>
      </div>
    </SettingsGroup>
  </FormDrawer>

  <UnsavedChangesDialog
    :guard="environmentGuard"
    data-testid="environment-unsaved-changes-dialog"
  />
</template>

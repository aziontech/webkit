<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import Input from '@aziontech/webkit/input'
  import Kbd from '@aziontech/webkit/kbd'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import CreateDrawer, {
    type CreateDrawerDeploymentPolicy,
    type CreateDrawerEnvironment,
    type CreateDrawerSubmission
  } from '../create-drawer.vue'
  import { sampleEnvironments } from '../sample'

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

  type RobotsPolicy = 'preserve_origin' | 'index' | 'noindex'
  type BranchMode = 'branch_is' | 'branch_starts_with' | 'branch_ends_with'

  const DEPLOYMENT_POLICIES: {
    value: CreateDrawerDeploymentPolicy
    label: string
    description: string
  }[] = [
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
  const ROBOTS_POLICIES: { value: RobotsPolicy; label: string; description: string }[] = [
    {
      value: 'preserve_origin',
      label: 'Preserve origin',
      description: 'Serves the robots.txt the resource returns.'
    },
    {
      value: 'index',
      label: 'Index',
      description:
        'The edge answers with a robots.txt that allows indexing. The origin is not reached.'
    },
    {
      value: 'noindex',
      label: 'No index',
      description:
        'The edge answers with a robots.txt that blocks indexing. The origin is not reached.'
    }
  ]
  const BRANCH_MODES: { value: BranchMode; label: string }[] = [
    { value: 'branch_is', label: 'Branch is' },
    { value: 'branch_starts_with', label: 'Branch starts with' },
    { value: 'branch_ends_with', label: 'Branch ends with' }
  ]

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

  const isOctet = (octet: string) =>
    /^\d{1,3}$/.test(octet) && Number(octet) <= 255 && (octet === '0' || !octet.startsWith('0'))
  const isIpOrCidr = (entry: string) => {
    const [address, prefix, ...rest] = entry.split('/')
    if (rest.length) return false
    const octets = address.split('.')
    if (octets.length !== 4 || !octets.every(isOctet)) return false
    return prefix === undefined || (/^\d{1,2}$/.test(prefix) && Number(prefix) <= 32)
  }
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

  const environmentGuard = useUnsavedChanges(() => environment, {
    onDiscard: (baseline) => Object.assign(environment, baseline),
    enabled: () => environmentOpen.value && !environmentSubmitting.value
  })
  const environmentGuardDialog = environmentGuard.dialogProps
  const environmentGuardLabels = environmentGuard.labels

  const onEnvironmentOpenChange = async (next: boolean) => {
    if (next) {
      environmentOpen.value = true
      return
    }
    if (await environmentGuard.confirmLeave()) environmentOpen.value = false
  }

  const environmentFormEl = ref<HTMLFormElement | null>(null)

  useShortcuts({
    keys: 'meta+enter',
    label: 'Create environment',
    group: 'Drawer',
    element: environmentFormEl,
    when: () => environmentOpen.value && !environmentSubmitting.value,
    handler: () => environmentFormEl.value?.requestSubmit()
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

  <Drawer
    :open="environmentOpen"
    @update:open="onEnvironmentOpenChange"
    :size="open ? 'medium' : 'large'"
    side="end"
  >
    <DrawerContent>
      <form
        ref="environmentFormEl"
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Create Environment"
        novalidate
        @submit.prevent="submitEnvironment"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>Create Environment</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              An environment is where a deployment lands. Its deployment policy decides which
              Deployment Settings can serve it.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="environmentSubmitting"
          >
            <legend class="sr-only">Create Environment</legend>
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
                  <Field.Description
                    >Optional and internal: it never reaches traffic.</Field.Description
                  >
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
                        >Only allow access from the listed IP addresses or CIDR
                        ranges.</Field.Description
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
                  <Field.Error v-if="environmentErrors.cidrs">{{
                    environmentErrors.cidrs
                  }}</Field.Error>
                  <Field.Description v-else
                    >One IPv4 address or CIDR range per line.</Field.Description
                  >
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
                      <Field.Description
                        >Track a Git branch pattern to trigger builds.</Field.Description
                      >
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
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              variant="primary"
              size="medium"
              :loading="environmentSubmitting"
              type="submit"
              :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
            >
              Create Environment
              <Kbd
                meta
                key-name="enter"
                size="small"
                aria-hidden="true"
              />
            </Button>
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>

  <ConfirmDialog
    v-bind="environmentGuardDialog"
    data-testid="environment-unsaved-changes-dialog"
  >
    <template #actions>
      <Button
        :label="environmentGuardLabels.keepEditing"
        variant="ghost"
        size="medium"
        data-autofocus
        @click="environmentGuard.keepEditing"
      />
      <Button
        :label="environmentGuardLabels.discard"
        variant="danger"
        size="medium"
        @click="environmentGuard.discardAndLeave"
      />
    </template>
  </ConfirmDialog>
</template>

<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import InputGroup from '@aziontech/webkit/input-group'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'

  const open = ref(false)
  const submitting = ref(false)
  const environmentSelectOpen = ref(false)
  const certificateTouched = ref(false)

  type DeploymentPolicy = 'single_version' | 'versioned_urls'

  interface EnvironmentOption extends SelectOptionItem {
    deploymentPolicy: DeploymentPolicy
  }

  const CREATE_ENVIRONMENT = '__create-environment__'
  const environmentOptions = ref<EnvironmentOption[]>([
    { value: 'Production', label: 'Production', deploymentPolicy: 'single_version' },
    { value: 'Preview', label: 'Preview', deploymentPolicy: 'versioned_urls' },
    { value: 'Stage', label: 'Stage', deploymentPolicy: 'versioned_urls' }
  ])
  const policyLabels: Record<DeploymentPolicy, string> = {
    single_version: 'Single',
    versioned_urls: 'Versioned'
  }
  const resourceEnvironments = ['Production', 'Preview']
  const certificateOptions = [
    { value: '', label: 'Free platform certificate', subject: '' },
    { value: 'cert-8801', label: 'example.com wildcard', subject: '*.example.com' },
    { value: 'cert-8803', label: 'api.example.com', subject: 'api.example.com' },
    { value: 'cert-8805', label: 'staging wildcard', subject: '*.staging.example.com' },
    { value: 'cert-8802', label: 'example.org', subject: 'example.org' }
  ]
  const kindOptions = [
    {
      value: 'free',
      label: 'Use a free platform domain',
      description: 'You can use a free azion.app subdomain.'
    },
    {
      value: 'own',
      label: 'Bring my own domain',
      description: 'Use your own DNS and point it to this resource.'
    }
  ]

  const blankForm = () => ({ kind: 'free', domain: '', environment: '', certificate: '' })
  const form = reactive(blankForm())
  const errors = reactive({ domain: '', environment: '' })

  const environmentLabel = (value: string) =>
    environmentOptions.value.find((option) => option.value === value)?.label ?? ''
  const certificateLabel = (value: string) =>
    certificateOptions.find((option) => option.value === value)?.label ?? ''

  const subjectCovers = (subject: string, host: string) => {
    const pattern = subject.toLowerCase()
    if (!pattern) return false
    if (pattern === host) return true
    if (!pattern.startsWith('*.')) return false
    const parent = pattern.slice(2)
    return (
      host.endsWith(`.${parent}`) && host.slice(0, -(parent.length + 1)).split('.').length === 1
    )
  }

  const certificateForDomain = (host: string) => {
    const name = host.trim().toLowerCase()
    if (!name) return ''
    const candidates = certificateOptions.filter((option) => subjectCovers(option.subject, name))
    const exact = candidates.find((option) => option.subject.toLowerCase() === name)
    return (exact ?? candidates[0])?.value ?? ''
  }

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(errors, { domain: '', environment: '' })
    submitting.value = false
    Object.assign(form, blankForm())
    certificateTouched.value = false
  })

  const fullDomain = computed(() => {
    const name = form.domain.trim()
    if (!name) return ''
    return form.kind === 'free' ? `${name}.azion.app` : name
  })

  watch(
    () => [fullDomain.value, form.kind],
    ([host, kind]) => {
      if (kind === 'free') {
        form.certificate = ''
        return
      }
      if (certificateTouched.value) return
      form.certificate = certificateForDomain(host)
    },
    { immediate: true }
  )

  const onCertificate = (value: string) => {
    certificateTouched.value = true
    form.certificate = value
  }

  const certificateHint = computed(() => {
    if (!form.certificate) {
      return 'Served by the free platform certificate, issued and renewed automatically.'
    }
    const name = certificateLabel(form.certificate)
    return certificateTouched.value
      ? `Served with ${name}.`
      : `${name} already covers this address, so it is selected. Change it if another one should serve it.`
  })

  const chosen = computed(() =>
    environmentOptions.value.find((option) => option.value === form.environment)
  )

  const joinsResource = computed(
    () => Boolean(form.environment) && !resourceEnvironments.includes(form.environment)
  )

  const environmentHint = computed(() => {
    if (!chosen.value) return 'Where this domain answers. Pick one, or create it from here.'
    const policy = policyLabels[chosen.value.deploymentPolicy]
    return joinsResource.value
      ? `This resource doesn't publish into ${chosen.value.label} yet. Adding this domain connects it, served by the Deployment Settings set to ${policy}.`
      : `${chosen.value.label} publishes with the Deployment Settings set to ${policy}.`
  })

  const onEnvironmentModel = (value: string) => {
    if (value === CREATE_ENVIRONMENT) {
      environmentSelectOpen.value = false
      environmentOpen.value = true
      return
    }
    form.environment = value
    errors.environment = ''
  }

  type RobotsPolicy = 'preserve_origin' | 'index' | 'noindex'
  type BranchMode = 'branch_is' | 'branch_starts_with' | 'branch_ends_with'

  const DEPLOYMENT_POLICIES: { value: DeploymentPolicy; label: string; description: string }[] = [
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
    deploymentPolicy: 'single_version' as DeploymentPolicy,
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
      form.environment = name
      errors.environment = ''
      environmentSubmitting.value = false
      environmentOpen.value = false
    }, 500)
  }

  const validate = () => {
    errors.domain = form.domain.trim() ? '' : 'This field is required.'
    errors.environment = form.environment ? '' : 'This field is required.'
    return !errors.domain && !errors.environment
  }

  const submit = () => {
    if (submitting.value) return
    if (!validate()) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      open.value = false
      toast.success(`${fullDomain.value} added.`)
    }, 600)
  }
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
    <Button
      type="button"
      label="Create Environment"
      variant="outline"
      size="medium"
      icon="ai ai-plus"
      @click="environmentOpen = true"
    />
    <Button
      type="button"
      label="Add Domain"
      variant="outline"
      size="medium"
      icon="ai ai-plus"
      @click="open = true"
    />
  </div>

  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Add Domain"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>Add Domain</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              A domain is what puts an environment on this resource. Say where it answers, and name
              the address.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Add Domain</legend>
            <SettingsSection
              title="Environment"
              hint="Where the domain answers."
            >
              <Field
                required
                :invalid="!!errors.environment"
              >
                <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                  <Field.Label for="domain-environment">Environment</Field.Label>
                </div>
                <Select
                  v-model:open="environmentSelectOpen"
                  :model-value="form.environment"
                  size="large"
                  class="w-full"
                  placeholder="Select an environment"
                  :disabled="submitting"
                  :invalid="!!errors.environment"
                  :display-value="environmentLabel"
                  @update:model-value="onEnvironmentModel"
                >
                  <Select.Trigger id="domain-environment" />
                  <Select.Content>
                    <Select.Item
                      v-for="option in environmentOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                    <template #footer>
                      <Select.Item
                        :value="CREATE_ENVIRONMENT"
                        class="w-full"
                      >
                        Create Environment
                      </Select.Item>
                    </template>
                  </Select.Content>
                </Select>
                <Field.Error v-if="errors.environment">{{ errors.environment }}</Field.Error>
                <Field.Description v-else>{{ environmentHint }}</Field.Description>
              </Field>
            </SettingsSection>

            <SettingsSection
              title="Domain"
              hint="The address this resource answers on, where it comes from, and the certificate it is served with."
            >
              <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <fieldset class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
                  <Field.Legend type="label">Domain source</Field.Legend>
                  <RadioGroup
                    v-model="form.kind"
                    variant="card"
                    name="domain-kind"
                    aria-label="Domain source"
                    :disabled="submitting"
                  >
                    <RadioGroup.Item
                      v-for="option in kindOptions"
                      :key="option.value"
                      :value="option.value"
                      :description="option.description"
                      >{{ option.label }}</RadioGroup.Item
                    >
                  </RadioGroup>
                </fieldset>

                <Field
                  :disabled="submitting"
                  required
                  :invalid="!!errors.domain"
                >
                  <Field.Label>Domain</Field.Label>
                  <InputGroup>
                    <InputGroup.Input
                      v-model="form.domain"
                      placeholder="my-resource"
                      @update:model-value="errors.domain = ''"
                    />
                    <InputGroup.Addon v-if="form.kind === 'free'">.azion.app</InputGroup.Addon>
                  </InputGroup>
                  <Field.Error v-if="errors.domain">{{ errors.domain }}</Field.Error>
                </Field>

                <template v-if="form.kind === 'own'">
                  <Field>
                    <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                      <Field.Label for="domain-certificate">Certificate</Field.Label>
                    </div>
                    <Select
                      :model-value="form.certificate"
                      size="large"
                      class="w-full"
                      :disabled="submitting"
                      :display-value="certificateLabel"
                      @update:model-value="onCertificate"
                    >
                      <Select.Trigger
                        id="domain-certificate"
                        aria-describedby="domain-certificate-helper"
                      />
                      <Select.Content>
                        <Select.Item
                          v-for="option in certificateOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Item>
                      </Select.Content>
                    </Select>
                    <HelperText
                      id="domain-certificate-helper"
                      type="helper"
                      >{{ certificateHint }}</HelperText
                    >
                  </Field>
                </template>

                <Alert
                  severity="info"
                  label="Your resource is always accessible at an azion.app subdomain based on its name. Custom domains allow visitors to reach it at your own domain."
                />
              </div>
            </SettingsSection>
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              label="Add Domain"
              variant="primary"
              size="medium"
              :loading="submitting"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
  <Drawer
    v-model:open="environmentOpen"
    :size="open ? 'medium' : 'large'"
    side="end"
  >
    <DrawerContent>
      <form
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
            <SettingsSection
              title="General"
              hint="How this environment is identified across the console."
            >
              <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <Field :required="!!environmentErrors.name">
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
            </SettingsSection>

            <SettingsSection
              title="Settings"
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
                  <HelperText
                    id="environment-deployment-policy-helper"
                    type="helper"
                    >{{ policyHint }} Only Deployment Settings set to
                    {{ deploymentPolicyLabel(environment.deploymentPolicy) }} can serve this
                    environment.</HelperText
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
                  <HelperText
                    id="environment-robots-policy-helper"
                    type="helper"
                    >{{ robotsHint }}</HelperText
                  >
                </Field>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Protection"
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
            </SettingsSection>

            <SettingsSection
              title="Branch tracking"
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
                    <HelperText
                      id="environment-branch-mode-helper"
                      type="helper"
                      >How the branch name is matched.</HelperText
                    >
                  </Field>
                  <Field :required="!!environmentErrors.branchMatch">
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
            </SettingsSection>
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              label="Create Environment"
              variant="primary"
              size="medium"
              :loading="environmentSubmitting"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>

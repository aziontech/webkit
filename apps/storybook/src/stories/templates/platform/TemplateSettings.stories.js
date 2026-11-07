import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  consoleComponents,
  consolePage,
  consoleScript,
  consoleSetup,
  pageHeading
} from './_form-patterns'
import { declare } from './_forms-markup'

const BREADCRUMB = [{ label: 'Forms', href: '/forms' }, { label: 'Fields separated' }]

const SCOPES = [
  { label: 'gab-az', value: 'gab-az' },
  { label: 'azion-tech', value: 'azion-tech' },
  { label: 'rafael-personal', value: 'rafael-personal' }
]

const DEPLOYMENT_TYPES = [
  {
    value: 'static',
    label: 'Static site',
    description:
      'Pre-rendered HTML/CSS/JS served straight from the edge. Fastest, no server runtime.'
  },
  {
    value: 'ssr',
    label: 'Server-side rendered',
    description: 'Rendered on demand by an edge function. Best for dynamic, personalized pages.'
  },
  {
    value: 'hybrid',
    label: 'Hybrid',
    description: 'A static shell with server-rendered islands. Balances speed and dynamism.'
  }
]

const RUNTIMES = [
  { value: 'node18', label: 'Node.js 18' },
  { value: 'node20', label: 'Node.js 20 (LTS)' },
  { value: 'bun', label: 'Bun 1.x' }
]

const REGION_OPTIONS = [
  { label: 'US East', value: 'us-east' },
  { label: 'US West', value: 'us-west' },
  { label: 'South America', value: 'sa-east' },
  { label: 'Europe', value: 'eu-west' },
  { label: 'Asia Pacific', value: 'ap-southeast' }
]

const FORM = {
  scope: 'gab-az',
  repoName: 'nuxt-ecommerce',
  repoPrivate: true,
  accessToken: '',
  revalidationSecret: '',
  storeDomain: '',
  deploymentType: '',
  runtime: 'node20',
  regions: ['us-east'],
  buildCommand: '',
  deployKey: '',
  buildNotes: '',
  alertPhone: '',
  emailNotifications: true,
  slackAlerts: false,
  deployPreviews: true,
  edgeCaching: true,
  http3: false,
  waf: false,
  acceptDeploy: false
}

const NAMES = [
  'Button',
  'FieldCheckbox',
  'FieldCheckboxBlock',
  'FieldInputGroup',
  'FieldPassword',
  'FieldPhoneNumber',
  'FieldRadio',
  'FieldRadioBlock',
  'FieldSwitch',
  'FieldSwitchBlock',
  'FieldText',
  'FieldTextSwitch',
  'FieldTextarea',
  'HelperText',
  'Label',
  'MultiSelect',
  'Select'
]

const scopeLabel = (value) => SCOPES.find((option) => option.value === value)?.label ?? ''
const regionsLabel = (values) =>
  (values ?? [])
    .map((value) => REGION_OPTIONS.find((option) => option.value === value)?.label ?? value)
    .join(', ')

const setupFor = (initiallySubmitted) => () => {
  const form = reactive(structuredClone(FORM))
  const submitted = ref(initiallySubmitted)
  const submitting = ref(false)
  const alertPhoneNumber = ref({ number: '', complete: false })

  const scopeEmpty = computed(() => !form.scope)
  const repoEmpty = computed(() => !form.repoName.trim())
  const tokenEmpty = computed(() => !form.accessToken.trim())
  const domainInvalid = computed(
    () => form.storeDomain.trim() !== '' && !/^https?:\/\/.+\..+/.test(form.storeDomain.trim())
  )
  const deploymentTypeEmpty = computed(() => !form.deploymentType)
  const buildCommandEmpty = computed(() => !form.buildCommand.trim())
  const deployKeyEmpty = computed(() => !form.deployKey)
  const deployKeyInvalid = computed(() => form.deployKey.length > 0 && form.deployKey.length < 8)
  const phoneEmpty = computed(() => !form.alertPhone.trim())
  const phoneInvalid = computed(
    () => form.alertPhone.trim() !== '' && !alertPhoneNumber.value.complete
  )
  const acceptEmpty = computed(() => !form.acceptDeploy)

  const isValid = computed(
    () =>
      !scopeEmpty.value &&
      !repoEmpty.value &&
      !tokenEmpty.value &&
      !domainInvalid.value &&
      !deploymentTypeEmpty.value &&
      !buildCommandEmpty.value &&
      !deployKeyEmpty.value &&
      !deployKeyInvalid.value &&
      !phoneEmpty.value &&
      !phoneInvalid.value &&
      !acceptEmpty.value
  )

  const submit = () => {
    if (submitting.value) return
    submitted.value = true
    if (!isValid.value) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
    }, 900)
  }

  return consoleSetup({
    breadcrumb: BREADCRUMB,
    state: {
      scopes: SCOPES,
      scopeLabel,
      deploymentTypes: DEPLOYMENT_TYPES,
      runtimes: RUNTIMES,
      regionOptions: REGION_OPTIONS,
      regionsLabel,
      form,
      submitting,
      alertPhoneNumber,
      scopeWarning: computed(() => submitted.value && scopeEmpty.value),
      repoWarning: computed(() => submitted.value && repoEmpty.value),
      tokenWarning: computed(() => submitted.value && tokenEmpty.value),
      domainError: computed(() => submitted.value && domainInvalid.value),
      deploymentTypeWarning: computed(() => submitted.value && deploymentTypeEmpty.value),
      buildCommandWarning: computed(() => submitted.value && buildCommandEmpty.value),
      deployKeyWarning: computed(() => submitted.value && deployKeyEmpty.value),
      deployKeyError: computed(() => submitted.value && deployKeyInvalid.value),
      phoneWarning: computed(() => submitted.value && phoneEmpty.value),
      phoneError: computed(() => submitted.value && phoneInvalid.value),
      acceptWarning: computed(() => submitted.value && acceptEmpty.value),
      submit
    }
  })
}

const LOGIC = `const scopeEmpty = computed(() => !form.scope)
const repoEmpty = computed(() => !form.repoName.trim())
const tokenEmpty = computed(() => !form.accessToken.trim())
const domainInvalid = computed(
  () => form.storeDomain.trim() !== '' && !/^https?:\\/\\/.+\\..+/.test(form.storeDomain.trim())
)
const deploymentTypeEmpty = computed(() => !form.deploymentType)
const buildCommandEmpty = computed(() => !form.buildCommand.trim())
const deployKeyEmpty = computed(() => !form.deployKey)
const deployKeyInvalid = computed(() => form.deployKey.length > 0 && form.deployKey.length < 8)
const phoneEmpty = computed(() => !form.alertPhone.trim())
const alertPhoneNumber = ref({ number: '', complete: false })
const phoneInvalid = computed(
  () => form.alertPhone.trim() !== '' && !alertPhoneNumber.value.complete
)
const acceptEmpty = computed(() => !form.acceptDeploy)

const scopeWarning = computed(() => submitted.value && scopeEmpty.value)
const repoWarning = computed(() => submitted.value && repoEmpty.value)
const tokenWarning = computed(() => submitted.value && tokenEmpty.value)
const domainError = computed(() => submitted.value && domainInvalid.value)
const deploymentTypeWarning = computed(() => submitted.value && deploymentTypeEmpty.value)
const buildCommandWarning = computed(() => submitted.value && buildCommandEmpty.value)
const deployKeyWarning = computed(() => submitted.value && deployKeyEmpty.value)
const deployKeyError = computed(() => submitted.value && deployKeyInvalid.value)
const phoneWarning = computed(() => submitted.value && phoneEmpty.value)
const phoneError = computed(() => submitted.value && phoneInvalid.value)
const acceptWarning = computed(() => submitted.value && acceptEmpty.value)

const isValid = computed(
  () =>
    !scopeEmpty.value &&
    !repoEmpty.value &&
    !tokenEmpty.value &&
    !domainInvalid.value &&
    !deploymentTypeEmpty.value &&
    !buildCommandEmpty.value &&
    !deployKeyEmpty.value &&
    !deployKeyInvalid.value &&
    !phoneEmpty.value &&
    !phoneInvalid.value &&
    !acceptEmpty.value
)

const submit = () => {
  if (submitting.value) return
  submitted.value = true
  if (!isValid.value) return
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
  }, 900)
}`.split('\n')

const scriptFor = (initiallySubmitted) =>
  consoleScript({
    breadcrumb: BREADCRUMB,
    names: NAMES,
    vue: ['computed', 'reactive', 'ref'],
    body: [
      declare('scopes', SCOPES),
      "const scopeLabel = (value) => scopes.find((option) => option.value === value)?.label ?? ''",
      '',
      declare('deploymentTypes', DEPLOYMENT_TYPES),
      declare('runtimes', RUNTIMES),
      declare('regionOptions', REGION_OPTIONS),
      'const regionsLabel = (values) =>',
      '  (values ?? [])',
      '    .map((value) => regionOptions.find((option) => option.value === value)?.label ?? value)',
      "    .join(', ')",
      '',
      declare('form', FORM, 'reactive'),
      `const submitted = ref(${initiallySubmitted})`,
      'const submitting = ref(false)',
      '',
      ...LOGIC
    ]
  })

const LOCK_ICON = `<template #iconRight>
  <i
    class="pi pi-lock"
    aria-hidden="true"
  />
</template>`

const REPOSITORY = `<div class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2">
  <div class="flex w-full flex-col gap-(--spacing-xs)">
    <Label
      for="tpl-scope"
      :required="scopeWarning"
      >Scope</Label
    >
    <Select
      v-model="form.scope"
      size="large"
      :disabled="submitting"
      placeholder="Select an account"
      :display-value="scopeLabel"
    >
      <Select.Trigger id="tpl-scope">
        <template #iconLeft>
          <i
            class="ai ai-github"
            aria-hidden="true"
          />
        </template>
      </Select.Trigger>
      <Select.Content>
        <Select.Option
          v-for="option in scopes"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </Select.Option>
      </Select.Content>
    </Select>
  </div>

  <FieldTextSwitch
    v-model="form.repoName"
    v-model:enabled="form.repoPrivate"
    input-id="tpl-repo-name"
    name="repoName"
    label="Private Repository Name"
    placeholder="my-repository"
    :required="repoWarning"
    :disabled="submitting"
  />
</div>`

const TEMPLATE_SETTINGS = `<section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
  <h2 class="text-heading-xs text-(--text-default)">Template Settings</h2>

  <FieldText
    v-model="form.accessToken"
    input-id="tpl-access-token"
    name="accessToken"
    label="Shopify Access Token"
    placeholder="Access Token"
    size="large"
    :disabled="submitting"
    :required="tokenWarning"
    :helper-text="
      tokenWarning
        ? 'This field is required.'
        : 'You can find this token in Credentials on Shopify Project Configurations.'
    "
  >
${indent(LOCK_ICON, 2)}
  </FieldText>

  <FieldText
    v-model="form.revalidationSecret"
    input-id="tpl-revalidation-secret"
    name="revalidationSecret"
    label="Shopify revalidation secret"
    placeholder="Revalidation secret"
    size="large"
    :disabled="submitting"
    helper-text="You can find this secret in Credentials on Shopify Project Configurations."
  >
${indent(LOCK_ICON, 2)}
  </FieldText>

  <FieldText
    v-model="form.storeDomain"
    input-id="tpl-store-domain"
    name="storeDomain"
    label="Shopify Store Domain"
    placeholder="https://your-shopify-store"
    size="large"
    :disabled="submitting"
    :invalid="domainError"
    :helper-text="
      domainError
        ? 'Enter a valid URL, e.g. https://your-store.myshopify.com.'
        : 'Your Shopify Store Domain.'
    "
  >
    <template #iconLeft>
      <i
        class="pi pi-globe"
        aria-hidden="true"
      />
    </template>
${indent(LOCK_ICON, 2)}
  </FieldText>
</section>`

const DEPLOYMENT = `<section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
  <h2 class="text-heading-xs text-(--text-default)">Deployment</h2>

  <fieldset class="m-0 flex w-full flex-col gap-(--spacing-xs) border-0 p-0">
    <legend class="mb-(--spacing-xs) p-0">
      <Label :required="deploymentTypeWarning">Deployment type</Label>
    </legend>
    <div class="flex flex-col gap-(--spacing-sm)">
      <FieldRadioBlock
        v-for="option in deploymentTypes"
        :key="option.value"
        v-model="form.deploymentType"
        :value="option.value"
        name="deploymentType"
        :input-id="\`tpl-deploymentType-\${option.value}\`"
        :label="option.label"
        :description="option.description"
        :disabled="submitting"
      />
    </div>
    <HelperText
      v-if="deploymentTypeWarning"
      kind="required"
      label="Select a deployment type."
    />
  </fieldset>

  <fieldset class="m-0 flex w-full flex-col gap-(--spacing-xs) border-0 p-0">
    <legend class="mb-(--spacing-xs) p-0">
      <Label>Runtime</Label>
    </legend>
    <div class="flex flex-wrap gap-(--spacing-lg)">
      <FieldRadio
        v-for="option in runtimes"
        :key="option.value"
        v-model="form.runtime"
        :value="option.value"
        name="runtime"
        :input-id="\`tpl-runtime-\${option.value}\`"
        :label="option.label"
        :disabled="submitting"
      />
    </div>
  </fieldset>

  <div class="flex w-full flex-col gap-(--spacing-xs)">
    <Label for="tpl-regions">Edge regions</Label>
    <MultiSelect
      v-model="form.regions"
      size="large"
      :disabled="submitting"
      placeholder="Select regions"
      :display-value="regionsLabel"
    >
      <MultiSelect.Trigger id="tpl-regions" />
      <MultiSelect.Content>
        <MultiSelect.Option
          v-for="option in regionOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </MultiSelect.Option>
      </MultiSelect.Content>
    </MultiSelect>
    <HelperText label="Leave empty to deploy to every available region." />
  </div>
</section>`

const BUILD = `<section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
  <h2 class="text-heading-xs text-(--text-default)">Build &amp; Runtime</h2>

  <FieldInputGroup
    v-model="form.buildCommand"
    input-id="tpl-build-command"
    name="buildCommand"
    label="Build command"
    placeholder="npm run build"
    :disabled="submitting"
    :required="buildCommandWarning"
    :helper-text="
      buildCommandWarning
        ? 'This field is required.'
        : 'Run from the repository root during each deployment.'
    "
  >
    <template #left>
      <span class="text-label-sm text-(--text-muted)">$</span>
    </template>
  </FieldInputGroup>

  <FieldPassword
    v-model="form.deployKey"
    input-id="tpl-deploy-key"
    name="deployKey"
    label="Deploy Key"
    placeholder="Paste your deploy key"
    autocomplete="new-password"
    :disabled="submitting"
    :required="deployKeyWarning"
    :invalid="deployKeyError"
    :helper-text="
      deployKeyError
        ? 'The deploy key must be at least 8 characters.'
        : deployKeyWarning
          ? 'This field is required.'
          : 'Used to authenticate the build against your repository.'
    "
  />

  <FieldTextarea
    v-model="form.buildNotes"
    input-id="tpl-build-notes"
    name="buildNotes"
    label="Build notes"
    placeholder="Anything the team should know about this deployment (optional)."
    :disabled="submitting"
    helper-text="Markdown is supported. Shown on the deployment summary."
  />
</section>`

const NOTIFICATIONS = `<section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
  <h2 class="text-heading-xs text-(--text-default)">Notifications &amp; Alerts</h2>

  <FieldPhoneNumber
    v-model="form.alertPhone"
    input-id="tpl-alert-phone"
    name="alertPhone"
    label="On-call alert number"
    :disabled="submitting"
    :required="phoneWarning"
    :invalid="phoneError"
    @update:phone="alertPhoneNumber = $event"
    :helper-text="
      phoneError
        ? 'Enter a valid phone number.'
        : phoneWarning
          ? 'This field is required.'
          : 'We call this number if a production deployment fails.'
    "
  />

  <div class="flex flex-col gap-(--spacing-sm)">
    <FieldSwitchBlock
      v-model="form.emailNotifications"
      label="Email notifications"
      description="Send a summary email to the team when a deployment finishes."
      :disabled="submitting"
    />
    <FieldSwitchBlock
      v-model="form.slackAlerts"
      label="Slack alerts"
      description="Post to your connected Slack channel on failures and rollbacks."
      :disabled="submitting"
    />
  </div>

  <FieldSwitch
    v-model="form.deployPreviews"
    label="Deploy previews"
    description="Build a preview URL for every pull request."
    :disabled="submitting"
  />
</section>`

const EDGE_FEATURES = `<section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
  <h2 class="text-heading-xs text-(--text-default)">Edge features</h2>

  <div class="flex flex-col gap-(--spacing-sm)">
    <FieldCheckboxBlock
      v-model="form.edgeCaching"
      label="Edge caching"
      description="Cache responses at the edge for faster global delivery."
      :disabled="submitting"
    />
    <FieldCheckboxBlock
      v-model="form.http3"
      label="HTTP/3"
      description="Serve traffic over HTTP/3 (QUIC) where the client supports it."
      :disabled="submitting"
    />
    <FieldCheckboxBlock
      v-model="form.waf"
      label="Web Application Firewall"
      description="Screen incoming requests against the managed WAF ruleset."
      :disabled="submitting"
    />
  </div>
</section>`

const ACKNOWLEDGE = `<div class="layout-section-start flex flex-col gap-(--spacing-xs)">
  <FieldCheckbox
    v-model="form.acceptDeploy"
    input-id="tpl-accept-deploy"
    name="acceptDeploy"
    label="I understand this triggers an immediate production deployment."
    :required="acceptWarning"
    :disabled="submitting"
  />
  <HelperText
    v-if="acceptWarning"
    kind="required"
    label="You must acknowledge this before deploying."
  />
</div>

<div class="layout-group-start flex justify-end">
  <Button
    label="Deploy"
    kind="primary"
    size="medium"
    :loading="submitting"
    @click="submit"
  />
</div>`

const TEMPLATE = consolePage({
  padded: false,
  main: `<form
  class="flex min-h-full flex-col"
  aria-labelledby="template-settings-title"
  novalidate
  @submit.prevent="submit"
>
  <div class="layout-column-form layout-boundary flex flex-1 flex-col">
${indent(
  pageHeading({
    title: 'Import from Git',
    titleId: 'template-settings-title',
    description:
      'Configure your Git repository to integrate your codebase and automate deployments directly from your version control system.'
  }),
  2
)}

    <fieldset
      class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
      :disabled="submitting"
    >
      <legend class="sr-only">Template settings</legend>

${indent([REPOSITORY, TEMPLATE_SETTINGS, DEPLOYMENT, BUILD, NOTIFICATIONS, EDGE_FEATURES, ACKNOWLEDGE].join('\n\n'), 3)}
    </fieldset>
  </div>
</form>`
})

const components = consoleComponents(NAMES)

const meta = {
  title: 'Templates/Platform/Forms/TemplateSettings',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Standalone field stacks in one column, Approach B of the forms lab (Fields separated, `/forms/fields-separated`): the console shell with an unpadded scroll region, a page heading, then the Git scope and repository side by side and sections of field stacks under plain headings, ending with an acknowledgement checkbox and a single Deploy button at the end of the column, with no sticky footer. Import from Git is the example: Template Settings, Deployment, Build and Runtime, Notifications and Alerts, Edge features. Every required field flags only after Deploy is pressed, through the field’s own required state and helper text. Built from the platform shell, `Label`, `Select`, `FieldTextSwitch`, `FieldText`, `FieldRadioBlock`, `FieldRadio`, `MultiSelect`, `FieldInputGroup`, `FieldPassword`, `FieldTextarea`, `FieldPhoneNumber`, `FieldSwitchBlock`, `FieldSwitch`, `FieldCheckboxBlock`, `FieldCheckbox`, `HelperText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: setupFor(false), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The page as it opens: scope and repository prefilled, Node.js 20 and US East preselected, every other field empty and nothing flagged.'
      },
      source: { code: toSfc(scriptFor(false), TEMPLATE) }
    }
  }
}

export const Submitted = {
  render: () => ({ components, setup: setupFor(true), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'After Deploy on the untouched form: the access token, deployment type, build command, deploy key, on-call number and the acknowledgement each show their required state and message.'
      },
      source: { code: toSfc(scriptFor(true), TEMPLATE) }
    }
  }
}

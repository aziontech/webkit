<script setup>
  import Button from '@aziontech/webkit/button'
  import FieldCheckbox from '@aziontech/webkit/field-checkbox'
  import FieldCheckboxBlock from '@aziontech/webkit/field-checkbox-block'
  import FieldInputGroup from '@aziontech/webkit/field-input-group'
  import FieldPassword from '@aziontech/webkit/field-password'
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import FieldRadio from '@aziontech/webkit/field-radio'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldTextSwitch from '@aziontech/webkit/field-text-switch'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select from '@aziontech/webkit/select'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useBaseline } from '../../lib/behavior/forms'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const scopes = [
    { label: 'gab-az', value: 'gab-az' },
    { label: 'azion-tech', value: 'azion-tech' },
    { label: 'rafael-personal', value: 'rafael-personal' }
  ]
  const scopeLabel = (value) => scopes.find((option) => option.value === value)?.label ?? ''

  const deploymentTypes = [
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

  const runtimes = [
    { value: 'node18', label: 'Node.js 18' },
    { value: 'node20', label: 'Node.js 20 (LTS)' },
    { value: 'bun', label: 'Bun 1.x' }
  ]

  const regionOptions = [
    { label: 'US East', value: 'us-east' },
    { label: 'US West', value: 'us-west' },
    { label: 'South America', value: 'sa-east' },
    { label: 'Europe', value: 'eu-west' },
    { label: 'Asia Pacific', value: 'ap-southeast' }
  ]
  const regionsLabel = (values) =>
    (values ?? [])
      .map((value) => regionOptions.find((option) => option.value === value)?.label ?? value)
      .join(', ')

  const form = reactive({
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
  })

  const submitted = ref(false)

  const submitting = ref(false)

  const { dirty, commit } = useBaseline(form)

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
    () => form.alertPhone.trim() !== '' && form.alertPhone.replace(/\D/g, '').length < 8
  )
  const acceptEmpty = computed(() => !form.acceptDeploy)

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

  const submit = async () => {
    if (submitting.value) return

    submitted.value = true
    if (!isValid.value) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      toast.success(`Deploying "${form.repoName}" from ${scopeLabel(form.scope)}.`)
      commit()
      router.push({ path: '/forms', query: { email: userEmail.value } })
    } catch (error) {
      toast.error('Could not start the deployment.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <AppLayout
    active="forms"
    :padded="false"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'Fields separated' }]"
  >
    <UnsavedChangesGuard :dirty="dirty" />

    <form
      class="flex min-h-full flex-col"
      aria-labelledby="template-settings-title"
      novalidate
      @submit.prevent="submit"
    >
      <div class="layout-column-form layout-boundary flex flex-1 flex-col">
        <PageHeading
          title-id="template-settings-title"
          title="Import from Git"
          description="Configure your Git repository to integrate your codebase and automate deployments directly from your version control system."
        />

        <fieldset
          class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">Template settings</legend>

          <div class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2">
            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Label
                for="tpl-scope"
                required
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
                      class="pi pi-github"
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

            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Label
                for="tpl-repo-name"
                required
                >Private Repository Name</Label
              >
              <FieldTextSwitch
                v-model="form.repoName"
                v-model:enabled="form.repoPrivate"
                input-id="tpl-repo-name"
                name="repoName"
                placeholder="my-repository"
                :required="repoWarning"
                :disabled="submitting"
              />
            </div>
          </div>

          <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
            <h2 class="text-heading-xs text-(--text-default)">Template Settings</h2>

            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Label
                for="tpl-access-token"
                required
                >Shopify Access Token</Label
              >
              <FieldText
                v-model="form.accessToken"
                input-id="tpl-access-token"
                name="accessToken"
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
                <template #iconRight>
                  <i
                    class="pi pi-lock"
                    aria-hidden="true"
                  />
                </template>
              </FieldText>
            </div>

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
              <template #iconRight>
                <i
                  class="pi pi-lock"
                  aria-hidden="true"
                />
              </template>
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
              <template #iconRight>
                <i
                  class="pi pi-lock"
                  aria-hidden="true"
                />
              </template>
            </FieldText>
          </section>

          <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
            <h2 class="text-heading-xs text-(--text-default)">Deployment</h2>

            <fieldset class="m-0 flex w-full flex-col gap-(--spacing-xs) border-0 p-0">
              <legend class="mb-(--spacing-xs) p-0">
                <Label required>Deployment type</Label>
              </legend>
              <div class="flex flex-col gap-(--spacing-sm)">
                <FieldRadioBlock
                  v-for="option in deploymentTypes"
                  :key="option.value"
                  v-model="form.deploymentType"
                  :value="option.value"
                  name="deploymentType"
                  :input-id="`tpl-deploymentType-${option.value}`"
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
                  :input-id="`tpl-runtime-${option.value}`"
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
          </section>

          <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
            <h2 class="text-heading-xs text-(--text-default)">Build &amp; Runtime</h2>

            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Label
                for="tpl-build-command"
                required
                >Build command</Label
              >
              <FieldInputGroup
                v-model="form.buildCommand"
                input-id="tpl-build-command"
                name="buildCommand"
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
            </div>

            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Label
                for="tpl-deploy-key"
                required
                >Deploy Key</Label
              >
              <FieldPassword
                v-model="form.deployKey"
                input-id="tpl-deploy-key"
                name="deployKey"
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
            </div>

            <FieldTextarea
              v-model="form.buildNotes"
              input-id="tpl-build-notes"
              name="buildNotes"
              label="Build notes"
              placeholder="Anything the team should know about this deployment (optional)."
              :disabled="submitting"
              helper-text="Markdown is supported. Shown on the deployment summary."
            />
          </section>

          <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
            <h2 class="text-heading-xs text-(--text-default)">Notifications &amp; Alerts</h2>

            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Label
                for="tpl-alert-phone"
                required
                >On-call alert number</Label
              >
              <FieldPhoneNumber
                v-model="form.alertPhone"
                input-id="tpl-alert-phone"
                name="alertPhone"
                :disabled="submitting"
                :required="phoneWarning"
                :invalid="phoneError"
                :helper-text="
                  phoneError
                    ? 'Enter a valid phone number.'
                    : phoneWarning
                      ? 'This field is required.'
                      : 'We call this number if a production deployment fails.'
                "
              />
            </div>

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
          </section>

          <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
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
          </section>

          <div class="layout-section-start flex flex-col gap-(--spacing-xs)">
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
          </div>
        </fieldset>
      </div>
    </form>
  </AppLayout>
</template>

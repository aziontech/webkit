<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import InputGroup from '@aziontech/webkit/input-group'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PhoneInput from '@aziontech/webkit/phone-input'
  import RadioButton from '@aziontech/webkit/radio-button'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, reactive, ref } from 'vue'

  const scopes = [
    { label: 'gab-lisboa', value: 'gab-lisboa' },
    { label: 'acme', value: 'acme' },
    { label: 'rafael-personal', value: 'rafael-personal' }
  ]
  const scopeLabel = (value: unknown) =>
    scopes.find((option) => option.value === value)?.label ?? ''

  const deploymentTypes = [
    {
      value: 'static',
      label: 'Static site',
      description:
        'Pre-rendered HTML/CSS/JS served straight from the CDN. Fastest, no server runtime.'
    },
    {
      value: 'ssr',
      label: 'Server-side rendered',
      description: 'Rendered on demand by a server function. Best for dynamic, personalized pages.'
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
  const regionsLabel = (values: unknown[]) =>
    (values ?? [])
      .map((value) => regionOptions.find((option) => option.value === value)?.label ?? value)
      .join(', ')

  const form = reactive({
    scope: 'gab-lisboa',
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
    caching: true,
    http3: false,
    requestFiltering: false,
    acceptDeploy: false
  })
  const submitted = ref(false)
  const submitting = ref(false)

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
  }
</script>

<template>
  <form
    class="flex min-h-0 flex-1 flex-col"
    aria-labelledby="template-settings-title"
    novalidate
    @submit.prevent="submit"
  >
    <div class="layout-column-form layout-boundary flex flex-1 flex-col">
      <PageHeader
        title="Import from Git"
        description="Configure your Git repository to integrate your codebase and automate deployments directly from your version control system."
        size="small"
        title-id="template-settings-title"
      />

      <fieldset
        class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="submitting"
      >
        <legend class="sr-only">Template settings</legend>

        <div class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2">
          <Field :required="scopeWarning">
            <Field.Label for="tpl-scope">Scope</Field.Label>
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
          </Field>

          <Field
            :required="repoWarning"
            :disabled="submitting"
          >
            <Field.Label for="tpl-repo-name">Private repository name</Field.Label>
            <InputGroup>
              <InputGroup.Input
                id="tpl-repo-name"
                v-model="form.repoName"
                name="repoName"
                placeholder="my-repository"
                :disabled="!form.repoPrivate"
              />
              <InputGroup.Addon>
                <Switch
                  v-model="form.repoPrivate"
                  aria-label="Toggle Private repository name"
                />
              </InputGroup.Addon>
            </InputGroup>
          </Field>
        </div>

        <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
          <h2 class="text-heading-xs text-(--text-default)">Template settings</h2>

          <Field
            :disabled="submitting"
            :required="tokenWarning"
          >
            <Field.Label for="tpl-access-token">Store access token</Field.Label>
            <Input
              id="tpl-access-token"
              v-model="form.accessToken"
              name="accessToken"
              placeholder="Access token"
              size="large"
            >
              <template #iconRight>
                <i
                  class="pi pi-lock"
                  aria-hidden="true"
                />
              </template>
            </Input>
            <Field.Description>
              {{
                tokenWarning
                  ? 'This field is required.'
                  : 'You can find this token in the API credentials of your store.'
              }}
            </Field.Description>
          </Field>

          <Field :disabled="submitting">
            <Field.Label for="tpl-revalidation-secret">Store revalidation secret</Field.Label>
            <Input
              id="tpl-revalidation-secret"
              v-model="form.revalidationSecret"
              name="revalidationSecret"
              placeholder="Revalidation secret"
              size="large"
            >
              <template #iconRight>
                <i
                  class="pi pi-lock"
                  aria-hidden="true"
                />
              </template>
            </Input>
            <Field.Description>
              You can find this secret in the API credentials of your store.
            </Field.Description>
          </Field>

          <Field
            :disabled="submitting"
            :invalid="domainError"
          >
            <Field.Label for="tpl-store-domain">Store domain</Field.Label>
            <Input
              id="tpl-store-domain"
              v-model="form.storeDomain"
              name="storeDomain"
              placeholder="https://store.example.com"
              size="large"
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
            </Input>
            <Field.Description>
              {{
                domainError
                  ? 'Enter a valid URL, e.g. https://store.example.com.'
                  : 'The public URL of your store.'
              }}
            </Field.Description>
          </Field>
        </section>

        <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
          <h2 class="text-heading-xs text-(--text-default)">Deployment</h2>

          <fieldset class="m-0 flex w-full flex-col gap-(--spacing-xs) border-0 p-0">
            <Field.Legend kind="label">Deployment type</Field.Legend>
            <div class="flex flex-col gap-(--spacing-sm)">
              <Field.Label
                v-for="option in deploymentTypes"
                :key="option.value"
              >
                <Field
                  orientation="horizontal"
                  :disabled="submitting"
                >
                  <RadioButton
                    v-model="form.deploymentType"
                    :value="option.value"
                    name="deploymentType"
                    :input-id="`tpl-deploymentType-${option.value}`"
                  />
                  <Field.Content>
                    <Field.Title>{{ option.label }}</Field.Title>
                    <Field.Description>{{ option.description }}</Field.Description>
                  </Field.Content>
                </Field>
              </Field.Label>
            </div>
            <HelperText
              v-if="deploymentTypeWarning"
              kind="required"
              label="Select a deployment type."
            />
          </fieldset>

          <fieldset class="m-0 flex w-full flex-col gap-(--spacing-xs) border-0 p-0">
            <Field.Legend kind="label">Runtime</Field.Legend>
            <div class="flex flex-wrap gap-(--spacing-lg)">
              <div
                v-for="option in runtimes"
                :key="option.value"
              >
                <Field
                  orientation="horizontal"
                  :disabled="submitting"
                >
                  <RadioButton
                    v-model="form.runtime"
                    :value="option.value"
                    name="runtime"
                    :input-id="`tpl-runtime-${option.value}`"
                  />
                  <Field.Label :for="`tpl-runtime-${option.value}`">{{ option.label }}</Field.Label>
                </Field>
              </div>
            </div>
          </fieldset>

          <Field>
            <Field.Label for="tpl-regions">Regions</Field.Label>
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
          </Field>
        </section>

        <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
          <h2 class="text-heading-xs text-(--text-default)">Build and runtime</h2>

          <Field
            :disabled="submitting"
            :required="buildCommandWarning"
          >
            <Field.Label for="tpl-build-command">Build command</Field.Label>
            <InputGroup>
              <InputGroup.Addon>
                <span class="text-label-sm text-(--text-muted)">$</span>
              </InputGroup.Addon>
              <InputGroup.Input
                id="tpl-build-command"
                v-model="form.buildCommand"
                name="buildCommand"
                placeholder="npm run build"
              />
            </InputGroup>
            <Field.Description>
              {{
                buildCommandWarning
                  ? 'This field is required.'
                  : 'Run from the repository root during each deployment.'
              }}
            </Field.Description>
          </Field>

          <Field
            :disabled="submitting"
            :required="deployKeyWarning"
            :invalid="deployKeyError"
          >
            <Field.Label for="tpl-deploy-key">Deploy key</Field.Label>
            <PasswordInput
              id="tpl-deploy-key"
              v-model="form.deployKey"
              name="deployKey"
              placeholder="Paste your deploy key"
              autocomplete="new-password"
            />
            <Field.Description>
              {{
                deployKeyError
                  ? 'The deploy key must be at least 8 characters.'
                  : deployKeyWarning
                    ? 'This field is required.'
                    : 'Used to authenticate the build against your repository.'
              }}
            </Field.Description>
          </Field>

          <Field :disabled="submitting">
            <Field.Label for="tpl-build-notes">Build notes</Field.Label>
            <Textarea
              id="tpl-build-notes"
              v-model="form.buildNotes"
              name="buildNotes"
              placeholder="Anything the team should know about this deployment."
            />
            <Field.Description>
              Markdown is supported. Shown on the deployment summary.
            </Field.Description>
          </Field>
        </section>

        <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
          <h2 class="text-heading-xs text-(--text-default)">Notifications and alerts</h2>

          <Field
            :disabled="submitting"
            :required="phoneWarning"
            :invalid="phoneError"
          >
            <Field.Label for="tpl-alert-phone">On-call alert number</Field.Label>
            <PhoneInput
              id="tpl-alert-phone"
              v-model="form.alertPhone"
              name="alertPhone"
              @update:phone="alertPhoneNumber = $event"
            />
            <Field.Description>
              {{
                phoneError
                  ? 'Enter a valid phone number.'
                  : phoneWarning
                    ? 'This field is required.'
                    : 'We call this number if a production deployment fails.'
              }}
            </Field.Description>
          </Field>

          <div class="flex flex-col gap-(--spacing-sm)">
            <Field.Label>
              <Field
                orientation="horizontal"
                :disabled="submitting"
              >
                <Switch v-model="form.emailNotifications" />
                <Field.Content>
                  <Field.Title>Email notifications</Field.Title>
                  <Field.Description>
                    Send a summary email to the team when a deployment finishes.
                  </Field.Description>
                </Field.Content>
              </Field>
            </Field.Label>
            <Field.Label>
              <Field
                orientation="horizontal"
                :disabled="submitting"
              >
                <Switch v-model="form.slackAlerts" />
                <Field.Content>
                  <Field.Title>Slack alerts</Field.Title>
                  <Field.Description>
                    Post to your connected Slack channel on failures and rollbacks.
                  </Field.Description>
                </Field.Content>
              </Field>
            </Field.Label>
          </div>

          <Field
            orientation="horizontal"
            :disabled="submitting"
          >
            <Switch v-model="form.deployPreviews" />
            <Field.Content>
              <Field.Label>Deploy previews</Field.Label>
              <Field.Description>Build a preview URL for every pull request.</Field.Description>
            </Field.Content>
          </Field>
        </section>

        <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
          <h2 class="text-heading-xs text-(--text-default)">Delivery features</h2>

          <div class="flex flex-col gap-(--spacing-sm)">
            <Field.Label>
              <Field
                orientation="horizontal"
                :disabled="submitting"
              >
                <Checkbox
                  v-model="form.caching"
                  binary
                />
                <Field.Content>
                  <Field.Title>Caching</Field.Title>
                  <Field.Description>
                    Cache responses close to your users for faster global delivery.
                  </Field.Description>
                </Field.Content>
              </Field>
            </Field.Label>
            <Field.Label>
              <Field
                orientation="horizontal"
                :disabled="submitting"
              >
                <Checkbox
                  v-model="form.http3"
                  binary
                />
                <Field.Content>
                  <Field.Title>HTTP/3</Field.Title>
                  <Field.Description>
                    Serve traffic over HTTP/3 (QUIC) where the client supports it.
                  </Field.Description>
                </Field.Content>
              </Field>
            </Field.Label>
            <Field.Label>
              <Field
                orientation="horizontal"
                :disabled="submitting"
              >
                <Checkbox
                  v-model="form.requestFiltering"
                  binary
                />
                <Field.Content>
                  <Field.Title>Request filtering</Field.Title>
                  <Field.Description>
                    Screen incoming requests against a managed rule set.
                  </Field.Description>
                </Field.Content>
              </Field>
            </Field.Label>
          </div>
        </section>

        <div class="layout-section-start flex flex-col gap-(--spacing-xs)">
          <Field
            orientation="horizontal"
            :required="acceptWarning"
            :disabled="submitting"
          >
            <Checkbox
              v-model="form.acceptDeploy"
              binary
              input-id="tpl-accept-deploy"
              name="acceptDeploy"
            />
            <Field.Content>
              <Field.Label for="tpl-accept-deploy">
                I understand this triggers an immediate production deployment.
              </Field.Label>
            </Field.Content>
          </Field>
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
</template>

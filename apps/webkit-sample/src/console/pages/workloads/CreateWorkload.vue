<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentFlow from '../../components/deployment/DeploymentFlow.vue'
  import WizardPage from '../../components/page/WizardPage.vue'
  import { useCreateOrigin } from '../../lib/behavior/create-origin'
  import { useBaseline } from '../../lib/behavior/forms'
  import {
    defaultScratchConfig,
    enabledCachePolicies,
    scratchCachePolicies,
    scratchConnector,
    validateScratch
  } from '../../lib/data/application-scratch'
  import { connectorMeta } from '../../lib/data/connectors'
  import {
    bindingPolicyLabel,
    deploymentPolicyLabel,
    strategyById
  } from '../../lib/data/deployment-strategies'
  import { provisionDeployment, resourceChain } from '../../lib/data/provisioning'
  import {
    defaultResourceBinding,
    resourceBindingIsExisting,
    resourceBindingName
  } from '../../lib/data/resource-binding'
  import {
    WORKLOAD_APPLICATIONS,
    WORKLOAD_STEPS,
    workloadDeploymentName,
    workloadNamesFromForm
  } from '../../lib/data/workload-flows'
  import { workloadProvisioningSteps } from '../../lib/data/workload-provisioning'
  import { settingsIdsForWorkload } from '../../lib/state/workload-settings'
  import DeploySuccess from '../applications/wizard/DeploySuccess.vue'
  import ApplicationStep from './wizard/ApplicationStep.vue'
  import BindingStep from './wizard/BindingStep.vue'
  import { provideWorkloadForm } from './wizard/form-context'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const phase = ref('wizard')
  const stepIndex = ref(0)

  const steps = WORKLOAD_STEPS
  const step = computed(() => steps[stepIndex.value]?.id ?? 'application')
  const isLastStep = computed(() => stepIndex.value === steps.length - 1)

  const form = reactive({
    application: defaultResourceBinding({ scratch: defaultScratchConfig() }),
    domainType: 'azion',
    domainPrefix: '',
    domainHost: '',
    name: '',
    environment: 'Production',
    certificate: 'azion_san',
    deploymentMode: 'auto',
    deployment: '',
    minimumTlsVersion: 'tls_1_2',
    customPage: '',
    allowAzionDomain: true,
    active: true
  })

  const seededApplication = String(route.query.application || '')
  if (WORKLOAD_APPLICATIONS.value.some((option) => option.value === seededApplication)) {
    form.application.existing = seededApplication
  } else if (seededApplication) {
    form.application.mode = 'new'
    form.application.name = seededApplication
  }

  const errors = reactive({})
  const clearErrors = () => Object.keys(errors).forEach((key) => delete errors[key])

  const submitting = ref(false)

  const page = ref(null)

  provideWorkloadForm({ form, errors })

  const { dirty, commit } = useBaseline(form)

  const names = computed(() => workloadNamesFromForm(form))

  const applicationName = computed(() => resourceBindingName(form.application))
  const applicationIsExisting = computed(() => resourceBindingIsExisting(form.application))

  const deploymentName = computed(() =>
    form.deploymentMode === 'existing'
      ? workloadDeploymentName(form.deployment)
      : names.value.deployment
  )

  const applicationExtras = computed(() => {
    if (applicationIsExisting.value) return []
    const { scratch } = form.application
    const policies = enabledCachePolicies(scratch)
    return [
      policies.length ? `${policies.length} cache setting${policies.length > 1 ? 's' : ''}` : '',
      scratch.connector.enabled
        ? `its ${connectorMeta(scratch.connector.type).label} connector`
        : ''
    ].filter(Boolean)
  })

  const applicationSummary = computed(() => {
    if (!applicationName.value) return 'Not chosen yet. Pick one, or create it with the workload.'
    if (applicationIsExisting.value) {
      return 'Serving its latest ready version. The domain answers with this.'
    }
    return applicationExtras.value.length
      ? `Created with the workload, plus ${applicationExtras.value.join(' and ')}.`
      : 'Created with the workload and built before the release is cut.'
  })

  const goBack = () => {
    if (stepIndex.value <= 0) return
    stepIndex.value -= 1
    clearErrors()
  }

  const goToStep = (index) => {
    if (index >= stepIndex.value) return
    stepIndex.value = index
    clearErrors()
  }

  const { path: originPath, label: originLabel } = useCreateOrigin('/workloads', 'Workloads')

  const cancel = () => router.push({ path: originPath.value, query: { email: userEmail.value } })

  const validate = () => {
    clearErrors()

    if (step.value === 'application') {
      if (!applicationName.value) {
        errors.application = applicationIsExisting.value
          ? 'Select the application this workload serves, or create a new one.'
          : 'Name the application, or select one that already exists.'
      }
      if (!applicationIsExisting.value) validateScratch(form.application.scratch, errors)
    }

    if (step.value === 'binding') {
      if (form.domainType === 'own') {
        if (!form.domainHost.trim()) {
          errors.domainHost = 'Enter the hostname that points at this workload.'
        }
        if (!form.name.trim()) errors.name = 'Name the workload.'
      } else if (!form.domainPrefix.trim()) {
        errors.domainPrefix = 'Enter the prefix for the Azion domain.'
      }
      if (form.deploymentMode === 'existing' && !form.deployment) {
        errors.deployment = 'Select the deployment the first release lands in.'
      }
    }

    return Object.keys(errors).length === 0
  }

  const provisioningSteps = computed(() =>
    workloadProvisioningSteps({
      workload: names.value.workload,
      domain: names.value.domain,
      application: applicationName.value,
      applicationExisting: applicationIsExisting.value,
      environment: form.environment,
      deployment: deploymentName.value,
      deploymentExisting: form.deploymentMode === 'existing'
    })
  )

  const advance = async () => {
    if (submitting.value) return
    if (!validate()) {
      page.value?.revealInvalid()
      return
    }

    if (!isLastStep.value) {
      stepIndex.value += 1
      clearErrors()
      return
    }

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      phase.value = 'provisioning'
    } catch (error) {
      toast.error('Could not start provisioning.', {
        description: error?.message ?? 'Check your connection, then retry.',
        action: { label: 'Retry', onClick: () => advance() }
      })
    } finally {
      submitting.value = false
    }
  }

  const provisioned = ref(null)

  const settingsNode = () => {
    const workload = provisioned.value?.workload
    if (!workload) return null
    const setting = strategyById(settingsIdsForWorkload(workload.id)[0])
    if (!setting) return null
    return {
      key: 'deployment-settings',
      kind: 'Deployment Setting',
      icon: 'ai ai-deploy-pillar',
      name: setting.name,
      status: setting.status,
      href: '/account/build-deployment',
      reference: setting.id,
      fields: [
        { label: 'Reach', value: 'This workload only' },
        { label: 'Binding policy', value: bindingPolicyLabel(setting.bindingPolicy) },
        { label: 'Deployment policy', value: deploymentPolicyLabel(setting.deploymentPolicy) }
      ]
    }
  }

  const createdResources = computed(() => {
    if (!provisioned.value) return []
    const chain = resourceChain(provisioned.value)
    const settings = settingsNode()
    if (!settings) return chain
    const at = chain.findIndex((node) => node.key === 'workload')
    if (at === -1) return [...chain, settings]
    return [...chain.slice(0, at + 1), settings, ...chain.slice(at + 1)]
  })

  const applicationLayer = () => {
    if (applicationIsExisting.value) return {}
    const { scratch } = form.application
    const name = applicationName.value
    return {
      connector: scratchConnector(scratch, name, connectorMeta(scratch.connector.type).label),
      cachePolicies: scratchCachePolicies(scratch, name)
    }
  }

  const onFinished = () => {
    provisioned.value = provisionDeployment({
      ...applicationLayer(),
      repoName: names.value.workload,
      framework: '',
      templateTitle: names.value.workload,
      applicationName: applicationName.value,
      applicationBound: applicationIsExisting.value,
      domain: names.value.domain
    })
    commit()
    phase.value = 'success'
  }

  const onFailed = (failedStep) => {
    phase.value = 'wizard'
    toast.error('Provisioning did not finish.', {
      description: `It stopped at ${failedStep}. Check the configuration and deploy again.`,
      action: { label: 'Retry', onClick: () => advance() }
    })
  }

  const manageWorkload = () =>
    router.push({
      path: `/workloads/${provisioned.value?.workload.id ?? ''}`,
      query: { email: userEmail.value, name: provisioned.value?.workload.name }
    })

  const successLead = computed(() => {
    const app = applicationName.value || 'the application'
    return form.domainType === 'own'
      ? `The workload is serving ${app}. Point your DNS at it to send traffic.`
      : `The workload is live and serving ${app}.`
  })

  const nextLabel = computed(() => (isLastStep.value ? 'Create and deploy' : 'Next'))

  const nextDisabled = computed(() => false)
</script>

<template>
  <WizardPage
    ref="page"
    :breadcrumb="[{ label: originLabel, href: originPath }, { label: 'Create Workload' }]"
    :back-label="`Back to ${originLabel}`"
    title="Create Workload"
    description="A workload is the public entry point: what it serves, and the domain traffic arrives on. The last step provisions both."
    title-id="create-workload-title"
    :heading="phase !== 'success'"
    :steps="steps"
    :current-step="stepIndex"
    :next-label="nextLabel"
    :next-disabled="nextDisabled"
    :submitting="submitting"
    :dirty="dirty && phase === 'wizard'"
    :terminal="phase !== 'wizard'"
    @back="goBack"
    @next="advance"
    @go="goToStep"
    @cancel="cancel"
  >
    <ApplicationStep
      v-if="step === 'application'"
      :disabled="submitting"
    />

    <template v-else-if="step === 'binding'">
      <CardBox
        :padded="false"
        class="mb-(--layout-section-gap)"
      >
        <template #content>
          <Item.List>
            <Item size="small">
              <Item.Media>
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    class="ai ai-edge-application text-body-md leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ applicationName || 'No application' }}</Item.Title>
                <Item.Description>{{ applicationSummary }}</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Button
                  type="button"
                  label="Change"
                  kind="text"
                  size="small"
                  :disabled="submitting"
                  @click="goToStep(0)"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>

      <BindingStep :disabled="submitting" />
    </template>

    <template #terminal>
      <DeploymentFlow
        v-if="phase === 'provisioning'"
        title="Provisioning"
        status-label="Creating"
        :steps="provisioningSteps"
        :splash="{
          verb: 'Provisioning',
          icon: 'ai ai-workloads',
          from: names.workload || 'workload',
          to: ''
        }"
        @finished="onFinished"
        @failed="onFailed"
      />
      <DeploySuccess
        v-else
        title="Workload deployed"
        :lead="successLead"
        :resources="createdResources"
        :domain="names.domain"
        :live="form.domainType !== 'own'"
        @manage="manageWorkload"
      />
    </template>
  </WizardPage>
</template>

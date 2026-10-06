<script setup>
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentFlow from '../../components/deployment/DeploymentFlow.vue'
  import WizardPage from '../../components/page/WizardPage.vue'
  import { resolveApplicationChoice } from '../../lib/behavior/application-binding'
  import { useCreateOrigin } from '../../lib/behavior/create-origin'
  import { useBaseline } from '../../lib/behavior/forms'
  import {
    getApplicationFlow,
    PROVISIONAL_STEPS,
    SCRATCH_SOURCE
  } from '../../lib/data/application-flows'
  import { defaultModuleState } from '../../lib/data/application-modules'
  import {
    defaultScratchConfig,
    scratchCachePolicies,
    scratchConnector,
    validateScratch
  } from '../../lib/data/application-scratch'
  import { connectorMeta } from '../../lib/data/connectors'
  import {
    defaultFirewallProtection,
    enabledFirewallModules,
    firewallBindingName,
    firewallIdByName,
    firewallIsBound,
    firewallModuleLabelsByName
  } from '../../lib/data/firewalls'
  import { AZION_COMMANDS } from '../../lib/data/frameworks'
  import {
    provisionDeployment,
    publishDeployment,
    resourceChain
  } from '../../lib/data/provisioning'
  import { installIntegration } from '../../lib/data/template-integrations'
  import { configuredTemplateSteps } from '../../lib/data/template-provisioning'
  import { getTemplate, templateSource } from '../../lib/data/templates.js'
  import { workloadProvisioningSteps } from '../../lib/data/workload-provisioning'
  import { addCreatedResource } from '../../lib/state/created-resources'
  import { rememberTemplateInstall } from '../../lib/state/template-install'
  import ConfigureStep from './wizard/ConfigureStep.vue'
  import DeploySuccess from './wizard/DeploySuccess.vue'
  import { provideCreateForm } from './wizard/form-context'
  import GitSourceStep from './wizard/GitSourceStep.vue'
  import InstallStep from './wizard/InstallStep.vue'
  import MethodStep from './wizard/MethodStep.vue'
  import RepositoryStep from './wizard/RepositoryStep.vue'
  import ScratchStep from './wizard/ScratchStep.vue'
  import SourceSummary from './wizard/SourceSummary.vue'
  import TargetStep from './wizard/TargetStep.vue'
  import TemplateSourceStep from './wizard/TemplateSourceStep.vue'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const source = ref(null)

  const repository = ref(null)

  const target = ref(null)

  const phase = ref('wizard')
  const flowId = ref('')
  const stepIndex = ref(0)

  const flow = computed(() => getApplicationFlow(flowId.value))

  const needsRepository = computed(
    () => flowId.value === 'template' && source.value?.requiresRepository !== false
  )

  const isIntegrationSource = computed(() => Boolean(source.value?.integration))
  const needsTarget = computed(() => flowId.value === 'template' && isIntegrationSource.value)

  const isInstall = computed(() => needsTarget.value && target.value?.mode === 'existing')

  const steps = computed(() => {
    const declared = flow.value?.steps ?? PROVISIONAL_STEPS
    return declared
      .filter((part) => (part.id === 'repository' ? needsRepository.value : true))
      .filter((part) => (part.id === 'target' ? needsTarget.value : true))
      .map((part) =>
        part.id === 'configure' && isInstall.value ? { ...part, label: 'Review and add' } : part
      )
  })
  const step = computed(() => steps.value[stepIndex.value]?.id ?? 'method')
  const isLastStep = computed(() => stepIndex.value === steps.value.length - 1)

  const form = reactive({
    name: '',
    buildCommand: AZION_COMMANDS.buildCommand,
    deployCommand: AZION_COMMANDS.deployCommand,
    settings: {},
    protection: defaultFirewallProtection(),
    domainHost: '',
    domainEnvironment: '',
    domainCertificate: '',
    modules: defaultModuleState(),
    active: true,
    debug: false,
    scratch: defaultScratchConfig()
  })

  const errors = reactive({})
  const clearErrors = () => Object.keys(errors).forEach((key) => delete errors[key])

  provideCreateForm({ form, errors })

  const submitting = ref(false)

  const page = ref(null)
  const revealInvalid = () => page.value?.revealInvalid()

  const { dirty, commit } = useBaseline(() => ({
    ...form,
    source: source.value,
    repository: repository.value,
    target: target.value
  }))

  const nameTouched = ref(false)
  watch(
    () => form.name,
    (next) => {
      if (next && next !== (source.value?.defaultName ?? '')) nameTouched.value = true
    }
  )

  const setSource = (next) => {
    source.value = next
    clearErrors()

    if (!nameTouched.value) form.name = next?.defaultName ?? ''

    repository.value = null
    target.value = null

    Object.keys(form.settings).forEach((key) => delete form.settings[key])
    ;(next?.settings ?? []).forEach((setting) => {
      form.settings[setting.name] = ''
    })
  }

  const setRepository = (next) => {
    repository.value = next
    if (errors.repository) delete errors.repository
  }

  const setTarget = (next) => {
    target.value = next
    clearErrors()
    if (next?.mode === 'new') {
      form.name = next.name
      nameTouched.value = true
    }
    if (next && !isLastStep.value) stepIndex.value += 1
  }

  const selectSource = (next) => {
    setSource(next)
    if (next && !isLastStep.value) stepIndex.value += 1
  }

  const chooseMethod = (id) => {
    flowId.value = id
    if (id === 'cli') setSource({ ...SCRATCH_SOURCE })
    else setSource(null)
    stepIndex.value = 1
  }

  const seedFromQuery = () => {
    const method = route.query.method
    if (!method || !getApplicationFlow(String(method))) return
    chooseMethod(String(method))

    const slug = route.query.template
    if (slug && String(method) === 'template') {
      const template = getTemplate(String(slug))
      if (template.slug === String(slug)) {
        setSource(templateSource(template))
        stepIndex.value = 2
      }
    }

    commit()
  }
  seedFromQuery()

  const goBack = () => {
    if (stepIndex.value <= 0) return
    stepIndex.value -= 1
    clearErrors()
    if (stepIndex.value === 0) flowId.value = ''
    if (step.value === 'target') target.value = null
  }

  const goToStep = (index) => {
    if (index >= stepIndex.value) return
    stepIndex.value = index
    clearErrors()
    if (index === 0) flowId.value = ''
    if (steps.value[index]?.id === 'target') target.value = null
  }

  const { path: originPath, label: originLabel } = useCreateOrigin('/applications', 'Applications')

  const cancel = () => router.push({ path: originPath.value, query: { email: userEmail.value } })

  const validateRepository = () => {
    clearErrors()
    const target = repository.value
    if (!target?.name) {
      errors.repository =
        target?.mode === 'existing'
          ? 'Select a repository, or create a new one.'
          : 'This field is required.'
    }
    return !errors.repository
  }

  const validateSettings = () => {
    ;(source.value?.settings ?? [])
      .filter((setting) => setting.required)
      .forEach((setting) => {
        if (!String(form.settings[setting.name] ?? '').trim()) {
          errors[setting.name] = 'This field is required.'
        }
      })
  }

  const validate = () => {
    clearErrors()

    if (isInstall.value) {
      validateSettings()
      return Object.keys(errors).length === 0
    }

    if (!form.name.trim()) errors.name = 'This field is required.'

    if (form.domainHost.trim() && !form.domainEnvironment) {
      errors.domainEnvironment = 'Pick the environment this domain answers in.'
    }

    if (flowId.value === 'cli') {
      validateScratch(form.scratch, errors)
      return Object.keys(errors).length === 0
    }

    if (form.protection.enabled && !firewallBindingName(form.protection)) {
      errors.firewall =
        form.protection.mode === 'new'
          ? 'Name the firewall, or bind one that already exists.'
          : 'Select the firewall to bind, or create a new one.'
    }
    validateSettings()
    return Object.keys(errors).length === 0
  }

  const buildFields = () =>
    source.value?.requiresBuild
      ? { buildCommand: form.buildCommand.trim(), deployCommand: form.deployCommand.trim() }
      : {}

  const payload = () => ({
    ...buildFields(),
    name: form.name.trim(),
    modules: Object.fromEntries(
      Object.entries(form.modules).map(([key, enabled]) => [key, { enabled }])
    ),
    active: form.active,
    debug: form.debug
  })

  const advance = async () => {
    if (submitting.value) return

    if (!isLastStep.value) {
      if (step.value === 'repository' && !validateRepository()) {
        revealInvalid()
        return
      }
      stepIndex.value += 1
      clearErrors()
      return
    }

    if (!validate()) {
      revealInvalid()
      return
    }

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))

      if (isInstall.value) {
        installOnExisting()
        return
      }

      if (flowId.value === 'cli') {
        finishCreate()
        return
      }

      phase.value = 'deploying'
    } catch (error) {
      toast.error('Could not start the deployment.', {
        description: error?.message ?? 'Check your connection, then retry.',
        action: { label: 'Retry', onClick: () => advance() }
      })
    } finally {
      submitting.value = false
    }
  }

  const storeConnector = (form_) => addCreatedResource('connectors', form_)

  const installOnExisting = () => {
    const host = resolveApplicationChoice(target.value)
    if (!host) {
      toast.error('That application is no longer there.', {
        description: 'Pick another one, or create a new application for it.'
      })
      return
    }

    const install = installIntegration(source.value.slug, form.settings, host.name, storeConnector)

    rememberTemplateInstall({
      slug: source.value.slug,
      title: source.value.title,
      application: host.name,
      rule: install.rule
    })

    toast.success(`${source.value.title} is ready to install.`, {
      description: `Save the rule to apply it on ${host.name}.`
    })

    commit()
    router.push({
      path: `/applications/${host.id}`,
      query: {
        email: userEmail.value,
        name: host.name,
        tab: 'rules-engine',
        bind: 'templates',
        record: source.value.slug
      }
    })
  }

  const gitScope = computed(() => {
    if (repository.value?.owner) return repository.value.owner
    return source.value?.kind === 'git' ? (source.value.repoOwner ?? '') : ''
  })

  const cloneDestination = computed(() => {
    if (repository.value?.name) return `${repository.value.owner}/${repository.value.name}`
    return gitScope.value || 'gab-az'
  })

  const isConfigured = computed(() => source.value?.requiresRepository === false)

  const isScratch = computed(() => flowId.value === 'cli')

  const deploySteps = computed(() => {
    if (isScratch.value)
      return workloadProvisioningSteps({
        workload: form.name.trim() || 'my-application',
        application: form.name.trim() || 'my-application',
        applicationExisting: true,
        protected: form.protection.enabled,
        firewall: firewallBindingName(form.protection),
        firewallBound: firewallIsBound(form.protection)
      })
    if (isConfigured.value)
      return configuredTemplateSteps({
        title: source.value?.title ?? 'template',
        settings: (source.value?.settings ?? []).map((setting) => setting.label)
      })
    return undefined
  })

  const deploySplash = computed(() => {
    if (isScratch.value)
      return {
        verb: 'Publishing',
        icon: 'ai ai-workloads',
        from: form.name.trim() || 'my-application',
        to: ''
      }
    if (isConfigured.value)
      return {
        verb: 'Provisioning',
        icon: source.value?.icon || 'ai ai-applications',
        from: source.value?.title ?? 'application',
        to: ''
      }
    return null
  })

  const provisioned = ref(null)
  const createdResources = computed(() => {
    if (!provisioned.value) return []
    const chain = resourceChain(provisioned.value)
    if (!installedRule.value) return chain
    const application = provisioned.value.application
    return [
      ...chain,
      {
        key: 'rule',
        kind: 'Rules Engine rule',
        icon: 'pi pi-sliders-h',
        name: installedRule.value.name,
        status: 'Active',
        href: `/applications/${application.id}`,
        reference: application.id,
        fields: [
          { label: 'Phase', value: 'Request' },
          { label: 'Description', value: installedRule.value.description }
        ]
      }
    ]
  })

  const scratchResources = () => {
    if (flowId.value !== 'cli') return {}
    const name = form.name.trim()
    return {
      connector: scratchConnector(
        form.scratch,
        name,
        connectorMeta(form.scratch.connector.type).label
      ),
      cachePolicies: scratchCachePolicies(form.scratch, name)
    }
  }

  const customDomains = () => {
    const host = form.domainHost.trim().toLowerCase()
    if (!host) return []
    return [
      {
        id: `domain-${Date.now()}`,
        domain: host,
        environment: form.domainEnvironment,
        certificate: form.domainCertificate
      }
    ]
  }

  const outcomeDomain = computed(
    () => form.domainHost.trim().toLowerCase() || provisioned.value?.workload?.domain || ''
  )

  const installedRule = ref(null)

  const integrationResources = () => {
    if (!isIntegrationSource.value) return {}
    const name = form.name.trim() || 'my-application'
    const install = installIntegration(source.value.slug, form.settings, name, storeConnector)
    installedRule.value = install.rule
    return {
      connector: install.connector
        ? {
            name: install.connector.name,
            kind: connectorMeta(install.connector.type).label,
            address: install.connector.address || install.connector.bucket || ''
          }
        : null,
      cachePolicies: install.cachePolicy
        ? [
            {
              name: install.cachePolicy.name,
              template: 'Cache policy',
              detail: `Browser ${install.cachePolicy.browserCache.maxAge}s · Edge ${install.cachePolicy.edgeCache.maxAge}s`
            }
          ]
        : []
    }
  }

  const onRunFinished = () => {
    if (provisioned.value) {
      provisioned.value = publishDeployment(provisioned.value.id) ?? provisioned.value
      phase.value = 'success'
      return
    }
    finishCreate()
  }

  const finishCreate = () => {
    const application = payload()
    provisioned.value = provisionDeployment({
      ...scratchResources(),
      ...integrationResources(),
      publish: flowId.value !== 'cli',
      source: flowId.value === 'cli' ? 'cli' : 'git',
      repoName: application.name,
      scope: gitScope.value || 'gab-az',
      isPublic: repository.value ? repository.value.visibility !== 'private' : true,
      framework: source.value?.framework ?? '',
      templateTitle: source.value?.title ?? application.name,
      firewall: form.protection.enabled,
      firewallName: firewallBindingName(form.protection),
      firewallBound: firewallIsBound(form.protection),
      firewallId: firewallIdByName(firewallBindingName(form.protection)),
      firewallModules: firewallIsBound(form.protection)
        ? firewallModuleLabelsByName(firewallBindingName(form.protection))
        : enabledFirewallModules(form.protection.modules),
      customDomains: customDomains()
    })
    commit()
    phase.value = 'success'
  }

  const onDeployFailed = (failedStep) => {
    const fromOutcome = Boolean(provisioned.value)
    phase.value = fromOutcome ? 'success' : 'wizard'
    toast.error('The deployment did not finish.', {
      description: `It stopped at ${failedStep}. Check the configuration and deploy again.`,
      action: { label: 'Retry', onClick: () => (fromOutcome ? deployHere() : advance()) }
    })
  }

  const outcomeTitle = computed(() =>
    isScratch.value && !published.value ? 'Application created' : 'Application deployed'
  )

  const pageDescription = computed(() =>
    flowId.value === 'cli'
      ? 'An application is the code Azion runs, and the configuration it runs with. Name it, choose how it caches and where it fetches from. The last step creates it, with nothing deployed yet.'
      : 'An application is the code Azion runs, and the configuration it runs with. Select where the code comes from, name it, and the last step deploys it along with the workload that publishes it.'
  )

  const outcomeLead = computed(() => {
    if (!isScratch.value) return 'You deployed a new application.'
    return published.value
      ? 'It is live on the workload provisioned for it.'
      : 'The application layer is ready. Nothing serves it yet. Deploy it from Next steps.'
  })

  const published = computed(() => Boolean(provisioned.value?.workload))

  const deployMethods = computed(() => [
    {
      icon: 'pi pi-cloud-upload',
      title: 'Deploy this application',
      description:
        'Provision a workload for it and deploy, without leaving this flow. Azion names the domain, and you can change it after.',
      action: true,
      recommended: true
    },
    {
      icon: 'ai ai-workloads',
      title: 'Deploy using a new workload',
      description:
        'Name the workload, put a firewall in front of it, and compose the release yourself.',
      to: {
        path: '/workloads/new',
        query: {
          email: userEmail.value,
          application: provisioned.value?.application.name ?? ''
        }
      }
    }
  ])

  const publishedNextSteps = computed(() => [
    {
      icon: 'pi pi-globe',
      title: 'Customize domain',
      description:
        'The workload serves this application on a generated Azion domain. Attach one of your own to it.',
      to: {
        path: `/workloads/${provisioned.value?.workload?.id ?? ''}`,
        query: { email: userEmail.value, name: provisioned.value?.workload?.name }
      }
    },
    {
      icon: 'ai ai-edge-firewall',
      title: 'Enable firewall protection',
      description: 'Bind a firewall so requests are inspected before they reach the application.',
      to: {
        path: `/workloads/${provisioned.value?.workload?.id ?? ''}`,
        query: { email: userEmail.value, name: provisioned.value?.workload?.name }
      }
    }
  ])

  const scratchNextSteps = computed(() =>
    published.value ? publishedNextSteps.value : deployMethods.value
  )

  const deployHere = () => {
    phase.value = 'deploying'
  }

  const onNextStep = (step) => {
    if (step.action) deployHere()
  }

  const manageWorkload = () =>
    router.push(
      published.value
        ? {
            path: `/workloads/${provisioned.value?.workload?.id ?? ''}`,
            query: { email: userEmail.value, name: provisioned.value?.workload?.name }
          }
        : {
            path: `/applications/${provisioned.value?.application.id ?? ''}`,
            query: { email: userEmail.value, name: provisioned.value?.application.name }
          }
    )

  const onChangeAnswer = (answer) =>
    goToStep(answer === 'repository' ? 2 : flowId.value === 'cli' ? 0 : 1)

  const nextLabel = computed(() => {
    if (step.value === 'method') return ''
    if (!isLastStep.value) return 'Next'
    if (isInstall.value) return `Add to ${target.value?.name ?? 'application'}`
    return flowId.value === 'cli' ? 'Create Application' : 'Create and deploy'
  })

  const nextDisabled = computed(
    () => (step.value === 'source' && !source.value) || (step.value === 'target' && !target.value)
  )
</script>

<template>
  <WizardPage
    ref="page"
    :breadcrumb="[{ label: originLabel, href: originPath }, { label: 'Create Application' }]"
    :back-label="`Back to ${originLabel}`"
    title="Create Application"
    :description="pageDescription"
    title-id="create-application-title"
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
    <MethodStep
      v-if="step === 'method'"
      @select="chooseMethod"
    />

    <GitSourceStep
      v-else-if="step === 'source' && flowId === 'git'"
      :source="source"
      :disabled="submitting"
      @update:source="selectSource"
    />

    <TemplateSourceStep
      v-else-if="step === 'source' && flowId === 'template'"
      :source="source"
      :disabled="submitting"
      @update:source="selectSource"
    />

    <RepositoryStep
      v-else-if="step === 'repository'"
      :source="source"
      :repository="repository"
      :errors="errors"
      :disabled="submitting"
      @update:repository="setRepository"
    />

    <TargetStep
      v-else-if="step === 'target'"
      :source="source"
      :target="target"
      :disabled="submitting"
      @update:target="setTarget"
    />

    <template v-else-if="step === 'configure' && isInstall">
      <SourceSummary
        :source="source"
        :repository="repository"
        :disabled="submitting"
        class="mb-(--layout-section-gap)"
        @change="onChangeAnswer"
      />

      <InstallStep
        :source="source"
        :target="target"
        :disabled="submitting"
      />
    </template>

    <ScratchStep
      v-else-if="step === 'configure' && flowId === 'cli'"
      :disabled="submitting"
    />

    <template v-else-if="step === 'configure'">
      <SourceSummary
        :source="source"
        :repository="repository"
        :disabled="submitting"
        class="mb-(--layout-section-gap)"
        @change="onChangeAnswer"
      />

      <ConfigureStep
        :source="source"
        :disabled="submitting"
      />
    </template>

    <template #terminal>
      <template v-if="phase === 'deploying'">
        <SourceSummary
          v-if="!isScratch"
          :source="source"
          :repository="repository"
          :changeable="false"
          class="mb-(--layout-section-gap)"
        />

        <DeploymentFlow
          :title="isConfigured ? 'Provisioning' : 'Deployment'"
          :status-label="isConfigured ? 'Creating' : 'Building'"
          :steps="deploySteps"
          :splash="deploySplash"
          :repo-owner="source?.repoOwner ?? 'aziontech'"
          :repo-path="source?.repoPath ?? 'templates/hello-world'"
          :scope="cloneDestination"
          @finished="onRunFinished"
          @failed="onDeployFailed"
        />
      </template>
      <DeploySuccess
        v-else
        :resources="createdResources"
        :scope="gitScope"
        :title="outcomeTitle"
        :lead="outcomeLead"
        :domain="outcomeDomain"
        :live="!form.domainHost.trim()"
        :next-steps="isScratch ? scratchNextSteps : []"
        :source="flowId === 'cli' ? 'cli' : 'git'"
        :application-name="provisioned?.application?.name ?? form.name"
        @manage="manageWorkload"
        @select="onNextStep"
      />
    </template>
  </WizardPage>
</template>

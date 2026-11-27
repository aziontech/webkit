<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Item from '@aziontech/ui/item'
  import { useUnsavedChanges } from '@aziontech/ui/use-unsaved-changes'
  import Wizard from '@aziontech/ui/wizard'
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'

  import {
    filterOptions,
    pickerSummary,
    type ServiceWizardOption,
    type ServiceWizardPickerInitial,
    type ServiceWizardScratch
  } from '../lib/service-wizard'
  import { deployments, originFieldsByType, platformDomainSuffix, projects } from '../sample'
  import DeploymentPicker from './deployment-picker.vue'
  import ProjectPickerCard from './project-picker-card.vue'
  import ProjectSettings from './project-settings.vue'
  import ServiceAdvanced from './service-advanced.vue'
  import ServiceDomainCard from './service-domain-card.vue'
  import ServiceEnvironment from './service-environment.vue'
  import WizardFrame from './wizard-frame.vue'

  const emit = defineEmits<{
    cancel: [event: MouseEvent | KeyboardEvent]
  }>()

  const breadcrumb = [{ label: 'Services', href: '/services' }, { label: 'Create Service' }]
  const PAGE_SIZE = 5

  const usePicker = (
    options: ServiceWizardOption[],
    noun: string,
    initial: ServiceWizardPickerInitial = {}
  ) => {
    const query = ref('')
    const chosen = ref(initial.chosen ?? '')
    const message = ref(initial.message ?? '')
    const shown = ref(PAGE_SIZE)
    const loading = ref(initial.loading ?? false)
    let timer: ReturnType<typeof setTimeout> | undefined
    onBeforeUnmount(() => clearTimeout(timer))

    const chosenIndex = options.findIndex((option) => option.value === chosen.value)
    if (chosenIndex >= PAGE_SIZE) shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE

    const paged = computed(() => options.length > PAGE_SIZE)
    const matches = computed(() => filterOptions(options, query.value))
    const visible = computed(() => matches.value.slice(0, shown.value))
    const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))
    const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

    const summary = computed(() =>
      pickerSummary({
        noun,
        total: options.length,
        query: query.value,
        loading: loading.value,
        matches: matches.value.length,
        visible: visible.value.length,
        remaining: remaining.value,
        nextBatch: nextBatch.value
      })
    )

    const loadMore = () => {
      if (loading.value || !remaining.value) return
      loading.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        shown.value += PAGE_SIZE
        loading.value = false
      }, 420)
    }

    return reactive({
      query,
      chosen,
      message,
      loading,
      paged,
      matches,
      visible,
      remaining,
      nextBatch,
      summary,
      loadMore
    })
  }

  const stepIndex = ref(0)

  const projectMode = ref('existing')
  const projectName = ref('')
  const projectPicker = usePicker(projects, 'project', { chosen: '' })
  const deploymentPicker = usePicker(deployments, 'deployment')
  const scratch = reactive<ServiceWizardScratch>({
    cache: {
      images: {
        enabled: false,
        values: { extensions: 'jpg, jpeg, png, gif, webp, avif, svg, ico, bmp, tiff' }
      },
      'files-optimization': { enabled: false, values: {} }
    },
    origin: { enabled: false, type: 'http', values: {} }
  })

  const form = reactive({
    domainType: 'platform',
    domainPrefix: '',
    domainHost: '',
    name: '',
    environment: 'Production',
    certificate: 'shared_san',
    deploymentMode: 'auto',
    minimumTlsVersion: 'tls_1_2',
    errorPage: '',
    allowPlatformDomain: true,
    active: true
  })
  const errors = reactive<Record<string, string>>({})
  const advancedOpen = ref(false)

  const slug = (value: string) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const names = computed(() => {
    const input = slug(form.domainType === 'own' ? form.name : form.domainPrefix)
    return {
      service: input,
      deployment: input ? input + '-deployment' : '',
      domain:
        form.domainType === 'own'
          ? form.domainHost.trim().toLowerCase() || (input ? input + platformDomainSuffix : '')
          : input
            ? input + platformDomainSuffix
            : ''
    }
  })

  const boundName = computed(() =>
    projectMode.value === 'new' ? projectName.value.trim() : projectPicker.chosen
  )

  const projectSummary = computed(() => {
    if (!boundName.value) return 'Not chosen yet. Pick one, or create it with the service.'
    if (projectMode.value !== 'new') {
      return 'Serving its latest ready version. The domain answers with this.'
    }
    return 'Created with the service and built before the release is cut.'
  })

  const originFields = computed(() => originFieldsByType[scratch.origin.type])

  const checkScratch = () => {
    if (scratch.cache.images.enabled && !scratch.cache.images.values.extensions?.trim()) {
      errors['cache.images.extensions'] = 'This field is required.'
    }
    if (!scratch.origin.enabled) return
    for (const field of originFields.value) {
      if (field.required && !String(scratch.origin.values[field.name] ?? '').trim()) {
        errors['origin.' + field.name] = 'This field is required.'
      }
    }
  }

  const validateProject = () => {
    if (!boundName.value) {
      projectPicker.message =
        projectMode.value === 'new'
          ? 'Name the project, or select one that already exists.'
          : 'Select the project this service serves, or create a new one.'
    }
    if (projectMode.value === 'new') checkScratch()
    return !projectPicker.message && Object.keys(errors).length === 0
  }

  const validateDomain = () => {
    if (form.domainType === 'own') {
      if (!form.domainHost.trim())
        errors.domainHost = 'Enter the hostname that points at this service.'
      if (!form.name.trim()) errors.name = 'Name the service.'
    } else if (!form.domainPrefix.trim()) {
      errors.domainPrefix = 'Enter the prefix for the platform domain.'
    }
    if (form.deploymentMode === 'existing' && !deploymentPicker.chosen) {
      deploymentPicker.message = 'Select the deployment the first release lands in.'
    }
    return Object.keys(errors).length === 0 && !deploymentPicker.message
  }

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    projectPicker.message = ''
    deploymentPicker.message = ''
    return stepIndex.value === 0 ? validateProject() : validateDomain()
  }

  const submitting = ref(false)
  let submitTimer: ReturnType<typeof setTimeout> | undefined
  onBeforeUnmount(() => clearTimeout(submitTimer))

  const onNext = (event: MouseEvent) => {
    if (!validate()) event.preventDefault()
  }

  const submit = () => {
    if (submitting.value || !validate()) return
    submitting.value = true
    submitTimer = setTimeout(() => {
      submitting.value = false
    }, 1200)
  }

  const guard = useUnsavedChanges(
    () => ({
      projectMode: projectMode.value,
      projectName: projectName.value,
      project: projectPicker.chosen,
      deployment: deploymentPicker.chosen,
      scratch,
      form
    }),
    { enabled: () => !submitting.value }
  )
</script>

<template>
  <WizardFrame
    v-model="stepIndex"
    back-label="Back to Services"
    :breadcrumb="breadcrumb"
    title="Create Service"
    description="A service is the public entry point: what it serves, and the domain traffic arrives on. The last step provisions both."
    submit-label="Create and deploy"
    :shortcut-label="stepIndex === 1 ? 'Create and deploy' : 'Next step'"
    :loading="submitting"
    :guard="guard"
    @next="onNext"
    @submit="submit"
    @cancel="(event: MouseEvent | KeyboardEvent) => emit('cancel', event)"
  >
    <Wizard.Step
      title="Project"
      description="What this service serves, an existing project or a new one."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-section-gap)">
        <ProjectPickerCard
          v-model:project-mode="projectMode"
          v-model:project-name="projectName"
          v-model:picker="projectPicker"
        />

        <ProjectSettings
          v-model:scratch="scratch"
          :project-mode="projectMode"
          :errors="errors"
        />
      </div>
    </Wizard.Step>
    <Wizard.Step
      title="Domain and deployment"
      description="Where traffic arrives, and the deployment the first release is cut against."
    >
      <div class="mb-(--layout-section-gap)">
        <Card :padded="false">
          <template #default>
            <Item.List>
              <Item size="small">
                <Item.Media>
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      class="az az-box text-body-md leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ boundName || 'No project' }}</Item.Title>
                  <Item.Description>{{ projectSummary }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <Button
                    type="button"
                    label="Change"
                    variant="ghost"
                    size="small"
                    @click="stepIndex = 0"
                  />
                </Item.Actions>
              </Item>
            </Item.List>
          </template>
        </Card>
      </div>

      <div class="flex min-w-0 flex-col">
        <ServiceDomainCard
          v-model:form="form"
          :errors="errors"
          :names="names"
        />

        <ServiceEnvironment v-model:form="form" />

        <DeploymentPicker
          v-model:form="form"
          v-model:picker="deploymentPicker"
          :names="names"
        />

        <ServiceAdvanced
          v-model:form="form"
          v-model:advanced-open="advancedOpen"
          :names="names"
        />
      </div>
    </Wizard.Step>
  </WizardFrame>
</template>

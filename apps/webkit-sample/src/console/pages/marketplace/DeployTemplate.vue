<script setup>
  import { curve, duration } from '@aziontech/theme/animations'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import GitProviderConnect from '../../components/creation/GitProviderConnect.vue'
  import UploadedProject from '../../components/creation/UploadedProject.vue'
  import DeploymentFlow from '../../components/deployment/DeploymentFlow.vue'
  import SelectField from '../../components/form/SelectField.vue'
  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import TemplatePreview from '../../components/marketplace/TemplatePreview.vue'
  import CreationHeader from '../../components/page/CreationHeader.vue'
  import { useBaseline } from '../../lib/behavior/forms'
  import { defaultRootFile, picksRootFile } from '../../lib/behavior/project-upload'
  import { FRAMEWORKS, markFilterFor, presetOptions } from '../../lib/data/frameworks'
  import { provisionDeployment, resourceChain } from '../../lib/data/provisioning'
  import { getTemplate } from '../../lib/data/templates.js'
  import { droppedProjectFor } from '../../lib/state/dropped-project'
  import { gitAccounts, gitConnected } from '../../lib/state/git-provider'
  import DeploySuccess from '../applications/wizard/DeploySuccess.vue'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const isRepoImport = computed(() => Boolean(route.query.repo))
  const isUpload = computed(() => Boolean(route.query.upload))

  const template = computed(() => {
    if (isUpload.value) {
      const name = String(route.query.upload)
      const framework = String(route.query.framework || '')
      return {
        slug: `upload:${name}`,
        title: name,
        description: 'Deploy this project straight from your machine.',
        framework,
        icon: '',
        requiresRepository: false,
        defaultRepoName: name,
        settings: []
      }
    }
    if (isRepoImport.value) {
      const name = String(route.query.repo)
      const owner = String(route.query.owner || 'gab-az')
      return {
        slug: `repo:${owner}/${name}`,
        title: name,
        description: `Import and deploy the ${name} repository directly from GitHub.`,
        framework: String(route.query.framework || ''),
        repoOwner: owner,
        repoPath: name,
        defaultRepoName: name,
        settings: []
      }
    }
    return getTemplate(route.query.template)
  })

  const templateMark = computed(() => {
    if (isUpload.value) {
      const icon = FRAMEWORKS.find((entry) => entry.tech === preset.value)?.icon
      return { icon: icon || 'pi pi-folder', markClass: markFilterFor(icon ?? '') }
    }
    const framework = FRAMEWORKS.find((entry) => entry.tech === template.value.framework)
    const icon = template.value.icon || framework?.icon || ''
    return { icon, markClass: markFilterFor(icon) }
  })

  const goToCreationCenter = () =>
    router.push({ path: '/create', query: { email: userEmail.value } })

  const manageWorkload = () =>
    router.push({
      path: `/workloads/${provisioned.value?.workload.id ?? ''}`,
      query: { email: userEmail.value, name: provisioned.value?.workload.name }
    })

  const breadcrumbSource = computed(() => {
    if (isUpload.value) return 'Upload a Project'
    return isRepoImport.value ? 'Import from Git' : 'Start from a Template'
  })

  const breadcrumbItems = computed(() => [
    { label: breadcrumbSource.value },
    { label: template.value.title, current: true }
  ])
  const onBreadcrumbNavigate = () => goToCreationCenter()

  const repositoryMode = computed(() => {
    if (template.value.requiresRepository === false) return 'none'
    if (isRepoImport.value) return 'required'
    return 'optional'
  })

  const skipGit = ref(false)

  const usesGit = computed(() => repositoryMode.value !== 'none' && !skipGit.value)

  const scope = ref(String(route.query.owner || ''))

  watch(
    gitAccounts,
    (accounts) => {
      if (!accounts.length) return
      if (accounts.some((account) => account.value === scope.value)) return
      scope.value = accounts[0].value
    },
    { immediate: true }
  )

  const isPublic = ref(true)

  const repoLabel = computed(() => {
    if (!usesGit.value) return 'Project Name'
    return isPublic.value ? 'Public Repository Name' : 'Private Repository Name'
  })
  const repoPlaceholder = computed(() => (usesGit.value ? 'my-repository' : 'my-project'))

  const formIntro = computed(() => {
    if (repositoryMode.value === 'none') {
      return isUpload.value
        ? 'Azion deploys these files once. Connect a Git provider later to ship every push automatically.'
        : 'Azion provisions this template directly. There is no repository to connect.'
    }
    if (!usesGit.value) {
      return 'Azion deploys this code once. Connect a Git provider later to ship every push automatically.'
    }
    return 'Azion deploys from this repository and ships every push automatically.'
  })

  const dropped = computed(() =>
    isUpload.value ? droppedProjectFor(String(route.query.upload)) : null
  )

  const preset = ref(String(route.query.framework || ''))

  const detectedPreset = computed(() => String(route.query.framework || ''))

  const presetHelper = computed(() => {
    if (!preset.value)
      return 'Nothing here named a framework. Pick one to build the project, or leave it to serve the files as they are.'
    if (preset.value === detectedPreset.value)
      return 'Detected from your project. Change it if we read it wrong.'
    return 'Azion builds the project with this preset.'
  })

  const picksRoot = computed(() =>
    picksRootFile({ files: dropped.value?.files ?? [], framework: preset.value })
  )

  const rootFile = ref(defaultRootFile(dropped.value?.files))

  const settingsTitle = computed(() => {
    if (!isUpload.value) return 'Template Settings'
    return dropped.value ? 'Project Files' : 'Project Settings'
  })
  const settingsEmpty = computed(() =>
    isUpload.value
      ? 'This project needs no additional settings.'
      : 'This template has no additional settings.'
  )

  const repoName = ref('')
  const settingsValues = reactive({})

  const settingsLoading = ref(false)
  let settingsTimer = null

  const skeletonFieldCount = computed(() => Math.max(template.value.settings.length, 2))

  const initFromTemplate = (t) => {
    repoName.value = t.defaultRepoName
    rootFile.value = defaultRootFile(dropped.value?.files)
    preset.value = t.framework
    Object.keys(settingsValues).forEach((k) => delete settingsValues[k])
    t.settings.forEach((s) => (settingsValues[s.name] = ''))

    if (settingsTimer) clearTimeout(settingsTimer)
    if (isUpload.value) {
      settingsLoading.value = false
      return
    }
    settingsLoading.value = true
    settingsTimer = setTimeout(() => {
      settingsLoading.value = false
    }, 900)
  }
  initFromTemplate(template.value)

  const { dirty, commit } = useBaseline(() => ({
    repoName: repoName.value,
    rootFile: rootFile.value,
    ...settingsValues
  }))
  watch(
    () => template.value.slug,
    () => {
      skipGit.value = false
      initFromTemplate(template.value)
      commit()
    }
  )

  const canDeploy = computed(() => {
    if (!repoName.value.trim()) return false
    if (picksRoot.value && !rootFile.value) return false
    return template.value.settings
      .filter((s) => s.required)
      .every((s) => (settingsValues[s.name] || '').trim())
  })

  const status = ref('form')

  const phase = computed(() =>
    status.value === 'form' && usesGit.value && !gitConnected.value ? 'connect' : status.value
  )

  const connectDescription = computed(
    () =>
      `Azion clones ${template.value.title} into a repository in your account, then deploys from it on every push.`
  )

  const deploySplash = computed(() =>
    usesGit.value
      ? null
      : {
          verb: 'Deploying',
          icon: templateMark.value.icon || 'pi pi-cloud-upload',
          from: template.value.title
        }
  )

  const submitting = ref(false)
  let submitTimer = null

  const runDeploy = () => {
    if (!canDeploy.value || submitting.value) return
    submitting.value = true
    submitTimer = setTimeout(() => {
      status.value = 'deploying'
      submitting.value = false
    }, 1500)
  }

  onBeforeUnmount(() => {
    if (submitTimer) clearTimeout(submitTimer)
    if (settingsTimer) clearTimeout(settingsTimer)
  })

  const timing = (d, c) => `opacity ${d} ${c}, transform ${d} ${c}`
  const onBeforeEnter = (el) => {
    el.style.transition = timing(duration['moderate-02'], curve['productive-entrance'])
  }
  const onBeforeLeave = (el) => {
    el.style.transition = timing(duration['fast-02'], curve['productive-exit'])
  }

  const ANCHOR_OFFSET = 24
  const flowScroll = ref(null)

  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const onPhaseEnter = (el) => {
    if (status.value !== 'deploying') return
    const container = flowScroll.value
    if (!container) return
    const top =
      container.scrollTop +
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      ANCHOR_OFFSET
    container.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    })
  }

  const provisioned = ref(null)
  const createdResources = computed(() =>
    provisioned.value ? resourceChain(provisioned.value) : []
  )

  const onDeployFinished = () => {
    provisioned.value = provisionDeployment({
      repoName: repoName.value,
      scope: usesGit.value ? scope.value : undefined,
      framework: isUpload.value ? preset.value : template.value.framework,
      isPublic: isPublic.value,
      templateTitle: template.value.title,
      source: usesGit.value ? 'git' : isUpload.value ? 'drop' : 'cli'
    })
    status.value = 'success'
  }
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <UnsavedChangesGuard :dirty="dirty && phase === 'form'" />

    <CreationHeader
      :show-back="phase !== 'success'"
      :breadcrumb="phase !== 'success' ? breadcrumbItems : []"
      back-label="Back to Creation Center"
      @back="goToCreationCenter"
      @navigate="onBreadcrumbNavigate"
    />

    <main
      ref="flowScroll"
      class="animate-page-enter motion-reduce:animate-none relative min-w-0 flex-1 overflow-auto"
    >
      <div
        class="layout-column-focused relative flex flex-col items-center gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-xxl)"
      >
        <Transition
          @before-enter="onBeforeEnter"
          @before-leave="onBeforeLeave"
          enter-from-class="opacity-0 translate-y-(--spacing-lg)"
          leave-to-class="opacity-0 -translate-y-(--spacing-md)"
        >
          <TemplatePreview
            v-if="phase !== 'success'"
            class="max-w-none! motion-reduce:transition-none! motion-reduce:transform-none!"
            :title="template.title"
            :description="template.description"
            :icon="templateMark.icon"
            :mark-class="templateMark.markClass"
            :cloned="usesGit"
            :repo-owner="template.repoOwner"
            :repo-path="template.repoPath"
          />
        </Transition>

        <Transition
          mode="out-in"
          @before-enter="onBeforeEnter"
          @enter="onPhaseEnter"
          @before-leave="onBeforeLeave"
          enter-from-class="opacity-0 translate-y-(--spacing-lg)"
          leave-to-class="opacity-0 -translate-y-(--spacing-md)"
        >
          <div
            :key="phase"
            class="flex w-full flex-col items-center gap-(--spacing-xl) motion-reduce:transition-none! motion-reduce:transform-none!"
          >
            <template v-if="phase === 'connect'">
              <GitProviderConnect
                class="w-full"
                title="Connect a Git provider"
                :description="connectDescription"
              >
                <template
                  v-if="repositoryMode === 'optional'"
                  #alternative
                >
                  <Button
                    label="Continue without Git"
                    kind="text"
                    size="large"
                    @click="skipGit = true"
                  />
                </template>
              </GitProviderConnect>

              <Button
                label="Browse Templates"
                kind="outlined"
                size="medium"
                @click="goToCreationCenter"
              />
            </template>

            <template v-else-if="phase === 'form'">
              <CardBox class="w-full">
                <template #content>
                  <div class="flex flex-col gap-(--spacing-lg)">
                    <div class="flex flex-col gap-(--spacing-xxs)">
                      <h2 class="text-heading-xs text-(--text-default)">Deploy your project</h2>
                      <p class="text-body-sm text-pretty text-(--text-muted)">
                        {{ formIntro }}
                      </p>
                    </div>

                    <div
                      class="grid grid-cols-1 items-start gap-(--spacing-lg)"
                      :class="usesGit || isUpload ? 'sm:grid-cols-2' : ''"
                    >
                      <div
                        v-if="usesGit"
                        class="flex flex-col gap-(--spacing-xs)"
                      >
                        <Label
                          label="Scope"
                          required
                          for="scope"
                        />
                        <Select
                          v-model="scope"
                          size="large"
                          placeholder="Select a scope"
                          :disabled="submitting"
                          :display-value="
                            (v) => gitAccounts.find((s) => s.value === v)?.label ?? ''
                          "
                        >
                          <Select.Trigger />
                          <Select.Content>
                            <Select.Option
                              v-for="s in gitAccounts"
                              :key="s.value"
                              :value="s.value"
                            >
                              {{ s.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </div>

                      <div class="flex flex-col gap-(--spacing-xs)">
                        <Label
                          :label="repoLabel"
                          required
                          for="repoName"
                        />
                        <InputGroupRoot
                          size="large"
                          :disabled="submitting"
                        >
                          <InputText
                            id="repoName"
                            v-model="repoName"
                            size="large"
                            :placeholder="repoPlaceholder"
                            class="flex-1"
                            :disabled="submitting"
                          />
                          <InputGroupAddon v-if="usesGit">
                            <Tooltip text="Toggle repository visibility (public or private)">
                              <Switch
                                v-model="isPublic"
                                kind="privacy"
                                :disabled="submitting"
                                :aria-label="
                                  isPublic
                                    ? 'Repository is public — toggle to make it private'
                                    : 'Repository is private — toggle to make it public'
                                "
                              />
                            </Tooltip>
                          </InputGroupAddon>
                        </InputGroupRoot>
                      </div>

                      <SelectField
                        v-if="isUpload"
                        v-model="preset"
                        label="Build preset"
                        placeholder="Select a preset"
                        :helper-text="presetHelper"
                        :options="presetOptions"
                        :disabled="submitting"
                      />
                    </div>

                    <h3 class="text-heading-xxs text-(--text-default)">{{ settingsTitle }}</h3>
                    <div
                      v-if="settingsLoading"
                      class="flex flex-col gap-(--spacing-lg)"
                      aria-busy="true"
                    >
                      <div
                        v-for="n in skeletonFieldCount"
                        :key="n"
                        class="flex flex-col gap-(--spacing-xs)"
                      >
                        <Skeleton
                          width="30%"
                          height="1rem"
                        />
                        <Skeleton
                          width="100%"
                          height="2rem"
                        />
                        <Skeleton
                          width="55%"
                          height="0.75rem"
                        />
                      </div>
                    </div>
                    <div
                      v-else-if="template.settings.length"
                      class="flex flex-col gap-(--spacing-lg)"
                    >
                      <div
                        v-for="field in template.settings"
                        :key="field.name"
                        class="flex flex-col gap-(--spacing-xs)"
                      >
                        <Label
                          :label="field.label"
                          :required="field.required"
                          :for="field.name"
                        />
                        <InputText
                          :id="field.name"
                          v-model="settingsValues[field.name]"
                          size="large"
                          :placeholder="field.placeholder"
                          :disabled="submitting"
                          :aria-describedby="field.description ? `${field.name}-helper` : undefined"
                        />
                        <HelperText
                          v-if="field.description"
                          :id="`${field.name}-helper`"
                          :label="field.description"
                        />
                      </div>
                    </div>
                    <UploadedProject
                      v-else-if="dropped"
                      v-model="rootFile"
                      :files="dropped.files"
                      :truncated="dropped.truncated"
                      :framework="preset"
                      :disabled="submitting"
                    />
                    <p
                      v-else
                      class="text-body-sm text-(--text-muted)"
                    >
                      {{ settingsEmpty }}
                    </p>
                  </div>
                </template>

                <template #footer>
                  <Button
                    class="w-full"
                    label="Deploy"
                    kind="primary"
                    size="large"
                    :disabled="!canDeploy"
                    :loading="submitting"
                    @click="runDeploy"
                  />
                </template>
              </CardBox>

              <Button
                label="Browse Templates"
                kind="outlined"
                size="medium"
                @click="goToCreationCenter"
              />
            </template>

            <template v-else-if="phase === 'deploying'">
              <DeploymentFlow
                :repo-owner="template.repoOwner"
                :repo-path="template.repoPath"
                :scope="scope"
                :splash="deploySplash"
                @finished="onDeployFinished"
              />
            </template>

            <template v-else>
              <DeploySuccess
                title="Congratulations!"
                lead="You just deployed a new application"
                :resources="createdResources"
                :scope="scope"
                :domain="provisioned?.workload?.domain ?? ''"
                @manage="manageWorkload"
              />
            </template>
          </div>
        </Transition>
      </div>
    </main>
  </div>
</template>

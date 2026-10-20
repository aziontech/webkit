<script setup>
  import { computed, nextTick, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProjectDropZone from '../../components/creation/ProjectDropZone.vue'
  import ApplicationDeployDrawer from '../../components/deployment/ApplicationDeployDrawer.vue'
  import ApplicationEnvironmentDeployDrawer from '../../components/deployment/ApplicationEnvironmentDeployDrawer.vue'
  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useProjectUpload } from '../../lib/behavior/project-upload'
  import { isTabDirty, tabCommit } from '../../lib/behavior/tab-dirty'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import { applicationById } from '../../lib/data/applications'
  import { provisionedApplications } from '../../lib/data/provisioning'
  import { applicationVersions } from '../../lib/data/releases'
  import { VERSION_STATES } from '../../lib/data/versioning'
  import { deployFlow } from '../../lib/state/sample-preset'
  import Build from './panels/Build.vue'
  import Deployments from './panels/Deployments.vue'
  import Overview from './panels/Overview.vue'
  import Versions from './panels/Versions.vue'

  const route = useRoute()
  const router = useRouter()

  const application = computed(() => {
    const id = String(route.params.id || '1784552864')
    const seeded = applicationById(id) ?? provisionedApplications.value.find((app) => app.id === id)
    if (seeded) return seeded
    return {
      id,
      name: String(route.query.name || 'webkit-sample-vue'),
      source: 'git'
    }
  })

  const VERSION_TABS = [
    'main-settings',
    'source',
    'device-groups',
    'cache-settings',
    'functions-instances',
    'rules-engine'
  ]

  const workingVersionId = () => {
    const versions = applicationVersions(String(application.value.name))
    return (
      versions.find((entry) => entry.state === VERSION_STATES.DRAFT)?.id ??
      versions.find((entry) => entry.state === VERSION_STATES.ACTIVE)?.id ??
      versions[0]?.id
    )
  }

  watch(
    () => route.query.tab,
    (tab) => {
      if (!VERSION_TABS.includes(String(tab))) return
      const versionId = workingVersionId()
      if (!versionId) return
      router.replace({
        path: `/applications/${application.value.id}/versions/${versionId}`,
        query: route.query
      })
    },
    { immediate: true }
  )

  const dropped = ref(null)
  const deployOpen = ref(false)
  const preferredWorkload = ref(null)
  const preferredEnvironment = ref('')
  const pinnedVersionId = ref('')

  const { dragging } = useProjectUpload((project) => {
    dropped.value = project
    pinnedVersionId.value = ''
    deployOpen.value = true
  })

  const deploySource = computed(() =>
    dropped.value ? dropped.value.name || 'dropped files' : String(application.value.branch || '')
  )

  watch(
    () => route.query.deploy,
    (deploy) => {
      if (deploy !== '1') return
      const {
        deploy: _deploy,
        workloadId,
        workloadName,
        environment,
        version,
        ...rest
      } = route.query
      preferredWorkload.value = workloadId
        ? { id: String(workloadId), name: String(workloadName || workloadId) }
        : null
      preferredEnvironment.value = environment ? String(environment) : ''
      pinnedVersionId.value = version ? String(version) : ''
      dropped.value = null
      router.replace({ query: rest })
      deployOpen.value = true
    },
    { immediate: true }
  )

  const tabs = computed(() => [
    {
      value: 'overview',
      label: 'Overview',
      component: Overview,
      props: { application: application.value }
    },
    {
      value: 'versions',
      label: 'Versions',
      component: Versions,
      props: { application: application.value }
    },
    {
      value: 'build',
      label: 'Build',
      component: Build,
      props: { application: application.value }
    },
    {
      value: 'deployments',
      label: 'Deployments',
      component: Deployments,
      props: { application: application.value }
    }
  ])

  const currentTab = computed(() =>
    tabs.value.some((t) => t.value === route.query.tab) ? route.query.tab : 'overview'
  )

  const leavingTab = ref(null)
  const leavingCommit = computed(() => (leavingTab.value ? tabCommit(leavingTab.value) : null))
  const tabGuard = ref(null)

  const goToTab = (value) => router.replace({ query: { ...route.query, tab: value } })

  const activeTab = computed({
    get: () => currentTab.value,
    set: async (value) => {
      if (!value) return
      const from = currentTab.value
      if (value === from || !isTabDirty(from)) return goToTab(value)

      leavingTab.value = from
      await nextTick()
      const proceed = await tabGuard.value?.ask()
      leavingTab.value = null
      if (proceed) goToTab(value)
    }
  })

  const scrollRef = ref(null)
  const enterRef = ref(null)
  useTabEnter(enterRef, activeTab, scrollRef)

  const activeView = computed(
    () => tabs.value.find((t) => t.value === activeTab.value) ?? tabs.value[0]
  )
</script>

<template>
  <AppLayout
    active="applications"
    :padded="false"
    :breadcrumb="[{ label: 'Applications', href: '/applications' }, { label: application.name }]"
  >
    <main class="flex h-full flex-col">
      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
      />

      <div class="relative flex min-h-0 flex-1 flex-col">
        <ProjectDropZone
          :active="dragging"
          title="Drop your project to deploy it"
          :description="`Azion builds a new version of ${application.name}, then you choose where it goes live.`"
          class="[--drop-zone-inset:var(--layout-boundary-inline)]"
        />

        <section
          ref="scrollRef"
          class="min-h-0 flex-1 overflow-auto"
        >
          <div
            ref="enterRef"
            class="flex min-h-full flex-col"
          >
            <KeepAlive>
              <component
                :is="activeView.component"
                v-bind="activeView.props"
              />
            </KeepAlive>
          </div>
        </section>
      </div>
    </main>

    <component
      :is="deployFlow === 'workload' ? ApplicationDeployDrawer : ApplicationEnvironmentDeployDrawer"
      v-model:open="deployOpen"
      :application="application"
      :source="deploySource"
      :preferred-workload="preferredWorkload"
      :preferred-environment="preferredEnvironment"
      :pinned-version-id="pinnedVersionId"
    />

    <UnsavedChangesGuard
      ref="tabGuard"
      savable
      :route-guard="false"
      :dirty="Boolean(leavingCommit?.dirty)"
      :saving="Boolean(leavingCommit?.saving)"
      @save="leavingCommit?.save?.()"
      @discard="leavingCommit?.discard?.()"
    />
  </AppLayout>
</template>

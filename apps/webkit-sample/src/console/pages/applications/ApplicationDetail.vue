<script setup>
  import { computed, nextTick, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProjectDropZone from '../../components/creation/ProjectDropZone.vue'
  import DropDeployDialog from '../../components/deployment/DropDeployDialog.vue'
  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useProjectUpload } from '../../lib/behavior/project-upload'
  import { isTabDirty, tabCommit } from '../../lib/behavior/tab-dirty'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import { applicationById } from '../../lib/data/applications'
  import { latestApplicationDeployment } from '../../lib/data/deployment-history'
  import { provisionedApplications } from '../../lib/data/provisioning'
  import { workloadById } from '../../lib/data/workloads'
  import { startResourceDeployRun } from '../../lib/state/deploy-runs'
  import Build from './panels/Build.vue'
  import CacheSettings from './panels/CacheSettings.vue'
  import Deployments from './panels/Deployments.vue'
  import DeviceGroups from './panels/DeviceGroups.vue'
  import FunctionsInstances from './panels/FunctionsInstances.vue'
  import MainSettings from './panels/MainSettings.vue'
  import Overview from './panels/Overview.vue'
  import RulesEngine from './panels/RulesEngine.vue'

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

  const DROP_ENVIRONMENT = 'Production'

  const dropped = ref(null)
  const dropOpen = ref(false)

  const { dragging } = useProjectUpload((project) => {
    dropped.value = project
    dropOpen.value = true
  })

  const deployDropped = () => {
    const app = application.value
    const latest = latestApplicationDeployment(app.id, app.name)
    const seededWorkload = latest ? workloadById(latest.workloadId) : undefined
    const workload = {
      id: latest?.workloadId ?? app.id,
      name: latest?.workloadName ?? app.name,
      domain: seededWorkload?.domain ?? app.domainName ?? ''
    }

    startResourceDeployRun({
      workload,
      application: { id: app.id, name: app.name },
      deploymentName: dropped.value?.name ?? app.name,
      environment: DROP_ENVIRONMENT,
      preset: app.preset || 'javascript'
    })
  }

  const tabs = computed(() => [
    {
      value: 'overview',
      label: 'Overview',
      component: Overview,
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
    },
    {
      value: 'device-groups',
      label: 'Device Groups',
      component: DeviceGroups,
      props: {}
    },
    {
      value: 'cache-settings',
      label: 'Cache Settings',
      component: CacheSettings,
      props: {}
    },
    {
      value: 'functions-instances',
      label: 'Functions Instances',
      component: FunctionsInstances,
      props: {}
    },
    {
      value: 'rules-engine',
      label: 'Rules Engine',
      component: RulesEngine,
      props: {}
    },
    {
      value: 'main-settings',
      label: 'Settings',
      component: MainSettings,
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
          :description="`Azion builds it and ships it to ${application.name} in ${DROP_ENVIRONMENT}.`"
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

    <DropDeployDialog
      v-model:open="dropOpen"
      :application-name="application.name"
      :environment="DROP_ENVIRONMENT"
      :files="dropped?.files ?? []"
      :truncated="dropped?.truncated ?? false"
      @deploy="deployDropped"
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

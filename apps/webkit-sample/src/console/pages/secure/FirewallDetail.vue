<script setup>
  import { computed, nextTick, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { isTabDirty, tabCommit } from '../../lib/behavior/tab-dirty'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import { firewallById } from '../../lib/data/firewalls'
  import FunctionsInstances from '../applications/panels/FunctionsInstances.vue'
  import FirewallMainSettings from './panels/FirewallMainSettings.vue'
  import FirewallOverview from './panels/FirewallOverview.vue'
  import FirewallRulesEngine from './panels/FirewallRulesEngine.vue'

  const route = useRoute()
  const router = useRouter()

  const firewall = computed(() => {
    const id = String(route.params.id ?? '')
    const record = firewallById(id)
    return {
      ...(record ?? {}),
      id,
      name: record?.name || String(route.query.name || 'Firewall'),
      status: record?.status || 'Active',
      modules: record?.modules ?? [],
      application: String(route.query.application || record?.application || '')
    }
  })

  const runsFunctions = computed(() => (firewall.value.modules ?? []).includes('functions'))

  const tabs = computed(() => [
    {
      value: 'overview',
      label: 'Overview',
      component: FirewallOverview,
      props: { firewall: firewall.value }
    },
    {
      value: 'rules-engine',
      label: 'Rules Engine',
      component: FirewallRulesEngine,
      props: { firewall: firewall.value }
    },
    ...(runsFunctions.value
      ? [
          {
            value: 'functions-instances',
            label: 'Functions Instances',
            component: FunctionsInstances,
            props: { environment: 'firewall' }
          }
        ]
      : []),
    {
      value: 'main-settings',
      label: 'Settings',
      component: FirewallMainSettings,
      props: { firewall: firewall.value }
    }
  ])

  const currentTab = computed(() =>
    tabs.value.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'overview'
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
    () => tabs.value.find((tab) => tab.value === activeTab.value) ?? tabs.value[0]
  )
</script>

<template>
  <AppLayout
    active="firewall"
    :padded="false"
    :breadcrumb="[{ label: 'Firewall', href: '/firewall' }, { label: firewall.name }]"
  >
    <main class="flex h-full flex-col">
      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
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
              :key="activeView.value"
              v-bind="activeView.props"
            />
          </KeepAlive>
        </div>
      </section>
    </main>

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

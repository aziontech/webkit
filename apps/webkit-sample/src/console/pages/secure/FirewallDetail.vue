<script setup>
  // FIREWALL DETAIL — the firewall's own page: what it is, and what it does.
  //
  // A firewall is CREATED INSIDE AN APPLICATION (../../lib/data/create-bindings.js) and
  // kept as its own record, because what it holds is a program: the rules that run before
  // a request reaches the application it protects. A program needs a page — a generated
  // settings form has nowhere to put a table whose ORDER is its behaviour.
  //
  // The same shape the application detail uses (../applications/ApplicationDetail.vue):
  // Overview says what the firewall is and what it protects, Rules Engine is the program,
  // Settings is the record, and Functions Instances appears only when the Functions module
  // is on — the way the console gates it on `edgeFunctionsEnabled`. The two tabs that
  // commit share the strip at the bottom of the page, so the shell carries the tab guard
  // that asks before a switch abandons pending work.
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

  // The record, from the store when it holds one — a firewall created this session is in
  // it — and from the URL when it does not, the way every other detail page in this
  // prototype accepts what the row that opened it knew (`?name=`, `?application=`).
  // The WHOLE record, not a synthesized `{ id, name }`: the Overview reports what the row
  // that opened it already showed — rules, environment, who touched it last — and a
  // partial record would make the page and the list disagree.
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

  // Functions run INSIDE a firewall only when its Functions module is on — a rule's Run
  // Function behaviour has nothing to call otherwise — so the tab is absent rather than
  // empty, exactly as the console gates it on `edgeFunctionsEnabled`.
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
    // LAST, and named for what it is — the same position and the same word the
    // application detail gives the record it is about. The `?tab=` key keeps its old
    // spelling so links already in the wild still land here.
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

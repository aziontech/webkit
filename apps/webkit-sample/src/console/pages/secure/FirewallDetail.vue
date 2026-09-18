<script setup>
  // FIREWALL DETAIL — the firewall's own page: what it is, and what it does.
  //
  // A firewall is CREATED INSIDE AN APPLICATION (../../lib/data/create-bindings.js) and
  // kept as its own record, because what it holds is a program: the rules that run before
  // a request reaches the application it protects. A program needs a page — a generated
  // settings form has nowhere to put a table whose ORDER is its behaviour.
  //
  // Two tabs, the same shape the application detail uses (../applications/ApplicationDetail.vue):
  // Main Settings is the record, Rules Engine is the program. Both commit, so the shell
  // carries the tab guard that asks before a switch abandons pending work.
  import { computed, nextTick, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { isTabDirty, tabCommit } from '../../lib/behavior/tab-dirty'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import { firewallById } from '../../lib/data/firewalls'
  import FirewallMainSettings from './panels/FirewallMainSettings.vue'
  import FirewallRulesEngine from './panels/FirewallRulesEngine.vue'

  const route = useRoute()
  const router = useRouter()

  // The record, from the store when it holds one — a firewall created this session is in
  // it — and from the URL when it does not, the way every other detail page in this
  // prototype accepts what the row that opened it knew (`?name=`, `?application=`).
  const firewall = computed(() => {
    const id = String(route.params.id ?? '')
    const record = firewallById(id)
    return {
      id,
      name: record?.name || String(route.query.name || 'Firewall'),
      status: record?.status || 'Active',
      modules: record?.modules ?? [],
      application: String(route.query.application || record?.application || '')
    }
  })

  const tabs = [
    {
      value: 'main-settings',
      label: 'Main Settings',
      component: FirewallMainSettings
    },
    {
      value: 'rules-engine',
      label: 'Rules Engine',
      component: FirewallRulesEngine
    }
  ]

  const currentTab = computed(() =>
    tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'main-settings'
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

  const activeView = computed(() => tabs.find((tab) => tab.value === activeTab.value) ?? tabs[0])
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
              :firewall="firewall"
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

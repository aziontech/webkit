<script setup>
  import { computed, nextTick, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { isTabDirty, tabCommit } from '../../lib/behavior/tab-dirty'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import { WAF_RULES, wafRuleById } from '../../lib/data/waf-rules'
  import WafAllowedRules from './panels/WafAllowedRules.vue'
  import WafMainSettings from './panels/WafMainSettings.vue'
  import WafTuning from './panels/WafTuning.vue'

  const route = useRoute()
  const router = useRouter()

  const ruleSet = computed(() => wafRuleById(route.params.id) ?? WAF_RULES[0])

  const allowedSeed = ref([])
  const createAllowedFrom = (tuningRows) => {
    allowedSeed.value = tuningRows
    goToTab('allowed-rules')
  }
  const clearAllowedSeed = () => {
    allowedSeed.value = []
  }

  const tabs = computed(() => [
    {
      value: 'main-settings',
      label: 'Main Settings',
      component: WafMainSettings,
      props: { ruleSet: ruleSet.value }
    },
    {
      value: 'tuning',
      label: 'Tuning',
      component: WafTuning,
      props: { ruleSet: ruleSet.value, onCreateAllowed: createAllowedFrom }
    },
    {
      value: 'allowed-rules',
      label: 'Allowed Rules',
      component: WafAllowedRules,
      props: {
        ruleSet: ruleSet.value,
        seed: allowedSeed.value,
        onSeedConsumed: clearAllowedSeed
      }
    }
  ])

  const currentTab = computed(() =>
    tabs.value.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'main-settings'
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
    active="waf-rules"
    :padded="false"
    :breadcrumb="[{ label: 'WAF Rules', href: '/waf-rules' }, { label: ruleSet.name }]"
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

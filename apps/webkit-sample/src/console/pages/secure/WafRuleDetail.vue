<script setup>
  // ONE WAF RULE SET, in three tabs — the console's own shape for this resource.
  //
  //   Main Settings  what it inspects for, and how hard   (the posture)
  //   Tuning         what it actually matched              (the evidence)
  //   Allowed Rules  the matches you decided to permit     (the exceptions)
  //
  // WHY TABS AND NOT A SETTINGS PAGE. A rule set is the one resource in Secure whose
  // configuration is only half the story: the other half is the traffic it caught, and
  // the exceptions carved out of it. Those three are different KINDS of surface — a
  // form, a read-only report, a list with its own create — so they cannot be bands of
  // one page, and splitting them across three routes would break the loop the reader
  // actually walks: set a posture, watch what it catches, allow the false positives.
  //
  // THE TABS ARE WIRED TO EACH OTHER, which is the reason this shell holds state at
  // all. "Add Allowed Rule" is a real hand-off: rows selected on Tuning open the
  // Allowed Rules drawer pre-filled and switch the tab under the reader. The seed lives
  // here rather than in either tab because neither can see the other, and `<KeepAlive>`
  // means the receiving tab may already be mounted when the hand-off arrives.
  //
  // Everything else about this shell is ApplicationDetail.vue's, deliberately: the same
  // PageTabs bar, the same `?tab=` in the URL, the same tab-switch guard. A reader who
  // has used one tabbed resource in this console has used all of them.
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

  // Falls back to the first seeded rule set rather than erroring: an unknown id in this
  // sample means someone typed a URL, and a blank screen teaches them nothing.
  const ruleSet = computed(() => wafRuleById(route.params.id) ?? WAF_RULES[0])

  // The Tuning → Allowed Rules hand-off.
  //
  // The seed is held until the RECEIVING tab says it took it, not cleared on a timer.
  // Clearing it a tick after the switch looks right and loses the payload: the Allowed
  // Rules tab may not be mounted yet at that point (this is the first crossing, so
  // `<KeepAlive>` has nothing cached), and a tab that mounts after the seed is gone has
  // nothing to read. The receiving side reads it with an `immediate` watcher — which
  // fires on mount whenever the value is already there — and calls back to clear it.
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
      // `nextTick` is load-bearing here for the same reason it is on ApplicationDetail:
      // `leavingCommit` is a computed, so the guard cannot SEE the tab it is being asked
      // about until Vue has flushed the prop.
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

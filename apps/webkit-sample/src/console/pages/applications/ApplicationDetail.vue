<script setup>
  // Application detail — the resource-detail SHELL for a single application. Its
  // identity (name) is the breadcrumb; the header's bottom is a FLUID navigation tab
  // bar (Main Settings / Build / Device Groups / …), and the active sub-page renders
  // below it.
  //
  // This file owns only the shell: the breadcrumb, the tab bar, the page actions
  // that trail it, and which view is mounted. Each tab is a SELF-CONTAINED view
  // under src/views/applications/ that owns its own content, its own state, and its
  // own create flow — so a tab can be read and changed without scrolling past the
  // five beside it.
  //
  // The primary action trails the tabs on the SAME row (WorkloadDetail /
  // EdgeDnsZoneDetail), not inside the tab's own heading: it belongs to the page, so
  // its position never moves as tabs change — only its label does. The tab still OWNS
  // the flow: the shell holds a ref to the mounted view and calls what that view
  // exposes (`defineExpose`), so the drawer, the form, and the pending state stay in
  // the file that renders them.
  //
  // No Documentation button here. That affordance belongs to a FIRST-LEVEL page — one
  // the sidebar routes to directly (Applications, Workloads, SQL Database, …), where
  // it introduces the module. An internal level is already inside the module, so the
  // row carries only the action this tab can perform; the reference material a band
  // needs is a SectionHeading `documentation` link next to that band instead.
  //
  // It also owns its own LAYOUT. The tab bar here is second-level navigation, which
  // makes each tab a separate page in one route — so per layout.css the unit that
  // picks a measure is the BAND, not the file: Main Settings is a stacked form on the
  // FORM measure (1192px), while Build and the list tabs carry tables and take the
  // DATA measure (1620px). AppLayout is therefore `:padded="false"` and each view
  // applies `.layout-boundary` itself, because the boundary has to sit inside the
  // scroll container, below the fixed tab bar.
  //
  // <KeepAlive> holds the mounted views, so work in progress in one tab (a Device
  // Group just created, a half-typed field) survives a trip to another tab and back —
  // which is what the single-component version gave for free.
  import Button from '@aziontech/webkit/button'
  import { computed, nextTick, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { isTabDirty, tabCommit } from '../../lib/behavior/tab-dirty'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import Build from './panels/Build.vue'
  import CacheSettings from './panels/CacheSettings.vue'
  import DeviceGroups from './panels/DeviceGroups.vue'
  import FunctionsInstances from './panels/FunctionsInstances.vue'
  import MainSettings from './panels/MainSettings.vue'
  import RulesEngine from './panels/RulesEngine.vue'

  const route = useRoute()
  const router = useRouter()

  // A tiny stand-in "record" — in a real app this comes from the route id. Mirrors
  // the reference repo gab-az/webkit-sample-vue so the Build tab is coherent.
  const application = {
    id: route.params.id || '1784552864',
    name: 'webkit-sample-vue'
  }

  // The resource's sub-pages. Each tab is a navigation destination, not a filter, and
  // names the view it mounts. `props` is per-tab on purpose: only the two tabs scoped
  // to the record itself receive it, so the others don't take an attribute they'd
  // leak onto their root element.
  //
  // `action` is what the tab puts on the tab row: its label and icon here, its
  // BEHAVIOUR in the view. `run` / `pending` receive the mounted view's exposed
  // surface (`defineExpose`), so the create drawer and the deploy's pending flag
  // never leave the file that owns them. A tab with nothing to create (Main Settings)
  // simply declares no `action`, and the row is tabs alone.
  const tabs = [
    {
      value: 'main-settings',
      label: 'Main Settings',
      component: MainSettings,
      props: { application }
    },
    {
      value: 'build',
      label: 'Build',
      component: Build,
      props: { application },
      action: {
        label: 'Deploy',
        icon: 'pi pi-cloud-upload',
        // No `pending`: the deploy is not run here. It opens the release page
        // (./ReleaseComposer.vue), which is where it is reviewed and where it runs.
        run: (view) => view.deploy()
      }
    },
    {
      value: 'device-groups',
      label: 'Device Groups',
      component: DeviceGroups,
      props: {},
      action: { label: 'Create device group', icon: 'pi pi-plus', run: (view) => view.openCreate() }
    },
    {
      value: 'cache-settings',
      label: 'Cache Settings',
      component: CacheSettings,
      props: {},
      action: {
        label: 'Create cache setting',
        icon: 'pi pi-plus',
        run: (view) => view.openCreate()
      }
    },
    {
      value: 'functions-instances',
      label: 'Functions Instances',
      component: FunctionsInstances,
      props: {},
      action: {
        label: 'Create functions instance',
        icon: 'pi pi-plus',
        run: (view) => view.openCreate()
      }
    },
    {
      value: 'rules-engine',
      label: 'Rules Engine',
      component: RulesEngine,
      props: {},
      action: { label: 'Create rule', icon: 'pi pi-plus', run: (view) => view.openCreate() }
    }
  ]

  // Active tab lives in the URL (`?tab=`) so it survives reload and is linkable.
  //
  // ── THE TAB SWITCH IS A BOUNDARY ──
  //
  // Two of these tabs commit — Main Settings saves the application record, Rules Engine
  // saves the order its rules run in — and their bars occupy the SAME strip at the
  // bottom of the page. So a tab switch made with work pending is the moment the reader
  // loses sight of it, and the Discard they meet on the next tab belongs to something
  // else entirely.
  //
  // The shell therefore asks first, with the same dialog and the same wording a route
  // leave gets (ui/UnsavedChangesGuard.vue). It holds the tab guard and the tabs hold
  // the route guard — `route-guard="false"` on their bars — so one navigation can never
  // raise two dialogs.
  const currentTab = computed(() =>
    tabs.some((t) => t.value === route.query.tab) ? route.query.tab : 'main-settings'
  )

  // The tab being left, so the guard can name and resolve THAT tab's commit rather than
  // whichever one happens to be active by the time the reader answers.
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
      // `nextTick` is load-bearing: `leavingCommit` is a computed, so the guard does not
      // SEE the tab it is being asked about until Vue has flushed the prop. Asking in the
      // same tick asks a guard whose `dirty` is still false, which answers "yes, go" and
      // switches the tab with the work still pending — the exact failure this whole path
      // exists to prevent.
      await nextTick()
      const proceed = await tabGuard.value?.ask()
      leavingTab.value = null
      if (proceed) goToTab(value)
    }
  })

  // The tab entry (component + props) the shell mounts. Falls back to the first tab,
  // so an unknown `?tab=` renders Main Settings rather than nothing.
  // A tab switch replaces a whole screen, so it arrives like one.
  const scrollRef = ref(null)
  const enterRef = ref(null)
  useTabEnter(enterRef, activeTab, scrollRef)

  const activeView = computed(() => tabs.find((t) => t.value === activeTab.value) ?? tabs[0])

  // The mounted view itself. <KeepAlive> caches the instances, and the ref follows
  // whichever one is active — so the row's action always reaches the tab on screen.
  const viewRef = ref(null)
  const runTabAction = () => activeView.value.action?.run(viewRef.value)
  const actionPending = computed(() =>
    Boolean(viewRef.value && activeView.value.action?.pending?.(viewRef.value))
  )
</script>

<template>
  <AppLayout
    active="applications"
    :padded="false"
    :breadcrumb="[{ label: 'Applications', href: '/applications' }, { label: application.name }]"
  >
    <main class="flex h-full flex-col">
      <!-- Nav pattern (no PageHeading here): the tabs form the bottom of the
           header — a fluid full-bleed bar. Each tab's own heading lives inside that
           tab's view; its primary action trails the tabs on this row, so the page's
           one control sits in a fixed place instead of moving per tab. -->
      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
      >
        <template #actions>
          <Button
            v-if="activeView.action"
            :label="activeView.action.label"
            :icon="activeView.action.icon"
            :loading="actionPending"
            kind="primary"
            size="medium"
            @click="runTabAction"
          />
        </template>
      </PageTabs>

      <!-- Only this region scrolls. Each view brings its own `.layout-boundary`
           and its own measure. -->
      <section
        ref="scrollRef"
        class="min-h-0 flex-1 overflow-auto"
      >
        <!-- A STABLE wrapper, deliberately unkeyed: `useTabEnter` replays the page
             entrance on it by restarting the class, because keying it would re-mount
             the <KeepAlive> inside and throw away the in-progress work it exists to
             keep (see lib/tab-enter.js). -->
        <!-- `flex min-h-full flex-col`: a tab whose commit bar is `sticky bottom-0`
             needs a column that REACHES the bottom of this scroll region, or sticky has
             nothing to stick to and the bar ends up wherever the content happens to
             stop. Measured on Rules Engine with five rules: the bar sat 243px above the
             fold. A tab that does not opt in (no `flex-1` on its root) is unaffected —
             it still sizes to its content. -->
        <div
          ref="enterRef"
          class="flex min-h-full flex-col"
        >
          <KeepAlive>
            <component
              :is="activeView.component"
              ref="viewRef"
              v-bind="activeView.props"
            />
          </KeepAlive>
        </div>
      </section>
    </main>

    <!-- The TAB guard. `route-guard="false"`: the leaving tab's own bar already holds
         the route, and two guards on one navigation stack two dialogs. It is `savable`
         because every tab here edits a record that already exists, so committing is a
         legitimate one-click way to resolve the switch. -->
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

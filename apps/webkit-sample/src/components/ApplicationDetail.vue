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
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import Build from '../views/applications/Build.vue'
  import CacheSettings from '../views/applications/CacheSettings.vue'
  import DeviceGroups from '../views/applications/DeviceGroups.vue'
  import FunctionsInstances from '../views/applications/FunctionsInstances.vue'
  import MainSettings from '../views/applications/MainSettings.vue'
  import RulesEngine from '../views/applications/RulesEngine.vue'
  import AppLayout from './ui/AppLayout.vue'
  import PageTabs from './ui/PageTabs.vue'

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
        run: (view) => view.deploy(),
        pending: (view) => view.deploying
      }
    },
    {
      value: 'device-groups',
      label: 'Device Groups',
      component: DeviceGroups,
      props: {},
      action: { label: 'Device Group', icon: 'pi pi-plus', run: (view) => view.openCreate() }
    },
    {
      value: 'cache-settings',
      label: 'Cache Settings',
      component: CacheSettings,
      props: {},
      action: { label: 'Cache Setting', icon: 'pi pi-plus', run: (view) => view.openCreate() }
    },
    {
      value: 'functions-instances',
      label: 'Functions Instances',
      component: FunctionsInstances,
      props: {},
      action: { label: 'Functions Instance', icon: 'pi pi-plus', run: (view) => view.openCreate() }
    },
    {
      value: 'rules-engine',
      label: 'Rules Engine',
      component: RulesEngine,
      props: {},
      action: { label: 'Rule', icon: 'pi pi-plus', run: (view) => view.openCreate() }
    }
  ]

  // Active tab lives in the URL (`?tab=`) so it survives reload and is linkable.
  const activeTab = computed({
    get: () => (tabs.some((t) => t.value === route.query.tab) ? route.query.tab : 'main-settings'),
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

  // The tab entry (component + props) the shell mounts. Falls back to the first tab,
  // so an unknown `?tab=` renders Main Settings rather than nothing.
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
      <section class="min-h-0 flex-1 overflow-auto">
        <KeepAlive>
          <component
            :is="activeView.component"
            ref="viewRef"
            v-bind="activeView.props"
          />
        </KeepAlive>
      </section>
    </main>
  </AppLayout>
</template>

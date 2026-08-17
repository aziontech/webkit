<script setup>
  // The Settings module — the SHELL for the account's identity, team, billing,
  // security, and personal preferences. Rendered inside the shared AppLayout (nav
  // sidebar + header); the header avatar and the sidebar account-menu "Settings"
  // entry both route here (/account).
  //
  // ONE PAGE PER CATEGORY, addressed by its own route (`/account`, `/account/users`,
  // `/account/billing`, …). The categories used to be a `PageTabs` bar switched by
  // `?tab=`; they are now rows in the sidebar's Settings level, and the rail is the
  // navigation. Two second-level navigations for one module (a rail level AND a tab
  // bar under it) made the same six destinations exist twice, in two different
  // orders, with only one of them reachable from anywhere else in the console.
  //
  // Each category is a SELF-CONTAINED view under src/views/account/ that owns its
  // own content, its own state, and its own save scope — the same split as
  // ApplicationDetail. This file owns only the shell: which view the route mounts,
  // the sidebar row that reads as active, and the breadcrumb.
  //
  // LAYOUT — measure per page: "Account Settings" is a stacked form on
  // `.layout-column-form`; the other five are tables on the data measure
  // `.layout-column` (see src/styles/layout.css). Each view applies
  // `.layout-boundary` itself, because the boundary belongs inside the view's own
  // scroll container.
  //
  // The shell hands each view a plain flex COLUMN rather than a scroll box, so every
  // view owns its own scroll region. That is what lets Account Settings pin its Save
  // bar below its scrolling body: a footer owned by the shell would have to reach
  // back into that view for its `submitting` flag and `submit` handler, which is
  // precisely the coupling this split exists to remove.
  //
  // Every settings route mounts THIS component, so Vue reuses the instance as the
  // reader moves between categories and <KeepAlive> keeps the views they have
  // already opened mounted — a half-filled form or a scrolled table survives a trip
  // to another category and back, which the tab bar gave for free.
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  import AppLayout from '../../components/shell/AppLayout.vue'
  import ActivityHistory from './panels/ActivityHistory.vue'
  import Billing from './panels/Billing.vue'
  import Credentials from './panels/Credentials.vue'
  import Settings from './panels/Settings.vue'
  import TeamsPermissions from './panels/TeamsPermissions.vue'
  import UsersManagement from './panels/UsersManagement.vue'

  // The six categories, keyed by the route that addresses each one. `id` is the
  // sidebar row the page marks active — the same ids the Settings level declares in
  // AppSidebar, so the rail highlights the page you are on without a second mapping.
  // `label` is the page's crumb; the view carries its own heading.
  const SETTINGS_PAGES = {
    '/account': { id: 'settings-general', label: 'General', component: Settings },
    '/account/users': {
      id: 'settings-users',
      label: 'Users management',
      component: UsersManagement
    },
    '/account/teams': {
      id: 'settings-teams',
      label: 'Teams and permissions',
      component: TeamsPermissions
    },
    '/account/credentials': {
      id: 'settings-credentials',
      label: 'Credentials',
      component: Credentials
    },
    '/account/billing': { id: 'settings-billing', label: 'Billing and plan', component: Billing },
    '/account/activity': {
      id: 'settings-activity',
      label: 'Activity History',
      component: ActivityHistory
    }
  }

  const route = useRoute()

  // Falls back to the landing category, so a settings route registered in router.js
  // before its entry lands here renders General rather than nothing. (A path that
  // matches no route at all never reaches this component — the app has no catch-all.)
  const page = computed(() => SETTINGS_PAGES[route.path] ?? SETTINGS_PAGES['/account'])

  // "Settings › <category>", the crumb pattern every second-level page in the console
  // uses. The landing page names itself once: a `Settings › General` trail would say
  // the same thing twice for the page the module opens on.
  const breadcrumb = computed(() =>
    page.value.id === 'settings-general'
      ? [{ label: 'Settings' }]
      : [{ label: 'Settings', href: '/account' }, { label: page.value.label }]
  )
</script>

<template>
  <AppLayout
    :active="page.id"
    :padded="false"
    :breadcrumb="breadcrumb"
  >
    <!-- No tab bar: the module is named by the "Settings" breadcrumb above, the
         category by the crumb beside it and by the active row in the rail, and each
         view carries its own heading. -->
    <main class="flex h-full flex-col">
      <!-- A flex column, not a scroll box: each view owns its own scrolling region
           (and, for Account Settings, its own pinned Save bar). -->
      <div class="flex min-h-0 flex-1 flex-col">
        <KeepAlive>
          <component :is="page.component" />
        </KeepAlive>
      </div>
    </main>
  </AppLayout>
</template>

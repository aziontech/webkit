<script setup>
  // The Settings module — the SHELL for the account's identity, team, billing,
  // security, and personal preferences. Rendered inside the shared AppLayout (nav
  // sidebar + header); the header avatar and the sidebar account-menu "Settings"
  // entry both route here (/account).
  //
  // This file owns only the shell: the breadcrumb, the second-level tab bar, and
  // which view is mounted. Each of the six account categories is a SELF-CONTAINED
  // view under src/views/account/ that owns its own content, its own state, and its
  // own save scope — the same split as ApplicationDetail.
  //
  // LAYOUT — measure per tab, not per module: the bar is second-level nav, so each
  // tab is its own page and carries the column its own content earns (see
  // src/styles/layout.css). "Account Settings" is a stacked form on
  // `.layout-column-form`; the other five are tables on the data measure
  // `.layout-column`. Each view applies `.layout-boundary` itself, because the
  // boundary belongs inside the scroll container, below the fixed bar.
  //
  // Unlike ApplicationDetail's shell, this one hands each view a plain flex COLUMN
  // rather than a scroll box, so every view owns its own scroll region. That is what
  // lets the Account Settings tab pin its own Save bar below its scrolling body: a
  // footer owned by the shell would have to reach back into that view for its
  // `submitting` flag and `submit` handler, which is precisely the coupling this
  // split exists to remove.
  //
  // <KeepAlive> holds the mounted views, so a half-filled form or a scrolled table
  // survives a trip to another tab and back — which the single-component version
  // gave for free.
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ActivityHistory from '../views/account/ActivityHistory.vue'
  import Billing from '../views/account/Billing.vue'
  import Credentials from '../views/account/Credentials.vue'
  import Settings from '../views/account/Settings.vue'
  import TeamsPermissions from '../views/account/TeamsPermissions.vue'
  import UsersManagement from '../views/account/UsersManagement.vue'
  import AppLayout from './ui/AppLayout.vue'
  import PageTabs from './ui/PageTabs.vue'

  const route = useRoute()
  const router = useRouter()

  // The six account categories that used to live in the account menu, each naming
  // the view it mounts.
  const tabs = [
    { value: 'account-settings', label: 'Account Settings', component: Settings },
    { value: 'users-management', label: 'Users Management', component: UsersManagement },
    { value: 'billing', label: 'Billing', component: Billing },
    { value: 'credentials', label: 'Credentials', component: Credentials },
    { value: 'activity-history', label: 'Activity History', component: ActivityHistory },
    { value: 'teams-permissions', label: 'Teams Permissions', component: TeamsPermissions }
  ]

  // The active tab lives in the URL (`?tab=`) so it survives a reload, is linkable,
  // and keeps working as the target of a section deep link
  // (…/account?tab=billing#invoices). A crumb href may already carry `?tab=`, which
  // is why AppLayout merges query params when navigating.
  const activeTab = computed({
    get: () =>
      tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'account-settings',
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

  // The tab entry the shell mounts. Falls back to the first tab, so an unknown
  // `?tab=` renders Account Settings rather than nothing.
  const activeView = computed(() => tabs.find((tab) => tab.value === activeTab.value) ?? tabs[0])
</script>

<template>
  <AppLayout
    active="account"
    :padded="false"
    :breadcrumb="[{ label: 'Settings' }]"
  >
    <main class="flex h-full flex-col">
      <!-- Second-level nav pattern (no PageHeading here): the category tabs form a
           fluid full-bleed bar at the top of the content zone; the module is already
           named by the "Settings" breadcrumb above, and each tab's own heading lives
           inside that tab's view. -->
      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
      />

      <!-- A flex column, not a scroll box: each view owns its own scrolling region
           (and, for Account Settings, its own pinned Save bar). -->
      <div class="flex min-h-0 flex-1 flex-col">
        <KeepAlive>
          <component :is="activeView.component" />
        </KeepAlive>
      </div>
    </main>
  </AppLayout>
</template>

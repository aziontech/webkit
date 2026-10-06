<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  import AppLayout from '../../components/shell/AppLayout.vue'
  import ActivityHistory from './panels/ActivityHistory.vue'
  import Billing from './panels/Billing.vue'
  import BuildDeployment from './panels/BuildDeployment.vue'
  import Credentials from './panels/Credentials.vue'
  import Environments from './panels/Environments.vue'
  import Settings from './panels/Settings.vue'
  import TeamsPermissions from './panels/TeamsPermissions.vue'
  import UsersManagement from './panels/UsersManagement.vue'

  const SETTINGS_PAGES = {
    '/account': { id: 'settings-general', label: 'General', component: Settings },
    '/account/build-deployment': {
      id: 'settings-build-deployment',
      label: 'Build & Deployment',
      component: BuildDeployment
    },
    '/account/environments': {
      id: 'settings-environments',
      label: 'Environments',
      component: Environments
    },
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

  const page = computed(() => SETTINGS_PAGES[route.path] ?? SETTINGS_PAGES['/account'])

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
    <main class="flex h-full flex-col">
      <div class="flex min-h-0 flex-1 flex-col">
        <KeepAlive>
          <component :is="page.component" />
        </KeepAlive>
      </div>
    </main>
  </AppLayout>
</template>

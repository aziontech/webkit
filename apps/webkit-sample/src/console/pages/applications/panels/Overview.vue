<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ApplicationSummary from '../../../components/application/ApplicationSummary.vue'
  import GetStarted from '../../../components/application/GetStarted.vue'
  import { latestApplicationDeployment } from '../../../lib/data/deployment-history'
  import { domainsFor } from '../../../lib/state/application-domains'

  interface Props {
    application: Record<string, unknown>
  }

  const props = defineProps<Props>()

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const latest = computed(() =>
    latestApplicationDeployment(props.application.id, props.application.name)
  )

  const isCli = computed(() => !props.application.repository)

  const customDomains = computed(() => domainsFor(props.application.id, props.application))

  const visit = () => toast.info('Opening the application in a new tab.')

  const goToBuild = () => router.replace({ query: { ...route.query, tab: 'build' } })

  const addDomain = () =>
    router.replace({ query: { ...route.query, tab: 'main-settings', add: 'domain' } })

  const manageDomains = () =>
    router.replace({ query: { ...route.query, tab: 'main-settings', focus: 'domains' } })

  const openSettings = () => router.replace({ query: { ...route.query, tab: 'main-settings' } })
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <section
      class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
    >
      <ApplicationSummary
        :application="application"
        :custom-domains="customDomains"
        :deployment="latest"
        :email="userEmail"
        @visit="visit"
        @connect-repository="goToBuild"
        @add-domain="addDomain"
        @manage-domains="manageDomains"
        @settings="openSettings"
      />

      <GetStarted
        v-if="isCli"
        :name="application.name"
      />
    </section>
  </div>
</template>

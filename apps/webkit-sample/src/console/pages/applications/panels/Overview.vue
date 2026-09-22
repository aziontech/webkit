<script setup>
  import { toast } from '@aziontech/webkit/toast'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ApplicationSummary from '../../../components/application/ApplicationSummary.vue'
  import GetStarted from '../../../components/application/GetStarted.vue'
  import { latestApplicationDeployment } from '../../../lib/data/deployment-history'
  import { domainsFor } from '../../../lib/state/application-domains'

  const props = defineProps({
    /** The record this page is about (../../../lib/data/applications.js). */
    application: { type: Object, required: true }
  })

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The summary's STATUS comes from this row — through the same function the module list
  // reads, so the row a reader clicked and the page it opened cannot name two states.
  const latest = computed(() =>
    latestApplicationDeployment(props.application.id, props.application.name)
  )

  // An application built from a repository already has its answer to "how does code get
  // in": every push to its branch ships. One without a repository has only the terminal,
  // and this is the page that says so — so the commands belong under the card that says it.
  const isCli = computed(() => !props.application.repository)

  // The SAVED list, from the store the Settings tab commits into — adding, editing and
  // removing a domain are pending edits on that tab, and this card reports what was
  // committed (../../../lib/state/application-domains.js).
  const customDomains = computed(() => domainsFor(props.application.id, props.application))

  const visit = () => toast.info('Opening the application in a new tab.')

  const goToBuild = () => router.replace({ query: { ...route.query, tab: 'build' } })

  // The domains live on Settings, where they can be edited and removed as well as added —
  // so the card's control takes the reader there and opens the drawer, rather than growing
  // a second surface that binds a domain the tab cannot then undo.
  const addDomain = () =>
    router.replace({ query: { ...route.query, tab: 'main-settings', add: 'domain' } })

  // Same destination as the add, without the drawer: the Settings tab, landed on the
  // Domains section rather than at the top of General. `focus` is consumed there, so a
  // reload of that tab does not scroll the reader somewhere they did not ask for.
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

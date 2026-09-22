<script setup>
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import AddDomainDrawer from '../../../components/application/AddDomainDrawer.vue'
  import ApplicationSummary from '../../../components/application/ApplicationSummary.vue'
  import GetStarted from '../../../components/application/GetStarted.vue'
  import { latestApplicationDeployment } from '../../../lib/data/deployment-history'

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

  // Page-local, like the workload's own domains (../../workloads/WorkloadDetail.vue).
  const customDomains = ref([...(props.application.customDomains ?? [])])
  const addDomainOpen = ref(false)

  watch(
    () => props.application.id,
    () => {
      customDomains.value = [...(props.application.customDomains ?? [])]
    }
  )

  const boundDomains = computed(() => customDomains.value.map((entry) => entry.domain))

  const onDomainSaved = (entry) => {
    customDomains.value = [...customDomains.value, entry]
    toast.success(`${entry.domain} is bound to this application.`, {
      description: 'Point its DNS at Azion and it answers as soon as the record propagates.'
    })
  }

  const visit = () => toast.info('Opening the application in a new tab.')

  const goToBuild = () => router.replace({ query: { ...route.query, tab: 'build' } })
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
        @add-domain="addDomainOpen = true"
      />

      <GetStarted
        v-if="isCli"
        :name="application.name"
      />
    </section>

    <AddDomainDrawer
      v-model:open="addDomainOpen"
      :generated-domain="application.domainName"
      :bound-domains="boundDomains"
      @save="onDomainSaved"
    />
  </div>
</template>

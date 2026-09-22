<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FirewallSummary from '../../../components/firewall/FirewallSummary.vue'
  import { productFirstUse } from '../../../lib/data/product-empty-states'

  defineProps({
    /** The record this page is about (../../../lib/data/firewalls.js). */
    firewall: { type: Object, required: true }
  })

  const HELP = productFirstUse('firewall').learnMore.href

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || '')

  const goToTab = (tab) => router.replace({ query: { ...route.query, tab } })
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <section
      class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
    >
      <FirewallSummary
        :firewall="firewall"
        :email="userEmail"
        :documentation-href="HELP"
        @rules="goToTab('rules-engine')"
        @settings="goToTab('main-settings')"
      />
    </section>
  </div>
</template>

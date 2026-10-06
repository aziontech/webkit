<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import TemplateBrowser from '../../../components/marketplace/TemplateBrowser.vue'
  import { technologyOptions, useCaseOptions } from '../../../lib/data/frameworks'
  import {
    deploySlugRoute,
    MORE_FRAMEWORKS,
    PUBLISHED_TEMPLATES,
    RECOMMENDED_CARDS,
    templateKindOptions
  } from '../../../lib/data/templates.js'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const SECTIONS = [
    { id: 'recommended', label: 'Recommended', kind: 'cards', items: RECOMMENDED_CARDS },
    { id: 'azion', label: 'Azion Templates', kind: 'list', items: PUBLISHED_TEMPLATES },
    { id: 'frameworks', label: 'All Frameworks', kind: 'list', items: MORE_FRAMEWORKS }
  ]

  const deployTemplate = (tpl) => {
    const target = deploySlugRoute(tpl.slug)
    router.push({ path: target.path, query: { ...target.query, email: userEmail.value } })
  }
</script>

<template>
  <TemplateBrowser
    class="w-full min-w-0 lg:min-h-0 lg:flex-1"
    scrollable
    title="Start from Template"
    :sections="SECTIONS"
    :kind-options="templateKindOptions"
    :use-case-options="useCaseOptions"
    :technology-options="technologyOptions"
    @select="deployTemplate"
  />
</template>

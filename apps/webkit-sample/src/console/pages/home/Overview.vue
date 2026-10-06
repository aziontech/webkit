<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import AppLayout from '../../components/shell/AppLayout.vue'
  import { setMode, useSampleMode } from '../../lib/state/sample-mode'
  import Home from './Home.vue'
  import HomeEmptyState from './HomeEmptyState.vue'

  interface Props {
    version?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    version: ''
  })

  const { accountEmpty } = useSampleMode()

  const showFirstUse = computed(() =>
    props.version ? props.version === 'empty' : accountEmpty.value
  )

  const route = useRoute()
  const router = useRouter()

  onMounted(() => {
    if (!route.query.domain) return
    setMode('populated')
    router.replace({ path: '/home', query: { email: route.query.email || undefined } })
  })

  const shell = ref(null)
  const openPalette = () => shell.value?.showPalette()
</script>

<template>
  <AppLayout
    ref="shell"
    active="overview"
    :padded="false"
    :breadcrumb="[{ label: 'Overview' }]"
  >
    <HomeEmptyState
      v-if="showFirstUse"
      @open-palette="openPalette"
    />
    <Home v-else />
  </AppLayout>
</template>

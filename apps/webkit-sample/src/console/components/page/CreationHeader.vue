<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { routeActivation } from '../../lib/behavior/anchor-nav'

  interface Props {
    breadcrumb?: unknown[]
    backLabel?: string
    showBack?: boolean
  }

  withDefaults(defineProps<Props>(), {
    breadcrumb: () => [],
    backLabel: 'Back',
    showBack: true
  })

  const emit = defineEmits<{
    back: []
    navigate: [event: Event, href: unknown]
  }>()

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const openAccount = () => router.push({ path: '/account', query: { email: userEmail.value } })

  const onCrumb = (event, href) => {
    if (!routeActivation(event)) return
    emit('navigate', event, href)
  }
</script>

<template>
  <GlobalHeader aria-label="Azion Console">
    <GlobalHeader.Left>
      <IconButton
        v-if="showBack"
        icon="pi pi-chevron-left"
        :aria-label="backLabel"
        kind="outlined"
        size="small"
        @click="emit('back')"
      />
      <GlobalHeader.Brand>
        <RouterLink
          :to="{ path: '/home', query: { email: userEmail } }"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </RouterLink>
      </GlobalHeader.Brand>
      <Breadcrumb
        v-if="breadcrumb.length"
        :items="breadcrumb"
        @navigate="onCrumb"
      />
    </GlobalHeader.Left>
    <GlobalHeader.Middle />
    <GlobalHeader.Right>
      <button
        type="button"
        aria-label="Account settings"
        class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        @click="openAccount"
      >
        <Avatar
          :label="userEmail"
          size="medium"
          kind="square"
        />
      </button>
    </GlobalHeader.Right>
  </GlobalHeader>
</template>

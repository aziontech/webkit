<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import HeaderSearch from '@shared/ui/HeaderSearch.vue'
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { routeActivation } from '../../lib/behavior/anchor-nav'
  import { endSession } from '../../lib/state/session'
  import AccountSwitcher from './AccountSwitcher.vue'
  import AppSidebar from './AppSidebar.vue'
  import SamplePresetDrawer from './SamplePresetDrawer.vue'

  const ACCOUNT_SWITCHING = false

  interface Props {
    active?: string
    breadcrumb?: unknown[]
    sidebar?: boolean
    collapsible?: boolean
    padded?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    active: '',
    breadcrumb: () => [],
    sidebar: true,
    collapsible: true,
    padded: true
  })

  defineSlots<{
    default(): unknown
  }>()

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const activeItem = ref(props.active)
  watch(
    () => props.active,
    (value) => {
      activeItem.value = value
    }
  )

  const MOBILE_QUERY = '(max-width: 767px)'
  const isMobile = ref(false)
  const navOpen = ref(false)
  const rail = ref(null)
  let mobileMql = null
  const onMobileChange = (event) => {
    isMobile.value = event.matches
    if (!event.matches) nextTick(() => rail.value?.measure())
  }

  onMounted(() => {
    mobileMql = window.matchMedia?.(MOBILE_QUERY)
    if (mobileMql) {
      isMobile.value = mobileMql.matches
      mobileMql.addEventListener('change', onMobileChange)
    }
  })
  onUnmounted(() => {
    mobileMql?.removeEventListener('change', onMobileChange)
  })

  const onNavigate = (event, item) => {
    activeItem.value = item.id
    if (item.path && item.path !== route.path) {
      router.push({ path: item.path, query: { email: userEmail.value, ...item.query } })
    }
  }

  const closeNav = () => {
    navOpen.value = false
  }
  const onMobileNavigate = (event, item) => {
    onNavigate(event, item)
    closeNav()
  }

  const showBreadcrumb = computed(() => props.breadcrumb.length >= 2)

  const onBrand = (event) => {
    if (!routeActivation(event)) return
    onNavigate(event, { id: 'overview', label: 'Overview', path: '/home' })
  }

  const onCrumb = (event, href) => {
    if (!routeActivation(event)) return
    if (href && href !== '#') {
      const [path, queryString] = href.split('?')
      const extra = Object.fromEntries(new URLSearchParams(queryString || ''))
      router.push({ path, query: { email: userEmail.value, ...extra } })
    }
  }

  const openCreationCenter = () =>
    router.push({ path: '/create', query: { email: userEmail.value } })

  const openAccount = () => router.push({ path: '/account', query: { email: userEmail.value } })

  const presetOpen = ref(false)

  const onAccountSelect = (event, value) => {
    if (value === 'sample-preset') {
      presetOpen.value = true
    } else if (value === 'personal-tokens') {
      router.push({ path: '/personal-tokens', query: { email: userEmail.value } })
    } else if (value === 'home') {
      router.push({ path: '/home', query: { email: userEmail.value } })
    } else if (value === 'docs') {
      router.push('/site/docs')
    } else {
      openAccount()
    }
  }

  const signOut = () => {
    endSession()
    router.push('/login')
  }

  const onMobileCreate = () => {
    closeNav()
    openCreationCenter()
  }
  const onMobileSelect = (event, value) => {
    closeNav()
    onAccountSelect(event, value)
  }
  const onMobileLogout = () => {
    closeNav()
    signOut()
  }

  const openPalette = () => {
    closeNav()
    rail.value?.showPalette()
  }

  const navPanel = ref(null)
  watch(navOpen, (open) => {
    if (!open) return
    globalThis.requestAnimationFrame(() => navPanel.value?.$el?.focus?.())
  })

  defineExpose({ showPalette: () => rail.value?.showPalette() })
</script>

<template>
  <div class="relative flex h-dvh overflow-hidden bg-(--bg-canvas)">
    <AppSidebar
      v-if="sidebar"
      ref="rail"
      class="hidden h-full md:flex"
      :user="userEmail"
      :active="activeItem"
      :collapsible="collapsible && !isMobile"
      :tenancy="ACCOUNT_SWITCHING && !isMobile"
      aria-label="Main navigation"
      @navigate="onNavigate"
      @create="openCreationCenter"
      @select="onAccountSelect"
      @logout="signOut"
    />

    <div class="flex min-w-0 flex-1 flex-col">
      <GlobalHeader
        aria-label="Azion Console"
        class="@container"
      >
        <GlobalHeader.Left class="justify-start!">
          <Tooltip
            v-if="sidebar && isMobile"
            key="nav-trigger"
            text="Open navigation"
            placement="bottom"
          >
            <IconButton
              icon="pi pi-bars"
              aria-label="Open navigation"
              kind="outlined"
              size="medium"
              @click="navOpen = true"
            />
          </Tooltip>

          <a
            href="/home"
            aria-label="Azion home"
            class="flex h-6 w-fit shrink-0 items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none md:hidden"
            @click="onBrand"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>

          <AccountSwitcher v-if="ACCOUNT_SWITCHING && isMobile" />

          <Breadcrumb
            v-if="showBreadcrumb"
            :items="breadcrumb"
            class="-ml-(--spacing-xs) hidden w-auto min-w-0 shrink md:flex"
            @navigate="onCrumb"
          />
        </GlobalHeader.Left>
        <GlobalHeader.Middle />
        <GlobalHeader.Right>
          <HeaderSearch
            v-if="sidebar"
            label="Search"
            @click="openPalette"
          />

          <template v-if="isMobile">
            <Tooltip
              text="Create"
              placement="bottom"
            >
              <IconButton
                icon="pi pi-plus-circle"
                kind="primary"
                size="medium"
                aria-label="Create"
                @click="openCreationCenter"
              />
            </Tooltip>
            <Tooltip
              text="Agent"
              placement="bottom"
            >
              <IconButton
                icon="ai ai-ask-azion"
                kind="outlined"
                size="medium"
                aria-label="Agent"
              />
            </Tooltip>
          </template>
          <template v-else>
            <Button
              label="Create"
              kind="primary"
              size="medium"
              icon="pi pi-plus-circle"
              @click="openCreationCenter"
            />
            <ButtonHighlight
              label="Agent"
              size="medium"
              icon="ai ai-ask-azion"
            />
          </template>

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

      <div
        :key="route.path"
        class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto"
        :class="{ 'layout-boundary': padded }"
      >
        <slot />
      </div>
    </div>

    <Drawer
      v-if="sidebar"
      v-model:open="navOpen"
      side="right"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent
          ref="navPanel"
          aria-label="Navigation"
        >
          <AppSidebar
            :user="userEmail"
            :active="activeItem"
            aria-label="Main navigation"
            fluid
            :palette="false"
            shortcut=""
            @navigate="onMobileNavigate"
            @create="onMobileCreate"
            @select="onMobileSelect"
            @logout="onMobileLogout"
          />
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <SamplePresetDrawer v-model:open="presetOpen" />
  </div>
</template>

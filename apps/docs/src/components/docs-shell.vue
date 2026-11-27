<script setup lang="ts">
  import '../styles/docs-utilities.css'

  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import LanguageSelect from '@aziontech/webkit/language-select'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import SkipLink from '@aziontech/webkit/skip-link'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { Toaster } from '@aziontech/webkit/toast'
  import {
    computed,
    defineAsyncComponent,
    hydrateOnIdle,
    nextTick,
    onMounted,
    ref,
    watch
  } from 'vue'
  import { useRoute } from 'vue-router'

  import { useRouteFocus } from '../composables/use-route-focus'
  import { LOCALES, messages } from '../lib/i18n'
  import { searchOpen } from '../lib/search-open'
  import { settings } from '../lib/settings'
  import DirectionToggle from './direction-toggle.vue'
  import SearchCommand from './search-command.vue'
  import SideNav from './side-nav.vue'

  const emit = defineEmits<{ hydrated: [] }>()

  const loadSidebar = () => import('./docs-sidebar.vue')
  const loadHeaderNav = () => import('./header-nav.vue')

  const DocsSidebar = defineAsyncComponent({
    loader: loadSidebar,
    hydrate: hydrateOnIdle()
  })
  const HeaderNav = defineAsyncComponent({
    loader: loadHeaderNav,
    hydrate: hydrateOnIdle()
  })

  const route = useRoute()
  const t = messages
  const navOpen = ref(false)

  const sections = computed(() => [
    { to: '/foundations', label: t.value.foundations },
    { to: '/components', label: t.value.components },
    { to: '/patterns', label: t.value.patterns },
    { to: '/blocks', label: t.value.blocks },
    { to: '/assets', label: t.value.assets },
    { to: '/ai', label: t.value.aiNav }
  ])

  const COPY_ROUTES = new Set(['foundation', 'pattern', 'assets'])

  const hasCopyToasts = computed(() => COPY_ROUTES.has(String(route.name)))

  const activeSection = computed(
    () => sections.value.find((section) => route.path.startsWith(section.to))?.to ?? ''
  )

  const sidebarLabel = computed(
    () =>
      sections.value.find((section) => section.to === activeSection.value)?.label ??
      t.value.foundations
  )

  const announcement = useRouteFocus()

  const whenIdle = (callback: () => void) => {
    if (typeof globalThis.requestIdleCallback === 'function')
      globalThis.requestIdleCallback(callback, { timeout: 2000 })
    else globalThis.setTimeout(callback, 0)
  }

  onMounted(async () => {
    await Promise.all([loadSidebar(), loadHeaderNav()]).catch(() => undefined)
    whenIdle(() => {
      void nextTick(() => emit('hydrated'))
    })
  })

  watch(
    () => route.fullPath,
    () => {
      navOpen.value = false
    }
  )
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <SkipLink />
    <p
      class="sr-only"
      aria-live="polite"
      aria-atomic="true"
      data-docs-announcer
    >
      {{ announcement }}
    </p>
    <div class="@container sticky top-0 z-40 w-full">
      <AppHeader :aria-label="t.siteHeader">
        <AppHeader.Start>
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <div class="shrink-0 lg:hidden">
              <IconButton
                icon="az az-menu"
                variant="outline"
                size="medium"
                :aria-label="t.openNavigation"
                @click="navOpen = true"
              />
            </div>
            <AppHeader.Brand
              href="/"
              :aria-label="t.home"
              label="WebKit"
            >
              <Brand
                variant="default"
                size="small"
              />
            </AppHeader.Brand>
            <HeaderNav
              :label="t.sections"
              :sections="sections"
              :active="activeSection"
            />
          </div>
        </AppHeader.Start>
        <AppHeader.Center />
        <AppHeader.End>
          <SearchTrigger
            collapsible
            :label="t.search"
            @open="searchOpen = true"
          />
          <div class="hidden shrink-0 sm:block">
            <LanguageSelect
              v-model="settings.locale"
              variant="ghost"
              :options="LOCALES"
              :aria-label="t.language"
            />
          </div>
          <div class="hidden shrink-0 sm:block">
            <DirectionToggle />
          </div>
          <div class="hidden shrink-0 sm:block">
            <ThemeSwitcher
              v-model="settings.theme"
              :aria-label="t.theme"
            />
          </div>
          <IconButton
            icon="az az-github"
            variant="outline"
            size="medium"
            :aria-label="`${t.github} ${t.newTab}`"
            href="https://github.com/aziontech/webkit"
            target="_blank"
            class="hidden shrink-0 sm:inline-flex"
          />
        </AppHeader.End>
      </AppHeader>
    </div>

    <div class="relative flex min-h-0 flex-1">
      <div class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-(--container-2xs) shrink-0 lg:flex">
        <DocsSidebar :label="sidebarLabel" />
      </div>

      <div class="flex min-w-0 flex-1 flex-col">
        <main
          id="main"
          class="@container/main min-w-0 flex-1"
        >
          <slot />
        </main>
        <Footer
          variant="console"
          :aria-label="t.footer"
        >
          <Footer.Column :title="t.footerWebkit">
            <Footer.Link href="https://github.com/aziontech/webkit">{{
              t.footerGithub
            }}</Footer.Link>
            <Footer.Link href="https://www.npmjs.com/package/@aziontech/webkit">{{
              t.footerNpm
            }}</Footer.Link>
          </Footer.Column>
          <Footer.Column :title="t.footerAzion">
            <Footer.Link href="https://www.azion.com/en/documentation/">{{
              t.footerAzionDocs
            }}</Footer.Link>
            <Footer.Link href="https://console.azion.com">{{ t.footerConsole }}</Footer.Link>
          </Footer.Column>
          <template #brand>
            <AppHeader.Brand
              href="/"
              :aria-label="t.home"
              label="WebKit"
            >
              <Brand
                variant="default"
                size="small"
              />
            </AppHeader.Brand>
          </template>
        </Footer>
      </div>
    </div>

    <Drawer
      v-model:open="navOpen"
      dismissible
      side="start"
      size="small"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>{{ t.navigation }}</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <div class="flex flex-wrap gap-(--spacing-xs)">
              <Button
                v-for="section in sections"
                :key="section.to"
                :href="section.to"
                :label="section.label"
                :aria-current="activeSection === section.to ? 'page' : undefined"
                :variant="activeSection === section.to ? 'secondary' : 'outline'"
                size="medium"
              />
            </div>
            <div
              class="flex flex-wrap items-center gap-(--spacing-xs)"
              data-docs-drawer-settings
            >
              <LanguageSelect
                v-model="settings.locale"
                variant="outline"
                :options="LOCALES"
                :aria-label="t.language"
              />
              <DirectionToggle />
              <ThemeSwitcher
                v-model="settings.theme"
                :aria-label="t.theme"
              />
            </div>
            <SideNav />
          </div>
        </PanelBody>
      </DrawerContent>
    </Drawer>

    <SearchCommand v-model:open="searchOpen" />
    <Toaster v-if="hasCopyToasts" />
  </div>
</template>
